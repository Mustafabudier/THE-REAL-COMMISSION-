import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Star, Users, Gift, ArrowLeft, CheckCircle2, ShieldCheck, ChevronDown, ChevronUp, Target, Flame, Handshake, PlayCircle } from 'lucide-react';
import { faqs } from '../data/quizData';

interface ResultPageProps {
  score: number;
  answers: Record<number, string>;
}

// Simple Confetti Component using Framer Motion
// Updated: Fixed positioning and high z-index to ensure visibility
const Confetti = () => {
  const colors = ['#BE123C', '#fb7185', '#ffffff'];
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden flex justify-center items-start pt-20 z-[100]">
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-4 rounded-sm"
          style={{
            backgroundColor: colors[i % colors.length],
            left: '50%',
            top: '20%',
          }}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
          animate={{
            x: (Math.random() - 0.5) * 800,
            y: Math.random() * 800 + 200, // Make them fall lower
            opacity: [1, 1, 0],
            rotate: Math.random() * 360,
          }}
          transition={{ duration: 3, ease: "easeOut" }}
        />
      ))}
    </div>
  );
};

// FAQ Item Component
const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-zinc-800 last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 flex items-center justify-between text-right text-gray-300 hover:text-white transition-colors group"
      >
        <span className="font-ibm font-bold text-lg group-hover:text-[#BE123C] transition-colors">{question}</span>
        {isOpen ? <ChevronUp className="text-[#BE123C]" /> : <ChevronDown className="text-gray-500" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="pb-4 text-gray-400 font-ibm font-medium leading-relaxed text-sm md:text-base">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ResultPage: React.FC<ResultPageProps> = ({ score, answers }) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [usersCount, setUsersCount] = useState(0);
  const [peopleCount, setPeopleCount] = useState(0); // For the 342 counter
  const [satisfactionCount, setSatisfactionCount] = useState(0);
  const [countdown, setCountdown] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const videoRef = useRef<HTMLDivElement>(null);
  
  // Animation Effects
  useEffect(() => {
    // Score Animation
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 500);

    // Top Stats Counters
    const userTarget = 1890;
    const userInterval = setInterval(() => {
      setUsersCount(prev => {
         const inc = Math.ceil((userTarget - prev) / 20); // Slower increment
         if (prev >= userTarget) {
            clearInterval(userInterval);
            return userTarget;
         }
         return prev + inc;
      });
    }, 30);
    
    // People Counter (342) - Ensuring it's a visible counter
    const peopleTarget = 342;
    const peopleInterval = setInterval(() => {
      setPeopleCount(prev => {
         const inc = Math.ceil((peopleTarget - prev) / 30);
         if (prev >= peopleTarget) {
            clearInterval(peopleInterval);
            return peopleTarget;
         }
         return prev + inc;
      });
    }, 50);

    // Satisfaction Counter
    const satisfactionInterval = setInterval(() => {
      setSatisfactionCount(prev => {
        if (prev >= 95) {
            clearInterval(satisfactionInterval);
            return 95;
        }
        return prev + 1;
      });
    }, 30);

    return () => {
      clearTimeout(timer);
      clearInterval(userInterval);
      clearInterval(peopleInterval);
      clearInterval(satisfactionInterval);
    };
  }, [score]);

  // Weekly Countdown Logic (Ends Friday 23:59:59)
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const currentDay = now.getDay(); // 0 = Sunday, 5 = Friday
      const daysUntilFriday = (5 + 7 - currentDay) % 7; 
      const friday = new Date(now);
      friday.setDate(now.getDate() + daysUntilFriday);
      friday.setHours(23, 59, 59, 99);
      
      const diff = friday.getTime() - now.getTime();
      if (diff > 0) {
        setCountdown({
          d: Math.floor(diff / (1000 * 60 * 60 * 24)),
          h: Math.floor((diff / (1000 * 60 * 60)) % 24),
          m: Math.floor((diff / 1000 / 60) % 60),
          s: Math.floor((diff / 1000) % 60),
        });
      } else {
         // Reset for next week if passed
         setCountdown({d: 6, h: 23, m: 59, s: 59}); 
      }
    };
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  const scrollToVideo = () => {
    videoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  // Determine Result Text based on Score
  const getResultText = () => {
    if (score >= 80) return "مؤهل جداً للنجاح (High Ticket Closer) 🚀🦁";
    if (score >= 50) return "لديك الأساسيات ولكن تحتاج لتوجيه 💡⚠️";
    return "تحتاج لبناء مهاراتك من الصفر 📉📚";
  };

  const fadeUpVariant: Variants = {
    hidden: { y: 50, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.8, ease: "easeInOut" } // Smoother, slower fade
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#09090b] text-white font-ibm overflow-x-hidden pb-20">
      
      {/* Confetti if Score > 50 */}
      {score > 50 && <Confetti />}

      <div className="container mx-auto px-4 max-w-4xl pt-8 flex flex-col gap-12">

        {/* 1. Top Stats Grid */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUpVariant}
          className="grid grid-cols-2 gap-4"
        >
          {/* Users Card */}
          <div className="bg-[#BE123C] rounded-2xl p-4 shadow-lg border border-rose-500/30 flex flex-col items-center justify-center text-center relative overflow-hidden h-40">
            <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-xl"></div>
            <Users className="text-rose-100 mb-2" size={24} />
            <span className="font-outfit font-black text-4xl text-white">+{usersCount}</span>
            <span className="text-rose-100 text-sm font-medium">شخص قدمو الاختبار</span>
          </div>
          
          {/* Satisfaction Card */}
          <div className="bg-[#BE123C] rounded-2xl p-4 shadow-lg border border-rose-500/30 flex flex-col items-center justify-center text-center relative overflow-hidden h-40">
             <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl"></div>
            <Star className="text-yellow-300 mb-2 fill-yellow-300" size={24} />
            <span className="font-outfit font-black text-4xl text-white">{satisfactionCount}%+</span>
            <span className="text-rose-100 text-sm font-medium">نسبة الرضا</span>
          </div>
        </motion.div>

        {/* 2. Main Score Card (The Gauge) */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUpVariant}
          className="bg-black rounded-3xl shadow-2xl shadow-rose-900/10 border border-zinc-800 p-8 flex flex-col items-center relative"
        >
           {/* Gauge SVG */}
           <div className="relative w-64 h-32 md:w-80 md:h-40 overflow-hidden mb-6">
             <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-full">
               {/* Background Arc */}
               <svg viewBox="0 0 100 50" className="w-full h-full transform overflow-visible">
                 <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#27272a" strokeWidth="8" strokeLinecap="round" />
                 {/* Progress Arc */}
                 <motion.path 
                   d="M 10 50 A 40 40 0 0 1 90 50" 
                   fill="none" 
                   stroke="url(#gradient)" 
                   strokeWidth="8" 
                   strokeLinecap="round"
                   strokeDasharray="126"
                   strokeDashoffset={126 - (126 * (animatedScore / 100))}
                   initial={{ strokeDashoffset: 126 }}
                   animate={{ strokeDashoffset: 126 - (126 * (score / 100)) }}
                   transition={{ duration: 2, ease: "easeOut" }}
                   className="filter drop-shadow-[0_0_10px_rgba(190,18,60,0.5)]"
                 />
                 <defs>
                   <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                     <stop offset="0%" stopColor="#fca5a5" />
                     <stop offset="100%" stopColor="#450a0a" />
                   </linearGradient>
                 </defs>
               </svg>
             </div>
             
             {/* Pulse Heartbeat */}
             <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-24 h-24 bg-rose-600 rounded-full blur-[50px] animate-pulse opacity-40"></div>
           </div>

           {/* Score Text */}
           <motion.div 
             animate={{ 
               scale: [1, 1.05, 1],
               rotate: [0, 1, -1, 0]
             }}
             transition={{ delay: 2, duration: 0.5 }}
             className="text-center z-10 -mt-10 flex flex-col items-center"
           >
             <h2 className="font-outfit font-black text-6xl md:text-7xl text-white">
               {animatedScore}%
             </h2>
             <p className="text-white font-cairo font-bold text-lg mt-2 mb-6 whitespace-pre-line">
               {getResultText()}
             </p>

             {/* Action Button within Score Card */}
             <button 
               onClick={scrollToVideo}
               className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-gray-200 px-6 py-3 rounded-full font-cairo font-bold transition-all hover:scale-105 group"
             >
                <span>شاهد الهدية</span>
                <PlayCircle size={20} className="text-[#BE123C] group-hover:text-white transition-colors" />
             </button>
           </motion.div>
        </motion.div>

        {/* 3. Video Gift Section */}
        <motion.div 
          ref={videoRef}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUpVariant}
          className="flex flex-col gap-6"
        >
          {/* Centered Title with Gift Icons */}
          <div className="flex items-center justify-center gap-3 text-center px-2">
             <motion.div 
               animate={{ rotate: [0, 10, -10, 0] }}
               transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
               className="text-[#BE123C]"
             >
               <Gift size={28} />
             </motion.div>
             <h3 className="font-ibm font-bold text-lg md:text-2xl text-white leading-relaxed">
               قم بمشاهدة الفيديو واكتشف كيف تجني عمولتك الحقيقية
             </h3>
             <motion.div 
               animate={{ rotate: [0, -10, 10, 0] }}
               transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
               className="text-[#BE123C]"
             >
               <Gift size={28} />
             </motion.div>
          </div>

          <div className="relative w-full aspect-video rounded-2xl overflow-hidden border-2 border-rose-900/50 shadow-[0_0_40px_rgba(190,18,60,0.3)] bg-black group">
            <iframe 
              src="https://player.vimeo.com/video/1144322731?title=0&byline=0&portrait=0&badge=0&autopause=0&player_id=0&app_id=58479" 
              className="absolute top-0 left-0 w-full h-full"
              frameBorder="0" 
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write" 
              title="Gift Video"
            ></iframe>
          </div>
        </motion.div>

        {/* 4. Urgency & Weekly Counter */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUpVariant}
          className="bg-zinc-900/80 rounded-3xl p-8 border border-zinc-800 flex flex-col items-center text-center gap-6 shadow-xl relative overflow-hidden"
        >
          {/* Background Gradient Spot */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-[#BE123C]/5 to-transparent pointer-events-none"></div>

          {/* Number & Text */}
          <div className="relative z-10">
             <div className="flex flex-col md:flex-row items-center justify-center gap-3 mb-2">
                <span className={`font-outfit font-black text-5xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-b from-rose-400 to-rose-700 drop-shadow-sm transition-all duration-300 ${peopleCount === 342 ? 'animate-pulse drop-shadow-[0_0_15px_rgba(190,18,60,0.8)]' : ''}`}>
                   +{peopleCount}
                </span>
                <span className="font-ibm font-bold text-xl md:text-2xl text-white max-w-sm leading-snug">
                   شخص قررو يبدأ بأكتشاف عمولتهم الحقيقية هذا الاسبوع
                </span>
             </div>
          </div>

          {/* Timer */}
          <div className="relative z-10 w-full max-w-lg">
             <p className="text-gray-400 text-sm font-bold mb-4">الوقت المتبقي لتحسم قرارك هذا الاسبوع</p>
             <div className="flex justify-center gap-3 md:gap-6">
                 {[
                   { val: countdown.s, label: "ثانية" },
                   { val: countdown.m, label: "دقيقة" },
                   { val: countdown.h, label: "ساعة" },
                   { val: countdown.d, label: "يوم" },
                 ].map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center">
                       <div className="bg-black border border-zinc-800 rounded-xl w-16 h-16 md:w-20 md:h-20 flex items-center justify-center shadow-inner">
                          <span className="font-outfit font-black text-2xl md:text-3xl text-[#BE123C]">{item.val}</span>
                       </div>
                       <span className="text-xs text-gray-500 mt-2 font-bold">{item.label}</span>
                    </div>
                 ))}
             </div>
          </div>
        </motion.div>

        {/* 5. CTA Card (RED CARD) */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUpVariant}
          className="bg-[#BE123C] rounded-3xl p-8 border border-rose-600 shadow-2xl flex flex-col gap-4 relative overflow-hidden"
        >
          {/* Subtle background pattern/glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

          <div className="relative z-10 flex flex-col items-center w-full text-center">
             <span className="font-ibm font-medium text-lg text-rose-200 mb-0">
                ارسل كلمة
             </span>
             <span className="font-aref font-black text-8xl md:text-9xl text-white mb-2 animate-pulse drop-shadow-[0_0_15px_rgba(255,255,255,0.6)]">
                عمولة
             </span>
             <p className="font-ibm font-medium text-lg md:text-xl text-rose-50 max-w-md">
                 لتحجز مكالمتك معي ونحط خطة العمل سوا
             </p>
          </div>

          <a 
            href="https://www.instagram.com/themustafabdier?igsh=YW14Y2Y3MXBiYnJo&utm_source=qr" 
            target="_blank"
            rel="noreferrer"
            className="mt-4 flex items-center justify-center gap-3 w-full bg-white hover:bg-gray-100 text-[#BE123C] py-4 rounded-xl font-cairo font-bold text-lg transition-all hover:scale-105 shadow-[0_10px_20px_-5px_rgba(0,0,0,0.2)] relative z-10"
          >
            <span>احجز مكالمتك الآن</span>
            <ArrowLeft size={20} />
          </a>
        </motion.div>

        {/* 6. Value Props ("Why start with me?") */}
        <div className="flex flex-col gap-6">
           <h3 className="font-ibm font-bold text-2xl text-white text-center">ليه ممكن تبدأ معي؟</h3>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: Target, text: "خطة واضحة" },
              { icon: Handshake, text: "متابعة شخصية" },
              { icon: Flame, text: "نتائج سريعة" },
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={{
                  hidden: { y: 30, opacity: 0 },
                  visible: { 
                    y: 0, 
                    opacity: 1, 
                    transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" } 
                  }
                } as Variants}
                whileHover={{ scale: 1.02, backgroundColor: "rgba(39, 39, 42, 0.8)" }}
                className="group bg-zinc-900/40 backdrop-blur-sm rounded-xl p-6 flex flex-col items-center justify-center text-center gap-3 border border-zinc-800 hover:border-[#BE123C]/50 transition-all duration-300 shadow-lg cursor-default"
              >
                <div className="p-3 bg-black rounded-full border border-zinc-800 group-hover:border-[#BE123C] transition-colors">
                   <item.icon className="text-[#BE123C] group-hover:text-white transition-colors" size={24} />
                </div>
                <span className="font-cairo font-bold text-lg text-gray-200">{item.text}</span>
              </motion.div>
            ))}
           </div>
        </div>

        {/* 7. Bio Section (SINGLE CARD MERGED - NATURAL IMAGE) */}
        <motion.div 
           initial="hidden"
           whileInView="visible"
           viewport={{ once: true, margin: "-100px" }}
           variants={fadeUpVariant}
           className="mt-12 w-full flex justify-center"
        >
          <div className="bg-zinc-900 rounded-3xl p-0 border border-zinc-800 shadow-2xl flex flex-col items-center text-center gap-0 max-w-2xl w-full relative overflow-hidden">
             
             {/* Image Section - Natural, Full Width of card top, Separated by shadow */}
             <div className="w-full relative flex justify-center pt-8 pb-4">
                <img 
                  src="https://lh3.googleusercontent.com/d/1MBc6AH2-t0WtozIzrQ_aPXh8A0-eyW8Z" 
                  alt="Mustafa Bdier" 
                  className="w-full max-w-[320px] h-auto object-cover rounded-2xl shadow-[0_25px_30px_-10px_rgba(0,0,0,0.7)] z-10 relative"
                />
             </div>

             {/* Content Section */}
             <div className="w-full px-8 pb-10 pt-4 flex flex-col items-center gap-2 relative z-20">
               <h3 className="font-aref font-bold text-3xl text-white">مصطفى بدير</h3>
               <p className="font-ibm font-light text-lg text-rose-200">رائد أعمال ومدرب تسويق وقيادة</p>
               
               {/* 5 Stars */}
               <div className="flex gap-1 my-2">
                 {[...Array(5)].map((_, i) => (
                   <Star key={i} size={20} className="fill-yellow-500 text-yellow-500" />
                 ))}
               </div>

               <p className="text-gray-300 text-lg leading-loose font-ibm font-medium mt-2">
                 مدرب مالي ورائد اعمال بدأ في عالم المبيعات والتسويق بالعمولة منذ اكتر من خمس سنوات وبدأ في معرفة كيفية قيادة الافرقة وكيفية البدء في صناعة المحتوى واليوم يمد يد العون والمساعدة لتخوض نفس الطريق ولكن بدون نفس الاخطاء.
               </p>
             </div>
          </div>
        </motion.div>

        {/* 8. Golden Guarantee (RESIZED & SHINE TEXT) */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUpVariant}
          className="relative mt-24 bg-black rounded-3xl border border-yellow-600/30 p-8 pt-24 text-center shadow-[0_0_50px_rgba(234,179,8,0.05)]"
        >
          {/* Natural Sized Floating Badge - Resized */}
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 z-10 w-full flex justify-center pointer-events-none">
             <motion.img 
               animate={{ y: [0, -6, 0] }}
               transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
               src="https://lh3.googleusercontent.com/d/1ZGPZLBrbp6s3UrcckLJcN12KjSGvE7bu" 
               alt="Money Back Guarantee" 
               className="w-auto h-auto max-h-[160px] drop-shadow-2xl"
             />
          </div>
          
          {/* Shiny Text Only - Enhanced Visibility */}
          <h3 className="font-aref font-black text-4xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-yellow-200 to-yellow-500 bg-[length:200%_auto] animate-textShine mb-4 relative z-10 drop-shadow-md">
            ضمان استرجاع ذهبي
          </h3>

          <p className="text-gray-300 text-lg leading-relaxed mb-8 max-w-3xl mx-auto font-ibm relative z-10">
            نحن نلتزم بالجودة والقيمة الحقيقية. إذا شعرت خلال أول 10 أيام أن البرنامج لم يقدم لك القيمة المتوقعة، يمكنك استرداد كامل مبلغ استثمارك دون أي تعقيدات. نحن هنا لننجح سوياً.
          </p>
          
          <div className="flex justify-center gap-8 border-t border-zinc-900 pt-6 relative z-10">
            <div className="flex flex-col items-center gap-2">
              <CheckCircle2 className="text-yellow-500" size={28} />
              <span className="text-sm font-bold text-gray-400">استرداد كامل 100%</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <ShieldCheck className="text-yellow-500" size={28} />
              <span className="text-sm font-bold text-gray-400">ضمان أول 10 أيام</span>
            </div>
          </div>
        </motion.div>

        {/* 9. FAQ Section */}
        <motion.div 
           initial="hidden"
           whileInView="visible"
           viewport={{ once: true, margin: "-100px" }}
           variants={fadeUpVariant}
           className="py-8 w-full"
        >
          <h3 className="font-aref font-bold text-3xl text-white mb-8 text-center">الأسئلة الشائعة</h3>
          <div className="bg-zinc-900/30 rounded-3xl border border-zinc-800 p-6 md:p-8">
             {faqs.map((faq, idx) => (
                <FAQItem key={idx} question={faq.question} answer={faq.answer} />
             ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default ResultPage;