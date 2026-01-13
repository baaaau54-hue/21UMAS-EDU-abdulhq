import React, { useState } from 'react';
import { generateReport } from '../services/geminiService';
import { FileText, Copy, Check, Printer, Settings, LayoutTemplate, AlignRight, AlignLeft, Calendar, User, Building, ArrowRightLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { GeminiModel } from '../types';

interface Props {
  model: GeminiModel;
}

type TemplateType = 'modern' | 'classic' | 'academic';
type TextDirection = 'rtl' | 'ltr';

const ReportTool: React.FC<Props> = ({ model }) => {
  const [notes, setNotes] = useState('');
  const [report, setReport] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Customization State
  const [template, setTemplate] = useState<TemplateType>('modern');
  const [direction, setDirection] = useState<TextDirection>('rtl');
  const [headerInfo, setHeaderInfo] = useState({
    doctorName: 'د. شادي',
    clinicName: 'جامعة 21 سبتمبر - كلية الطب',
    date: new Date().toISOString().split('T')[0],
  });
  const [showSettings, setShowSettings] = useState(true);

  const handleGenerate = async () => {
    if (!notes) return;
    setLoading(true);
    const result = await generateReport(notes, model);
    setReport(result);
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  // --- Template Components ---

  const ModernHeader = () => (
    <div className="mb-6">
      <div className="bg-emerald-600 text-white p-6 rounded-t-lg shadow-sm print:shadow-none">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold mb-1">{headerInfo.clinicName}</h1>
            <p className="text-emerald-100 text-sm">قسم الباطنة العامة</p>
          </div>
          <div className="text-left rtl:text-left ltr:text-right">
             <div className="bg-white/20 px-3 py-1 rounded text-sm backdrop-blur-sm inline-block">
                {headerInfo.date}
             </div>
          </div>
        </div>
      </div>
      <div className="bg-emerald-50 p-4 border-b-2 border-emerald-600 flex justify-between items-center text-emerald-900">
         <div className="flex items-center gap-2 font-bold">
            <User size={18}/>
            <span>الطبيب المعالج: {headerInfo.doctorName}</span>
         </div>
         <div className="text-xs uppercase tracking-wider font-semibold opacity-70">Medical Report</div>
      </div>
    </div>
  );

  const ClassicHeader = () => (
    <div className="mb-8 text-center border-b-4 border-double border-slate-800 pb-6 pt-4">
      <h1 className="text-3xl font-serif font-bold text-slate-900 mb-2">{headerInfo.clinicName}</h1>
      <p className="text-slate-600 font-serif mb-4">تقرير طبي رسمي | Official Medical Report</p>
      <div className="flex justify-center gap-8 text-sm font-medium text-slate-700">
        <span>د. {headerInfo.doctorName}</span>
        <span>|</span>
        <span>{headerInfo.date}</span>
      </div>
    </div>
  );

  const AcademicHeader = () => (
    <div className="mb-6 border border-slate-300 p-4 rounded-lg bg-slate-50">
       <div className="grid grid-cols-2 gap-4 mb-4 border-b border-slate-200 pb-4">
          <div>
             <span className="block text-xs text-slate-500 mb-1">المنشأة التعليمية</span>
             <span className="font-bold text-slate-800">{headerInfo.clinicName}</span>
          </div>
          <div className="text-left rtl:text-left ltr:text-right">
             <span className="block text-xs text-slate-500 mb-1">التاريخ</span>
             <span className="font-bold text-slate-800">{headerInfo.date}</span>
          </div>
       </div>
       <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 bg-white border px-2 py-1 rounded">الطالب المناوب</span>
          <span className="font-bold text-indigo-700">{headerInfo.doctorName} - المستوى الرابع</span>
       </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <header className="mb-4 no-print">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <span className="w-2 h-8 bg-emerald-600 rounded-full"></span>
          منشئ التقارير الطبية (SOAP Note)
        </h2>
        <div className="flex items-center gap-2 flex-wrap">
           <p className="text-slate-500 mt-2 text-sm">خصص ترويسة التقرير، اختر القالب، واطبع كملف PDF احترافي.</p>
           <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 rounded border border-emerald-100 mt-2">{model}</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Settings & Input Column */}
        <div className="lg:col-span-4 space-y-4 no-print order-2 lg:order-1">
          
          {/* Customization Panel */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
            <button 
               onClick={() => setShowSettings(!showSettings)}
               className="flex items-center justify-between w-full text-slate-800 font-bold"
            >
              <div className="flex items-center gap-2">
                 <Settings size={18} className="text-emerald-600"/>
                 <span>إعدادات التقرير</span>
              </div>
              <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                {showSettings ? 'إخفاء' : 'إظهار'}
              </span>
            </button>
            
            {showSettings && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-2 mt-4">
                <div>
                   <label className="text-xs font-semibold text-slate-500 mb-1 block">اسم الطبيب / الطالب</label>
                   <div className="relative">
                      <User size={14} className="absolute top-3 right-3 text-slate-400" />
                      <input 
                        type="text" 
                        value={headerInfo.doctorName}
                        onChange={(e) => setHeaderInfo({...headerInfo, doctorName: e.target.value})}
                        className="w-full pl-3 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-emerald-500 outline-none"
                      />
                   </div>
                </div>
                <div>
                   <label className="text-xs font-semibold text-slate-500 mb-1 block">اسم العيادة / الكلية</label>
                   <div className="relative">
                      <Building size={14} className="absolute top-3 right-3 text-slate-400" />
                      <input 
                        type="text" 
                        value={headerInfo.clinicName}
                        onChange={(e) => setHeaderInfo({...headerInfo, clinicName: e.target.value})}
                        className="w-full pl-3 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-emerald-500 outline-none"
                      />
                   </div>
                </div>
                <div>
                   <label className="text-xs font-semibold text-slate-500 mb-1 block">التاريخ</label>
                   <div className="relative">
                      <Calendar size={14} className="absolute top-3 right-3 text-slate-400" />
                      <input 
                        type="date" 
                        value={headerInfo.date}
                        onChange={(e) => setHeaderInfo({...headerInfo, date: e.target.value})}
                        className="w-full pl-3 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-emerald-500 outline-none"
                      />
                   </div>
                </div>
                
                <div className="border-t border-slate-100 pt-3">
                   <label className="text-xs font-semibold text-slate-500 mb-2 block flex items-center gap-1">
                      <LayoutTemplate size={14}/>
                      نمط القالب
                   </label>
                   <div className="grid grid-cols-3 gap-2">
                      <button 
                        onClick={() => setTemplate('modern')}
                        className={`text-xs p-2 rounded border text-center transition-all ${template === 'modern' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                      >
                        حديث
                      </button>
                      <button 
                        onClick={() => setTemplate('classic')}
                        className={`text-xs p-2 rounded border text-center transition-all ${template === 'classic' ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                      >
                        رسمي
                      </button>
                      <button 
                        onClick={() => setTemplate('academic')}
                        className={`text-xs p-2 rounded border text-center transition-all ${template === 'academic' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                      >
                        أكاديمي
                      </button>
                   </div>
                </div>

                <div className="border-t border-slate-100 pt-3">
                   <label className="text-xs font-semibold text-slate-500 mb-2 block">اتجاه النص</label>
                   <div className="flex bg-slate-100 p-1 rounded-lg">
                      <button 
                        onClick={() => setDirection('rtl')}
                        className={`flex-1 flex items-center justify-center gap-1 text-xs py-1.5 rounded-md transition-all ${direction === 'rtl' ? 'bg-white shadow text-slate-800' : 'text-slate-500'}`}
                      >
                        <AlignRight size={14}/>
                        <span>العربية (RTL)</span>
                      </button>
                      <button 
                        onClick={() => setDirection('ltr')}
                        className={`flex-1 flex items-center justify-center gap-1 text-xs py-1.5 rounded-md transition-all ${direction === 'ltr' ? 'bg-white shadow text-slate-800' : 'text-slate-500'}`}
                      >
                        <AlignLeft size={14}/>
                        <span>English (LTR)</span>
                      </button>
                   </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col min-h-[300px]">
            <label className="text-sm font-semibold text-slate-700 mb-2 block">الملاحظات الطبية</label>
            <textarea
              className="flex-1 w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none resize-none bg-slate-50 text-sm leading-relaxed"
              placeholder={direction === 'rtl' ? "اكتب الأعراض، الفحص، والتشخيص هنا..." : "Enter symptoms, exam findings, and plan..."}
              dir={direction}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <button
              onClick={handleGenerate}
              disabled={loading || !notes}
              className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 transition-all shadow-lg shadow-emerald-200"
            >
              {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <FileText size={20} />}
              <span>إنشاء التقرير</span>
            </button>
          </div>
        </div>

        {/* Preview & Print Column */}
        <div className="lg:col-span-8 order-1 lg:order-2">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full min-h-[500px] md:min-h-[600px] overflow-hidden">
            <div className="flex flex-col md:flex-row justify-between items-center p-4 border-b border-slate-100 bg-slate-50 no-print gap-3">
               <h3 className="font-bold text-slate-800 flex items-center gap-2">
                 <FileText size={18} className="text-emerald-500"/>
                 معاينة التقرير (Live Preview)
               </h3>
               <div className="flex gap-2 w-full md:w-auto">
                 {report && (
                   <>
                     <button onClick={handlePrint} className="flex-1 md:flex-none justify-center flex items-center gap-2 bg-slate-800 text-white hover:bg-slate-700 px-4 py-2 rounded-lg text-xs font-bold transition-colors shadow-lg shadow-slate-200" title="حفظ كـ PDF">
                       <Printer size={16} />
                       <span>طباعة PDF</span>
                     </button>
                     <button onClick={handleCopy} className="text-slate-400 hover:text-emerald-600 transition-colors p-2 bg-white border border-slate-200 rounded-lg" title="نسخ النص">
                       {copied ? <Check size={18} className="text-emerald-600" /> : <Copy size={18} />}
                     </button>
                   </>
                 )}
               </div>
            </div>
            
            {/* 
                PREVIEW CONTAINER:
                On mobile, this container is scrollable horizontally to allow the user 
                to see the FULL A4 width.
                IN PRINT: We remove these constraints via CSS overrides in index.html to fit the page.
            */}
            <div className="flex-1 bg-slate-200/50 p-4 md:p-8 overflow-x-auto relative scrollbar-hide">
              {report ? (
                <>
                    <div className="md:hidden text-center text-[10px] text-slate-400 mb-2 flex items-center justify-center gap-1 no-print">
                        <ArrowRightLeft size={12}/>
                        <span>اسحب لرؤية كامل الصفحة</span>
                    </div>
                    <div 
                    id="printable-area" 
                    className={`mx-auto bg-white shadow-xl print:shadow-none min-h-[29.7cm] p-[1.5cm] relative transition-all duration-300 min-w-[210mm] w-[210mm] print:min-w-0 print:w-full`}
                    dir={direction}
                    >
                    {/* Template Header */}
                    {template === 'modern' && <ModernHeader />}
                    {template === 'classic' && <ClassicHeader />}
                    {template === 'academic' && <AcademicHeader />}

                    {/* Body */}
                    <div className={`prose prose-sm max-w-none ${template === 'modern' ? 'prose-emerald' : 'prose-slate'}`}>
                        <ReactMarkdown>{report}</ReactMarkdown>
                    </div>

                    {/* Footer */}
                    <div className="mt-12 pt-6 border-t border-slate-100 text-center text-xs text-slate-400 print-break-inside-avoid">
                        <p>تم إنشاء هذا التقرير إلكترونياً باستخدام حقيبة د. شادي الذكية.</p>
                        <p>{new Date().toLocaleTimeString()} - {headerInfo.clinicName}</p>
                    </div>
                    </div>
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 text-sm no-print min-h-[300px]">
                  <FileText size={48} className="mb-4 opacity-20" />
                  <p>سيظهر التقرير هنا بالشكل النهائي القابل للطباعة.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportTool;