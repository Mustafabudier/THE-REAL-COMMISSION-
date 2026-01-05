import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Gift, Instagram, ChevronDown, ChevronUp, MessageCircle } from 'lucide-react';
import { faqs } from '../data/quizData';

interface ResultPageProps {
  score: number;
  answers: Record<number, string>;
}

const CountUp = ({ target, suffix = "" }: { target: number, suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const end = target;
    const duration = 1.5;
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
  }, [target, isInView]);

  return <span ref={ref}>{count}{suffix}</span>;
};

const ResultPage: React.FC<ResultPageProps> = ({ score }) => {
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
    <div className="min-h-screen w-full bg-black font-ibm pb-24 relative text-white">
      <div className="fixed inset-0 pointer-events-none opacity-20">
         <div className="absolute top-0 right-0 w-96 h-96 bg-red-900 blur-[120px] rounded-full"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 max-w-xl pt-10 flex flex-col gap-8">
        <h1 className="text-center font-aref font-bold text-4xl text-white">عمولتك الحقيقية</h1>

        {/* Score Ring */}
        <div className="bg-zinc-900/40 rounded-[3rem] border border-zinc-800 p-10 flex flex-col items-center text-center shadow-2xl backdrop-blur-sm">
          <h2 className="text-red-500 font-bold text-xl mb-8 uppercase tracking-widest">نتيجتك النهائية</h2>
          <div className="relative w-56 h-28 mb-8">
             <svg className="w-full h-full" viewBox="0 0 200 110">
                <path d="M 15 100 A 85 85 0 0 1 185 100" fill="none" stroke="#1a1a1a" strokeWidth="16" strokeLinecap="round" />
                <motion.path d="M 15 100 A 85 85 0 0 1 185 100" fill="none" stroke="#be123c" strokeWidth="16" strokeLinecap="round" strokeDasharray={circumference} initial={{ strokeDashoffset: circumference }} animate={{ strokeDashoffset: strokeDashoffset }} transition={{ duration: 1.5, ease: "easeOut" }} />
             </svg>
             <div className="absolute inset-0 flex items-center justify-center pt-10 text-5xl font-black text-white">{Math.round(animatedScore)}%</div>
          </div>
          <p className="text-zinc-400 text-sm mb-8 px-4">هذه النتيجة بناءً على مهاراتك الحالية، اكتشف كيف نرفعها للضعف 👇</p>
          <button onClick={scrollToVideo} className="w-full bg-red-700 hover:bg-red-600 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg shadow-red-900/40"><Gift size={20} /> شاهد الفيديو وهديتك</button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-5 text-center">
             <p className="text-[10px] text-zinc-500 mb-1 uppercase tracking-tighter">أشخاص خاضوا التجربة</p>
             <p className="text-2xl font-bold text-white"><CountUp target={1422} suffix="+" /></p>
          </div>
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-5 text-center">
             <p className="text-[10px] text-zinc-500 mb-1 uppercase tracking-tighter">نسبة النجاح</p>
             <p className="text-2xl font-bold text-white"><CountUp target={96} suffix="%" /></p>
          </div>
        </div>

        {/* Video Section */}
        <div ref={videoRef} className="bg-zinc-900 rounded-3xl p-1 border border-zinc-800 shadow-2xl overflow-hidden aspect-video">
           <iframe src="https://player.vimeo.com/video/1144322731" className="w-full h-full rounded-[1.4rem]" frameBorder="0" allow="autoplay; fullscreen" />
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-b from-red-950/20 to-black border border-red-900/30 rounded-[3rem] p-10 text-center shadow-2xl">
           <p className="text-zinc-500 text-sm mb-2">أرسل لنا كلمة</p>
           <h2 className="font-aref text-7xl text-white mb-6 animate-pulse">عمولة</h2>
           <p className="text-xs text-zinc-400 leading-relaxed mb-8">لنبدأ معاً رحلة مضاعفة أرباحك وبناء خطة عمل حقيقية تناسب أهدافك</p>
           
           <div className="flex flex-col gap-4">
             <a href="https://www.instagram.com/themustafabdier" target="_blank" className="bg-white text-black py-4 rounded-full font-bold flex items-center justify-center gap-3 text-sm hover:scale-[1.02] transition-transform active:scale-95 shadow-xl"><Instagram size={20} className="text-red-600" /> أرسل كلمة "عمولة" على إنستغرام</a>
             <a href="https://wa.me/447400757671?text=عمولة" target="_blank" className="bg-[#25D366] text-white py-4 rounded-full font-bold flex items-center justify-center gap-3 text-sm hover:scale-[1.02] transition-transform active:scale-95 shadow-xl">
                <MessageCircle size={20} /> تواصل مع مصطفى مباشرة (واتساب)
             </a>
           </div>
        </div>

        {/* Bio */}
        <div className="bg-zinc-900/50 rounded-[3rem] overflow-hidden border border-zinc-800 shadow-2xl">
           <img src="https://lh3.googleusercontent.com/d/1MBc6AH2-t0WtozIzrQ_aPXh8A0-eyW8Z" className="w-full h-72 object-cover" alt="Mustafa Bdeir" />
           <div className="p-8">
              <h3 className="text-2xl font-bold text-white mb-1">مصطفى بدير</h3>
              <p className="text-red-500 text-sm font-medium mb-4">مستشار مالي وخبير مبيعات</p>
              <p className="text-zinc-400 text-sm leading-relaxed">أساعدك على تحويل مهاراتك إلى دخل حقيقي من خلال استراتيجيات بيع المنتجات عالية القيمة (High-Ticket) وبناء بيزنس مستدام.</p>
           </div>
        </div>

        {/* FAQ Section */}
        <div className="space-y-4">
          <h4 className="text-center text-zinc-500 text-xs font-bold uppercase tracking-widest mb-2">الأسئلة الشائعة</h4>
          {faqs.map((faq, i) => (
            <div key={i} className="bg-zinc-900/30 border border-zinc-800 rounded-2xl overflow-hidden backdrop-blur-sm">
               <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full p-5 flex justify-between items-center text-right text-sm font-bold text-zinc-200">
                  <span>{faq.question}</span>
                  {openFaq === i ? <ChevronUp size={18} className="text-red-500" /> : <ChevronDown size={18} className="text-zinc-600" />}
               </button>
               {openFaq === i && (
                 <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="px-5 pb-5 text-xs text-zinc-400 leading-relaxed border-t border-zinc-800/50 pt-4">
                   {faq.answer}
                 </motion.div>
               )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResultPage;