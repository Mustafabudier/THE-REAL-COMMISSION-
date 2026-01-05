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

// --- Helper Components ---

// Smooth CountUp Component (Triggers when in view)
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

// Weekly Countdown Timer
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
      <div className="bg-zinc-900/80 px-3 py-2 rounded-lg border border-zinc-800 min-w-[45px] text-center">
        {timeLeft.seconds} <span className="text-[9px] block text-gray-400 font-ibm font-normal">ثانية</span>
      </div>
      <span>:</span>
      <div className="bg-zinc-900/80 px-3 py-2 rounded-lg border border-zinc-800 min-w-[45px] text-center">
        {timeLeft.minutes} <span className="text-[9px] block text-gray-400 font-ibm font-normal">دقيقة</span>
      </div>
      <span>:</span>
      <div className="bg-zinc-900/80 px-3 py-2 rounded-lg border border-zinc-800 min-w-[45px] text-center">
        {timeLeft.hours} <span className="text-[9px] block text-gray-400 font-ibm font-normal">ساعة</span>
      </div>
      <span>:</span>
      <div className="bg-zinc-900/80 px-3 py-2 rounded-lg border border-zinc-800 min-w-[45px] text-center">
        {timeLeft.days} <span className="text-[9px] block text-gray-400 font-ibm font-normal">يوم</span>
      </div>
    </div>
  );
};

