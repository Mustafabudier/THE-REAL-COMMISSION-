import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Loader2, ShieldCheck, ArrowRight, ChevronDown } from 'lucide-react';

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
    
    // تنظيف الرقم من أي رموز
    const phoneClean = formData.phone.replace(/[\s\-\+\(\)]/g, ''); 
    
    // شروط مرنة: الطول بين 9 و 15 خانة، ويسمح بالبدء بـ 0
    const isValidLength = phoneClean.length >= 9 && phoneClean.length <= 15;
    const isFake = /^(012345678|123456789|111111111|000000000)$/.test(phoneClean);

    if (!isValidLength || isFake || !/^\d+$/.test(phoneClean)) {
      newErrors.phone = 'رقم الهاتف غير صحيح (مثال: 05xxxxxxxx)';
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
    <div className="min-h-[100dvh] w-full bg-black flex flex-col items-center justify-center p-4 font-ibm relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#1a0000] to-black opacity-50"></div>
      
      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="relative z-10 text-center mb-8">
        <h1 className="font-aref font-bold text-4xl text-white">عمولتك الحقيقية</h1>
      </motion.div>

      <div className="relative z-10 w-full max-w-[320px]">
        <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-[#0a0a0a] rounded-[2rem] border border-zinc-800 shadow-2xl overflow-hidden">
           <img src="https://lh3.googleusercontent.com/d/1kCqtTV-3Do4rJWjxjb8NhgZRMVubw-CB" alt="Locked" className="w-full h-32 object-cover opacity-80" />
           
           <div className="p-6">
              <div className="text-center mb-6">
                <h2 className="text-white font-bold text-xl flex items-center justify-center gap-2">النتيجة بانتظارك <Lock size={16} className="text-red-600" /></h2>
                <p className="text-zinc-500 text-[11px] mt-1">سجل بياناتك لفك القفل عن نتيجتك</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="الاسم الكامل" className={`w-full bg-black border ${errors.name ? 'border-red-500' : 'border-zinc-800'} rounded-xl px-4 py-3 text-white text-sm focus:border-red-600 outline-none transition-all`} />
                <input type="email" name="email" dir="ltr" value={formData.email} onChange={handleChange} placeholder="البريد الإلكتروني" className={`w-full bg-black border ${errors.email ? 'border-red-500' : 'border-zinc-800'} rounded-xl px-4 py-3 text-white text-sm focus:border-red-600 outline-none transition-all`} />
                <input type="tel" name="phone" dir="ltr" value={formData.phone} onChange={handleChange} placeholder="رقم الهاتف (05xxxxxxxx)" className={`w-full bg-black border ${errors.phone ? 'border-red-500' : 'border-zinc-800'} rounded-xl px-4 py-3 text-white text-sm focus:border-red-600 outline-none transition-all`} />
                {errors.phone && <p className="text-[10px] text-red-500 font-bold px-1">{errors.phone}</p>}
                
                <div className="relative">
                  <select name="country" value={formData.country} onChange={handleChange} className={`w-full bg-black border ${errors.country ? 'border-red-500' : 'border-zinc-800'} rounded-xl px-4 py-3 text-white text-sm appearance-none outline-none cursor-pointer`}>
                    <option value="" disabled>اختر الدولة</option>
                    <option value="SA">السعودية 🇸🇦</option>
                    <option value="AE">الإمارات 🇦🇪</option>
                    <option value="KW">الكويت 🇰🇼</option>
                    <option value="JO">الأردن 🇯🇴</option>
                    <option value="EG">مصر 🇪🇬</option>
                    <option value="OTHER">دولة أخرى 🌍</option>
                  </select>
                  <ChevronDown size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" />
                </div>

                <button type="submit" disabled={isSubmitting} className="w-full bg-red-700 hover:bg-red-600 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-900/20 mt-4">
                  {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} />}
                  <span>{isSubmitting ? 'جاري التأمين...' : 'إعرض نتيجتي الآن'}</span>
                </button>
              </form>

              <div className="mt-6 flex items-center justify-center gap-4 border-t border-zinc-900 pt-4">
                <div className="flex items-center gap-1 text-[10px] text-zinc-500"><ShieldCheck size={12} className="text-green-600" /> آمن</div>
                <div className="w-px h-3 bg-zinc-800"></div>
                <div className="flex items-center gap-1 text-[10px] text-zinc-500"><Lock size={12} className="text-red-600" /> مشفر</div>
              </div>
           </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ResultGatePage;