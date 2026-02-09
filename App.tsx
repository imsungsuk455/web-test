import React, { useState, useEffect, useCallback } from 'react';
import { QUESTIONS, RESULTS } from './constants';
import { AppState, PersonalityType } from './types';
import ProgressBar from './components/ProgressBar';
import Button from './components/Button';
import ShareModal from './components/ShareModal';
import { Share2, RotateCcw } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    screen: 'WELCOME',
    currentQuestionIndex: 0,
    answers: [],
  });
  const [fade, setFade] = useState(true);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Simple page transition effect
  const transitionTo = (nextState: Partial<AppState>) => {
    setFade(false);
    setTimeout(() => {
      setState(prev => ({ ...prev, ...nextState }));
      setFade(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 300);
  };

  const startTest = () => {
    if (!fade) return;
    transitionTo({ screen: 'QUIZ', currentQuestionIndex: 0, answers: [] });
  };

  const handleAnswer = (choice: 'A' | 'B') => {
    if (!fade) return; // Prevent double clicks during transition

    const nextAnswers = [...state.answers, choice];
    
    if (state.currentQuestionIndex < QUESTIONS.length - 1) {
      // Next question
      setFade(false);
      setTimeout(() => {
        setState(prev => ({
          ...prev,
          answers: nextAnswers,
          currentQuestionIndex: prev.currentQuestionIndex + 1
        }));
        setFade(true);
      }, 300);
    } else {
      // Finish
      transitionTo({ screen: 'RESULT', answers: nextAnswers });
    }
  };

  const resetTest = () => {
    if (!fade) return;
    transitionTo({ screen: 'WELCOME', currentQuestionIndex: 0, answers: [] });
  };

  const calculateResult = useCallback((): {
    resultData: typeof RESULTS[PersonalityType];
    egenScore: number;
    tetoScore: number;
    egenPercent: number;
    tetoPercent: number;
  } => {
    const egenCount = state.answers.filter(a => a === 'A').length;
    const tetoCount = state.answers.filter(a => a === 'B').length;
    const total = QUESTIONS.length;
    
    const egenPercent = Math.round((egenCount / total) * 100);
    const tetoPercent = Math.round((tetoCount / total) * 100);

    let type: PersonalityType = 'HYBRID';
    if (egenPercent >= 70) type = 'EGEN';
    else if (tetoPercent >= 70) type = 'TETO';

    return {
      resultData: RESULTS[type],
      egenScore: egenCount,
      tetoScore: tetoCount,
      egenPercent,
      tetoPercent
    };
  }, [state.answers]);

  // -- RENDER SCREENS --

  // 1. WELCOME SCREEN
  if (state.screen === 'WELCOME') {
    return (
      <main className={`min-h-screen flex items-center justify-center p-6 transition-opacity duration-300 ${fade ? 'opacity-100' : 'opacity-0'}`}>
        <div className="max-w-md w-full bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-xl text-center border border-white/50">
          <div className="text-6xl mb-6 animate-bounce">✨</div>
          <h1 className="font-display text-4xl mb-2 text-slate-800">
            <span className="text-pink-500">에겐녀</span> VS <span className="text-cyan-600">테토녀</span>
          </h1>
          <p className="text-xl font-bold text-slate-600 mb-8">성향 판별 테스트</p>
          
          <div className="bg-slate-50 p-6 rounded-2xl mb-8 text-left space-y-3 shadow-inner">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🐰</span>
              <div>
                <span className="font-bold text-pink-500 block">Egen (Energy)</span>
                <span className="text-sm text-slate-500">긍정적, 감성적, 리액션 부자</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🦊</span>
              <div>
                <span className="font-bold text-cyan-600 block">Teto (Tech/Logical)</span>
                <span className="text-sm text-slate-500">논리적, 이성적, 효율성 중시</span>
              </div>
            </div>
          </div>

          <p className="text-slate-500 mb-8">
            나는 과연 어떤 타입일까요?<br/>
            10가지 질문으로 알아보세요!
          </p>

          <Button onClick={startTest} disabled={!fade} fullWidth className="bg-gradient-to-r from-pink-400 to-cyan-400 hover:from-pink-500 hover:to-cyan-500 border-none">
            테스트 시작하기
          </Button>
        </div>
      </main>
    );
  }

  // 2. QUIZ SCREEN
  if (state.screen === 'QUIZ') {
    const question = QUESTIONS[state.currentQuestionIndex];
    
    // Safety guard to prevent crash if index is out of bounds
    if (!question) return null;

    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6 max-w-md mx-auto">
         <div className={`w-full transition-all duration-300 transform ${fade ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="mb-6 text-center">
             <span className="text-4xl inline-block mb-2">
               {state.currentQuestionIndex % 2 === 0 ? '🤔' : '👀'}
             </span>
          </div>

          <ProgressBar current={state.currentQuestionIndex + 1} total={QUESTIONS.length} />

          <div className="bg-white p-8 rounded-3xl shadow-lg mb-8 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-300 to-cyan-300"></div>
             <h2 className="text-2xl font-bold text-slate-800 mb-4 whitespace-pre-wrap leading-relaxed text-center font-display">
               {question.text}
             </h2>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => handleAnswer('A')}
              disabled={!fade}
              className="w-full p-6 text-left bg-white rounded-2xl shadow-sm border-2 border-transparent hover:border-pink-300 hover:bg-pink-50 transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-start">
                <span className="bg-pink-100 text-pink-600 font-bold px-3 py-1 rounded-lg mr-3 group-hover:bg-pink-200">A</span>
                <span className="text-slate-700 font-medium leading-relaxed">{question.options.A}</span>
              </div>
            </button>

            <button
              onClick={() => handleAnswer('B')}
              disabled={!fade}
              className="w-full p-6 text-left bg-white rounded-2xl shadow-sm border-2 border-transparent hover:border-cyan-300 hover:bg-cyan-50 transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-start">
                <span className="bg-cyan-100 text-cyan-600 font-bold px-3 py-1 rounded-lg mr-3 group-hover:bg-cyan-200">B</span>
                <span className="text-slate-700 font-medium leading-relaxed">{question.options.B}</span>
              </div>
            </button>
          </div>
        </div>
      </main>
    );
  }

  // 3. RESULT SCREEN
  if (state.screen === 'RESULT') {
    const { resultData, egenPercent, tetoPercent } = calculateResult();

    return (
      <main className={`min-h-screen py-12 px-6 flex items-center justify-center transition-opacity duration-500 ${fade ? 'opacity-100' : 'opacity-0'}`}>
        <div className="max-w-md w-full bg-white rounded-[2rem] shadow-2xl overflow-hidden">
          {/* Header Image/Color Area */}
          <div className={`p-10 text-center ${resultData.bgClass} relative`}>
             <div className="text-8xl mb-4 filter drop-shadow-md transform hover:scale-110 transition-transform duration-300 cursor-default">
                {resultData.emoji}
             </div>
             <h2 className={`font-display text-3xl font-bold mb-2 ${resultData.colorClass}`}>
               {resultData.title}
             </h2>
             <div className="flex flex-wrap justify-center gap-2 mt-4">
                {resultData.traits.map(trait => (
                  <span key={trait} className="bg-white/60 px-3 py-1 rounded-full text-xs font-bold text-slate-600">
                    {trait}
                  </span>
                ))}
             </div>
          </div>

          <div className="p-8">
            {/* Description */}
            <p className="text-slate-600 leading-relaxed mb-8 text-center">
              {resultData.description}
            </p>

            {/* Graphs */}
            <div className="space-y-4 mb-10">
              <div>
                <div className="flex justify-between text-sm font-bold mb-1">
                  <span className="text-pink-500">에겐력 (Energy)</span>
                  <span className="text-pink-500">{egenPercent}%</span>
                </div>
                <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-pink-400 rounded-full transition-all duration-1000" style={{ width: `${egenPercent}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm font-bold mb-1">
                  <span className="text-cyan-600">테토력 (Tech/Logic)</span>
                  <span className="text-cyan-600">{tetoPercent}%</span>
                </div>
                <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-500 rounded-full transition-all duration-1000" style={{ width: `${tetoPercent}%` }}></div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col space-y-3">
              <Button onClick={() => setIsShareModalOpen(true)} disabled={!fade} variant="secondary" fullWidth className="flex items-center justify-center gap-2">
                <Share2 size={20} />
                결과 공유하기
              </Button>
              
              <Button onClick={resetTest} disabled={!fade} variant="outline" fullWidth className="flex items-center justify-center gap-2">
                <RotateCcw size={20} />
                다시 테스트하기
              </Button>
            </div>
          </div>
        </div>

        <ShareModal 
          isOpen={isShareModalOpen} 
          onClose={() => setIsShareModalOpen(false)} 
          resultTitle={resultData.title}
          resultDescription={resultData.description}
        />
      </main>
    );
  }

  return null;
};

export default App;