const ResultPage: React.FC<ResultPageProps> = ({ score, answers }) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const videoRef = useRef<HTMLDivElement>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    // Delay slightly to allow page load then animate score
    const timer = setTimeout(() => setAnimatedScore(score), 400);
    return () => clearTimeout(timer);
  }, [score]);

  const scrollToVideo = () => {
    videoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const getResultFeedback = () => {
    if (score >= 80) return "ما شاء الله! لديك عقلية القناص 🦁، أنت جاهز للانطلاق.";
    if (score >= 50) return "بداية مبشرة! لديك الأساس ولكن تحتاج إلى الصقل 🛠️.";
    return "لا تقلق! كل خبير كان يوماً ما مبتدئاً 🌱، المهم أن تبدأ.";
  };

  // Gauge Calculations
  const radius = 85;
  const circumference = Math.PI * radius; // Half circle arc length
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="min-h-screen w-full bg-[#000000] font-ibm pb-20 overflow-x-hidden relative text-white selection:bg-red-900 selection:text-white">
      
      {/* 1. Optimized Background */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
         <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-red-900/10 rounded-full blur-[80px]"></div>
         <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-red-950/20 rounded-full blur-[80px]"></div>
         
         {/* Floating Icons */}
         <div className="absolute top-[10%] right-[5%] opacity-20 animate-float text-4xl">💲</div>
         <div className="absolute top-[30%] left-[10%] opacity-20 animate-float text-5xl" style={{ animationDelay: '2s' }}>🎯</div>
         <div className="absolute bottom-[20%] right-[15%] opacity-15 animate-float text-3xl" style={{ animationDelay: '1s' }}>📈</div>
      </div>

      <div className="relative z-10 container mx-auto px-4 max-w-xl pt-8 flex flex-col gap-6">

        {/* 2. Header */}
        <div className="text-center mb-2">
          <h1 className="font-aref font-bold text-4xl md:text-5xl text-white drop-shadow-[0_0_10px_rgba(220,38,38,0.5)]">
            عمولتك الحقيقية
          </h1>
        </div>

        {/* 3. Red Stats Boxes */}
        <div className="grid grid-cols-2 gap-4">
          <div className="relative bg-gradient-to-br from-red-900 to-red-950 border border-red-500/30 rounded-2xl p-5 flex flex-col items-center justify-center text-center shadow-lg group">
             <span className="text-3xl mb-2 filter drop-shadow-md">👥</span>
             <div className="absolute top-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50"></div>
             <h3 className="text-red-100 font-cairo font-bold text-xs mb-2 tracking-wide opacity-90">شخص قامو بالأختبار</h3>
             <p className="text-white font-outfit font-bold text-3xl md:text-4xl drop-shadow-md">
               <CountUp target={1389} suffix="+" />
             </p>
          </div>

          <div className="relative bg-gradient-to-br from-red-900 to-red-950 border border-red-500/30 rounded-2xl p-5 flex flex-col items-center justify-center text-center shadow-lg group">
             <span className="text-3xl mb-2 filter drop-shadow-md">⭐</span>
             <div className="absolute top-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50"></div>
             <h3 className="text-red-100 font-cairo font-bold text-xs mb-2 tracking-wide opacity-90">معدل الرضا عن النتيجة</h3>
             <p className="text-white font-outfit font-bold text-3xl md:text-4xl drop-shadow-md">
               <CountUp target={93} suffix="%" />
             </p>
          </div>
        </div>

        {/* 4. Result Card */}
        <div className="bg-[#0a0a0a] rounded-[2.5rem] border border-zinc-800 p-6 md:p-8 flex flex-col items-center text-center relative overflow-hidden shadow-2xl">
          <h2 className="font-ibm font-bold text-2xl text-red-500 mb-6 drop-shadow-sm">نتيجتك النهائية</h2>

          {/* SVG Gauge */}
          <div className="relative w-64 h-32 mb-2">
             <svg className="w-full h-full" viewBox="0 0 200 110">
                <defs>
                  <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f87171" />
                    <stop offset="100%" stopColor="#991b1b" />
                  </linearGradient>
                </defs>
                <path 
                  d="M 15 100 A 85 85 0 0 1 185 100" 
                  fill="none" 
                  stroke="#1f1f1f" 
                  strokeWidth="18" 
                  strokeLinecap="round" 
                />
                <motion.path 
                  d="M 15 100 A 85 85 0 0 1 185 100" 
                  fill="none" 
                  stroke="url(#gaugeGradient)" 
                  strokeWidth="18" 
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: strokeDashoffset }}
                  transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                  className="drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                />
             </svg>
             
             <div className="absolute bottom-0 left-0 w-full flex flex-col items-center justify-end h-full pb-2">
                <div className="font-outfit font-black text-5xl text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
                  {Math.round(animatedScore)}%
                </div>
                <div className="w-16 h-1 bg-red-500 rounded-full mt-2 animate-pulse shadow-[0_0_8px_#ef4444]"></div>
             </div>
          </div>

          <p className="text-zinc-300 font-ibm font-medium text-base mb-8 px-2 leading-relaxed">
             {getResultFeedback()}
             <br/>
             <span className="text-red-400 font-bold block mt-3 text-lg">
               🎥 اكتشف كيف تضاعف هذا الرقم في الفيديو بالأسفل 👇
             </span>
          </p>

          <button 
            onClick={scrollToVideo}
            className="group w-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white py-4 rounded-xl transition-all flex items-center justify-center gap-3 relative overflow-hidden"
          >
             <Gift className="text-red-500 animate-bounce" size={24} />
             <span className="font-ibm font-bold text-lg relative z-10">احصل على هديتك</span>
             <div className="absolute inset-0 bg-red-900/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
          </button>
        </div>

        {/* 5. Video Section */}
        <div ref={videoRef} className="flex flex-col gap-3 scroll-mt-20">
           <div className="flex items-center gap-2 mb-1 justify-center">
              <span className="text-2xl animate-pulse">🎁</span>
              <h3 className="font-ibm font-bold text-lg text-white leading-tight text-center">
                تأكد انك حضرت الفيديو للنهاية لتكتشف عمولتك الحقيقة
              </h3>
           </div>
           
           <div className="bg-[#111] p-1 rounded-2xl border border-red-900/30 shadow-[0_0_30px_rgba(220,38,38,0.1)]">
             <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black">
                <iframe 
                  src="https://player.vimeo.com/video/1144322731?title=0&byline=0&portrait=0&badge=0&autopause=0&player_id=0&app_id=58479" 
                  className="absolute top-0 left-0 w-full h-full"
                  frameBorder="0" 
                  allow="autoplay; fullscreen; picture-in-picture" 
                  title="Analysis Video"
                ></iframe>
             </div>
           </div>
        </div>

        {/* 6. Red CTA Card (Commission) */}
        <div className="bg-gradient-to-br from-[#b91c1c] to-[#991b1b] rounded-[2.5rem] p-6 text-center shadow-[0_0_30px_rgba(185,28,28,0.4)] relative overflow-hidden border border-red-500/20">
           <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '20px 20px' }}></div>
           
           <div className="relative z-10 flex flex-col items-center justify-center py-8">
              
              <div className="relative inline-block mb-4">
                 <span className="absolute -top-8 -right-6 md:-top-10 md:-right-12 text-red-100/90 font-ibm font-bold text-lg whitespace-nowrap rotate-[-3deg]">
                   ارسل كلمة
                 </span>
                 <h2 className="font-aref font-bold text-[5.5rem] md:text-[7rem] text-white drop-shadow-xl leading-[1.1]">
                   عمولة
                 </h2>
              </div>
              
              <p className="text-white/95 font-ibm font-medium text-sm mt-2 max-w-[280px] mx-auto leading-relaxed opacity-90">
                لناقش مع بعض الشق التاني من الاستراتيجية ونرسم خطة البدء
              </p>

              <div className="flex flex-col gap-3 w-full max-w-[320px] mx-auto">
                {/* Instagram Button */}
                <a 
                   href="https://www.instagram.com/themustafabdier?igsh=YW14Y2Y3MXBiYnJo&utm_source=qr" 
                   target="_blank"
                   rel="noreferrer"
                   className="mt-6 inline-flex items-center justify-center gap-2 bg-white text-[#b91c1c] px-6 py-2.5 rounded-full font-ibm font-bold text-xs md:text-sm shadow-lg hover:bg-red-50 transition-all hover:scale-105"
                >
                   <Instagram size={16} />
                   <span>اضغط وأرسل كلمة عمولة من هنا</span>
                </a>

                {/* WhatsApp Button */}
                <a 
                   href="https://wa.me/447400757671?text=عمولة" 
                   target="_blank"
                   rel="noreferrer"
                   className="inline-flex items-center justify-center gap-2 bg-transparent border border-white/30 text-white px-6 py-2.5 rounded-full font-ibm font-bold text-xs md:text-sm transition-all hover:bg-white/10 hover:border-white/50"
                >
                   <MessageCircle size={16} className="text-green-500 fill-green-500/10" />
                   <span>تواصل دايركت مع مصطفى على الواتس اب</span>
                </a>
              </div>
           </div>
        </div>

        {/* 7. Social Proof & Countdown */}
        <div className="bg-[#1c1c1c] rounded-[2rem] p-6 border border-zinc-800 shadow-xl">
           <div className="flex items-center justify-between gap-4 mb-6">
              <div className="text-right shrink-0">
                 <div className="font-outfit font-black text-5xl md:text-6xl text-white flex items-center gap-1">
                   <span className="text-red-500">+</span>
                   <CountUp target={348} />
                 </div>
              </div>
              <div className="text-right flex-1">
                 <p className="font-ibm font-medium text-zinc-300 text-sm md:text-base leading-relaxed">
                   شخص قررو يبدأو يطبقو هالإستراتيجية ويجنو منها أوائل العمولات هذا الاسبوع معي
                 </p>
              </div>
           </div>

           <div className="w-full h-px bg-zinc-800 my-4"></div>

           <div className="text-center">
              <p className="text-zinc-500 font-ibm text-xs mb-1">الوقت المتبقي لتحسم قرارك هذا الأسبوع</p>
              <div className="flex justify-center">
                <WeeklyCountdown />
              </div>
           </div>
        </div>

        {/* 8. Join Team Button */}
        <div className="flex justify-center -my-3 relative z-20">
           <a 
             href="https://www.instagram.com/themustafabdier?igsh=YW14Y2Y3MXBiYnJo&utm_source=qr"
             target="_blank"
             rel="noreferrer"
             className="bg-zinc-900 border border-red-900/50 text-white px-8 py-3 rounded-full font-cairo font-bold text-sm shadow-[0_0_20px_rgba(220,38,38,0.2)] hover:bg-red-900/20 transition-colors flex items-center gap-2"
           >
             <span>انضم لفريقي الان 🚀</span>
           </a>
        </div>

        {/* 9. Bio Card */}
        <div className="bg-[#0f0f0f] rounded-[2rem] p-0 border border-zinc-800 overflow-hidden relative shadow-2xl mt-4">
           <div className="relative w-full h-[400px] bg-gradient-to-b from-zinc-800 to-[#0f0f0f]">
              <img 
                src="https://lh3.googleusercontent.com/d/1MBc6AH2-t0WtozIzrQ_aPXh8A0-eyW8Z" 
                alt="Mustafa Badier" 
                className="w-full h-full object-cover object-top"
                loading="lazy"
              />
              <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/90 to-transparent"></div>
           </div>
           
           <div className="relative z-10 p-6 -mt-10">
              <h3 className="font-aref font-bold text-3xl text-white mb-1">مصطفى بدير</h3>
              <p className="font-ibm font-light text-red-400 text-sm mb-4 tracking-wide">مدرب مالي ورائد أعمال</p>
              
              <p className="text-zinc-400 font-ibm text-sm leading-loose text-justify opacity-90">
                مدرب ومسوق معتمد بشارك خبرته الي تجاوزت الخمس سنوات في صناعة المحتوى، التسويق بالعمولة، اساليب القيادة والذكاء العاطفي، واسس تكوين الفرق وادارتها. قام بمساعدة آلاف الاشخاص من معظم انحاء العالم بكيف يعرفو يستفيديو من خيراتهم وقدراتهم المخفية ويقدرو يعتمدو إعتماد كلي على الاونلاين بزنس.
              </p>
           </div>
        </div>

        {/* 10. Golden Guarantee Card */}
        <div className="relative mt-4 bg-black rounded-[2rem] border border-yellow-600/50 p-6 md:p-8 flex flex-col items-center text-center shadow-[0_0_20px_rgba(234,179,8,0.1)] overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent animate-shine opacity-50"></div>
           
           <img 
             src="https://lh3.googleusercontent.com/d/1ZGPZLBrbp6s3UrcckLJcN12KjSGvE7bu" 
             alt="Golden Guarantee" 
             className="w-24 h-24 mb-4 drop-shadow-lg"
             loading="lazy"
           />
           
           <h3 className="font-aref font-bold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 animate-textShine mb-4">
             ضمان استرجاع ذهبي
           </h3>
           
           <p className="font-ibm font-normal text-zinc-300 text-sm leading-relaxed max-w-sm mx-auto">
             في حال ما شفت انه الخدمة مناسبة الك او القيمة الي وعدناك فيها ما وفينا فيها، او لأي سبب كان بتقدر تنسحب خلال أول 10 أيام الك معي وبدون إبداء الاسباب بضمان استرجاع كامل فلوسك الي دفعتها.
           </p>
        </div>

        {/* 11. FAQs */}
        <div className="mt-8 space-y-4">
          <h3 className="font-aref font-bold text-2xl text-white text-center mb-6">
            الأسئلة الشائعة
          </h3>
          
          {faqs.map((faq, idx) => (
            <div 
              key={idx}
              className="bg-[#111] border border-zinc-800 rounded-xl overflow-hidden transition-all duration-300 hover:border-zinc-700"
            >
              <button 
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between p-4 text-right"
              >
                <span className="font-ibm font-bold text-zinc-200 text-sm md:text-base">{faq.question}</span>
                {openFaq === idx ? <ChevronUp size={18} className="text-red-500" /> : <ChevronDown size={18} className="text-zinc-500" />}
              </button>
              <AnimatePresence>
                {openFaq === idx && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="bg-black/50 px-4 pb-4"
                  >
                    <p className="font-ibm text-zinc-400 text-sm leading-relaxed border-t border-zinc-800 pt-3">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default ResultPage;