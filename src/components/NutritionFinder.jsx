import { useState, useEffect } from 'react';
import { LineChart, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Search, Info, ArrowRight } from 'lucide-react';

// API key for USDA Food Data Central API
const API_KEY = "mnv47hh5GWSxdtRPfWAlqYxbSaqygzS6SjtZM10t";

export default function NutritionFinder() {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Function to search foods from the API
  const searchFoods = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(query)}&pageSize=10&api_key=${API_KEY}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      
      const data = await response.json();
      setSearchResults(data.foods || []);
    } catch (err) {
      setError('Error fetching nutrition data. Please try again.');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    searchFoods();
  };
  
  // Extract and prepare nutrition data for charts
  const prepareNutritionData = () => {
    if (!selectedFood || !selectedFood.foodNutrients) return [];
    
    // Filter for key nutrients and prepare data for charts
    const keyNutrients = selectedFood.foodNutrients
      .filter(nutrient => [
        'Protein', 'Total lipid (fat)', 'Carbohydrate, by difference', 
        'Fiber, total dietary', 'Sugars, total including NLEA', 'Calcium, Ca',
        'Iron, Fe', 'Sodium, Na', 'Vitamin C', 'Vitamin A, RAE', 'Cholesterol',
        'Potassium, K', 'Magnesium, Mg'
      ].includes(nutrient.nutrientName))
      .map(nutrient => ({
        name: nutrient.nutrientName.replace(/, .*$/, '').replace(' including NLEA', ''),
        value: nutrient.value,
        unit: nutrient.unitName
      }));
    
    return keyNutrients;
  };
  
  // Extract macronutrients (protein, fat, carbs) for pie chart
  const prepareMacroData = () => {
    if (!selectedFood || !selectedFood.foodNutrients) return [];
    
    const macros = {
      'Protein': 0,
      'Fat': 0,
      'Carbohydrates': 0
    };
    
    selectedFood.foodNutrients.forEach(nutrient => {
      if (nutrient.nutrientName === 'Protein') {
        macros['Protein'] = nutrient.value || 0;
      } else if (nutrient.nutrientName === 'Total lipid (fat)') {
        macros['Fat'] = nutrient.value || 0;
      } else if (nutrient.nutrientName === 'Carbohydrate, by difference') {
        macros['Carbohydrates'] = nutrient.value || 0;
      }
    });
    
    return Object.keys(macros).map(key => ({
      name: key,
      value: macros[key]
    }));
  };
  
  // Colors for the chart
  const COLORS = ['#ff5a87', '#8a4fff', '#2d2a3b', '#f9f0f7'];

  return (
    <div className="flex flex-col min-h-screen bg-purple-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-6 shadow-md">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Info className="w-8 h-8" />
            Nutrition Finder
          </h1>
          <p className="mt-2 text-white/90">
            Search foods to discover their nutritional content
          </p>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-grow p-6 max-w-6xl mx-auto w-full">
        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="relative flex-grow">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for foods (e.g., apple, chicken breast)"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              <Search className="absolute right-3 top-3 text-gray-400" />
            </div>
            <button 
              type="submit" 
              className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-1 transition-colors"
              disabled={loading}
            >
              Search
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
        
        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}
        
        {/* Loading Indicator */}
        {loading && (
          <div className="text-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-100 border-t-purple-600 mx-auto"></div>
            <p className="mt-4 text-purple-800">Loading nutrition data...</p>
          </div>
        )}
        
        {/* Results Display */}
        <div className="grid md:grid-cols-12 gap-8">
          {/* Results List */}
          {searchResults.length > 0 && (
            <div className={`${selectedFood ? 'md:col-span-4' : 'md:col-span-12'}`}>
              <h2 className="text-xl font-bold text-purple-800 mb-4">Search Results</h2>
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <ul className="divide-y divide-gray-200">
                  {searchResults.map((food) => (
                    <li 
                      key={food.fdcId} 
                      className={`p-4 cursor-pointer transition-colors hover:bg-pink-50 ${selectedFood?.fdcId === food.fdcId ? 'bg-pink-100' : ''}`}
                      onClick={() => setSelectedFood(food)}
                    >
                      <h3 className="font-medium text-gray-800">{food.description}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {food.brandName ? `${food.brandName}` : 'Generic'} • {food.foodCategory || 'Food'}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          
          {/* Nutrition Details */}
          {selectedFood && (
            <div className="md:col-span-8">
              <h2 className="text-xl font-bold text-purple-800 mb-4">Nutrition Facts</h2>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-1">{selectedFood.description}</h3>
                <p className="text-sm text-gray-600 mb-6">{selectedFood.brandName || 'Generic'} • {selectedFood.foodCategory || 'Food'}</p>
                
                {/* Macro Nutrient Visualization */}
                <h4 className="font-medium text-purple-800 mb-3">Macronutrient Breakdown</h4>
                <div className="h-64 mb-8">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={prepareMacroData()}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis label={{ value: 'grams', angle: -90, position: 'insideLeft' }} />
                      <Tooltip formatter={(value) => [`${value} g`, '']} />
                      <Legend />
                      <Bar dataKey="value" name="Amount (g)">
                        {prepareMacroData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Other Nutrients List */}
                <h4 className="font-medium text-purple-800 mb-3">Key Nutrients</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nutrient</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {prepareNutritionData().map((nutrient, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{nutrient.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                            {nutrient.value} {nutrient.unit}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                                
                {/* Nutrient Visualization */}
                <h4 className="font-medium text-purple-800 mt-8 mb-3">Nutrient Visualization</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={prepareNutritionData().filter(n => !['Protein', 'Fat', 'Carbohydrates'].includes(n.name)).slice(0, 6)}
                      margin={{ top: 5, right: 30, left: 20, bottom: 30 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                      <YAxis />
                      <Tooltip formatter={(value, name, props) => [`${value} ${props.payload.unit}`, props.payload.name]} />
                      <Bar dataKey="value" name="Amount" fill="#8a4fff" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Empty State */}
        {!loading && searchResults.length === 0 && !error && (
          <div className="text-center p-12 bg-white rounded-lg shadow-md">
            <div className="mx-auto w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center">
              <Info className="w-12 h-12 text-purple-600" />
            </div>
            <h3 className="mt-4 text-xl font-medium text-gray-900">Search for Foods</h3>
            <p className="mt-2 text-gray-600">
              Enter a food item in the search box above to view detailed nutritional information.
            </p>
          </div>
        )}
      </main>
      
    </div>
  );
}