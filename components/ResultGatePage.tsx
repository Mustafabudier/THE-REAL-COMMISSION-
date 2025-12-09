
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Loader2, AlertCircle, DollarSign, Star, Key, ShieldCheck, ArrowRight } from 'lucide-react';

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
    if (formData.name.trim().length < 3) newErrors.name = 'الاسم يجب أن يكون 3 أحرف على الأقل';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'يرجى إدخال بريد إلكتروني صحيح';
    if (!/^\d{8,}$/.test(formData.phone)) newErrors.phone = 'يرجى إدخال رقم هاتف صحيح';
    if (!formData.country) newErrors.country = 'يرجى اختيار الدولة';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    // Simulate API delay, actual logic handled in parent
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    // Clear error when user types
    if (errors[e.target.name]) {
      setErrors(prev => ({ ...prev, [e.target.name]: '' }));
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#09090b] flex flex-col items-center justify-center p-4 relative overflow-hidden font-ibm">
      
      {/* 1. Background Animation Layer (Floating Icons) */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <motion.div 
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[10%] left-[10%] text-[#BE123C] opacity-30"
        >
          <Lock size={48} />
        </motion.div>
        <motion.div 
           animate={{ y: [0, 30, 0], rotate: [0, -15, 0] }}
           transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
           className="absolute bottom-[20%] right-[10%] text-[#BE123C] opacity-20"
        >
          <Key size={56} />
        </motion.div>
        <motion.div 
           animate={{ y: [0, -25, 0], x: [0, 10, 0] }}
           transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
           className="absolute top-[20%] right-[20%] text-[#BE123C] opacity-25"
        >
          <ShieldCheck size={40} />
        </motion.div>
        <motion.div 
           animate={{ scale: [1, 1.1, 1] }}
           transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
           className="absolute bottom-[15%] left-[20%] text-[#BE123C] opacity-30"
        >
          <DollarSign size={64} />
        </motion.div>
        <motion.div 
           animate={{ rotate: [0, 360] }}
           transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
           className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 text-[#BE123C] opacity-10"
        >
          <Star size={120} />
        </motion.div>
      </div>

      {/* 2. Main Card */}
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-[90%] max-w-[19rem] bg-white rounded-3xl shadow-2xl shadow-rose-900/10 border border-rose-50 overflow-hidden my-4"
      >
        
        {/* Header Image - Reduced Height */}
        <div className="relative h-32 w-full bg-gray-100">
           <img 
             src="https://lh3.googleusercontent.com/d/1kCqtTV-3Do4rJWjxjb8NhgZRMVubw-CB" 
             alt="Unlock Results" 
             className="w-full h-full object-cover"
           />
        </div>

        {/* Content Section - Compact Padding */}
        <div className="px-5 pt-4 pb-6">
          
          <div className="text-center mb-6">
            <h2 className="font-ibm font-bold text-xl text-[#881337] mb-1">النتيجة جاهزة!</h2>
            <p className="text-gray-500 text-[10px] md:text-xs font-medium">أدخل بياناتك لفتح النتيجة فوراً</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            
            {/* Name */}
            <div className="space-y-1 text-right">
              <label className="block text-gray-800 font-ibm font-bold text-xs md:text-sm mr-1">
                الاسم الكامل
              </label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full bg-gray-50 text-gray-900 border rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-rose-100 transition-all
                  ${errors.name ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#BE123C]'}
                `}
                placeholder="أدخل اسمك هنا"
              />
              {errors.name && <span className="text-red-500 text-[9px] block mr-1">{errors.name}</span>}
            </div>

            {/* Email */}
            <div className="space-y-1 text-right">
              <label className="block text-gray-800 font-ibm font-bold text-xs md:text-sm mr-1">
                البريد الإلكتروني
              </label>
              <input 
                type="email" 
                name="email"
                dir="ltr"
                value={formData.email}
                onChange={handleChange}
                className={`w-full bg-gray-50 text-gray-900 border rounded-xl px-3 py-2 text-xs text-right focus:outline-none focus:ring-2 focus:ring-rose-100 transition-all
                  ${errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#BE123C]'}
                `}
                placeholder="example@gmail.com"
              />
              {errors.email && <span className="text-red-500 text-[9px] block mr-1">{errors.email}</span>}
            </div>

            {/* Phone */}
            <div className="space-y-1 text-right">
               <label className="block text-gray-800 font-ibm font-bold text-xs md:text-sm mr-1">
                رقم الهاتف
              </label>
              <input 
                type="tel" 
                name="phone"
                dir="ltr"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full bg-gray-50 text-gray-900 border rounded-xl px-3 py-2 text-xs text-right focus:outline-none focus:ring-2 focus:ring-rose-100 transition-all
                  ${errors.phone ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#BE123C]'}
                `}
                placeholder="05XXXXXXXX"
              />
              {errors.phone && <span className="text-red-500 text-[9px] block mr-1">{errors.phone}</span>}
            </div>

            {/* Country */}
            <div className="space-y-1 text-right">
              <label className="block text-gray-800 font-ibm font-bold text-xs md:text-sm mr-1">
                الدولة
              </label>
              <div className="relative">
                <select 
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className={`w-full bg-gray-50 text-gray-900 border rounded-xl px-3 py-2 text-xs appearance-none focus:outline-none focus:ring-2 focus:ring-rose-100 transition-all
                    ${errors.country ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#BE123C]'}
                  `}
                >
                  <option value="" disabled>اختر الدولة</option>
                  <optgroup label="الدول العربية">
                    <option value="SA">السعودية</option>
                    <option value="AE">الإمارات</option>
                    <option value="KW">الكويت</option>
                    <option value="QA">قطر</option>
                    <option value="OM">عمان</option>
                    <option value="BH">البحرين</option>
                    <option value="EG">مصر</option>
                    <option value="JO">الأردن</option>
                    <option value="LB">لبنان</option>
                    <option value="IQ">العراق</option>
                    <option value="MA">المغرب</option>
                    <option value="DZ">الجزائر</option>
                    <option value="TN">تونس</option>
                    <option value="LY">ليبيا</option>
                    <option value="SD">السودان</option>
                    <option value="YE">اليمن</option>
                    <option value="PS">فلسطين</option>
                    <option value="SY">سوريا</option>
                  </optgroup>
                  <optgroup label="باقي دول العالم">
                    <option value="TR">تركيا</option>
                    <option value="US">الولايات المتحدة</option>
                    <option value="UK">المملكة المتحدة</option>
                    <option value="EU">أوروبا</option>
                    <option value="OTHER">أخرى</option>
                  </optgroup>
                </select>
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <ArrowRight size={12} className="rotate-90" />
                </div>
              </div>
              {errors.country && <span className="text-red-500 text-[9px] block mr-1">{errors.country}</span>}
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={isSubmitting}
              className="mt-2 w-full bg-gradient-to-r from-[#881337] to-[#BE123C] text-white font-cairo font-bold text-sm py-3 rounded-xl shadow-lg shadow-rose-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  <span>جاري المعالجة...</span>
                </>
              ) : (
                <>
                  <Lock size={16} />
                  <span>أظهر النتيجة الآن</span>
                </>
              )}
            </button>

            {/* Privacy Footer */}
            <div className="text-center">
              <p className="text-[9px] text-gray-400">
                بياناتك آمنة 100%.
              </p>
            </div>

          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ResultGatePage;
