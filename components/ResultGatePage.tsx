import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, ShieldCheck, ArrowRight, ChevronDown, User, Mail, Phone, Globe } from 'lucide-react';

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
    const phoneClean = formData.phone.replace(/[\s\-\+\(\)]/g, ''); 
    const isValidLength = phoneClean.length >= 9 && phoneClean.length <= 15;
    if (!isValidLength || !/^\d+$/.test(phoneClean)) {
      newErrors.phone = 'رقم الهاتف غير صحيح';
    }
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
    <div className="min-h-[100dvh] w-full bg-black flex flex-col items-center justify-center p-3 font-ibm relative overflow-hidden">
      
      {/* Red Pulsing Flash Behind Card */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        <motion.div 
          animate={{ 
            opacity: [0.2, 0.7, 0.2],
            scale: [0.9, 1.2, 0.9],
            filter: ["blur(80px)", "blur(120px)", "blur(80px)"]
          }}
          transition={{ 
            duration: 2.5, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="w-[350px] h-[350px] bg-red-600/50 rounded-full"
        />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
      </div>
      
      <motion.div 
        initial={{ y: -15, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        className="relative z-10 text-center mb-4"
      >
        <h1 className="font-aref font-bold text-3xl text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">عمولتك الحقيقية</h1>
        <div className="h-0.5 w-12 bg-red-700 mx-auto mt-1.5 rounded-full shadow-[0_0_12px_rgba(185,28,28,0.7)]"></div>
      </motion.div>

      <div className="relative z-10 w-full max-w-[320px]">
        <motion.div 
          initial={{ scale: 0.98, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          className="bg-zinc-900/95 backdrop-blur-3xl rounded-[1.5rem] border border-zinc-800/60 shadow-2xl overflow-hidden shadow-black/90"
        >
           {/* Clear Image - Natural Sizing - Slightly Smaller Container */}
           <div className="relative w-full bg-zinc-950 flex justify-center border-b border-zinc-800/30">
              <img 
                src="https://lh3.googleusercontent.com/d/1kCqtTV-3Do4rJWjxjb8NhgZRMVubw-CB" 
                alt="Result Ready" 
                className="w-full h-auto object-contain max-h-[140px] block" 
              />
           </div>
           
           <div className="p-5 pt-4">
              <div className="text-center mb-4">
                <h2 className="text-white font-bold text-xl tracking-tight">نتيجتك جاهزة</h2>
                <p className="text-zinc-500 text-[10px] mt-1 leading-relaxed">أدخل بياناتك بالأسفل لنتمكن من تحليل نتيجتك فوراً</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-2.5">
                {/* Name Field */}
                <div className="relative">
                  <User size={13} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input 
                    type="text" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    placeholder="الاسم الكامل" 
                    className={`w-full bg-zinc-950 border ${errors.name ? 'border-red-500' : 'border-zinc-800/80'} rounded-xl pr-10 pl-4 py-3 text-white text-xs focus:border-red-600 focus:ring-1 focus:ring-red-600/20 outline-none transition-all placeholder:text-zinc-600`} 
                  />
                </div>

                {/* Email Field */}
                <div className="relative">
                  <Mail size={13} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input 
                    type="email" 
                    name="email" 
                    dir="ltr" 
                    value={formData.email} 
                    onChange={handleChange} 
                    placeholder="البريد الإلكتروني" 
                    className={`w-full bg-zinc-950 border ${errors.email ? 'border-red-500' : 'border-zinc-800/80'} rounded-xl pr-10 pl-4 py-3 text-white text-xs focus:border-red-600 focus:ring-1 focus:ring-red-600/20 outline-none transition-all text-right md:text-left placeholder:text-zinc-600`} 
                  />
                </div>

                {/* Phone Field */}
                <div className="relative">
                  <Phone size={13} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input 
                    type="tel" 
                    name="phone" 
                    dir="ltr" 
                    value={formData.phone} 
                    onChange={handleChange} 
                    placeholder="رقم الهاتف" 
                    className={`w-full bg-zinc-950 border ${errors.phone ? 'border-red-500' : 'border-zinc-800/80'} rounded-xl pr-10 pl-4 py-3 text-white text-xs focus:border-red-600 focus:ring-1 focus:ring-red-600/20 outline-none transition-all text-right md:text-left placeholder:text-zinc-600`} 
                  />
                </div>
                
                {/* Country Field */}
                <div className="relative">
                  <Globe size={13} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                  <select 
                    name="country" 
                    value={formData.country} 
                    onChange={handleChange} 
                    className={`w-full bg-zinc-950 border ${errors.country ? 'border-red-500' : 'border-zinc-800/80'} rounded-xl pr-10 pl-8 py-3 text-white text-[11px] appearance-none outline-none cursor-pointer focus:border-red-600 transition-all`}
                  >
                    <option value="" disabled className="bg-zinc-900">اختر الدولة</option>
                    <option value="SA" className="bg-zinc-900">السعودية 🇸🇦</option>
                    <option value="AE" className="bg-zinc-900">الإمارات 🇦🇪</option>
                    <option value="KW" className="bg-zinc-900">الكويت 🇰🇼</option>
                    <option value="JO" className="bg-zinc-900">الأردن 🇯🇴</option>
                    <option value="EG" className="bg-zinc-900">مصر 🇪🇬</option>
                    <option value="OTHER" className="bg-zinc-900">دولة أخرى 🌍</option>
                  </select>
                  <ChevronDown size={11} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none" />
                </div>

                <motion.button 
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit" 
                  disabled={isSubmitting} 
                  className="w-full bg-red-700 hover:bg-red-600 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-950/40 mt-3 group overflow-hidden relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shine"></div>
                  {isSubmitting ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <>
                      <span className="text-sm">إعرض نتيجتي الآن</span>
                      <ArrowRight size={16} className="group-hover:translate-x-[-2px] transition-transform" />
                    </>
                  )}
                </motion.button>
              </form>

              <div className="mt-5 flex items-center justify-center gap-4 border-t border-zinc-800/40 pt-4">
                <div className="flex items-center gap-1.5 text-[9px] text-zinc-500 font-medium">
                  <ShieldCheck size={11} className="text-green-600/70" /> 
                  آمن 100%
                </div>
                <div className="w-px h-2.5 bg-zinc-800"></div>
                <div className="flex items-center gap-1.5 text-[9px] text-zinc-500 font-medium">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                  نتائج مباشرة
                </div>
              </div>
           </div>
        </motion.div>
        
        <p className="text-center text-zinc-600 text-[8px] mt-3 leading-relaxed px-6 opacity-60">
          بياناتك تستخدم فقط لإرسال النتيجة والتواصل المهني معك.
        </p>
      </div>
    </div>
  );
};

export default ResultGatePage;