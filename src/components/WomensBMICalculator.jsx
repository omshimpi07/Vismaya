import { useState, useRef } from 'react';
import { Download, Calculator, Info, Clipboard, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { jsPDF } from 'jspdf';

export default function WomensBMICalculator() {
  // State for BMI calculation
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [age, setAge] = useState('');
  const [activityLevel, setActivityLevel] = useState('moderate');
  const [pregnancyStatus, setPregnancyStatus] = useState('no');
  const [bmiResult, setBmiResult] = useState(null);
  const [bmiCategory, setBmiCategory] = useState('');
  const [dietPlan, setDietPlan] = useState(null);
  const [showDownloadSuccess, setShowDownloadSuccess] = useState(false);
  const [expandedMeal, setExpandedMeal] = useState(null);
  
  // Reference for scrolling
  const resultRef = useRef(null);
  
  // BMI calculation function
  const calculateBMI = (e) => {
    e.preventDefault();
    
    if (!height || !weight || !age) return;
    
    // Convert height from cm to meters
    const heightInMeters = height / 100;
    
    // Basic BMI calculation
    let bmi = weight / (heightInMeters * heightInMeters);
    bmi = parseFloat(bmi.toFixed(1));
    
    // Set BMI result
    setBmiResult(bmi);
    
    // Determine BMI category
    let category;
    
    if (bmi < 18.5) {
      category = 'Underweight';
    } else if (bmi >= 18.5 && bmi < 25) {
      category = 'Normal weight';
    } else if (bmi >= 25 && bmi < 30) {
      category = 'Overweight';
    } else {
      category = 'Obese';
    }
    
    setBmiCategory(category);
    
    // Generate appropriate diet plan
    generateDietPlan(category, age, activityLevel, pregnancyStatus);
    
    // Scroll to results
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };
  
  // Diet plan generator
  const generateDietPlan = (bmiCategory, age, activityLevel, pregnancyStatus) => {
    // Base calorie needs adjusted for women (simplified calculation)
    let baseCalories;
    
    // Adjust base calories by age
    if (age < 30) {
      baseCalories = 2000;
    } else if (age >= 30 && age < 50) {
      baseCalories = 1800;
    } else {
      baseCalories = 1600;
    }
    
    // Adjust for activity level
    switch (activityLevel) {
      case 'sedentary':
        baseCalories *= 1.2;
        break;
      case 'moderate':
        baseCalories *= 1.5;
        break;
      case 'active':
        baseCalories *= 1.7;
        break;
      default:
        baseCalories *= 1.5;
    }
    
    // Adjust for pregnancy status
    if (pregnancyStatus === 'yes') {
      baseCalories += 300; // Add approximately 300 calories for pregnancy
    }
    
    // Adjust based on BMI category
    let calorieTarget;
    let proteinPercentage;
    let carbPercentage;
    let fatPercentage;
    let planFocus;
    
    switch (bmiCategory) {
      case 'Underweight':
        calorieTarget = Math.round(baseCalories * 1.1); // Slight calorie surplus
        proteinPercentage = 25;
        carbPercentage = 50;
        fatPercentage = 25;
        planFocus = 'weight gain';
        break;
      case 'Normal weight':
        calorieTarget = Math.round(baseCalories);
        proteinPercentage = 30;
        carbPercentage = 45;
        fatPercentage = 25;
        planFocus = 'maintenance';
        break;
      case 'Overweight':
        calorieTarget = Math.round(baseCalories * 0.85); // Moderate deficit
        proteinPercentage = 35;
        carbPercentage = 40;
        fatPercentage = 25;
        planFocus = 'weight loss';
        break;
      case 'Obese':
        calorieTarget = Math.round(baseCalories * 0.7); // Larger deficit
        proteinPercentage = 40;
        carbPercentage = 35;
        fatPercentage = 25;
        planFocus = 'weight loss';
        break;
      default:
        calorieTarget = Math.round(baseCalories);
        proteinPercentage = 30;
        carbPercentage = 45;
        fatPercentage = 25;
        planFocus = 'maintenance';
    }
    
    // Ensure minimum calorie floor (never go below 1200 for women)
    if (calorieTarget < 1200 && pregnancyStatus !== 'yes') {
      calorieTarget = 1200;
    } else if (calorieTarget < 1500 && pregnancyStatus === 'yes') {
      calorieTarget = 1500; // Higher minimum for pregnant women
    }
    
    // Calculate macros
    const proteinGrams = Math.round((calorieTarget * (proteinPercentage/100)) / 4);
    const carbGrams = Math.round((calorieTarget * (carbPercentage/100)) / 4);
    const fatGrams = Math.round((calorieTarget * (fatPercentage/100)) / 9);
    
    // Generate meal plans based on calorie target and BMI category
    const meals = generateMealPlan(calorieTarget, bmiCategory, pregnancyStatus);
    
    // Create the diet plan object
    const plan = {
      calories: calorieTarget,
      macros: {
        protein: proteinGrams,
        carbs: carbGrams,
        fat: fatGrams
      },
      focus: planFocus,
      meals: meals,
      hydration: pregnancyStatus === 'yes' ? "2.5-3 liters" : "2-2.5 liters",
      specialConsiderations: pregnancyStatus === 'yes' ? [
        "Focus on folate-rich foods",
        "Increase calcium intake",
        "Avoid alcohol and limit caffeine",
        "Consult with healthcare provider before starting any diet"
      ] : []
    };
    
    setDietPlan(plan);
  };
  
  // Generate specific meal recommendations
  const generateMealPlan = (calories, bmiCategory, pregnancyStatus) => {
    // Different meal plans based on category and calorie target
    let breakfast, lunch, dinner, snacks;
    
    if (bmiCategory === 'Underweight') {
      breakfast = {
        title: "Nutrient-Dense Breakfast",
        items: [
          "Greek yogurt (1 cup) with berries and honey",
          "Whole grain toast (2 slices) with avocado and eggs",
          "Smoothie with protein powder, banana, peanut butter, and milk"
        ],
        notes: "Focus on protein and healthy fats to support weight gain."
      };
      
      lunch = {
        title: "Energy-Rich Lunch",
        items: [
          "Quinoa bowl with grilled chicken, avocado, and roasted vegetables",
          "Whole grain wrap with turkey, cheese, and plenty of vegetables",
          "Salmon with sweet potato and steamed vegetables"
        ],
        notes: "Include complex carbs, protein, and healthy fats."
      };
      
      dinner = {
        title: "Balanced Dinner",
        items: [
          "Lean protein (fish, chicken, or beans) with brown rice and vegetables",
          "Whole grain pasta with olive oil, vegetables, and chicken or shrimp",
          "Stir-fry with tofu or meat, vegetables, and brown rice"
        ],
        notes: "Focus on a mix of nutrients to support healthy weight gain."
      };
      
      snacks = {
        title: "Nutrient-Dense Snacks",
        items: [
          "Trail mix with nuts and dried fruit",
          "Cheese and whole grain crackers",
          "Smoothie with protein powder",
          "Peanut butter on whole grain toast",
          "Hummus with vegetables"
        ],
        notes: "Aim for 2-3 snacks daily between meals."
      };
    } else if (bmiCategory === 'Normal weight') {
      breakfast = {
        title: "Balanced Breakfast",
        items: [
          "Oatmeal with berries and a tablespoon of nut butter",
          "Whole grain toast with avocado and poached eggs",
          "Greek yogurt parfait with granola and fresh fruit"
        ],
        notes: "Balance protein and complex carbs for sustained energy."
      };
      
      lunch = {
        title: "Nutrient-Rich Lunch",
        items: [
          "Large salad with grilled chicken, olive oil, and vinegar dressing",
          "Grain bowl with quinoa, roasted vegetables, and chickpeas",
          "Vegetable soup with a side salad and whole grain roll"
        ],
        notes: "Focus on vegetables, lean protein, and moderate portions."
      };
      
      dinner = {
        title: "Balanced Dinner",
        items: [
          "Baked fish with roasted vegetables and quinoa",
          "Stir-fry with tofu or chicken and plenty of vegetables",
          "Lentil soup with a side salad and small portion of whole grain bread"
        ],
        notes: "Include lean protein, vegetables, and moderate complex carbs."
      };
      
      snacks = {
        title: "Healthy Snacks",
        items: [
          "Apple with a tablespoon of almond butter",
          "Handful of mixed nuts",
          "Greek yogurt with berries",
          "Hummus with vegetable sticks",
          "Hardboiled egg"
        ],
        notes: "Choose 1-2 snacks daily as needed."
      };
    } else {
      // Overweight or Obese categories
      breakfast = {
        title: "Protein-Focused Breakfast",
        items: [
          "Egg white omelet with vegetables",
          "Greek yogurt with a small amount of berries",
          "Protein smoothie with spinach, protein powder, and almond milk"
        ],
        notes: "Emphasize protein and fiber while limiting carbohydrates."
      };
      
      lunch = {
        title: "Vegetable-Forward Lunch",
        items: [
          "Large salad with grilled chicken and light dressing",
          "Lettuce wraps with turkey and vegetables",
          "Zucchini noodles with lean protein and tomato sauce"
        ],
        notes: "Focus on non-starchy vegetables and lean protein."
      };
      
      dinner = {
        title: "Lean Dinner",
        items: [
          "Grilled fish with steamed vegetables",
          "Chicken breast with large portion of roasted vegetables",
          "Tofu stir-fry with plenty of vegetables and small portion of brown rice"
        ],
        notes: "Emphasize protein and vegetables while limiting starchy carbs."
      };
      
      snacks = {
        title: "Low-Calorie Snacks",
        items: [
          "Celery with a tablespoon of almond butter",
          "Hard-boiled egg",
          "Small handful of nuts",
          "Cucumber slices with hummus",
          "Greek yogurt (plain, low-fat)"
        ],
        notes: "Limit to 1-2 small snacks daily if needed."
      };
    }
    
    // Add pregnancy-specific additions if needed
    if (pregnancyStatus === 'yes') {
      breakfast.items.push("Spinach and folic acid-rich vegetables in omelets");
      breakfast.notes += " Include folate-rich foods for fetal development.";
      
      lunch.items.push("Calcium-rich foods like dairy or fortified plant alternatives");
      lunch.notes += " Focus on iron and calcium-rich options.";
      
      dinner.items.push("Iron-rich foods like leafy greens with vitamin C for absorption");
      dinner.notes += " Include a variety of nutrients essential for pregnancy.";
      
      snacks.items.push("Yogurt with almonds for calcium and protein");
      snacks.items.push("Fruit rich in vitamin C");
      snacks.notes += " More frequent snacks may help with nausea.";
    }
    
    return { breakfast, lunch, dinner, snacks };
  };
  
  // Function to download diet plan as PDF
  const downloadDietPlan = () => {
    if (!dietPlan) return;
    
    // Create new PDF document
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.setTextColor(138, 79, 255); // Purple color
    doc.text("Personalized Women's Diet Plan", 20, 20);
    
    // Add BMI information
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(`BMI: ${bmiResult} - ${bmiCategory}`, 20, 30);
    
    // Add diet focus
    doc.setFontSize(12);
    doc.text(`Diet Focus: ${dietPlan.focus.charAt(0).toUpperCase() + dietPlan.focus.slice(1)}`, 20, 40);
    doc.text(`Daily Calorie Target: ${dietPlan.calories} calories`, 20, 50);
    
    // Add macros
    doc.text("Daily Macronutrients:", 20, 60);
    doc.text(`- Protein: ${dietPlan.macros.protein}g`, 25, 70);
    doc.text(`- Carbohydrates: ${dietPlan.macros.carbs}g`, 25, 80);
    doc.text(`- Fat: ${dietPlan.macros.fat}g`, 25, 90);
    
    // Add hydration
    doc.text(`Daily Hydration: ${dietPlan.hydration} of water`, 20, 100);
    
    // Add special considerations if any
    let yPosition = 110;
    if (dietPlan.specialConsiderations.length > 0) {
      doc.text("Special Considerations:", 20, yPosition);
      yPosition += 10;
      dietPlan.specialConsiderations.forEach(consideration => {
        doc.text(`- ${consideration}`, 25, yPosition);
        yPosition += 10;
      });
    }
    
    // Add meal plans
    doc.setFontSize(14);
    doc.setTextColor(255, 90, 135); // Pink color
    yPosition += 10;
    doc.text("Meal Plan", 20, yPosition);
    
    // Add each meal with recommendations
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    
    // Breakfast
    yPosition += 10;
    doc.text(dietPlan.meals.breakfast.title, 20, yPosition);
    yPosition += 10;
    dietPlan.meals.breakfast.items.forEach(item => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(`- ${item}`, 25, yPosition);
      yPosition += 10;
    });
    doc.text(`Note: ${dietPlan.meals.breakfast.notes}`, 25, yPosition);
    
    // Lunch
    yPosition += 15;
    if (yPosition > 270) {
      doc.addPage();
      yPosition = 20;
    }
    doc.text(dietPlan.meals.lunch.title, 20, yPosition);
    yPosition += 10;
    dietPlan.meals.lunch.items.forEach(item => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(`- ${item}`, 25, yPosition);
      yPosition += 10;
    });
    doc.text(`Note: ${dietPlan.meals.lunch.notes}`, 25, yPosition);
    
    // Dinner
    yPosition += 15;
    if (yPosition > 270) {
      doc.addPage();
      yPosition = 20;
    }
    doc.text(dietPlan.meals.dinner.title, 20, yPosition);
    yPosition += 10;
    dietPlan.meals.dinner.items.forEach(item => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(`- ${item}`, 25, yPosition);
      yPosition += 10;
    });
    doc.text(`Note: ${dietPlan.meals.dinner.notes}`, 25, yPosition);
    
    // Snacks
    yPosition += 15;
    if (yPosition > 270) {
      doc.addPage();
      yPosition = 20;
    }
    doc.text(dietPlan.meals.snacks.title, 20, yPosition);
    yPosition += 10;
    dietPlan.meals.snacks.items.forEach(item => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(`- ${item}`, 25, yPosition);
      yPosition += 10;
    });
    doc.text(`Note: ${dietPlan.meals.snacks.notes}`, 25, yPosition);
    
    // Add disclaimer
    yPosition += 20;
    if (yPosition > 270) {
      doc.addPage();
      yPosition = 20;
    }
    doc.setFontSize(10);
    doc.text("Disclaimer: This diet plan is generated as a general guideline based on your BMI and provided information.", 20, yPosition);
    yPosition += 5;
    doc.text("Always consult with a healthcare provider before starting any new diet regimen, especially during pregnancy.", 20, yPosition);
    
    // Save the PDF
    doc.save("womens-diet-plan.pdf");
    
    // Show success message
    setShowDownloadSuccess(true);
    setTimeout(() => setShowDownloadSuccess(false), 3000);
  };
  
  // Toggle expanded meal section
  const toggleMeal = (mealType) => {
    if (expandedMeal === mealType) {
      setExpandedMeal(null);
    } else {
      setExpandedMeal(mealType);
    }
  };

  return (
    <div className="min-h-screen bg-purple-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-6 shadow-md">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Calculator className="w-8 h-8" />
            Women's BMI & Diet Plan Calculator
          </h1>
          <p className="mt-2 text-white/90">
            Calculate your BMI and get a personalized diet plan based on your results
          </p>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="py-8 px-4 max-w-4xl mx-auto">
        {/* Calculator Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-purple-800 mb-4">Enter Your Information</h2>
          
          <form onSubmit={calculateBMI} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Height */}
              <div>
                <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">
                  Height (cm)
                </label>
                <input
                  type="number"
                  id="height"
                  min="120"
                  max="220"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                />
              </div>
              
              {/* Weight */}
              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  id="weight"
                  min="30"
                  max="200"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                />
              </div>
              
              {/* Age */}
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                  Age
                </label>
                <input
                  type="number"
                  id="age"
                  min="18"
                  max="100"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                />
              </div>
              
              {/* Activity Level */}
              <div>
                <label htmlFor="activity" className="block text-sm font-medium text-gray-700 mb-1">
                  Activity Level
                </label>
                <select
                  id="activity"
                  value={activityLevel}
                  onChange={(e) => setActivityLevel(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option value="sedentary">Sedentary (little or no exercise)</option>
                  <option value="moderate">Moderate (exercise 3-5 times/week)</option>
                  <option value="active">Active (daily exercise or physical job)</option>
                </select>
              </div>
              
              {/* Pregnancy Status */}
              <div className="md:col-span-2">
                <label htmlFor="pregnancy" className="block text-sm font-medium text-gray-700 mb-1">
                  Are you pregnant?
                </label>
                <div className="flex gap-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      value="no"
                      checked={pregnancyStatus === 'no'}
                      onChange={() => setPregnancyStatus('no')}
                      className="h-4 w-4 text-pink-500"
                    />
                    <span className="ml-2">No</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      value="yes"
                      checked={pregnancyStatus === 'yes'}
                      onChange={() => setPregnancyStatus('yes')}
                      className="h-4 w-4 text-pink-500"
                    />
                    <span className="ml-2">Yes</span>
                  </label>
                </div>
                {pregnancyStatus === 'yes' && (
                  <p className="mt-2 text-sm text-purple-600">
                    <Info className="inline-block w-4 h-4 mr-1" />
                    Your diet plan will include pregnancy-specific nutritional considerations.
                  </p>
                )}
              </div>
            </div>
            
            <button
              type="submit"
              className="w-full bg-pink-500 hover:bg-pink-600 text-white p-3 rounded-lg font-medium transition-colors"
            >
              Calculate BMI & Generate Diet Plan
            </button>
          </form>
        </div>
        
        {/* Results Section */}
        {bmiResult && (
          <div ref={resultRef} className="space-y-8">
            {/* BMI Result Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-purple-800 mb-4">Your BMI Results</h2>
              
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <p className="text-gray-600">Your BMI is</p>
                  <p className="text-4xl font-bold text-pink-500">{bmiResult}</p>
                  <p className={`text-lg font-medium ${
                    bmiCategory === 'Normal weight' ? 'text-green-500' : 
                    bmiCategory === 'Underweight' ? 'text-yellow-500' : 'text-red-500'
                  }`}>
                    {bmiCategory}
                  </p>
                </div>
                
                <div className="mt-4 md:mt-0 bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-medium text-purple-800 mb-2">BMI Categories</h3>
                  <ul className="text-sm space-y-1">
                    <li className="flex justify-between">
                      <span>Underweight:</span>
                      <span className="font-medium">Below 18.5</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Normal weight:</span>
                      <span className="font-medium">18.5–24.9</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Overweight:</span>
                      <span className="font-medium">25–29.9</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Obesity:</span>
                      <span className="font-medium">30 or greater</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              {pregnancyStatus === 'yes' && (
                <div className="mt-6 bg-pink-50 border border-pink-200 rounded-lg p-4">
                  <p className="flex items-start">
                    <Info className="w-5 h-5 text-pink-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>
                      BMI calculations may not be as reliable during pregnancy. This plan includes pregnancy-specific nutritional guidance, but always consult with your healthcare provider.
                    </span>
                  </p>
                </div>
              )}
            </div>
            
            {/* Diet Plan Card */}
            {dietPlan && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold text-purple-800">Your Personalized Diet Plan</h2>
                  
                  <button
                    onClick={downloadDietPlan}
                    className="flex items-center gap-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download PDF
                  </button>
                </div>
                
                {/* Download confirmation */}
                {showDownloadSuccess && (
                  <div className="mb-4 flex items-center bg-green-50 text-green-800 p-3 rounded-lg">
                    <Check className="w-5 h-5 mr-2" />
                    PDF downloaded successfully!
                  </div>
                )}
                
                {/* Diet Overview */}
                <div className="mb-6 bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-medium text-purple-800 mb-3">Diet Overview</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <p className="text-sm text-gray-500">Daily Calories</p>
                      <p className="text-xl font-bold text-pink-500">{dietPlan.calories}</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <p className="text-sm text-gray-500">Protein</p>
                      <p className="text-xl font-bold text-purple-600">{dietPlan.macros.protein}g</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <p className="text-sm text-gray-500">Carbs</p>
                      <p className="text-xl font-bold text-purple-600">{dietPlan.macros.carbs}g</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <p className="text-sm text-gray-500">Fat</p>
                      <p className="text-xl font-bold text-purple-600">{dietPlan.macros.fat}g</p>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <p className="flex items-start">
                      <Info className="w-5 h-5 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>
                        This plan focuses on <strong>{dietPlan.focus}</strong> with a daily water intake of <strong>{dietPlan.hydration}</strong>.
                      </span>
                    </p>
                  </div>
                </div>
                
                {/* Special Considerations for Pregnancy */}
                {pregnancyStatus === 'yes' && dietPlan.specialConsiderations.length > 0 && (
                  <div className="mb-6 bg-pink-50 p-4 rounded-lg">
                    <h3 className="font-medium text-pink-600 mb-2">Pregnancy Considerations</h3>
                    <ul className="space-y-2">
                      {dietPlan.specialConsiderations.map((consideration, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-pink-500 mr-2">•</span>
                          {consideration}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Meal Plan */}
                <h3 className="font-bold text-xl text-purple-800 mb-4">Recommended Meals</h3>
                {/* Breakfast Section */}
                <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleMeal('breakfast')}
                    className="w-full flex justify-between items-center p-4 bg-white hover:bg-purple-50 transition-colors"
                  >
                    <span className="font-medium text-lg text-purple-800">{dietPlan.meals.breakfast.title}</span>
                    {expandedMeal === 'breakfast' ? (
                      <ChevronUp className="w-5 h-5 text-purple-600" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-purple-600" />
                    )}
                  </button>
                  
                  {expandedMeal === 'breakfast' && (
                    <div className="p-4 bg-white border-t border-gray-200">
                      <ul className="space-y-2 mb-3">
                        {dietPlan.meals.breakfast.items.map((item, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-pink-500 mr-2">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                      <p className="text-sm text-gray-600 italic">
                        <Info className="inline-block w-4 h-4 mr-1 text-purple-500" />
                        {dietPlan.meals.breakfast.notes}
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Lunch Section */}
                <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleMeal('lunch')}
                    className="w-full flex justify-between items-center p-4 bg-white hover:bg-purple-50 transition-colors"
                  >
                    <span className="font-medium text-lg text-purple-800">{dietPlan.meals.lunch.title}</span>
                    {expandedMeal === 'lunch' ? (
                      <ChevronUp className="w-5 h-5 text-purple-600" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-purple-600" />
                    )}
                  </button>
                  
                  {expandedMeal === 'lunch' && (
                    <div className="p-4 bg-white border-t border-gray-200">
                      <ul className="space-y-2 mb-3">
                        {dietPlan.meals.lunch.items.map((item, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-pink-500 mr-2">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                      <p className="text-sm text-gray-600 italic">
                        <Info className="inline-block w-4 h-4 mr-1 text-purple-500" />
                        {dietPlan.meals.lunch.notes}
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Dinner Section */}
                <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleMeal('dinner')}
                    className="w-full flex justify-between items-center p-4 bg-white hover:bg-purple-50 transition-colors"
                  >
                    <span className="font-medium text-lg text-purple-800">{dietPlan.meals.dinner.title}</span>
                    {expandedMeal === 'dinner' ? (
                      <ChevronUp className="w-5 h-5 text-purple-600" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-purple-600" />
                    )}
                  </button>
                  
                  {expandedMeal === 'dinner' && (
                    <div className="p-4 bg-white border-t border-gray-200">
                      <ul className="space-y-2 mb-3">
                        {dietPlan.meals.dinner.items.map((item, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-pink-500 mr-2">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                      <p className="text-sm text-gray-600 italic">
                        <Info className="inline-block w-4 h-4 mr-1 text-purple-500" />
                        {dietPlan.meals.dinner.notes}
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Snacks Section */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleMeal('snacks')}
                    className="w-full flex justify-between items-center p-4 bg-white hover:bg-purple-50 transition-colors"
                  >
                    <span className="font-medium text-lg text-purple-800">{dietPlan.meals.snacks.title}</span>
                    {expandedMeal === 'snacks' ? (
                      <ChevronUp className="w-5 h-5 text-purple-600" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-purple-600" />
                    )}
                  </button>
                  
                  {expandedMeal === 'snacks' && (
                    <div className="p-4 bg-white border-t border-gray-200">
                      <ul className="space-y-2 mb-3">
                        {dietPlan.meals.snacks.items.map((item, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-pink-500 mr-2">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                      <p className="text-sm text-gray-600 italic">
                        <Info className="inline-block w-4 h-4 mr-1 text-purple-500" />
                        {dietPlan.meals.snacks.notes}
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Disclaimer */}
                <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600">
                    <strong>Disclaimer:</strong> This diet plan is generated as a general guideline based on your BMI and provided information. 
                    Always consult with a healthcare provider before starting any new diet regimen, especially during pregnancy.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* No Results State */}
        {!bmiResult && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <Calculator className="w-16 h-16 text-purple-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-600 mb-2">Ready to Calculate Your BMI?</h3>
            <p className="text-gray-500 mb-4">
              Enter your information above to calculate your BMI and receive a personalized diet plan.
            </p>
            <div className="bg-purple-50 p-4 inline-block rounded-lg">
              <h4 className="font-medium text-purple-800 mb-2">Why Calculate BMI?</h4>
              <ul className="text-sm text-left text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="text-pink-500 mr-2">•</span>
                  Understand your current weight status
                </li>
                <li className="flex items-start">
                  <span className="text-pink-500 mr-2">•</span>
                  Get personalized dietary recommendations
                </li>
                <li className="flex items-start">
                  <span className="text-pink-500 mr-2">•</span>
                  Take control of your health journey
                </li>
              </ul>
            </div>
          </div>
        )}
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-100 mt-12 py-6 px-4">
        <div className="max-w-4xl mx-auto text-center text-gray-600 text-sm">
          <p>
            This BMI calculator is designed specifically for women, taking into account female-specific factors
            including pregnancy status. The diet plans are general recommendations.
          </p>
          <p className="mt-2">
            For medical advice, always consult with a healthcare professional.
          </p>
        </div>
      </footer>
    </div>
  );
}