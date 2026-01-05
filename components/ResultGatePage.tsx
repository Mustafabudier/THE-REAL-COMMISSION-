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
    
    if (formData.name.trim().length < 3) newErrors.name = 'الاسم مطلوب بشكل كامل';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'يرجى إدخال بريد إلكتروني صحيح';
    
    // التحقق من رقم الهاتف لضمان وصوله لجوجل شيت وللواتساب بشكل صحيح
    const phoneClean = formData.phone.replace(/[\s\-\+\(\)]/g, ''); 
    const isValidLength = phoneClean.length >= 9 && phoneClean.length <= 15;
    const isGeneric = /^(012345678|123456789|0123456789|987654321|00000000|11111111|22222222|33333333|44444444|55555555|66666666|77777777|88888888|99999999)$/.test(phoneClean);
    const hasTooManyRepeats = /(.)\1{6,}/.test(phoneClean);

    if (!isValidLength || isGeneric || hasTooManyRepeats || !/^\d+$/.test(phoneClean)) {
      newErrors.phone = 'يرجى إدخال رقم هاتف حقيقي (مثل: 05xxxxxxx)';
    }
    
    if (!formData.country) newErrors.country = 'يرجى اختيار الدولة';
    
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
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black via-[#0f0000] to-black"></div>
        <div className="absolute top-[40%] left-[-2%] md:left-[5%] opacity-30 animate-float text-5xl z-0">🎯</div>
      </div>

      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="relative z-10 text-center mb-6">
        <h1 className="font-aref font-bold text-4xl md:text-5xl text-white">عمولتك الحقيقية</h1>
      </motion.div>

      <div className="relative z-10 w-full max-w-[280px] flex flex-col items-center">
        <div className="absolute top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[80%] bg-red-600/30 blur-[60px] rounded-full pointer-events-none z-0"></div>
        
        <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-full relative z-20 shadow-2xl">
            <img src="https://lh3.googleusercontent.com/d/1kCqtTV-3Do4rJWjxjb8NhgZRMVubw-CB" alt="Locked Result" className="w-full h-auto object-cover rounded-t-[1.5rem]" />
        </motion.div>

        <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="w-full relative z-10 bg-[#050505] rounded-b-[1.5rem] border-x border-b border-zinc-900 shadow-2xl p-4">
           <div className="text-center mb-4">
               <h2 className="font-ibm font-bold text-lg text-white mb-1 flex items-center justify-center gap-2">النتيجة جاهزة <Lock size={14} className="text-red-500" /></h2>
               <p className="text-[10px] text-zinc-400">املئ بياناتك بدقة لتصلك النتيجة</p>
           </div>

           <form onSubmit={handleSubmit} className="w-full space-y-2.5">
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="الاسم الكامل" className={`w-full bg-[#0a0a0a] border ${errors.name ? 'border-red-500' : 'border-zinc-800'} rounded-lg px-3 py-2 text-right text-white text-xs focus:border-red-600 outline-none`} />
              <input type="email" name="email" dir="ltr" value={formData.email} onChange={handleChange} placeholder="البريد الإلكتروني" className={`w-full bg-[#0a0a0a] border ${errors.email ? 'border-red-500' : 'border-zinc-800'} rounded-lg px-3 py-2 text-right text-white text-xs focus:border-red-600 outline-none`} />
              <input type="tel" name="phone" dir="ltr" value={formData.phone} onChange={handleChange} placeholder="رقم الهاتف (مثل: 05xxxxxxxx)" className={`w-full bg-[#0a0a0a] border ${errors.phone ? 'border-red-500' : 'border-zinc-800'} rounded-lg px-3 py-2 text-right text-white text-xs focus:border-red-600 outline-none`} />
              {errors.phone && <p className="text-[9px] text-red-500 font-bold">{errors.phone}</p>}
              
              <div className="relative">
                  <select name="country" value={formData.country} onChange={handleChange} className={`w-full bg-[#0a0a0a] border ${errors.country ? 'border-red-500' : 'border-zinc-800'} rounded-lg px-3 py-2 text-right appearance-none text-white text-xs outline-none cursor-pointer`}>
                    <option value="" disabled>اختر الدولة</option>
                    <option value="SA">السعودية 🇸🇦</option>
                    <option value="AE">الإمارات 🇦🇪</option>
                    <option value="KW">الكويت 🇰🇼</option>
                    <option value="EG">مصر 🇪🇬</option>
                    <option value="JO">الأردن 🇯🇴</option>
                    <option value="OTHER">دولة أخرى 🌍</option>
                  </select>
                  <ChevronDown size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full bg-red-700 hover:bg-red-600 text-white font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2">
                {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <ArrowRight size={14} />}
                <span className="text-xs">{isSubmitting ? 'جاري الإرسال...' : 'إعرض نتيجتي الان'}</span>
              </button>
           </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ResultGatePage;