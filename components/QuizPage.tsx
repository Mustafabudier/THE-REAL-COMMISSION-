import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Rocket, Check, Clock } from 'lucide-react';
import { questions, quotes, Quote, Question } from '../data/quizData';

interface QuizPageProps {
  onFinish: (answers: Record<number, string>) => void;
}

const QuizPage: React.FC<QuizPageProps> = ({ onFinish }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showInterstitial, setShowInterstitial] = useState<number | null>(null);
  const [direction, setDirection] = useState(0); // -1 for back, 1 for next

  // Calculate progress
  // Note: We want progress to feel significant. 
  const totalQuestions = questions.length;
  const progress = Math.min(100, Math.round(((currentQuestionIndex) / totalQuestions) * 100));

  const currentQuestion: Question = questions[currentQuestionIndex];
  
  // Logic to handle answering a question
  const handleAnswer = (optionId: string) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: optionId }));
    setDirection(1);

    // Delay to show selection visual feedback
    setTimeout(() => {
      const nextIndex = currentQuestionIndex + 1;
      
      // Check for interstitials
      // Logic: Show quote AFTER question breaks defined in data
      if (quotes[nextIndex]) {
        setShowInterstitial(nextIndex);
        // We do NOT increment currentQuestionIndex yet. The Interstitial "Continue" will do that.
        // Let's set index to nextIndex, but render the interstitial INSTEAD of the question card.
        setCurrentQuestionIndex(nextIndex);
      } else if (nextIndex < totalQuestions) {
        setCurrentQuestionIndex(nextIndex);
      } else {
        // Quiz Finished
        console.log("Quiz Finished", answers);
        onFinish(answers);
      }
    }, 400);
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setDirection(-1);
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleInterstitialContinue = () => {
    setShowInterstitial(null);
  };

  // Render Interstitial
  if (showInterstitial !== null && quotes[showInterstitial]) {
    const quote = quotes[showInterstitial];
    return (
      <Interstitial 
        quote={quote} 
        onContinue={handleInterstitialContinue} 
      />
    );
  }

  return (
    <div className="min-h-screen w-full bg-rose-50 flex flex-col items-center py-8 px-4 transition-colors duration-500 font-ibm">
      
      {/* Container */}
      <div className="w-full max-w-3xl flex flex-col gap-6">
        
        {/* Mini Header Title */}
        <div className="flex justify-center -mb-2 animate-fade-in-down">
          <h1 className="font-aref font-bold text-3xl md:text-4xl text-rose-900/90 drop-shadow-sm">
            عمولتك الحقيقية
          </h1>
        </div>

        {/* Header & Progress */}
        <div className="w-full space-y-3">
          <div className="flex justify-between items-end px-2">
            <span className="font-outfit font-bold text-rose-900 text-lg">
              {progress}%
            </span>
            <div className="flex items-baseline gap-1 font-outfit text-rose-900">
              <span className="text-sm font-medium opacity-60">السؤال</span>
              <span className="text-2xl font-bold">{currentQuestionIndex + 1}</span>
              <span className="text-sm font-medium opacity-60">من {totalQuestions}</span>
            </div>
          </div>
          
          <div className="relative h-3 w-full bg-white rounded-full shadow-inner overflow-visible">
            {/* Progress Fill */}
            <motion.div 
              className="absolute top-0 right-0 h-full bg-gradient-to-l from-[#BE123C] to-[#fb7185] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ type: "spring", stiffness: 50, damping: 20 }}
            >
              {/* Rocket Icon */}
              {progress > 0 && (
                <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                   <div className="bg-white p-1.5 rounded-full shadow-md border border-rose-100">
                      <Rocket size={16} className="text-[#BE123C] -rotate-45" fill="currentColor" />
                   </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Question Card */}
        <AnimatePresence mode='wait' custom={direction}>
          <motion.div
            key={currentQuestion.id}
            custom={direction}
            initial={{ x: direction > 0 ? 50 : -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction > 0 ? -50 : 50, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-white rounded-[2.5rem] shadow-xl border border-rose-100 p-6 md:p-10 relative overflow-hidden min-h-[400px] flex flex-col"
          >
             {/* Decorative Blob */}
             <div className="absolute -top-10 -right-10 w-40 h-40 bg-rose-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

             {/* Question Text */}
             <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 leading-snug relative z-10">
               {currentQuestion.text}
             </h2>

             {/* Options */}
             <div className="flex flex-col gap-3 relative z-10">
               {currentQuestion.options.map((option, idx) => {
                 const isSelected = answers[currentQuestion.id] === option.id;
                 return (
                   <motion.button
                     key={option.id}
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: idx * 0.1 }}
                     onClick={() => handleAnswer(option.id)}
                     className={`group relative flex items-center w-full p-4 rounded-2xl border-2 transition-all duration-200 text-right
                       ${isSelected 
                         ? 'border-[#BE123C] bg-rose-50' 
                         : 'border-gray-100 bg-white hover:border-rose-200 hover:bg-rose-50/50 hover:scale-[1.01]'
                       }
                     `}
                   >
                     {/* Emoji Box */}
                     <div className={`
                       ml-4 w-12 h-12 flex items-center justify-center rounded-xl text-2xl transition-colors
                       ${isSelected ? 'bg-white shadow-sm' : 'bg-gray-50 group-hover:bg-white'}
                     `}>
                       {option.emoji}
                     </div>

                     {/* Text */}
                     <span className={`font-cairo font-semibold text-lg flex-1 ${isSelected ? 'text-rose-900' : 'text-gray-700'}`}>
                       {option.text}
                     </span>

                     {/* Radio Circle */}
                     <div className={`
                       w-6 h-6 rounded-full border-2 flex items-center justify-center mr-2 transition-colors
                       ${isSelected ? 'border-[#BE123C] bg-[#BE123C]' : 'border-gray-300 group-hover:border-rose-300'}
                     `}>
                       {isSelected && <Check size={14} className="text-white" strokeWidth={3} />}
                     </div>
                   </motion.button>
                 );
               })}
             </div>

             {/* Bottom Navigation / Note */}
             <div className="mt-auto pt-8 flex items-center justify-between text-gray-400">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Clock size={16} />
                  <span>لن يستغرق الأمر أكثر من 3 دقائق</span>
                </div>

                {currentQuestionIndex > 0 && (
                  <button 
                    onClick={handleBack}
                    className="flex items-center gap-2 text-gray-500 hover:text-[#BE123C] transition-colors font-cairo font-bold"
                  >
                    <span>السابق</span>
                    <ArrowRight size={20} />
                  </button>
                )}
             </div>

          </motion.div>
        </AnimatePresence>

      </div>
    </div>
  );
};

