import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Gift, Instagram, ChevronDown, MessageCircle, ShieldCheck, Undo2, ArrowLeft } from 'lucide-react';
import { faqs } from '../data/quizData';

interface ResultPageProps {
  score: number;
  answers: Record<number, string>;
}

const THEME_RED = "#Af140A";

const CountUp = ({ target, suffix = "", duration = 1.0 }: { target: number, suffix?: string, duration?: number }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const end = target;
    const totalFrames = Math.round(duration * 60);
    const increment = end / totalFrames;
    let currentFrame = 0;
    const timer = setInterval(() => {
      currentFrame++;
      start += increment;
      if (currentFrame >= totalFrames) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [target, isInView, duration]);

  return <span ref={ref} className="font-inter font-black tracking-tighter">{count.toLocaleString()}{suffix}</span>;
};

const WeeklyCountdown = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const nextSunday = new Date();
      const daysUntilSunday = (7 - now.getDay()) % 7;
      nextSunday.setDate(now.getDate() + (daysUntilSunday === 0 ? 7 : daysUntilSunday));
      nextSunday.setHours(23, 59, 59, 999);
      const difference = nextSunday.getTime() - now.getTime();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex justify-center items-center gap-2 text-white font-inter font-black text-3xl md:text-5xl mt-3" dir="ltr">
      <div className="flex flex-col items-center leading-none">
        <span>{timeLeft.days}</span>
        <span className="text-[8px] font-ibm font-bold opacity-50 uppercase tracking-[0.1em] mt-1">DAYS</span>
      </div>
      <div className="opacity-20 text-xl pb-4">:</div>
      <div className="flex flex-col items-center leading-none">
        <span>{String(timeLeft.hours).padStart(2, '0')}</span>
        <span className="text-[8px] font-ibm font-bold opacity-50 uppercase tracking-[0.1em] mt-1">HRS</span>
      </div>
      <div className="opacity-20 text-xl pb-4">:</div>
      <div className="flex flex-col items-center leading-none">
        <span>{String(timeLeft.minutes).padStart(2, '0')}</span>
        <span className="text-[8px] font-ibm font-bold opacity-50 uppercase tracking-[0.1em] mt-1">MINS</span>
      </div>
      <div className="opacity-20 text-xl pb-4">:</div>
      <div className="flex flex-col items-center leading-none">
        <span>{String(timeLeft.seconds).padStart(2, '0')}</span>
        <span className="text-[8px] font-ibm font-bold opacity-50 uppercase tracking-[0.1em] mt-1">SECS</span>
      </div>
    </div>
  );
};

const InstagramTab = () => (
  <a 
    href="https://www.instagram.com/themustafabdier" 
    target="_blank" 
    className="relative group w-full bg-[#Af140A] rounded-2xl p-5 md:p-6 flex items-center justify-between shadow-[0_10px_30px_rgba(175,20,10,0.3)] overflow-hidden transition-all hover:scale-[1.01] active:scale-95"
  >
     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shine_1.5s_infinite]"></div>
     <div className="flex items-center gap-4 relative z-10">
        <div className="bg-white/10 p-2 md:p-3 rounded-xl">
           <Instagram size={24} className="text-white" />
        </div>
        <div className="text-right">
           <p className="text-white font-ibm font-bold text-base md:text-lg leading-tight mb-0.5">تواصل معي الآن</p>
           <p className="text-white/80 font-ibm text-[11px] md:text-sm">أرسل كلمة "عمولة" على الخاص</p>
        </div>
     </div>
     <div className="bg-white/10 p-2 rounded-full relative z-10 group-hover:bg-white group-hover:text-[#Af140A] transition-colors">
        <ArrowLeft size={18} className="text-white group-hover:text-[#Af140A]" />
     </div>
  </a>
);

