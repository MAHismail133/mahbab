
import React, { useState, useEffect, useCallback } from 'react';
import { AppState, Question, UserInfo } from './types';
import { fetchQuestions } from './services/geminiService';
import IslamicPattern from './components/IslamicPattern';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.LANDING);
  const [user, setUser] = useState<UserInfo>({ name: '', age: '' });
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);

  const startQuiz = async () => {
    setLoading(true);
    const newQuestions = await fetchQuestions();
    setQuestions(newQuestions);
    setLoading(false);
    setState(AppState.QUIZ);
  };

  const handleAnswer = (idx: number) => {
    if (idx === questions[currentQuestionIdx].correctAnswer) {
      setScore(prev => prev + 1);
    }
    
    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
    } else {
      setState(AppState.RESULT);
    }
  };

  const resetQuiz = () => {
    setState(AppState.LANDING);
    setScore(0);
    setCurrentQuestionIdx(0);
    setUser({ name: '', age: '' });
  };

  const renderLanding = () => (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6 animate-fade-in z-10 relative">
      <div className="mb-8 relative">
         <div className="w-48 h-48 bg-[#d4af37] rounded-full flex items-center justify-center p-1 shadow-2xl">
            <div className="w-full h-full bg-[#042f2e] rounded-full flex items-center justify-center">
                <span className="text-6xl">🌙</span>
            </div>
         </div>
      </div>
      <h1 className="text-5xl font-kufi gold-text mb-4">مسابقة النور الرمضانية</h1>
      <p className="text-xl text-sand-100 mb-10 opacity-80 max-w-md leading-relaxed">
        اختبر معلوماتك الدينية في جو من الروحانية والجمال.
      </p>
      <button 
        onClick={() => setState(AppState.REGISTRATION)}
        className="gold-bg px-12 py-4 rounded-full text-xl font-bold shadow-lg hover:scale-105 transition-transform duration-300 active:scale-95"
      >
        ابدأ المسابقة
      </button>
    </div>
  );

  const renderRegistration = () => (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 animate-fade-in z-10 relative">
      <div className="w-full max-w-md gold-border bg-[#064e3b] p-8 rounded-2xl shadow-2xl">
        <h2 className="text-3xl font-kufi gold-text mb-8 text-center">بيانات المتسابق</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm mb-2 opacity-70">الاسم الكريم</label>
            <input 
              type="text" 
              value={user.name}
              onChange={(e) => setUser({...user, name: e.target.value})}
              placeholder="أدخل اسمك هنا..."
              className="w-full bg-[#042f2e] border-2 border-[#d4af37]/30 rounded-lg p-3 focus:border-[#d4af37] outline-none transition-colors text-right"
            />
          </div>
          <div>
            <label className="block text-sm mb-2 opacity-70">العمر</label>
            <input 
              type="number" 
              value={user.age}
              onChange={(e) => setUser({...user, age: e.target.value})}
              placeholder="مثال: 20"
              className="w-full bg-[#042f2e] border-2 border-[#d4af37]/30 rounded-lg p-3 focus:border-[#d4af37] outline-none transition-colors text-right"
            />
          </div>
          <button 
            disabled={!user.name || !user.age || loading}
            onClick={startQuiz}
            className={`w-full gold-bg py-4 rounded-xl text-xl font-bold mt-4 shadow-lg hover:brightness-110 transition-all ${(!user.name || !user.age || loading) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'جاري تجهيز الأسئلة...' : 'دخول المسابقة'}
          </button>
        </div>
      </div>
    </div>
  );

  const renderQuiz = () => {
    if (questions.length === 0) return null;
    const q = questions[currentQuestionIdx];
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 animate-fade-in z-10 relative">
        <div className="w-full max-w-xl">
            <div className="flex justify-between items-center mb-6 gold-text font-kufi">
                <span className="text-xl">السؤال {currentQuestionIdx + 1} من {questions.length}</span>
                <span className="text-lg">المتسابق: {user.name}</span>
            </div>
            
            <div className="gold-border bg-[#064e3b] p-8 rounded-3xl shadow-2xl min-h-[400px] flex flex-col">
                <h3 className="text-2xl md:text-3xl leading-snug mb-10 text-center font-bold">
                    {q.question}
                </h3>
                <div className="grid gap-4 mt-auto">
                    {q.options.map((option, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleAnswer(idx)}
                            className="w-full text-right p-4 rounded-xl bg-[#042f2e] border border-[#d4af37]/20 hover:border-[#d4af37] hover:bg-[#d4af37]/10 transition-all duration-200 text-lg md:text-xl active:bg-[#d4af37]/20 group"
                        >
                            <span className="inline-block w-8 h-8 rounded-full bg-[#d4af37] text-[#042f2e] text-center leading-8 font-bold ml-3 group-hover:scale-110 transition-transform">
                                {['أ', 'ب', 'ج', 'د'][idx]}
                            </span>
                            {option}
                        </button>
                    ))}
                </div>
            </div>
        </div>
      </div>
    );
  };

  const renderResult = () => {
    const isSuccess = score >= (questions.length / 2);
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 animate-fade-in z-10 relative text-center">
        <div className="w-full max-w-md gold-border bg-[#064e3b] p-10 rounded-3xl shadow-2xl">
          <div className="text-6xl mb-6">
            {isSuccess ? '🏆' : '🕯️'}
          </div>
          <h2 className={`text-4xl font-kufi mb-4 ${isSuccess ? 'text-green-400' : 'text-red-400'}`}>
            {isSuccess ? 'بارك الله فيك' : 'حاول مرة أخرى'}
          </h2>
          <p className="text-2xl mb-2">أحسنت يا {user.name}!</p>
          <div className="text-6xl gold-text font-kufi my-8">
            {score} / {questions.length}
          </div>
          <p className="mb-8 opacity-70">
            {isSuccess 
                ? 'لقد اجتزت المسابقة بنجاح باهر.' 
                : 'لا بأس، العلم يأتي بالتعلم. حاول مرة أخرى لزيادة معلوماتك.'}
          </p>
          <button 
            onClick={resetQuiz}
            className="w-full gold-bg py-4 rounded-xl text-xl font-bold shadow-lg hover:scale-105 transition-transform"
          >
            العودة للرئيسية
          </button>
        </div>
      </div>
    );
  };

  return (
    <main className="relative min-h-screen overflow-hidden">
      <IslamicPattern />
      {state === AppState.LANDING && renderLanding()}
      {state === AppState.REGISTRATION && renderRegistration()}
      {state === AppState.QUIZ && renderQuiz()}
      {state === AppState.RESULT && renderResult()}
    </main>
  );
};

export default App;
