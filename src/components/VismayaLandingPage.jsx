import { useState, useEffect } from 'react';
import { Shield, Activity, Menu, X, ChevronRight, MessageCircle, ArrowRight } from 'lucide-react';
import Navbar from './Navbar';
import HealthTipsCarousel from './HealthTipsCarousel';

export default function VismayaLandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Navigation */}
      <Navbar/>
      {/* Hero Section */}
      <section id="home" className=" mt-[-50px] pt-32 pb-20 md:pt-40 md:pb-28 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
              <div className="inline-block px-4 py-1 bg-pink-100 text-pink-600 rounded-full text-sm mb-6 font-medium">
                Safety • Health • Empowerment
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                A <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">Wonder</span> for Women's Safety and Health
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Vismaya empowers women through innovative technology focused on personal safety, health monitoring, and community support.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium rounded-full px-8 py-3 shadow-lg hover:shadow-xl transition-all flex items-center justify-center">
                  Try Now
                  <ArrowRight size={18} className="ml-2" />
                </button>
                <button className="border-2 border-purple-600 text-purple-600 font-medium rounded-full px-8 py-3 hover:bg-purple-50 transition-all flex items-center justify-center">
                  Learn More
                </button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative">
                <div className="absolute -top-5 -left-5 w-full h-full bg-gradient-to-br from-pink-200 to-purple-200 rounded-3xl transform rotate-3"></div>
                <img src="womensafety.jpeg" alt="Woman using Vismaya app" className="relative z-10 rounded-3xl shadow-xl" />
              </div>
            </div>
          </div>

          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all">
              <div className="bg-pink-100 w-14 h-14 rounded-full flex items-center justify-center mb-5">
                <Shield size={24} className="text-pink-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Safety First</h3>
              <p className="text-gray-600">Real-time location sharing, emergency alerts and 24/7 monitoring to keep you protected.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all">
              <div className="bg-purple-100 w-14 h-14 rounded-full flex items-center justify-center mb-5">
                <Activity size={24} className="text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Health Tracking</h3>
              <p className="text-gray-600">Personalized health monitoring, cycle tracking, and wellness recommendations.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all">
              <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mb-5">
                <MessageCircle size={24} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Community Support</h3>
              <p className="text-gray-600">Connect with a community of women sharing experiences and resources.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-to-b from-white to-purple-50 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1 bg-purple-100 text-purple-600 rounded-full text-sm mb-4 font-medium">
              FEATURES
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Designed for Your Wellbeing</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Vismaya combines cutting-edge technology with thoughtful design to create a comprehensive solution for women's safety and health.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <img src="https://cdn-gnapb.nitrocdn.com/rVKsFrUUJpBqwSXDQLTtMASMDgzFisXl/assets/images/optimized/rev-2e6882e/www.octalsoftware.com/wp-content/uploads/2023/11/ezgif.com-webp-to-jpg-52-1024x683.jpg" alt="Vismaya app features" className="rounded-3xl shadow-2xl" />
            </div>
            <div>
              <div className="mb-10">
                <div className="flex items-center mb-4">
                  <div className="bg-pink-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                    <Shield size={20} className="text-pink-600" />
                  </div>
                  <h3 className="text-xl font-bold">Safety Features</h3>
                </div>
                <p className="text-gray-600 pl-16">Trigger emergency alerts with voice commands or one-touch activation that notify your trusted contacts with your exact location.</p>
              </div>
              
              <div className="mb-10">
                <div className="flex items-center mb-4">
                  <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                    <Activity size={20} className="text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold">Health Features</h3>
                </div>
                <p className="text-gray-600 pl-16">Track your cycle, mood patterns, and health metrics in one intuitive dashboard with personalized insights.</p>
              </div>
              
              <div className="mb-10">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                    <MessageCircle size={20} className="text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold">Secure Community</h3>
                </div>
                <p className="text-gray-600 pl-16">Connect with verified members in your area to share resources, experiences, and support each other.</p>
              </div>
              
              
            </div>
          </div>
        </div>
      </section>
      <div>
      <HealthTipsCarousel/>
      </div>
      
      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-white px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1 bg-pink-100 text-pink-600 rounded-full text-sm mb-4 font-medium">
              TESTIMONIALS
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Women Are Saying</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join thousands of women who have found peace of mind with Vismaya.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all">
              <div className="flex items-center mb-6">
                <img src="https://media.istockphoto.com/id/1313502972/photo/portrait-of-beautiful-woman-having-fun.jpg?s=612x612&w=0&k=20&c=DHGWp3wIoSlpjK9xFdARpgpyo4t-hIzuqOSx5ZyRsHA=" alt="User" className="w-14 h-14 rounded-full mr-4" />
                <div>
                  <h4 className="font-bold">Sarah Johnson</h4>
                  <p className="text-gray-600 text-sm">Marketing Executive</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                "Vismaya has completely changed how I feel walking home late at night. The safety features are intuitive, and the health tracking has helped me understand my body better."
              </p>
              <div className="flex text-yellow-500">
                ★★★★★
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all">
              <div className="flex items-center mb-6">
                <img src="https://t3.ftcdn.net/jpg/02/81/81/86/360_F_281818663_XXRCNuGktKeZsnknqWkKI0rR4JPWui3H.jpg" alt="User" className="w-14 h-14 rounded-full mr-4" />
                <div>
                  <h4 className="font-bold">Maya Patel</h4>
                  <p className="text-gray-600 text-sm">Medical Student</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                "As a medical student with late night shifts, the safety features give me confidence. The community aspect has connected me with other women in healthcare who share similar experiences."
              </p>
              <div className="flex text-yellow-500">
                ★★★★★
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all">
              <div className="flex items-center mb-6">
                <img src="https://images.pexels.com/photos/15602468/pexels-photo-15602468/free-photo-of-portrait-of-indian-woman-in-sunlight.jpeg" alt="User" className="w-14 h-14 rounded-full mr-4" />
                <div>
                  <h4 className="font-bold">Aisha Williams</h4>
                  <p className="text-gray-600 text-sm">Software Engineer</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                "As someone who values privacy, I appreciate how Vismaya balances security with data protection. The health insights have been incredibly accurate for me."
              </p>
              <div className="flex text-yellow-500">
                ★★★★★
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-pink-500 to-purple-600 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Join the Vismaya Community Today</h2>
          <p className="text-white text-lg mb-10 max-w-2xl mx-auto opacity-90">
            Take control of your safety and health with technology designed specifically for women.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-purple-600 font-medium rounded-full px-8 py-3 shadow-lg hover:shadow-xl transition-all flex items-center justify-center">
              Register Now
            </button>
            <button className="bg-white text-purple-600 font-medium rounded-full px-8 py-3 shadow-lg hover:shadow-xl transition-all flex items-center justify-center">
              Get Started
            </button>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 bg-gray-50 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">Vismaya</h3>
              <p className="text-gray-600 mb-4">Empowering women through innovative technology for safety and health.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-pink-500">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-pink-500">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-pink-500">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-pink-500">Features</a></li>
                <li><a href="#" className="text-gray-600 hover:text-pink-500">Safety Tools</a></li>
                <li><a href="#" className="text-gray-600 hover:text-pink-500">Health Tracking</a></li>
                <li><a href="#" className="text-gray-600 hover:text-pink-500">Community</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-pink-500">About Us</a></li>
                <li><a href="#" className="text-gray-600 hover:text-pink-500">Blog</a></li>
                <li><a href="#" className="text-gray-600 hover:text-pink-500">Careers</a></li>
                <li><a href="#" className="text-gray-600 hover:text-pink-500">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-pink-500">Support</a></li>
                <li><a href="#" className="text-gray-600 hover:text-pink-500">Privacy</a></li>
                <li><a href="#" className="text-gray-600 hover:text-pink-500">Terms</a></li>
                <li><a href="#" className="text-gray-600 hover:text-pink-500">Help Center</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-12 pt-8 text-center text-gray-500">
            <p>© 2025 Vismaya. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}