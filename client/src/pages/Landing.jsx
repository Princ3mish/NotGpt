// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Zap, Image, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets';

const Landing = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden relative font-sans">
      {/* Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-600/30 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[150px] rounded-full pointer-events-none" />
      
      {/* Navbar */}
      <nav className="relative z-10 flex justify-between items-center p-6 lg:px-20">
        <div>
          <img src={assets.logo_full_dark} alt="NotGPT Logo" className="h-8 md:h-10" />
        </div>
        <Link 
          to="/login" 
          className="bg-white/5 hover:bg-white/15 backdrop-blur-md border border-white/10 px-6 py-2 rounded-full transition-all text-sm font-medium"
        >
          Login
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center text-center px-4 pt-24 pb-32">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm mb-8"
        >
          <Sparkles size={16} />
          <span>Introducing NotGPT 2.0</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl font-bold tracking-tight max-w-4xl bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50 mb-6"
        >
          Unleash Your Creativity with Limitless AI
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-xl text-gray-400 max-w-2xl mb-12"
        >
          Experience next-generation artificial intelligence. Generate stunning images, write compelling code, and chat seamlessly in one immersive platform.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Link 
            to="/chat" 
            className="group relative inline-flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-4 rounded-full text-lg font-medium shadow-[0_0_40px_rgba(168,85,247,0.4)] hover:shadow-[0_0_60px_rgba(168,85,247,0.6)] transition-all hover:-translate-y-1"
          >
            Get Started Free
            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Feature Cards Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full mt-28 px-4">
            <FeatureCard 
               icon={<Zap className="text-yellow-400" />}
               title="Lightning Fast"
               desc="Optimized models returning responses in milliseconds."
               delay={0.8}
            />
            <FeatureCard 
               icon={<Image className="text-purple-400" />}
               title="AI Imaging"
               desc="Highly detailed rendering and dynamic aesthetic control."
               delay={1.0}
            />
            <FeatureCard 
               icon={<MessageSquare className="text-blue-400" />}
               title="Smart Chat"
               desc="Context-aware natural conversations keeping track of logic."
               delay={1.2}
            />
        </div>
      </main>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    className="bg-white/5 border border-white/10 backdrop-blur-sm p-6 rounded-2xl flex flex-col items-center text-center hover:bg-white/10 transition-colors cursor-default"
  >
    <div className="p-4 bg-white/5 rounded-full mb-6">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-3 text-white/90">{title}</h3>
    <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
  </motion.div>
);

export default Landing;
