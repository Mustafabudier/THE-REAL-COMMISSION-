import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import QuizPage from './components/QuizPage';
import ResultGatePage from './components/ResultGatePage';
import ResultPage from './components/ResultPage';
import { questions } from './data/quizData';

type ViewState = 'landing' | 'quiz' | 'result_gate' | 'result';

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxiw7bU06Cu9qN3SxaXk0a8FqZnhryEDdJz3VrHH9CYY3r_7nYfZfQst-yUPuJZNYQ/exec"; 

// وظيفية مساعدة لإرسال الأحداث لفيسبوك
const trackFbEvent = (eventName: string, params?: any) => {
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', eventName, params);
  }
};

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('landing');
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [score, setScore] = useState(85);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [view]);

  const calculateScore = (collectedAnswers: Record<number, string>) => {
    let totalScore = 0;
    let maxPossible = 0;

    questions.forEach(q => {
      const selectedOptionId = collectedAnswers[q.id];
      const selectedOption = q.options.find(opt => opt.id === selectedOptionId);
      const maxVal = Math.max(...q.options.map(o => o.value));
      maxPossible += maxVal;
      if (selectedOption) {
        totalScore += selectedOption.value;
      }
    });

    const percentage = maxPossible > 0 ? Math.round((totalScore / maxPossible) * 100) : 0;
    setScore(percentage);
  };

  const handleStartQuiz = () => {
    trackFbEvent('Contact'); // إشارة لفيسبوك بأن الشخص بدأ الاختبار
    setView('quiz');
  };

  const handleQuizFinish = (collectedAnswers: Record<number, string>) => {
    setAnswers(collectedAnswers);
    calculateScore(collectedAnswers);
    window.scrollTo(0,0);
    
    // إرسال حدث لفيسبوك: العميل أنهى الأسئلة بنجاح (نستخدم SubmitApplication كحدث قياسي)
    trackFbEvent('SubmitApplication');
    
    setView('result_gate');
  };

  const handleGateSubmit = async (formData: any) => {
    const q1AnswerId = answers[1];
    const q2AnswerId = answers[2];
    const q1Text = questions.find(q => q.id === 1)?.options.find(opt => opt.id === q1AnswerId)?.text || "لم يجب";
    const q2Text = questions.find(q => q.id === 2)?.options.find(opt => opt.id === q2AnswerId)?.text || "لم يجب";

    const payload = {
      timestamp: new Date().toISOString(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      country: formData.country,
      score: score,
      experience: q1Text,
      commission: q2Text,
      full_answers: JSON.stringify(answers)
    };

    try {
      if (GOOGLE_SCRIPT_URL && GOOGLE_SCRIPT_URL.startsWith("http")) {
        await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify(payload),
        });
      }

      // الحدث الأهم: العميل سجل بياناته وحصل على النتيجة (Lead)
      trackFbEvent('Lead', {
        value: score,
        currency: 'USD',
        content_name: 'Quiz Completion'
      });

      window.scrollTo(0,0);
      setView('result');
      
    } catch (error) {
      console.error("Error submitting form", error);
      window.scrollTo(0,0);
      setView('result');
    }
  };

  return (
    <div className="min-h-screen w-full relative">
       {view === 'landing' && (
         <LandingPage onStart={handleStartQuiz} />
       )}
       
       {view === 'quiz' && (
         <QuizPage onFinish={handleQuizFinish} />
       )}

       {view === 'result_gate' && (
         <ResultGatePage 
            onSubmit={handleGateSubmit}
         />
       )}

       {view === 'result' && (
         <ResultPage 
            score={score}
            answers={answers}
         />
       )}
    </div>
  );
};

export default App;