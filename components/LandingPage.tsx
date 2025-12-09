import React from 'react';
import { ArrowLeft, DollarSign, Target, Zap, TrendingUp, Crosshair } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-[#FFF1F2] via-[#FFF5F5] to-[#FFE4E6] flex flex-col justify-center items-center">
      
      {/* 1. Background Animation Layer */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
        {/* Large Blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FECDD3] rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob"></div>
        <div className="absolute top-0 -left-20 w-[400px] h-[400px] bg-[#FEE2E2] rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob" style={{ animationDelay: "2s" }}></div>
        <div className="absolute -bottom-32 left-20 w-[600px] h-[600px] bg-[#FFE4E6] rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob" style={{ animationDelay: "4s" }}></div>

        {/* Floating Icons */}
        {/* Top Right */}
        <div className="absolute top-[15%] right-[10%] text-[#BE123C] opacity-20 animate-float" style={{ animationDelay: '0s' }}>
          <DollarSign size={64} strokeWidth={1.5} />
        </div>
        {/* Top Left */}
        <div className="absolute top-[20%] left-[15%] text-[#BE123C] opacity-25 animate-float" style={{ animationDelay: '2s' }}>
          <Target size={56} strokeWidth={1.5} />
        </div>
        {/* Bottom Right */}
        <div className="absolute bottom-[25%] right-[20%] text-[#BE123C] opacity-20 animate-float" style={{ animationDelay: '1s' }}>
          <TrendingUp size={72} strokeWidth={1.5} />
        </div>
        {/* Bottom Left */}
        <div className="absolute bottom-[15%] left-[10%] text-[#BE123C] opacity-15 animate-float" style={{ animationDelay: '3s' }}>
          <Crosshair size={60} strokeWidth={1.5} />
        </div>
         {/* Center random */}
         <div className="absolute top-[60%] left-[60%] text-[#BE123C] opacity-10 animate-float" style={{ animationDelay: '1.5s' }}>
          <Zap size={48} strokeWidth={1.5} />
        </div>
      </div>

      {/* 2. Content Layer */}
      <div className="relative z-10 container mx-auto px-4 flex flex-col items-center text-center max-w-5xl">
        
        {/* Top Badge */}
        <div className="mb-8 animate-fade-in-down">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-rose-200 bg-white/50 backdrop-blur-sm shadow-sm">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
            </span>
            <span className="text-rose-900 font-cairo font-bold text-sm tracking-wide">
              اختبار مدته 3 دقائق
            </span>
          </div>
        </div>

        {/* Hero Headline */}
        <h1 className="font-aref font-bold text-rose-900 leading-[1.3] mb-6 drop-shadow-sm
            text-6xl md:text-8xl lg:text-9xl
        ">
          عمولتك الحقيقية
        </h1>

        {/* Sub-headline */}
        <p className="font-ibm text-gray-700 text-xl md:text-2xl lg:text-3xl max-w-3xl leading-relaxed mb-12">
          اكتشف قيمة العمولة التي تستحق أن تحصل عليها <br className="hidden md:block" />
          مقابل خبرتك ومهاراتك الحالية في السوق
        </p>

        {/* CTA Button */}
        <button 
          onClick={onStart}
          className="group relative inline-flex items-center justify-center gap-4 bg-[#BE123C] hover:bg-[#9F1239] text-white 
          py-5 px-10 md:py-6 md:px-16 rounded-full shadow-2xl shadow-rose-900/20 
          transform transition-all duration-300 hover:scale-105 overflow-hidden"
        >
          {/* Shine Effect Wrapper */}
          <div className="absolute inset-0 -translate-x-full group-hover:animate-[shine_1s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-10" />
          
          <span className="font-cairo font-bold text-xl md:text-2xl lg:text-3xl relative z-20">
            ابدأ الاختبار الآن
          </span>
          <ArrowLeft className="w-6 h-6 md:w-8 md:h-8 group-hover:-translate-x-2 transition-transform duration-300 relative z-20" />
        </button>

        {/* Footer Note */}
        <div className="mt-10 flex items-center gap-2 text-gray-500 font-ibm text-base md:text-lg opacity-80">
          <Zap className="w-5 h-5 text-yellow-500 animate-pulse" fill="currentColor" />
          <span>الاختبار سريع ومجاني بالكامل</span>
        </div>

      </div>
    </div>
  );
};

export default LandingPage;