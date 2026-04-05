import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Heart, Shield, Clock, Bell, Activity } from 'lucide-react';

// Health & Safety Tips Data
const healthTips = [
  {
    id: 1,
    category: "Physical Health",
    title: "Regular Health Screenings",
    content: "Schedule regular mammograms, pap smears, and bone density tests. Early detection saves lives.",
    icon: <Activity color="#ff5a87" size={32} />,
    bgColor: "bg-pink-50"
  },
  {
    id: 2,
    category: "Safety",
    title: "Share Your Location",
    content: "When traveling alone, share your live location with trusted contacts using your phone's safety features.",
    icon: <Shield color="#8a4fff" size={32} />,
    bgColor: "bg-purple-50"
  },
  {
    id: 3,
    category: "Mental Health",
    title: "Mindful Moments",
    content: "Take 5 minutes each day to practice deep breathing and mindfulness to reduce stress and anxiety.",
    icon: <Heart color="#ff5a87" size={32} />,
    bgColor: "bg-pink-50"
  },
  {
    id: 4,
    category: "Safety",
    title: "Emergency Contacts",
    content: "Keep emergency contacts accessible on your phone, including local women's helpline numbers.",
    icon: <Bell color="#8a4fff" size={32} />,
    bgColor: "bg-purple-50"
  },
  {
    id: 5,
    category: "Physical Health",
    title: "Stay Hydrated",
    content: "Drink at least 8 glasses of water daily to maintain energy levels and support overall health.",
    icon: <Activity color="#ff5a87" size={32} />,
    bgColor: "bg-pink-50"
  }
];

// Main Component
export default function HealthTipsCarousel() {
  const [currentTip, setCurrentTip] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState('right');

  const nextTip = () => {
    if (isAnimating) return;
    setDirection('right');
    setIsAnimating(true);
    setCurrentTip((prev) => (prev + 1) % healthTips.length);
  };

  const prevTip = () => {
    if (isAnimating) return;
    setDirection('left');
    setIsAnimating(true);
    setCurrentTip((prev) => (prev - 1 + healthTips.length) % healthTips.length);
  };

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  // Auto-advance the carousel
  useEffect(() => {
    const interval = setInterval(() => {
      nextTip();
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Animation classes
  const slideClass = isAnimating
    ? direction === 'right'
      ? 'translate-x-full opacity-0'
      : '-translate-x-full opacity-0'
    : 'translate-x-0 opacity-100';

  return (
    <div className="flex flex-col items-center w-full  mx-auto p-4 font-sans">
      {/* Header */}
      <div className="w-full bg-gradient-to-r from-purple-700 to-pink-500 rounded-t-2xl p-4 shadow-lg">
        <h1 className="text-white text-2xl font-bold text-center">
          Women's Health & Safety Tips
        </h1>
      </div>
      
      {/* Main Content */}
      <div className="w-full bg-white rounded-b-2xl shadow-lg overflow-hidden">
        <div className="relative h-96 overflow-hidden">
          {/* Tip Card */}
          <div 
            className={`absolute inset-0 transition-all duration-500 ease-in-out transform ${slideClass}`}
          >
            <div className={`h-full flex flex-col ${healthTips[currentTip].bgColor}`}>
              {/* Category Badge */}
              <div className="flex justify-between items-center p-6">
                <span 
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    healthTips[currentTip].category === "Safety" 
                      ? "bg-purple-100 text-purple-800" 
                      : "bg-pink-100 text-pink-800"
                  }`}
                >
                  {healthTips[currentTip].category}
                </span>
                <Clock size={20} className="text-gray-500" />
              </div>
              
              {/* Icon and Content */}
              <div className="flex-grow flex flex-col justify-center items-center p-6 text-center">
                <div className={`p-4 rounded-full mb-6 ${
                  healthTips[currentTip].category === "Safety" 
                    ? "bg-purple-100" 
                    : "bg-pink-100"
                }`}>
                  {healthTips[currentTip].icon}
                </div>
                <h2 className="text-2xl font-bold mb-4 text-gray-800">
                  {healthTips[currentTip].title}
                </h2>
                <p className="text-lg text-gray-600 max-w-md">
                  {healthTips[currentTip].content}
                </p>
              </div>
              
              {/* Progress Indicators */}
              <div className="flex justify-center gap-2 p-6">
                {healthTips.map((_, index) => (
                  <div 
                    key={index} 
                    className={`h-2 w-10 rounded-full transition-all duration-300 ${
                      index === currentTip 
                        ? index % 2 === 0 ? "bg-pink-500" : "bg-purple-500" 
                        : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
          
          {/* Navigation Buttons */}
          <button 
            onClick={prevTip} 
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white shadow-lg transition-all duration-200 hover:scale-110"
            aria-label="Previous tip"
          >
            <ChevronLeft size={24} className="text-gray-800" />
          </button>
          <button 
            onClick={nextTip} 
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white shadow-lg transition-all duration-200 hover:scale-110"
            aria-label="Next tip"
          >
            <ChevronRight size={24} className="text-gray-800" />
          </button>
        </div>
        
        {/* Action Buttons */}
       
      </div>
      
      {/* Quick Access Safety Section */}
      
    </div>
  );
}