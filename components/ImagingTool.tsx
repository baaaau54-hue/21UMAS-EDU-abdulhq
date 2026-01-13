import React, { useState, useRef } from 'react';
import { analyzeImage, analyzeRadiologyText } from '../services/geminiService';
import { Upload, X, Loader2, ScanEye, Type, Image as ImageIcon, Printer } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { GeminiModel } from '../types';

interface Props {
  model: GeminiModel;
}

const ImagingTool: React.FC<Props> = ({ model }) => {
  const [mode, setMode] = useState<'upload' | 'text'>('upload');
  
  // Upload State
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Text State
  const [textDescription, setTextDescription] = useState('');

  // Common State
  const [userPrompt, setUserPrompt] = useState(''); // Used for additional context in upload mode
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);

  // Handlers
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setAnalysis('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearImage = () => {
    setSelectedImage(null);
    setAnalysis('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAnalyze = async () => {
    setLoading(true);
    let result = '';

    if (mode === 'upload' && selectedImage) {
      const base64Data = selectedImage.split(',')[1];
      result = await analyzeImage(base64Data, userPrompt, model);
    } else if (mode === 'text' && textDescription) {
      result = await analyzeRadiologyText(textDescription, model);
    }

    setAnalysis(result);
    setLoading(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto h-full flex flex-col">
      <header className="mb-6 no-print">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <span className="w-2 h-8 bg-teal-500 rounded-full"></span>
          مختبر الأشعة التفاعلي
        </h2>
        <div className="flex items-center gap-3">
            <p className="text-slate-500 mt-2">تحليل الصور الطبية أو تفسير التقارير المكتوبة.</p>
            <span className="text-xs bg-teal-50 text-teal-600 px-2 py-1 rounded border border-teal-100 mt-2">{model}</span>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-xl w-fit mb-6 no-print">
        <button
          onClick={() => { setMode('upload'); setAnalysis(''); }}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all ${mode === 'upload' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <ImageIcon size={18} />
          <span>رفع صورة</span>
        </button>
        <button
          onClick={() => { setMode('text'); setAnalysis(''); }}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all ${mode === 'text' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <Type size={18} />
          <span>وصف نصي</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
        {/* Input Section */}
        <div className="space-y-4 no-print">
          
          {mode === 'upload' ? (
            // Upload Mode UI
            <>
              <div className={`relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all bg-white h-80 ${selectedImage ? 'border-teal-500 bg-teal-50' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'}`}>
                {selectedImage ? (
                  <>
                    <img src={selectedImage} alt="Uploaded X-Ray" className="max-h-full max-w-full object-contain rounded-lg shadow-sm" />
                    <button 
                      onClick={handleClearImage}
                      className="absolute top-4 right-4 bg-white/90 text-red-500 p-2 rounded-full shadow-md hover:bg-red-50"
                    >
                      <X size={20} />
                    </button>
                  </>
                ) : (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="cursor-pointer text-center w-full h-full flex flex-col items-center justify-center"
                  >
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                      <Upload size={28} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-700">اضغط لرفع صورة</h3>
                    <p className="text-sm text-slate-500 mt-2">PNG, JPG</p>
                  </div>
                )}
                <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
              </div>
              <input
                type="text"
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                placeholder="سياق إضافي (مثال: ذكر 50 سنة، مدخن...)"
                className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-teal-500 text-sm"
              />
            </>
          ) : (
            // Text Mode UI
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-fit">
               <label className="block text-sm font-semibold text-slate-700 mb-3">وصف النتيجة الشعاعية</label>
               <textarea
                 value={textDescription}
                 onChange={(e) => setTextDescription(e.target.value)}
                 placeholder="مثال: وجود كثافة متجانسة في الفص السفلي للرئة اليمنى مع زوال الزاوية الضلعية الحجابية..."
                 className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all h-64 bg-slate-50 resize-none leading-relaxed"
               />
               <p className="text-xs text-slate-400 mt-2">يمكنك نسخ ولصق تقارير الأشعة هنا للحصول على شرح مبسط.</p>
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={loading || (mode === 'upload' && !selectedImage) || (mode === 'text' && !textDescription)}
            className="w-full mt-4 bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="animate-spin" /> : <ScanEye size={20} />}
            <span>{mode === 'upload' ? 'تحليل الصورة' : 'تفسير الوصف'}</span>
          </button>
        </div>

        {/* Results Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col h-full min-h-[500px]">
          <div className="flex justify-between items-center mb-4 no-print">
             <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
               <Activity size={20} className="text-teal-500" />
               التقرير والتفسير
             </h3>
             {analysis && (
                <button onClick={handlePrint} className="text-slate-400 hover:text-red-600 transition-colors" title="حفظ PDF">
                  <Printer size={20} />
                </button>
             )}
          </div>
          
          <div className="flex-1 bg-slate-50 rounded-xl p-6 overflow-y-auto">
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center space-y-4 no-print">
                 <Loader2 size={40} className="text-teal-500 animate-spin" />
                 <p className="text-slate-500 animate-pulse">جاري معالجة البيانات...</p>
              </div>
            ) : analysis ? (
              <div id="printable-area" className="bg-white p-2">
                  <div className="mb-4 text-center border-b pb-4">
                      <h2 className="text-xl font-bold">تقرير مختبر الأشعة</h2>
                      <p className="text-sm text-gray-500">د. شادي - السنة الرابعة</p>
                   </div>
                  {mode === 'upload' && selectedImage && (
                    <div className="mb-4 flex justify-center">
                       <img src={selectedImage} className="max-h-64 rounded-lg border border-slate-200" alt="Radiology Scan" />
                    </div>
                  )}
                  <div className="prose prose-sm prose-slate max-w-none dir-rtl">
                    <ReactMarkdown>{analysis}</ReactMarkdown>
                  </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center no-print">
                <p>بانتظار المدخلات...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple Icon component used locally
const Activity = ({size, className}: {size: number, className?: string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
)

export default ImagingTool;