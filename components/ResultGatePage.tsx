
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Loader2, ShieldCheck, ArrowRight, TrendingUp, ChevronDown } from 'lucide-react';

interface ResultGatePageProps {
  onSubmit: (formData: any) => void;
}

const ResultGatePage: React.FC<ResultGatePageProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    country: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (formData.name.trim().length < 3) newErrors.name = 'الاسم مطلوب';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'بريد غير صحيح';
    if (!/^\d{8,}$/.test(formData.phone)) newErrors.phone = 'رقم غير صحيح';
    if (!formData.country) newErrors.country = 'مطلوب';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) {
      setErrors(prev => ({ ...prev, [e.target.name]: '' }));
    }
  };

  return (
    <div className="min-h-[100dvh] w-full bg-black flex flex-col items-center justify-center p-4 font-ibm relative overflow-hidden">
      
      {/* 1. Background Animation */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
        {/* Deep Ambient Glows */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black via-[#0f0000] to-black"></div>
        
        {/* Floating Emojis - Positioned to be visible on mobile */}
        {/* Top Right */}
        <div className="absolute top-[5%] right-[5%] opacity-30 animate-float text-4xl grayscale hover:grayscale-0 transition-all duration-500 z-0">💲</div>
        {/* Middle Left */}
        <div className="absolute top-[40%] left-[-2%] md:left-[5%] opacity-30 animate-float text-5xl grayscale hover:grayscale-0 transition-all duration-500 z-0" style={{ animationDelay: '1.5s' }}>🎯</div>
        {/* Bottom Right */}
        <div className="absolute bottom-[10%] right-[0%] md:right-[15%] opacity-20 animate-float text-red-800 z-0" style={{ animationDelay: '2s' }}>
             <TrendingUp size={50} strokeWidth={1.5} />
        </div>
      </div>

      {/* 2. Main Title - Clean White */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-10 text-center mb-6"
      >
        <h1 className="font-aref font-bold text-4xl md:text-5xl text-white">
          عمولتك الحقيقية
        </h1>
      </motion.div>

      {/* 3. The Content Wrapper (Merged Stack) */}
      <div className="relative z-10 w-full max-w-[280px] flex flex-col items-center">
        
        {/* Glow Effect - Behind the Stack */}
        <div className="absolute top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[80%] bg-red-600/30 blur-[60px] rounded-full pointer-events-none z-0"></div>

        {/* Image - Top Half - Merged */}
        <motion.div 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full relative z-20 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.9)]" // Black shadow casting down onto the card for contrast
        >
            <img 
              src="https://lh3.googleusercontent.com/d/1kCqtTV-3Do4rJWjxjb8NhgZRMVubw-CB" 
              alt="Locked Result" 
              className="w-full h-auto object-cover rounded-t-[1.5rem] block" // Rounded top, block display
            />
        </motion.div>

        {/* The Card (Form Only) - Bottom Half - Merged */}
        <motion.div 
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="w-full relative z-10 bg-[#050505] rounded-b-[1.5rem] rounded-t-none overflow-hidden border-x border-b border-zinc-900 shadow-2xl" // Remove top border to seamless merge
        >
          <div className="px-4 pt-6 pb-5 flex flex-col items-center">
             
             {/* Text Block */}
             <div className="text-center mb-5">
               <h2 className="font-ibm font-bold text-xl text-white mb-1 flex items-center justify-center gap-2">
                 <span>النتيجة جاهزة</span>
                 <Lock size={16} className="text-red-500" />
               </h2>
               <p className="text-[11px] text-zinc-400 font-medium">
                 املئ بياناتك لمشاهدة النتيجة
               </p>
             </div>

             {/* Form - Compact Vertical Spacing */}
             <form onSubmit={handleSubmit} className="w-full space-y-2.5">
              
              {/* 1. Name */}
              <div className="space-y-1">
                <label className="block text-zinc-500 text-[10px] font-medium pr-1">الاسم الكامل</label>
                <input 
                  type="text" 
                  name="name"
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full bg-[#0a0a0a] border ${errors.name ? 'border-red-500' : 'border-zinc-800'} rounded-lg px-3 py-2 text-right font-ibm text-white placeholder-zinc-700 text-xs focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all`}
                  placeholder="الاسم"
                />
              </div>

              {/* 2. Email */}
              <div className="space-y-1">
                <label className="block text-zinc-500 text-[10px] font-medium pr-1">البريد الإلكتروني</label>
                <input 
                  type="email" 
                  name="email"
                  autoComplete="email"
                  dir="ltr"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full bg-[#0a0a0a] border ${errors.email ? 'border-red-500' : 'border-zinc-800'} rounded-lg px-3 py-2 text-right font-ibm text-white placeholder-zinc-700 text-xs focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all`}
                  placeholder="name@example.com"
                />
              </div>

              {/* 3. Phone */}
              <div className="space-y-1">
                <label className="block text-zinc-500 text-[10px] font-medium pr-1">رقم الهاتف</label>
                <input 
                  type="tel" 
                  name="phone"
                  autoComplete="tel"
                  dir="ltr"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full bg-[#0a0a0a] border ${errors.phone ? 'border-red-500' : 'border-zinc-800'} rounded-lg px-3 py-2 text-right font-ibm text-white placeholder-zinc-700 text-xs focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all`}
                  placeholder="+966"
                />
              </div>

              {/* 4. Country */}
              <div className="space-y-1">
                  <label className="block text-zinc-500 text-[10px] font-medium pr-1">الدولة</label>
                  <div className="relative">
                      <select 
                        name="country"
                        autoComplete="country-name"
                        value={formData.country}
                        onChange={handleChange}
                        className={`w-full bg-[#0a0a0a] border ${errors.country ? 'border-red-500' : 'border-zinc-800'} rounded-lg px-3 py-2 text-right appearance-none font-ibm text-white text-xs focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 cursor-pointer`}
                      >
                        <option value="" disabled className="text-zinc-600">اختر الدولة</option>
                        <option value="SA">السعودية 🇸🇦</option>
                        <option value="AE">الإمارات 🇦🇪</option>
                        <option value="KW">الكويت 🇰🇼</option>
                        <option value="QA">قطر 🇶🇦</option>
                        <option value="OM">عمان 🇴🇲</option>
                        <option value="EG">مصر 🇪🇬</option>
                        <option value="JO">الأردن 🇯🇴</option>
                        <option value="OTHER">دولة أخرى 🌍</option>
                      </select>
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-600">
                        <ChevronDown size={12} />
                      </div>
                  </div>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="mt-3 w-full bg-gradient-to-r from-[#9f1239] to-[#be123c] hover:from-[#881337] hover:to-[#9f1239] text-white font-bold py-2.5 rounded-xl shadow-[0_0_15px_rgba(190,18,60,0.4)] hover:shadow-red-900/60 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 relative overflow-hidden group border border-red-500/20"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shine"></div>
                {isSubmitting ? <Loader2 size={14} className="animate-spin text-red-200" /> : null}
                <span className="font-cairo text-sm">إعرض نتيجتي الان</span>
                {!isSubmitting && <ArrowRight size={14} className="text-red-200" />}
              </button>

              {/* Trust Badges */}
              <div className="flex items-center justify-center gap-2 pt-2 border-t border-zinc-900/50 w-full mt-2">
                  <div className="flex items-center gap-1">
                      <ShieldCheck size={10} className="text-green-500" />
                      <span className="text-[9px] text-zinc-500 font-medium">آمن 100%</span>
                  </div>
                  <div className="w-px h-2 bg-zinc-800"></div>
                  <div className="flex items-center gap-1">
                      <Lock size={10} className="text-red-500" />
                      <span className="text-[9px] text-zinc-500 font-medium">بيانات سرية</span>
                  </div>
              </div>

            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ResultGatePage;
