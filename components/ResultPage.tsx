import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { 
  Gift, 
  Instagram,
  ChevronDown,
  ChevronUp,
  MessageCircle
} from 'lucide-react';
import { faqs } from '../data/quizData';

interface ResultPageProps {
  score: number;
  answers: Record<number, string>;
}

const CountUp = ({ target, duration = 1.5, suffix = "" }: { target: number, duration?: number, suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

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
  }, [target, duration, isInView]);

  return <span ref={ref}>{count}{suffix}</span>;
};

const WeeklyCountdown = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const dayOfWeek = now.getDay(); 
      const daysUntilFriday = (5 + 7 - dayOfWeek) % 7 || 7; 
      const deadline = new Date(now);
      deadline.setDate(now.getDate() + daysUntilFriday);
      deadline.setHours(23, 59, 59, 999);
      const difference = deadline.getTime() - now.getTime();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };
    const timer = setInterval(calculateTimeLeft, 1000);
    calculateTimeLeft(); 
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center gap-2 text-red-500 font-outfit font-bold text-lg md:text-xl mt-2 dir-ltr">
      {[timeLeft.seconds, timeLeft.minutes, timeLeft.hours, timeLeft.days].map((val, i) => (
        <React.Fragment key={i}>
          <div className="bg-zinc-900/80 px-3 py-2 rounded-lg border border-zinc-800 min-w-[45px] text-center">
            {val} <span className="text-[9px] block text-gray-400 font-ibm font-normal">{['ثانية', 'دقيقة', 'ساعة', 'يوم'][i]}</span>
          </div>
          {i < 3 && <span>:</span>}
        </React.Fragment>
      ))}
    </div>
  );
};

const ResultPage: React.FC<ResultPageProps> = ({ score, answers }) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const videoRef = useRef<HTMLDivElement>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 400);
    return () => clearTimeout(timer);
  }, [score]);

  const scrollToVideo = () => videoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });

  const radius = 85;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="min-h-screen w-full bg-black font-ibm pb-20 relative text-white">
      <div className="fixed inset-0 pointer-events-none opacity-20">
         <div className="absolute top-0 right-0 w-96 h-96 bg-red-900 blur-3xl rounded-full"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 max-w-xl pt-8 flex flex-col gap-6">
        <h1 className="text-center font-aref font-bold text-4xl text-white">عمولتك الحقيقية</h1>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 text-center">
             <p className="text-xs text-zinc-400 mb-1">شخص قامو بالاختبار</p>
             <p className="text-2xl font-bold"><CountUp target={1389} suffix="+" /></p>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 text-center">
             <p className="text-xs text-zinc-400 mb-1">معدل الرضا</p>
             <p className="text-2xl font-bold"><CountUp target={93} suffix="%" /></p>
          </div>
        </div>

        {/* Result Card */}
        <div className="bg-zinc-900/30 rounded-[2.5rem] border border-zinc-800 p-8 flex flex-col items-center text-center">
          <h2 className="text-red-500 font-bold text-xl mb-6">نتيجتك النهائية</h2>
          <div className="relative w-48 h-24 mb-6">
             <svg className="w-full h-full" viewBox="0 0 200 110">
                <path d="M 15 100 A 85 85 0 0 1 185 100" fill="none" stroke="#222" strokeWidth="15" strokeLinecap="round" />
                <motion.path d="M 15 100 A 85 85 0 0 1 185 100" fill="none" stroke="#ef4444" strokeWidth="15" strokeLinecap="round" strokeDasharray={circumference} initial={{ strokeDashoffset: circumference }} animate={{ strokeDashoffset: strokeDashoffset }} transition={{ duration: 1.5 }} />
             </svg>
             <div className="absolute inset-0 flex items-center justify-center pt-8 text-4xl font-black">{Math.round(animatedScore)}%</div>
          </div>
          <p className="text-zinc-400 text-sm mb-6">اكتشف كيف تضاعف هذا الرقم في الفيديو بالأسفل 👇</p>
          <button onClick={scrollToVideo} className="w-full bg-red-700 py-3 rounded-xl font-bold flex items-center justify-center gap-2"><Gift size={18} /> احصل على هديتك</button>
        </div>

        {/* Video Section */}
        <div ref={videoRef} className="bg-zinc-900 rounded-2xl p-1 border border-zinc-800 aspect-video">
           <iframe src="https://player.vimeo.com/video/1144322731" className="w-full h-full rounded-xl" frameBorder="0" allow="autoplay; fullscreen" />
        </div>

        {/* CTA Section */}
        <div className="bg-red-900/20 border border-red-900/50 rounded-[2.5rem] p-8 text-center">
           <span className="text-zinc-400 text-sm">ارسل كلمة</span>
           <h2 className="font-aref text-6xl text-white my-2">عمولة</h2>
           <p className="text-xs text-zinc-300 mb-6">لناقش مع بعض الشق التاني من الاستراتيجية ونرسم خطة البدء</p>
           
           <div className="flex flex-col gap-3">
             <a href="https://www.instagram.com/themustafabdier" target="_blank" className="bg-white text-red-900 py-3 rounded-full font-bold flex items-center justify-center gap-2 text-sm"><Instagram size={18} /> اضغط وأرسل كلمة عمولة من هنا</a>
             <a href="https://wa.me/447400757671?text=عمولة" target="_blank" className="bg-green-600/10 border border-green-600/50 text-white py-3 rounded-full font-bold flex items-center justify-center gap-2 text-sm hover:bg-green-600/20 transition-all">
                <MessageCircle size={18} className="text-green-500" /> 
                تواصل دايركت مع مصطفى على الواتس اب
             </a>
           </div>
        </div>

        {/* Bio */}
        <div className="bg-zinc-900 rounded-[2.5rem] overflow-hidden border border-zinc-800">
           <img src="https://lh3.googleusercontent.com/d/1MBc6AH2-t0WtozIzrQ_aPXh8A0-eyW8Z" className="w-full h-64 object-cover" />
           <div className="p-6">
              <h3 className="text-2xl font-bold">مصطفى بدير</h3>
              <p className="text-red-500 text-xs mb-3">مدرب مالي ورائد أعمال</p>
              <p className="text-zinc-400 text-sm leading-relaxed">خبرة تجاوزت الخمس سنوات في صناعة المحتوى والتسويق بالعمولة، ساعد آلاف الأشخاص حول العالم في بناء بيزنس أونلاين حقيقي.</p>
           </div>
        </div>

        {/* FAQs */}
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
               <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full p-4 flex justify-between items-center text-sm font-bold">
                  <span>{faq.question}</span>
                  {openFaq === i ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
               </button>
               {openFaq === i && <div className="px-4 pb-4 text-xs text-zinc-400 leading-relaxed border-t border-zinc-800 pt-3">{faq.answer}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResultPage;