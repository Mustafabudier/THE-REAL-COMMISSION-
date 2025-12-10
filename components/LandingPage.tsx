
import React, { useEffect, useState } from 'react';
import { ArrowLeft, DollarSign, Target } from 'lucide-react';
import { motion } from 'framer-motion';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const [lightState, setLightState] = useState<'off' | 'flicker' | 'on'>('off');

  // Flicker Sequence Effect - Adjusted for "Dark Room Flash" feel - FASTER TIMING
  useEffect(() => {
    const triggerLight = async () => {
      // 1. Start Pitch Dark (Build Tension) - REDUCED WAIT TIME
      await new Promise(r => setTimeout(r, 600));
      
      // 2. The FLASH (Everything appears briefly)
      setLightState('flicker');
      await new Promise(r => setTimeout(r, 100)); // Short burst
      
      // 3. Dark again
      setLightState('off');
      await new Promise(r => setTimeout(r, 100));

      // 4. Quick pre-ignition flicker (optional, adds realism)
      setLightState('flicker');
      await new Promise(r => setTimeout(r, 50));
      setLightState('off');
      await new Promise(r => setTimeout(r, 50));

      // 5. Steady ON
      setLightState('on');
    };

    triggerLight();
  }, []);

  // Determine visibility based on light state
  const getContentOpacity = () => {
    switch (lightState) {
      case 'on': return 1;
      case 'flicker': return 0.95; // Visible during flash
      case 'off': return 0; // Pitch black
    }
  };

  const getContentBlur = () => {
    switch (lightState) {
      case 'on': return 'blur(0px)';
      case 'flicker': return 'blur(0px)'; // Sharp during flash
      case 'off': return 'blur(10px)'; // Blurred in dark
    }
  };

  return (
    <div className="relative min-h-[100dvh] w-full overflow-hidden bg-black flex flex-col justify-center items-center font-ibm p-4 selection:bg-red-900 selection:text-white">
      
      {/* --- REALISTIC MINI HANGING LAMP (Centered Top) --- */}
      <motion.div
        initial={{ rotate: 0 }} 
        animate={{ rotate: [0, 2, -2, 1, -1, 0] }} 
        transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        className="absolute top-0 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center pointer-events-none origin-top"
      >
        {/* The Rope - Dark Brown */}
        <div className="w-[2px] h-12 md:h-16 bg-[#3E2723] relative shadow-sm"></div>
        
        {/* The Lamp Assembly (Miniature) */}
        <div className="relative flex flex-col items-center">
            
            {/* Wood Cap */}
            <div className="w-5 h-4 bg-[#5D4037] rounded-t-md relative z-30 shadow-md"></div>

            {/* The Shade - Clear White/Cream Color - Modern Dome Style */}
            <div className="w-24 h-10 bg-[#E7E5E4] relative z-20 shadow-[inset_0_-4px_8px_rgba(0,0,0,0.1),0_5px_15px_rgba(0,0,0,0.5)]"
                 style={{ 
                    borderRadius: '50px 50px 0 0', 
                 }}>
            </div>

            {/* The Bulb Glow Source - Intense White Center */}
            <div className={`
                absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-12 h-12 rounded-full transition-opacity duration-75 z-10 flex items-center justify-center
                ${lightState === 'off' ? 'opacity-0' : ''}
                ${lightState === 'flicker' ? 'opacity-100' : ''}
                ${lightState === 'on' ? 'opacity-100' : ''} 
            `}>
                {/* EXTREME GLOW CORE - HIGH INTENSITY */}
                <div className={`
                    w-6 h-6 bg-white rounded-full blur-[2px]
                    ${lightState !== 'off' ? 'shadow-[0_0_50px_15px_rgba(255,255,255,1),0_0_100px_40px_rgba(255,255,255,0.9),0_0_180px_80px_rgba(255,255,255,0.5)]' : ''}
                `}></div>
            </div>

        </div>

        {/* God Ray / Volumetric Light Cone - Brightened */}
        <motion.div 
            animate={{ opacity: lightState !== 'off' ? 0.7 : 0 }} 
            transition={{ duration: 0.1 }} 
            className="absolute top-[90%] left-1/2 -translate-x-1/2 w-[800px] h-[100vh] bg-gradient-to-b from-white/50 via-white/10 to-transparent blur-3xl pointer-events-none origin-top"
            style={{ clipPath: 'polygon(45% 0%, 55% 0%, 100% 100%, 0% 100%)' }}
        />
      </motion.div>

      {/* --- CONTENT REVEAL (Synced with Light State) --- */}
      
      {/* 1. Cinematic Film Grain Overlay */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-[1] opacity-[0.08] mix-blend-overlay">
         <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <filter id="noiseFilter">
              <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/>
            </filter>
            <rect width="100%" height="100%" filter="url(#noiseFilter)" />
         </svg>
      </div>

      {/* 2. Background Elements */}
      <motion.div 
        animate={{ opacity: getContentOpacity() }}
        transition={{ duration: 0.1 }} // Fast transition for flicker
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      >
        {/* Darker Glow Blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-900/10 rounded-full mix-blend-screen filter blur-[120px] opacity-40 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-rose-950/10 rounded-full mix-blend-screen filter blur-[120px] opacity-30 animate-blob" style={{ animationDelay: "4s" }}></div>

        {/* Floating Icons */}
        <div className="absolute top-[20%] right-[10%] text-rose-800 opacity-20 animate-float" style={{ animationDelay: '0s' }}>
          <DollarSign size={48} strokeWidth={1.5} />
        </div>
        <div className="absolute bottom-[20%] left-[10%] text-rose-800 opacity-20 animate-float" style={{ animationDelay: '2s' }}>
          <Target size={48} strokeWidth={1.5} />
        </div>
      </motion.div>

      {/* 3. Main Content - CENTERED PERFECTLY */}
      <motion.div 
        animate={{ 
            opacity: getContentOpacity(),
            filter: getContentBlur()
        }} 
        transition={{ duration: 0.1 }}
        className="relative z-10 container mx-auto px-4 flex flex-col items-center justify-center text-center max-w-4xl min-h-[100dvh]"
      >
        
        {/* Top Badge */}
        <div className="mb-6 pt-16 md:pt-0">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-red-900/40 bg-black/40 backdrop-blur-md shadow-[0_0_20px_rgba(220,38,38,0.1)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
            </span>
            <span className="text-zinc-300 font-ibm font-medium text-xs md:text-sm tracking-wide">
              اختبار مدته 3 دقائق
            </span>
          </div>
        </div>

        {/* Hero Headline with Red Back Glow - INCREASED FONT SIZE */}
        <div className="relative mb-6 w-full flex justify-center">
            {/* The Red Shadow Glow behind text - REMOVED as requested */}
            {/* <motion.div ... className="absolute inset-0 bg-red-600 blur-[80px] rounded-full z-0 opacity-50" ... /> */}

            <h1 className="font-aref font-bold text-6xl md:text-8xl lg:text-9xl text-white relative z-10 drop-shadow-2xl">
              عمولتك الحقيقية
            </h1>
        </div>

        {/* Subtitle */}
        <p className="text-zinc-300 font-ibm font-normal text-base md:text-lg max-w-2xl mb-12 leading-relaxed opacity-90 relative z-10 px-4">
          اكتشف قيمة العمولة التي تستحق ان تحصل عليها مقابل
          <br className="hidden md:block" />
          مهاراتك وخبراتك الحالية في السوق من خلال هذا الاختبار 👇🏻
        </p>

        {/* CTA Button */}
        <div className="relative z-10">
          <button 
            onClick={onStart}
            className="group relative bg-[#be123c] text-white px-8 md:px-10 py-4 md:py-5 rounded-full font-cairo font-bold text-xl md:text-2xl shadow-[0_0_40px_rgba(190,18,60,0.6)] hover:shadow-[0_0_60px_rgba(190,18,60,0.8)] hover:scale-105 transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-3">
              ابدأ الاكتشاف الان
              <ArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            </span>
            {/* Button Shine Effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:animate-shine bg-gradient-to-r from-transparent via-white/20 to-transparent z-0"></div>
          </button>
          
          {/* Note under button */}
          <p className="mt-6 text-zinc-500 text-xs md:text-sm font-ibm">
            ✨ الاختبار مجاني بالكامل والنتيجة ستظهر فوراً
          </p>
        </div>

      </motion.div>
    </div>
  );
};

export default LandingPage;