const ResultPage: React.FC<ResultPageProps> = ({ score }) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const videoRef = useRef<HTMLDivElement>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 200);
    return () => clearTimeout(timer);
  }, [score]);

  const scrollToVideo = () => videoRef.current?.scrollIntoView({ behavior: 'smooth' });

  const radius = 85;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="min-h-screen w-full bg-black font-ibm pb-12 relative text-white overflow-x-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
         <div className="absolute top-0 right-0 w-80 h-80 bg-[#Af140A]/10 blur-[120px] rounded-full"></div>
         <div className="absolute bottom-0 left-0 w-80 h-80 bg-zinc-950/40 blur-[120px] rounded-full"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 max-w-xl pt-10 flex flex-col gap-8 md:gap-10">
        
        {/* Header Title */}
        <h1 className="text-center font-aref font-bold text-4xl md:text-5xl text-white mb-0 tracking-tight">عمولتك الحقيقية</h1>

        {/* Top Stats Grid */}
        <div className="grid grid-cols-2 gap-3 md:gap-4">
          <div className="bg-[#Af140A]/20 backdrop-blur-2xl border border-[#Af140A]/30 rounded-[2rem] p-5 md:p-7 text-center shadow-[0_0_30px_rgba(175,20,10,0.15)]">
             <div className="text-2xl mb-1">🚀</div>
             <p className="text-3xl md:text-4xl text-white leading-none mb-1 font-inter font-black"><CountUp target={1640} /></p>
             <p className="text-[10px] md:text-xs text-zinc-100/70 font-ibm font-bold uppercase">شخص قاموا بالطلب</p>
          </div>
          <div className="bg-[#Af140A]/20 backdrop-blur-2xl border border-[#Af140A]/30 rounded-[2rem] p-5 md:p-7 text-center shadow-[0_0_30px_rgba(175,20,10,0.15)]">
             <div className="text-2xl mb-1">⭐</div>
             <p className="text-3xl md:text-4xl text-white leading-none mb-1 font-inter font-black"><CountUp target={93} suffix="%" /></p>
             <p className="text-[10px] md:text-xs text-zinc-100/70 font-ibm font-bold uppercase">نسبة الرضا</p>
          </div>
        </div>

        {/* Result Card */}
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-[#Af140A]/10 backdrop-blur-3xl rounded-[2.5rem] border border-[#Af140A]/20 p-7 md:p-10 flex flex-col items-center text-center shadow-[0_0_60px_rgba(175,20,10,0.15)] relative overflow-hidden"
        >
          <h2 className="text-[#Af140A] font-ibm font-bold text-2xl md:text-3xl mb-6 uppercase tracking-tighter leading-none">نتيجتك‌الحالية</h2>
          
          <div className="relative w-64 h-32 mb-6">
             <svg className="w-full h-full" viewBox="0 0 200 110">
                <path d="M 15 100 A 85 85 0 0 1 185 100" fill="none" stroke="#1a1a1a" strokeWidth="18" strokeLinecap="round" />
                <motion.path 
                  d="M 15 100 A 85 85 0 0 1 185 100" 
                  fill="none" 
                  stroke="#Af140A" 
                  strokeWidth="18" 
                  strokeLinecap="round" 
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: strokeDashoffset }}
                  transition={{ duration: 1.2, ease: "circOut" }}
                />
             </svg>
             <div className="absolute inset-0 flex items-center justify-center pt-8 text-7xl md:text-8xl font-inter font-black text-white tracking-tighter">
                {Math.round(animatedScore)}%
             </div>
          </div>

          <p className="text-zinc-200 font-ibm font-bold text-lg md:text-xl mb-8 leading-relaxed max-w-xs md:max-w-sm">
             {score > 70 ? "لديك إمكانيات مذهلة للوصول إلى القمة! حان وقت الانطلاق لتحقيق ثروتك 🚀" : "أنت في بداية الطريق، وبقليل من التوجيه الصحيح ستتضاعف نتائجك فوراً 👇"}
          </p>

          <button 
            onClick={scrollToVideo}
            className="w-full bg-[#Af140A] hover:bg-[#8B1008] text-white py-5 rounded-2xl font-ibm font-bold text-xl md:text-2xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-2xl shadow-[#Af140A]/30"
          >
            <Gift size={24} />
            <span>شاهد هديتك</span>
          </button>
        </motion.div>

        {/* Video Card */}
        <div ref={videoRef} className="bg-zinc-900 rounded-[2.5rem] p-1 border border-zinc-800 shadow-2xl aspect-video overflow-hidden">
           <iframe 
             src="https://player.vimeo.com/video/1144322731?badge=0&autopause=0&player_id=0&app_id=58479&title=0&byline=0&portrait=0" 
             className="w-full h-full rounded-[2.4rem]" 
             frameBorder="0" 
             allow="autoplay; fullscreen; picture-in-picture" 
           />
        </div>

        {/* RED CTA Card */}
        <div className="bg-[#Af140A] rounded-[2.5rem] p-8 md:p-12 text-center flex flex-col items-center shadow-2xl shadow-[#Af140A]/50 overflow-hidden relative group">
           <p className="text-white text-sm md:text-base font-ibm font-bold mb-3 opacity-90">أرسل لي كلمة</p>
           <h2 className="font-aref text-[100px] md:text-[130px] leading-none text-white mb-8 drop-shadow-2xl relative">
              <span className="relative z-10">عمولة</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-20 translate-x-[-250%] group-hover:animate-[shine_1.8s_infinite] pointer-events-none"></div>
           </h2>
           <p className="text-white font-ibm text-base md:text-lg font-medium leading-relaxed mb-10 max-w-xs md:max-w-sm">
             لنستكمل الجزء الثاني من الخطة ونبدأ التحدي سوا 🤝 🔥
           </p>
           <div className="flex gap-3 w-full">
              <a 
                href="https://www.instagram.com/themustafabdier" 
                target="_blank" 
                className="flex-1 bg-white text-black py-4 rounded-full font-ibm font-bold flex items-center justify-center gap-2 text-sm shadow-lg hover:scale-105 transition-transform"
              >
                <Instagram size={20} className="text-[#Af140A]" />
                إنستغرام
              </a>
              <a 
                href="https://wa.me/447400757671?text=عمولة" 
                target="_blank" 
                className="flex-1 bg-[#25D366] text-white py-4 rounded-full font-ibm font-bold flex items-center justify-center gap-2 text-sm shadow-lg hover:scale-105 transition-transform"
              >
                <MessageCircle size={20} />
                واتساب
              </a>
           </div>
        </div>

        {/* Weekly Joined Card */}
        <div className="bg-[#18181b] border border-zinc-800/80 rounded-[2.5rem] p-7 md:p-10 shadow-xl">
           <div className="flex items-center justify-between gap-6 md:gap-8">
             <div className="text-6xl md:text-8xl text-white font-inter font-black flex items-start leading-none order-first">
               <CountUp target={346} duration={0.8} />
               <span className="text-[#Af140A] text-4xl md:text-6xl mt-1 mr-1">+</span>
             </div>
             <div className="flex-1 text-right">
                <p className="text-zinc-100 font-ibm font-bold text-base md:text-lg leading-relaxed">
                  شخص قاموا بالأنضمام لبرنامجي التدريبي خلال هذا الأسبوع ، القرار قرارك 🎯
                </p>
             </div>
           </div>
           <div className="w-full h-px bg-zinc-800/40 my-6 md:my-8"></div>
           <div className="w-full">
              <WeeklyCountdown />
              <p className="mt-6 text-sm md:text-base text-white font-ibm font-bold tracking-normal flex items-center justify-center gap-2">
                الوقت المتبقي لك لحسم قرارك ⏱️
              </p>
           </div>
        </div>

        {/* Instagram Tab */}
        <InstagramTab />

        {/* Bio Section */}
        <div className="relative pt-4">
          <div className="relative w-full h-[400px] md:h-[480px] overflow-hidden rounded-t-[2.5rem]">
             <img 
               src="https://lh3.googleusercontent.com/d/1MBc6AH2-t0WtozIzrQ_aPXh8A0-eyW8Z" 
               className="w-full h-full object-cover object-top" 
               alt="Mustafa Bdeir" 
             />
             <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black via-black/98 to-transparent"></div>
          </div>
          <div className="bg-black p-8 md:p-10 pt-0 -mt-20 relative z-20 rounded-b-[2.5rem] border-x border-b border-zinc-800/30 text-right">
             <h3 className="text-5xl md:text-7xl font-aref font-bold text-white mb-1 drop-shadow-2xl">مصطفى بدير</h3>
             <p className="text-[#Af140A] text-lg md:text-xl font-ibm font-bold mb-5 tracking-wide">رائد أعمال ومدرب مالي</p>
             <p className="text-zinc-300 font-ibm text-base md:text-lg font-medium leading-relaxed">
               مدرب مالي وتسويق بالعموبة قام خلال الخمس سنوات بممساعدة اكتر من 1000 شخص كيف يحققو دخل أونلاين وساعد مئات الاشخاص منهم انهم يعملو ما بين ال 10,000$ الى 50,000$ بفضل الله سبحانه وتعالى وبفضل الاستراتيجية التي يتبعها مئات من طلابه سنوياّ
             </p>
          </div>
        </div>

        {/* Golden Guarantee Card */}
        <div className="bg-[#0f0f0f] border-2 border-yellow-600/15 rounded-[2.5rem] p-7 md:p-10 pt-16 md:pt-20 text-center shadow-[0_0_60px_rgba(202,138,4,0.03)] relative mt-24">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 md:w-40 md:h-40 bg-black rounded-full p-2 border border-yellow-600/20 shadow-2xl flex items-center justify-center">
              <img 
                src="https://lh3.googleusercontent.com/d/1ZGPZLBrbp6s3UrcckLJcN12KjSGvE7bu" 
                className="w-28 h-28 md:w-36 md:h-36 object-contain filter drop-shadow-[0_0_20px_rgba(202,138,4,0.6)]" 
                alt="Golden Guarantee" 
              />
           </div>
           <h4 className="text-yellow-500 font-aref text-3xl md:text-4xl font-bold mb-6">ضمان الاسترجاع الذهبي</h4>
           <p className="text-zinc-100 font-ibm text-base md:text-lg leading-relaxed max-w-md mx-auto mb-10 font-medium">
             نحرص بشدة على ارجاع كامل المبلغ في حال لم تجد القيمة الحقيقية وراء هذه الوكالة خلال خمس ايام من اشتراكك ، وبدون ابداء اسباب
           </p>
           <div className="flex flex-col items-center gap-5 border-t border-zinc-800/60 pt-8">
              <div className="flex items-center gap-3 text-yellow-500 font-ibm text-sm md:text-base font-bold">
                 <ShieldCheck size={22} className="text-yellow-500" />
                 <span>ضمان استرجاع ذهبي خلال اول خمس أيام</span>
              </div>
              <div className="flex items-center gap-3 text-yellow-500 font-ibm text-sm md:text-base font-bold">
                 <Undo2 size={22} className="text-yellow-500" />
                 <span>استرجاع بقيمة 100%</span>
              </div>
           </div>
        </div>

        {/* FAQs Section */}
        <div className="space-y-4 pb-4 mt-8">
          <h4 className="text-center text-white font-aref text-3xl md:text-4xl font-bold mb-8">الأسئلة الشائعة</h4>
          {faqs.map((faq, i) => (
            <div key={i} className="bg-zinc-900/20 border border-zinc-800/50 rounded-2xl overflow-hidden backdrop-blur-sm">
               <button 
                 onClick={() => setOpenFaq(openFaq === i ? null : i)} 
                 className="w-full p-6 md:p-8 flex justify-between items-center text-right text-sm md:text-base font-ibm font-bold text-zinc-100 transition-colors hover:bg-zinc-800/30"
               >
                  <span>{faq.question}</span>
                  <motion.div animate={{ rotate: openFaq === i ? 180 : 0 }}>
                    <ChevronDown size={22} className={openFaq === i ? "text-[#Af140A]" : "text-zinc-600"} />
                  </motion.div>
               </button>
               <AnimatePresence>
                 {openFaq === i && (
                   <motion.div 
                     initial={{ height: 0, opacity: 0 }} 
                     animate={{ height: 'auto', opacity: 1 }} 
                     exit={{ height: 0, opacity: 0 }}
                     className="px-6 md:px-8 pb-6 md:pb-8 text-base md:text-lg font-ibm font-normal text-zinc-400 leading-relaxed pt-2"
                   >
                     {faq.answer}
                   </motion.div>
                 )}
               </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Final CTA Tab */}
        <InstagramTab />

        {/* Copyright Footer */}
        <div className="text-center py-10 border-t border-zinc-900/50">
           <p className="text-zinc-600 font-ibm text-xs font-bold tracking-[0.1em] uppercase">
             جميع الحقوق محفوظة لمصطفى بدير &copy; {new Date().getFullYear()}
           </p>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;