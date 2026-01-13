import React from 'react';
import { AppView } from '../types';
import { Stethoscope, Activity, BrainCircuit, FileText, GraduationCap, Microscope, Database, Code } from 'lucide-react';

interface DashboardProps {
  onNavigate: (view: AppView) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const tools = [
    { 
      id: AppView.DIAGNOSIS, 
      title: 'التشخيص التفريقي', 
      desc: 'مساعد ذكي لاقتراح التشخيصات بناءً على الأعراض.',
      icon: Stethoscope,
      color: 'bg-blue-500',
      bg: 'bg-blue-50'
    },
    { 
      id: AppView.CASE_STUDY, 
      title: 'حل الحالات (Interactive)', 
      desc: 'لعبة تعليمية: واجه مريضاً غامضاً، اطلب فحوصات، وشخص الحالة.',
      icon: Microscope,
      color: 'bg-purple-500',
      bg: 'bg-purple-50'
    },
    { 
      id: AppView.IMAGING, 
      title: 'مختبر الأشعة', 
      desc: 'تحليل الصور وتقديم تفسيرات للتقارير النصية للأشعة.',
      icon: Activity,
      color: 'bg-teal-500',
      bg: 'bg-teal-50'
    },
    { 
      id: AppView.PATIENT_DB, 
      title: 'سجل الحالات', 
      desc: 'قاعدة بيانات محلية لحفظ ومراجعة حالات المرضى.',
      icon: Database,
      color: 'bg-orange-500',
      bg: 'bg-orange-50'
    },
    { 
      id: AppView.SIMULATION, 
      title: 'المحاكاة (أخذ التاريخ)', 
      desc: 'تدرب على مهارات التواصل وأخذ التاريخ المرضي (History Taking).',
      icon: BrainCircuit,
      color: 'bg-indigo-500',
      bg: 'bg-indigo-50'
    },
    { 
      id: AppView.REPORTS, 
      title: 'كاتب التقارير', 
      desc: 'توليد تقارير SOAP Notes وتصديرها كملفات PDF.',
      icon: FileText,
      color: 'bg-emerald-500',
      bg: 'bg-emerald-50'
    },
  ];

  return (
    <div className="max-w-6xl mx-auto py-4 md:py-8">
      {/* Hero Section - Mobile Optimized */}
      <div className="bg-gradient-to-l from-blue-900 to-slate-900 rounded-2xl md:rounded-3xl p-6 md:p-8 mb-6 md:mb-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-3 md:mb-4">
            <GraduationCap className="text-blue-300 w-6 h-6 md:w-8 md:h-8" />
            <span className="bg-blue-500/30 px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[10px] md:text-xs font-medium border border-blue-400/30">المستوى الرابع - باطنة عامة</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4 leading-tight">أهلاً بك، د. شادي</h1>
          <p className="text-blue-100 max-w-xl text-sm md:text-lg leading-relaxed mb-4 md:mb-6">
            حقيبتك الطبية الذكية تم تحديثها. جرب الآن أداة <b>حل الحالات التفاعلية</b> الجديدة وقاعدة البيانات الشخصية.
            <br/><span className="text-[10px] md:text-sm opacity-70 mt-2 block">* تذكر: هذه الأدوات للدعم التعليمي فقط وليست بديلاً عن الرأي الطبي المختص.</span>
          </p>
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[10px] md:text-xs text-blue-200">
             <Code size={12} />
             <span>تطوير: عبدالحق.عبدالحق</span>
          </div>
        </div>
      </div>

      {/* Grid - Mobile Optimized */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 pb-20 md:pb-0">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <button
              key={tool.id}
              onClick={() => onNavigate(tool.id)}
              className="group bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-right flex items-start gap-4 h-full active:scale-95"
            >
              <div className={`${tool.color} w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                <Icon size={24} className="md:w-7 md:h-7" />
              </div>
              <div>
                <h3 className="text-base md:text-lg font-bold text-slate-800 mb-1 md:mb-2 group-hover:text-blue-700 transition-colors">{tool.title}</h3>
                <p className="text-slate-500 text-xs md:text-sm leading-relaxed">{tool.desc}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;