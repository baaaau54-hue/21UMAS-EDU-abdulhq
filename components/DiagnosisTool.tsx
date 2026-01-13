import React, { useState } from 'react';
import { getDifferentialDiagnosis } from '../services/geminiService';
import { Send, Loader2, AlertCircle, Printer } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { GeminiModel } from '../types';

interface Props {
  model: GeminiModel;
}

const DiagnosisTool: React.FC<Props> = ({ model }) => {
  const [symptoms, setSymptoms] = useState('');
  const [history, setHistory] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!symptoms) return;
    setLoading(true);
    const response = await getDifferentialDiagnosis(symptoms, history, model);
    setResult(response);
    setLoading(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <header className="mb-8 no-print">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
          مساعد التشخيص التفريقي
        </h2>
        <p className="text-slate-500 mt-2">أدخل الأعراض والتاريخ المرضي للحصول على قائمة بالاحتمالات التشخيصية.</p>
        <div className="text-xs text-blue-600 bg-blue-50 w-fit px-2 py-1 rounded mt-2">
           النواة الحالية: {model}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-fit no-print">
          <label className="block text-sm font-semibold text-slate-700 mb-2">الأعراض الرئيسية</label>
          <textarea
            className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all h-32 bg-slate-50"
            placeholder="مثال: ألم في الصدر ينتشر للكتف الأيسر، تعرق، غثيان..."
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
          />

          <label className="block text-sm font-semibold text-slate-700 mt-4 mb-2">التاريخ المرضي (اختياري)</label>
          <textarea
            className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all h-24 bg-slate-50"
            placeholder="مثال: مدخن، يعاني من ارتفاع ضغط الدم..."
            value={history}
            onChange={(e) => setHistory(e.target.value)}
          />

          <button
            onClick={handleAnalyze}
            disabled={loading || !symptoms}
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Send size={20} />}
            <span>تحليل الحالة</span>
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 min-h-[400px] flex flex-col">
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100 no-print">
             <h3 className="text-lg font-bold text-slate-800">النتيجة والتحليل</h3>
             {result && (
                <button onClick={handlePrint} className="text-slate-400 hover:text-red-600 transition-colors" title="طباعة / حفظ PDF">
                  <Printer size={20} />
                </button>
             )}
          </div>
          
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 no-print">
              <Loader2 size={40} className="animate-spin mb-4 text-blue-500" />
              <p>جاري استشارة الذكاء الاصطناعي...</p>
            </div>
          ) : result ? (
            <div className="flex-1 overflow-y-auto max-h-[500px]">
                <div id="printable-area" className="prose prose-sm prose-slate max-w-none font-medium leading-relaxed bg-white p-2">
                   <div className="mb-4 text-center border-b pb-4">
                      <h2 className="text-xl font-bold">تقرير التشخيص التفريقي</h2>
                      <p className="text-sm text-gray-500">د. شادي - السنة الرابعة</p>
                   </div>
                   <ReactMarkdown>{result}</ReactMarkdown>
                </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-center no-print">
              <AlertCircle size={48} className="mb-4 opacity-20" />
              <p>النتائج ستظهر هنا بعد إدخال البيانات.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiagnosisTool;