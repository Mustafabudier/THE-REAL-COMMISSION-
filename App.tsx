
import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import QuizPage from './components/QuizPage';
import ResultGatePage from './components/ResultGatePage';
import ResultPage from './components/ResultPage'; // New Import
import { questions } from './data/quizData';

// Updated ViewState to include 'result'
type ViewState = 'landing' | 'quiz' | 'result_gate' | 'result';

// 🔴 هام: قم بوضع رابط Google Web App هنا الذي نسخته من الخطوة رقم 4
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxiw7bU06Cu9qN3SxaXk0a8FqZnhryEDdJz3VrHH9CYY3r_7nYfZfQst-yUPuJZNYQ/exec"; 

const App: React.FC = () => {
  // Initial view set to 'landing' for the correct user flow
  const [view, setView] = useState<ViewState>('landing');
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [score, setScore] = useState(85); // Default score

  // Scroll to top whenever view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [view]);

  const calculateScore = (collectedAnswers: Record<number, string>) => {
    let totalScore = 0;
    let maxPossible = 0;

    questions.forEach(q => {
      const selectedOptionId = collectedAnswers[q.id];
      const selectedOption = q.options.find(opt => opt.id === selectedOptionId);
      
      // Add up max possible value for this question
      const maxVal = Math.max(...q.options.map(o => o.value));
      maxPossible += maxVal;

      if (selectedOption) {
        totalScore += selectedOption.value;
      }
    });

    // Normalize to 100%
    const percentage = maxPossible > 0 ? Math.round((totalScore / maxPossible) * 100) : 0;
    setScore(percentage);
  };

  const handleQuizFinish = (collectedAnswers: Record<number, string>) => {
    setAnswers(collectedAnswers);
    calculateScore(collectedAnswers);
    window.scrollTo(0,0);
    // Move to ResultGatePage (3rd page)
    setView('result_gate');
  };

  const handleGateSubmit = async (formData: any) => {
    
    // 1. استخراج الإجابات النصية للسؤال الأول (الخبرة) والثاني (العمولة) لتصنيف العميل
    // Get readable answers for Question 1 & 2
    const q1AnswerId = answers[1]; // Answer ID for Q1 (e.g., 'a', 'b')
    const q2AnswerId = answers[2]; // Answer ID for Q2
    
    // البحث عن النص المقابل للاختيار (مثال: "مبتدئ" بدلاً من "a")
    const q1Text = questions.find(q => q.id === 1)?.options.find(opt => opt.id === q1AnswerId)?.text || "لم يجب";
    const q2Text = questions.find(q => q.id === 2)?.options.find(opt => opt.id === q2AnswerId)?.text || "لم يجب";

    // 2. Prepare Payload
    const payload = {
      timestamp: new Date().toISOString(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      country: formData.country,
      score: score,
      experience: q1Text, // إجابة السؤال 1 نصاً
      commission: q2Text, // إجابة السؤال 2 نصاً
      full_answers: JSON.stringify(answers) // باقي الإجابات كاحتياط
    };

    console.log("Sending Data to Sheet:", payload);

    try {
      // 3. Send to Google Sheets (if URL is set)
      if (GOOGLE_SCRIPT_URL && GOOGLE_SCRIPT_URL.startsWith("http")) {
        await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors', // Important for Google Sheets to avoid CORS errors
          headers: {
            'Content-Type': 'text/plain', // CHANGED to text/plain to bypass CORS
          },
          body: JSON.stringify(payload),
        });
        console.log("Request sent to Google Sheet");
      } else {
        console.warn("Google Script URL is missing or invalid.");
      }

      // 4. Redirect to Result Page regardless of API success (to not block user)
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
         <LandingPage onStart={() => setView('quiz')} />
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
