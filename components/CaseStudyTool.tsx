import React, { useState, useRef, useEffect } from 'react';
import { startNewCase, performCaseAction } from '../services/geminiService';
import { Microscope, Play, Send, CheckCircle2, FlaskConical, Stethoscope, Printer } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { GeminiModel } from '../types';

interface Interaction {
  type: 'system' | 'user' | 'result';
  text: string;
}

interface Props {
  model: GeminiModel;
}

const CaseStudyTool: React.FC<Props> = ({ model }) => {
  const [activeCase, setActiveCase] = useState(false);
  const [loading, setLoading] = useState(false);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [inputAction, setInputAction] = useState('');
  
  // To accumulate context for the AI
  const [caseContext, setCaseContext] = useState('');

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [interactions]);

  const handleStartCase = async () => {
    setLoading(true);
    setActiveCase(true);
    setInteractions([]);
    
    const initialScenario = await startNewCase(model);
    
    setInteractions([{ type: 'system', text: initialScenario }]);
    setCaseContext(initialScenario);
    setLoading(false);
  };

  const handleAction = async () => {
    if (!inputAction.trim()) return;
    
    const userAction = inputAction;
    setInputAction('');
    
    // Add user action to UI
    setInteractions(prev => [...prev, { type: 'user', text: userAction }]);
    setLoading(true);

    const result = await performCaseAction(caseContext, userAction, model);
    
    // Update context
    setCaseContext(prev => `${prev}\n\nالإجراء: ${userAction}\nالنتيجة: ${result}`);
    
    // Add result to UI
    setInteractions(prev => [...prev, { type: 'result', text: result }]);
    setLoading(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col">
      <header className="mb-4 flex justify-between items-center no-print">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <span className="w-2 h-8 bg-purple-600 rounded-full"></span>
            حل الحالات السريرية (Diagnostic Detective)
          </h2>
          <div className="flex items-center gap-2">
            <p className="text-slate-500 text-sm">ابدأ سيناريو غامض، اطلب فحوصات، واكتشف التشخيص.</p>
            <span className="text-[10px] bg-purple-50 text-purple-600 px-2 rounded border border-purple-100">{model}</span>
          </div>
        </div>
        {!activeCase && (
          <button 
            onClick={handleStartCase}
            className="bg-purple-600 text-white px-6 py-2 rounded-xl hover:bg-purple-700 transition-all flex items-center gap-2 font-bold shadow-lg shadow-purple-200"
          >
            <Play size={18} />
            <span>ابدأ حالة جديدة</span>
          </button>
        )}
        {activeCase && (
            <button 
                onClick={handlePrint} 
                className="text-slate-500 hover:text-red-600 p-2 bg-white rounded-lg border border-slate-200 shadow-sm transition-colors"
                title="حفظ السجل PDF"
            >
                <Printer size={18} />
            </button>
        )}
      </header>

      {!activeCase ? (
        <div className="flex-1 bg-white rounded-2xl border border-slate-200 flex flex-col items-center justify-center text-center p-8 shadow-sm">
          <div className="w-24 h-24 bg-purple-50 rounded-full flex items-center justify-center mb-6">
            <Microscope size={48} className="text-purple-500" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">هل أنت مستعد للتحدي؟</h3>
          <p className="text-slate-500 max-w-md mx-auto mb-8">
            سيتم عرض مريض يعاني من أعراض معينة. دورك هو طلب الفحوصات اللازمة (تخطيط قلب، أشعة، دم) وتحديد التشخيص النهائي.
          </p>
          <button 
            onClick={handleStartCase}
            disabled={loading}
            className="bg-purple-600 text-white px-8 py-3 rounded-xl hover:bg-purple-700 transition-all font-bold text-lg"
          >
            {loading ? 'جاري تحضير المريض...' : 'بدء المحاكاة'}
          </button>
        </div>
      ) : (
        <div className="flex-1 bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden flex flex-col relative">
           
           <div className="absolute top-4 left-4 z-10 no-print">
              <button onClick={() => setActiveCase(false)} className="text-xs bg-white/80 backdrop-blur px-3 py-1 rounded-full border border-slate-200 hover:bg-red-50 hover:text-red-600 transition-colors">
                إنهاء الحالة
              </button>
           </div>

           {/* Interactions Stream */}
           <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
              <div id="printable-area" className="space-y-6 p-2 bg-slate-50">
                <div className="text-center border-b pb-4 mb-4">
                  <h3 className="text-xl font-bold">تقرير حالة سريرية</h3>
                  <p className="text-gray-500">حل الحالات - د. شادي</p>
                </div>
                {interactions.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    
                    {msg.type === 'system' && (
                        <div className="w-full bg-white border-l-4 border-purple-500 p-6 rounded-r-xl shadow-sm mb-4">
                        <div className="flex items-center gap-2 mb-2 text-purple-700 font-bold border-b border-slate-100 pb-2">
                            <Stethoscope size={20} />
                            <span>بيانات الحالة</span>
                        </div>
                        <div className="prose prose-sm prose-slate max-w-none">
                            <ReactMarkdown>{msg.text}</ReactMarkdown>
                        </div>
                        </div>
                    )}

                    {msg.type === 'user' && (
                        <div className="bg-slate-800 text-white px-5 py-3 rounded-2xl rounded-tl-none max-w-[80%] shadow-md">
                          <span className="block text-[10px] text-slate-300 mb-1">الإجراء المطلوب</span>
                          {msg.text}
                        </div>
                    )}

                    {msg.type === 'result' && (
                        <div className="w-[90%] bg-white border border-slate-200 p-5 rounded-2xl rounded-tr-none shadow-sm ml-0 mr-auto">
                        <div className="flex items-center gap-2 mb-2 text-slate-500 text-xs font-bold uppercase tracking-wider">
                            <FlaskConical size={14} />
                            <span>نتيجة / تقييم</span>
                        </div>
                        <div className="prose prose-sm prose-slate max-w-none">
                            <ReactMarkdown>{msg.text}</ReactMarkdown>
                        </div>
                        </div>
                    )}

                    </div>
                ))}
              </div>
              
              {loading && (
                <div className="flex items-center gap-2 text-slate-400 p-4 no-print">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-100"></div>
                  <span>المشرف يراجع الطلب...</span>
                </div>
              )}
           </div>

           {/* Input Area */}
           <div className="p-4 bg-white border-t border-slate-200 no-print">
             <div className="flex gap-2">
               <input
                 type="text"
                 className="flex-1 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                 placeholder="اطلب فحصاً (مثال: طلب صورة دم CBC) أو اقترح تشخيصاً..."
                 value={inputAction}
                 onChange={(e) => setInputAction(e.target.value)}
                 onKeyDown={(e) => e.key === 'Enter' && handleAction()}
                 disabled={loading}
               />
               <button
                 onClick={handleAction}
                 disabled={loading || !inputAction.trim()}
                 className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-xl transition-all disabled:opacity-50"
               >
                 <Send size={20} />
               </button>
             </div>
             <div className="flex gap-2 mt-2 overflow-x-auto scrollbar-hide">
                <span className="text-xs text-slate-400 px-2 py-1">أوامر سريعة:</span>
                {['طلب ECG', 'طلب CXR', 'فحص CBC', 'قياس الضغط'].map(cmd => (
                  <button key={cmd} onClick={() => setInputAction(cmd)} className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1 rounded-full border border-slate-200 transition-colors whitespace-nowrap">
                    {cmd}
                  </button>
                ))}
             </div>
           </div>

        </div>
      )}
    </div>
  );
};

export default CaseStudyTool;