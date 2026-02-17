
import React, { useState, useEffect } from 'react';
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
    if (!user.name || !user.age) return;
    setLoading(true);
    try {
      // Fetch fresh questions for every new participant
      const newQuestions = await fetchQuestions();
      setQuestions(newQuestions);
      setCurrentQuestionIdx(0);
      setScore(0);
      setState(AppState.QUIZ);
    } catch (err) {
      alert("عذراً، فشل الاتصال. حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (idx: number) => {
    const isCorrect = idx === questions[currentQuestionIdx].correctAnswer;
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    
    if (currentQuestionIdx < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIdx(prev => prev + 1);
      }, 300);
    } else {
      setTimeout(() => {
        setState(AppState.RESULT);
      }, 300);
    }
  };

  const resetQuiz = () => {
    setState(AppState.LANDING);
    setUser({ name: '', age: '' });
  };

  const renderLanding = () => (
    <div className="flex flex-col items-center justify-center h-full w-full text-center p-6 animate-enter z-10 relative">
      <div className="mb-10 relative">
         <div className="w-44 h-44 bg-[#d4af37] rounded-full flex items-center justify-center p-1 shadow-2xl animate-pulse-gold">
            <div className="w-full h-full bg-[#022c22] rounded-full flex items-center justify-center overflow-hidden border-4 border-[#d4af37]">
                <span className="text-8xl">🌙</span>
            </div>
         </div>
      </div>
      <h1 className="text-5xl md:text-7xl font-kufi gold-gradient mb-6 font-bold leading-tight">مسابقة النور الرمضانية</h1>
      <p className="text-xl text-stone-300 mb-14 max-w-sm leading-relaxed">
        رحلة معرفية إيمانية في أعماق الثقافة الإسلامية بأسلوب عصري.
      </p>
      <button 
        onClick={() => setState(AppState.REGISTRATION)}
        className="gold-button w-full max-w-xs py-5 rounded-2xl text-2xl font-bold font-kufi shadow-2xl"
      >
        دخول المسابقة
      </button>
    </div>
  );

  const renderRegistration = () => (
    <div className="flex flex-col items-center justify-center h-full w-full p-6 animate-enter z-10 relative">
      <div className="w-full max-w-md gold-border card-bg p-10 rounded-[2.5rem] shadow-2xl border-t-8">
        <h2 className="text-4xl font-kufi gold-gradient mb-10 text-center font-bold">بياناتك يا بطل</h2>
        <div className="space-y-8">
          <div className="space-y-3">
            <label className="block text-xl font-bold text-[#d4af37]">الاسم الكريم</label>
            <input 
              type="text" 
              value={user.name}
              onChange={(e) => setUser({...user, name: e.target.value})}
              placeholder="اكتب اسمك هنا..."
              className="w-full bg-[#022c22] border-2 border-[#d4af37]/40 rounded-2xl p-5 focus:border-[#d4af37] outline-none transition-all text-right text-xl text-white shadow-inner"
            />
          </div>
          <div className="space-y-3">
            <label className="block text-xl font-bold text-[#d4af37]">العمر</label>
            <input 
              type="number" 
              inputMode="numeric"
              value={user.age}
              onChange={(e) => setUser({...user, age: e.target.value})}
              placeholder="أدخل عمرك"
              className="w-full bg-[#022c22] border-2 border-[#d4af37]/40 rounded-2xl p-5 focus:border-[#d4af37] outline-none transition-all text-right text-xl text-white shadow-inner"
            />
          </div>
          <button 
            disabled={!user.name || !user.age || loading}
            onClick={startQuiz}
            className={`w-full gold-button py-6 rounded-2xl text-2xl font-bold font-kufi mt-4 shadow-xl active:scale-95 ${(loading || !user.name || !user.age) ? 'opacity-50' : ''}`}
          >
            {loading ? 'جاري التحميل...' : 'دخول الاختبار'}
          </button>
        </div>
      </div>
    </div>
  );

  const renderQuiz = () => {
    if (questions.length === 0) return null;
    const q = questions[currentQuestionIdx];
    const progress = ((currentQuestionIdx + 1) / questions.length) * 100;

    return (
      <div className="flex flex-col items-center justify-start h-full w-full p-4 pt-12 animate-enter z-10 relative overflow-y-auto">
        <div className="w-full max-w-2xl flex flex-col h-full">
            <div className="flex justify-between items-center mb-6 text-[#d4af37] font-kufi px-2">
                <span className="text-2xl font-bold">{currentQuestionIdx + 1} / {questions.length}</span>
                <span className="text-xl opacity-80">{user.name}</span>
            </div>
            
            <div className="w-full h-4 bg-[#022c22] rounded-full mb-10 border border-[#d4af37]/40 overflow-hidden shadow-inner">
                <div 
                  className="h-full bg-gradient-to-l from-[#d4af37] to-[#f1d592] transition-all duration-700 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
            </div>

            <div className="gold-border card-bg p-10 md:p-14 rounded-[3rem] shadow-2xl flex flex-col relative overflow-hidden flex-1 mb-8">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#d4af37]/5 rounded-bl-[4rem] border-r-4 border-t-4 border-[#d4af37]/20"></div>
                
                <h3 className="text-3xl md:text-4xl leading-tight mb-14 text-center font-bold text-white font-amiri">
                    {q.question}
                </h3>
                
                <div className="grid grid-cols-1 gap-5 mt-auto">
                    {q.options.map((option, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleAnswer(idx)}
                            className="w-full text-right p-6 rounded-3xl bg-[#022c22]/60 border-2 border-[#d4af37]/30 hover:border-[#d4af37] hover:bg-[#d4af37]/10 transition-all duration-300 text-xl md:text-2xl active:scale-[0.97] group flex items-center justify-between"
                        >
                            <span className="text-white flex-1">{option}</span>
                            <span className="w-12 h-12 flex items-center justify-center rounded-xl bg-[#d4af37] text-[#022c22] font-bold text-2xl mr-5 group-hover:rotate-6 transition-transform shadow-lg">
                                {['أ', 'ب', 'ج', 'د'][idx]}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
      </div>
    );
  };

  const renderResult = () => {
    // Required score to pass (at least 60%)
    const passThreshold = Math.ceil(questions.length * 0.6);
    const isSuccess = score >= passThreshold;
    
    return (
      <div className="flex flex-col items-center justify-center h-full w-full p-6 animate-enter z-10 relative text-center">
        <div className="w-full max-w-md gold-border card-bg p-14 rounded-[4rem] shadow-2xl relative">
          <div className="absolute -top-14 left-1/2 -translate-x-1/2 w-28 h-28 bg-[#064e3b] rounded-full border-4 border-[#d4af37] flex items-center justify-center text-6xl shadow-2xl animate-bounce">
            {isSuccess ? '🏆' : '📚'}
          </div>
          
          <h2 className={`text-6xl font-kufi mt-12 mb-8 font-bold ${isSuccess ? 'text-green-400' : 'text-[#d4af37]'}`}>
            {isSuccess ? 'بارك الله فيك' : 'حاول مرة أخرى'}
          </h2>
          
          <p className="text-2xl mb-2 text-stone-200 opacity-80">نتيجتك النهائية</p>
          <div className="text-8xl font-kufi gold-gradient my-8 font-black tracking-tighter">
            {score} / {questions.length}
          </div>
          
          <div className="p-6 bg-[#022c22]/80 rounded-3xl mb-12 border border-[#d4af37]/30 shadow-inner">
            <p className="text-2xl opacity-90 leading-relaxed text-stone-100">
              {isSuccess 
                ? `ما شاء الله يا ${user.name}، لقد أثبتت تميزك وفهمك العميق!` 
                : `يا ${user.name}، القراءة مفتاح العلم. لا تيأس وكرر المحاولة لتزداد علماً.`}
            </p>
          </div>

          <button 
            onClick={resetQuiz}
            className="w-full gold-button py-6 rounded-3xl text-3xl font-bold font-kufi shadow-2xl active:scale-95"
          >
            {isSuccess ? 'إعادة المسابقة' : 'محاولة ثانية'}
          </button>
        </div>
      </div>
    );
  };

  return (
    <main className="fixed inset-0 flex flex-col items-center justify-center bg-[#022c22]">
      <IslamicPattern />
      {state === AppState.LANDING && renderLanding()}
      {state === AppState.REGISTRATION && renderRegistration()}
      {state === AppState.QUIZ && renderQuiz()}
      {state === AppState.RESULT && renderResult()}
    </main>
  );
};

export default App;