// Interstitial Component (Inspiration Break)
const Interstitial: React.FC<{ quote: Quote; onContinue: () => void }> = ({ quote, onContinue }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-6 text-center overflow-hidden"
    >
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
         <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#BE123C] rounded-full mix-blend-screen filter blur-[120px] opacity-10 animate-pulse"></div>
         <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-zinc-900 rounded-full mix-blend-screen filter blur-[100px] opacity-20"></div>
      </div>

      <div className="relative z-10 max-w-2xl flex flex-col items-center">
        
        {/* Main Title */}
        <motion.h1 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="font-aref font-bold text-3xl md:text-5xl text-white mb-6 drop-shadow-md"
        >
          عمولتك الحقيقية
        </motion.h1>

        {/* Badge */}
        <div className="mb-8 px-4 py-1.5 rounded-full bg-[#BE123C]/20 border border-[#BE123C]/40 text-[#fb7185] font-cairo font-bold text-sm flex items-center gap-2">
          <span>💡</span>
          <span>وقفة إلهام</span>
        </div>

        {/* Image */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-[#BE123C] p-1 mb-8 shadow-[0_0_30px_rgba(190,18,60,0.4)]"
        >
          <img 
            src={quote.imageUrl} 
            alt={quote.author} 
            className="w-full h-full rounded-full object-cover filter grayscale hover:grayscale-0 transition-all duration-700"
          />
        </motion.div>

        {/* Quote */}
        <motion.h3 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="font-cairo font-bold text-2xl md:text-4xl text-white leading-relaxed mb-6"
        >
          "{quote.text}"
        </motion.h3>

        {/* Author Info */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mb-12"
        >
          <p className="text-[#BE123C] font-bold text-xl">{quote.author}</p>
          <p className="text-gray-400 text-sm">{quote.role}</p>
        </motion.div>

        {/* Continue Button */}
        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          onClick={onContinue}
          className="bg-[#BE123C] hover:bg-[#9F1239] text-white px-10 py-4 rounded-full font-cairo font-bold text-xl shadow-lg shadow-rose-900/40 hover:scale-105 transition-all"
        >
          تابع الاختبار
        </motion.button>

      </div>
    </motion.div>
  );
};

export default QuizPage;