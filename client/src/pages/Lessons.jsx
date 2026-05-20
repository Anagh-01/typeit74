import { useState } from 'react';
import { BookOpen, CheckCircle2, Lock, Play } from 'lucide-react';

const LESSONS = [
  { id: 1, title: 'Home Row Basics', desc: 'Learn to place your fingers on ASDF JKL;', unlocked: true, completed: true },
  { id: 2, title: 'Top Row', desc: 'Reach up to QWERT YUIOP', unlocked: true, completed: false },
  { id: 3, title: 'Bottom Row', desc: 'Reach down to ZXCVB NM,./', unlocked: false, completed: false },
  { id: 4, title: 'Numbers Row', desc: 'Reach up to 1234567890', unlocked: false, completed: false },
  { id: 5, title: 'Symbols', desc: 'Special characters !@#$%^&*()', unlocked: false, completed: false },
  { id: 6, title: 'Bigrams & Trigrams', desc: 'Common letter combinations', unlocked: false, completed: false },
];

const Lessons = () => {
  const [activeLesson, setActiveLesson] = useState(null);

  if (activeLesson) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl text-center">
        <h2 className="text-3xl font-bold mb-4">{activeLesson.title}</h2>
        <p className="text-slate-400 mb-8">{activeLesson.desc}</p>
        
        <div className="bg-slate-800 border border-slate-700 p-8 rounded-2xl mb-8">
          <div className="text-4xl font-mono tracking-[0.5em] text-red-500">
            f j f j d k d k s l s l a ; a ;
          </div>
        </div>
        
        <div className="flex justify-center space-x-4">
          <button 
            className="bg-red-500 hover:bg-red-400 text-slate-900 font-bold py-3 px-8 rounded-full transition-colors flex items-center space-x-2"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>Start Drill</span>
          </button>
          <button 
            onClick={() => setActiveLesson(null)}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3 px-8 rounded-full transition-colors"
          >
            Back to Lessons
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center">
          <BookOpen className="w-10 h-10 text-red-500 mr-4" />
          Typing Academy
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Master touch typing step-by-step. Start from the basic home row and progress to advanced symbols and speed drills.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {LESSONS.map((lesson) => (
          <div 
            key={lesson.id} 
            onClick={() => lesson.unlocked && setActiveLesson(lesson)}
            className={`relative p-6 rounded-2xl border transition-all ${
              lesson.unlocked 
                ? 'bg-slate-800/50 border-red-500/30 hover:border-red-400 hover:bg-slate-800 cursor-pointer shadow-[0_0_15px_rgba(239,68,68,0.1)] hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]' 
                : 'bg-slate-900/50 border-slate-800 opacity-75 cursor-not-allowed'
            }`}
          >
            {!lesson.unlocked && (
              <div className="absolute top-4 right-4 text-slate-600">
                <Lock className="w-5 h-5" />
              </div>
            )}
            
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                lesson.completed ? 'bg-green-500/20 text-green-400' : 
                lesson.unlocked ? 'bg-red-500/20 text-red-500' : 'bg-slate-800 text-slate-500'
              }`}>
                {lesson.completed ? <CheckCircle2 className="w-6 h-6" /> : lesson.id}
              </div>
            </div>
            
            <h3 className={`text-xl font-bold mb-2 ${lesson.unlocked ? 'text-white' : 'text-slate-500'}`}>
              {lesson.title}
            </h3>
            <p className="text-slate-400 text-sm">
              {lesson.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Lessons;
