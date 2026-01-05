import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import QuizPage from './components/QuizPage';
import ResultGatePage from './components/ResultGatePage';
import ResultPage from './components/ResultPage';
import { questions } from './data/quizData';

/**
 * @file App.tsx
 * @description المكون الرئيسي الذي يدير التنقل بين صفحات التطبيق.
 */

type ViewState = 'landing' | 'quiz' | 'result_gate' | 'result';

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxUCkGdIlXz08s8Uht5FgmFOsow6agDyRP9a87Q8bwX1WKudalp2tEs7nQVQlCqy1Y/exec"; 

const trackFbEvent = (eventName: string, params?: any) => {
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', eventName, params);
  }
};

const App: React.FC = () => {
  // تم إرجاع الحالة الافتراضية إلى 'landing' ليبدأ المستخدم من البداية
  const [view, setView] = useState<ViewState>('landing');
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [score, setScore] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    trackFbEvent('PageView', { view_name: view });
  }, [view]);

  const calculateScore = (collectedAnswers: Record<number, string>) => {
    let totalScore = 0;
    let maxPossible = 0;
    questions.forEach(q => {
      const selectedOptionId = collectedAnswers[q.id];
      const selectedOption = q.options.find(opt => opt.id === selectedOptionId);
      const maxVal = Math.max(...q.options.map(o => o.value));
      maxPossible += maxVal;
      if (selectedOption) totalScore += selectedOption.value;
    });
    const percentage = maxPossible > 0 ? Math.round((totalScore / maxPossible) * 100) : 0;
    setScore(percentage);
  };

  const handleStartQuiz = () => {
    trackFbEvent('Contact');
    setView('quiz');
  };

  const handleQuizFinish = (collectedAnswers: Record<number, string>) => {
    setAnswers(collectedAnswers);
    calculateScore(collectedAnswers);
    trackFbEvent('SubmitApplication');
    setView('result_gate');
  };

  const handleGateSubmit = async (formData: any) => {
    const q1AnswerId = answers[1];
    const q2AnswerId = answers[2];
    const q1Text = questions.find(q => q.id === 1)?.options.find(opt => opt.id === q1AnswerId)?.text || "N/A";
    const q2Text = questions.find(q => q.id === 2)?.options.find(opt => opt.id === q2AnswerId)?.text || "N/A";

    const payload = {
      timestamp: new Date().toLocaleString('ar-EG', { timeZone: 'Asia/Riyadh' }),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      country: formData.country,
      score: `${score}%`,
      experience: q1Text,
      commission: q2Text,
      source: window.location.href
    };

    try {
      fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', 
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(payload),
      });
      await new Promise(resolve => setTimeout(resolve, 2000));
      trackFbEvent('Lead', { value: score, currency: 'USD' });
      setView('result');
    } catch (error) {
      setView('result'); 
    }
  };

  return (
    <div className="min-h-screen w-full relative bg-black">
       {view === 'landing' && <LandingPage onStart={handleStartQuiz} />}
       {view === 'quiz' && <QuizPage onFinish={handleQuizFinish} />}
       {view === 'result_gate' && <ResultGatePage onSubmit={handleGateSubmit} />}
       {view === 'result' && <ResultPage score={score} answers={answers} />}
    </div>
  );
};

export default App;