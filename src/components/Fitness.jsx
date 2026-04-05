import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const categories = [
  'Period workouts',
  'Pregnancy workouts',
  'General fitness',
  'Tabata',
  'Yoga for women',
  'Strength Training',
  'Cardio for Women',
  'Postpartum Workouts',
  'Pilates',
  'Dance Workouts'
];

const Fitness = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [videos, setVideos] = useState([]);
  const [videoCount, setVideoCount] = useState(12);
  const [isLoading, setIsLoading] = useState(false);

  const fetchVideos = async (queries, count) => {
    setIsLoading(true);
    try {
      let allVideos = [];
      for (let query of queries) {
        const res = await axios.get(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=${count}&q=${encodeURIComponent(query)}&key=REMOVED_API_KEY`
        );
        allVideos = [...allVideos, ...res.data.items];
      }
      setVideos(allVideos);
    } catch (err) {
      console.error('Failed to fetch videos:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCategories.length > 0) {
      fetchVideos(selectedCategories, videoCount);
    }
  }, [selectedCategories, videoCount]);

  const handleCategoryChange = (category) => {
    setSelectedCategories((prevState) =>
      prevState.includes(category)
        ? prevState.filter((item) => item !== category)
        : [...prevState, category]
    );
  };

  const loadMoreVideos = () => {
    setVideoCount(videoCount + 12);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans py-8 px-4 md:px-6">
      <motion.div 
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <motion.div 
          className="text-center mb-10"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-purple-800 mb-4">
            Women's Fitness Hub
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover curated workouts designed specifically for women's unique needs and fitness goals
          </p>
        </motion.div>

        {/* Horizontal Category Selection */}
        <motion.div 
          className="mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Select Categories
            </h2>
            
            <div className="flex flex-wrap gap-4">
              {categories.map((cat) => (
                <motion.div
                  key={cat}
                  className={`
                    cursor-pointer rounded-md px-4 py-2 transition-all duration-200
                    ${selectedCategories.includes(cat) 
                      ? 'bg-purple-600 text-white shadow-md' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                  `}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleCategoryChange(cat)}
                >
                  <span className="font-medium">{cat}</span>
                </motion.div>
              ))}
            </div>
            
            {selectedCategories.length > 0 && (
              <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm text-gray-500 font-medium">Selected:</span>
                  {selectedCategories.map(cat => (
                    <div key={cat} className="bg-purple-100 text-purple-700 rounded-md px-3 py-1 text-sm font-medium flex items-center gap-1">
                      <span>{cat}</span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCategoryChange(cat);
                        }}
                        className="ml-1 hover:text-purple-900"
                      >
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Videos Display Section */}
        <div className="mb-10">
          {selectedCategories.length === 0 ? (
            <motion.div 
              className="bg-white rounded-lg shadow-md p-10 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Select a category to begin</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Choose from our variety of workout categories designed specifically for women's needs
              </p>
            </motion.div>
          ) : isLoading ? (
            <div className="flex justify-center items-center py-16">
              <div className="w-10 h-10 border-4 border-gray-200 border-t-purple-600 rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Recommended Workouts</h2>
                <div className="bg-gray-100 rounded-md px-3 py-1">
                  <span className="text-sm font-medium text-gray-600">
                    {videos.length} videos found
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((video) => (
                  <motion.a
                    key={video.id.videoId}
                    href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="relative bg-gray-200">
                      {/* For demonstration purposes, using a placeholder if thumbnails don't load */}
                      {video.snippet.thumbnails?.high?.url ? (
                        <img
                          src={video.snippet.thumbnails.high.url}
                          alt={video.snippet.title}
                          className="w-full h-48 object-cover"
                          onError={(e) => {
                            e.target.src = "/api/placeholder/320/180";
                            e.target.alt = "Video thumbnail placeholder";
                          }}
                        />
                      ) : (
                        <div className="w-full h-48 flex items-center justify-center bg-gray-200">
                          <span className="text-gray-500">Thumbnail unavailable</span>
                        </div>
                      )}
                      
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 bg-white bg-opacity-80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <svg className="w-5 h-5 text-purple-700" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8 5V19L19 12L8 5Z" fill="currentColor"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-medium text-gray-800 line-clamp-2 group-hover:text-purple-700 transition-colors">
                        {video.snippet.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-2">
                        {video.snippet.channelTitle}
                      </p>
                    </div>
                  </motion.a>
                ))}
              </div>

              {/* Load More Button */}
              <div className="flex justify-center mt-10">
                <motion.button
                  onClick={loadMoreVideos}
                  className="px-6 py-2 bg-purple-600 text-white rounded-md font-medium shadow-md hover:bg-purple-700 transition-colors duration-200"
                  whileTap={{ scale: 0.98 }}
                >
                  Load More
                </motion.button>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Fitness;