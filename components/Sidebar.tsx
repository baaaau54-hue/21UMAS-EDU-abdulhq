import React from 'react';
import { AppView, GeminiModel } from '../types';
import { 
  Stethoscope, 
  Activity, 
  FileText, 
  BrainCircuit, 
  LayoutDashboard,
  Database,
  Microscope,
  Code,
  Cpu
} from 'lucide-react';

interface SidebarProps {
  currentView: AppView;
  onChangeView: (view: AppView) => void;
  selectedModel: GeminiModel;
  onSelectModel: (model: GeminiModel) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, selectedModel, onSelectModel }) => {
  const menuItems = [
    { id: AppView.DASHBOARD, label: 'الرئيسية', icon: LayoutDashboard },
    { id: AppView.DIAGNOSIS, label: 'التشخيص التفريقي', icon: Stethoscope },
    { id: AppView.CASE_STUDY, label: 'حل الحالات', icon: Microscope },
    { id: AppView.IMAGING, label: 'مختبر الأشعة', icon: Activity },
    { id: AppView.SIMULATION, label: 'المحاكاة', icon: BrainCircuit },
    { id: AppView.PATIENT_DB, label: 'سجل الحالات', icon: Database },
    { id: AppView.REPORTS, label: 'التقارير', icon: FileText },
  ];

  return (
    <div className="w-16 md:w-64 bg-slate-900 text-white flex flex-col h-screen fixed right-0 top-0 shadow-2xl z-[100] transition-all duration-300 sidebar">
      <div className="p-4 md:p-6 flex items-center justify-center border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-500 rounded-full flex items-center justify-center text-lg md:text-xl font-bold shrink-0 shadow-lg shadow-blue-500/30">
          ش
        </div>
        <h1 className="hidden md:block mr-3 text-lg font-bold text-blue-100 whitespace-nowrap">د. شادي</h1>
      </div>

      <nav className="flex-1 mt-2 md:mt-4 px-2 md:px-4 space-y-2 overflow-y-auto scrollbar-hide pb-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id)}
              className={`w-full flex items-center justify-center md:justify-start p-3 md:p-3 rounded-xl transition-all duration-200 active:scale-95 ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
              title={item.label}
            >
              <Icon size={24} strokeWidth={1.5} className="md:w-6 md:h-6" />
              <span className="hidden md:block mr-3 font-medium text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Model Selector - Responsive Area */}
      <div className="px-2 md:px-4 pb-4 md:pb-4 mt-auto border-t border-slate-800 pt-4 md:border-none md:pt-0 bg-slate-900">
         <div className="hidden md:flex text-xs text-slate-500 mb-1 items-center gap-1">
            <Cpu size={12}/>
            نواة المعالجة (AI Core)
         </div>
         
         {/* Desktop Select */}
         <select 
            value={selectedModel} 
            onChange={(e) => onSelectModel(e.target.value as GeminiModel)}
            className="hidden md:block w-full bg-slate-800 text-slate-300 text-xs p-2 rounded-lg border border-slate-700 outline-none focus:border-blue-500 cursor-pointer hover:bg-slate-700 transition-colors"
         >
            <option value="gemini-2.5-flash-lite">Flash Lite 2.5 (الافتراضي)</option>
            <option value="gemini-3-flash-preview">Gemini 3 Flash</option>
            <option value="gemini-3-pro-preview">Gemini 3 Pro (المتطور)</option>
         </select>

         {/* Mobile Select (Compact CPU Icon with Overlay) */}
         <div className="md:hidden flex flex-col items-center gap-1">
            <div className="relative group flex items-center justify-center w-10 h-10 bg-slate-800 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700 transition-colors border border-slate-700">
                <Cpu size={20} className={selectedModel.includes('pro') ? 'text-purple-400' : 'text-emerald-400'} />
                <select 
                    value={selectedModel} 
                    onChange={(e) => onSelectModel(e.target.value as GeminiModel)}
                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                    title="تغيير نموذج الذكاء الاصطناعي"
                >
                    <option value="gemini-2.5-flash-lite">Lite</option>
                    <option value="gemini-3-flash-preview">Flash</option>
                    <option value="gemini-3-pro-preview">Pro</option>
                </select>
            </div>
            <span className="text-[9px] text-slate-500 font-mono">
                {selectedModel.includes('pro') ? 'PRO' : selectedModel.includes('lite') ? 'LITE' : 'FLASH'}
            </span>
         </div>
      </div>

      <div className="p-4 border-t border-slate-700 bg-slate-900 hidden md:block">
        <div className="text-xs text-slate-500 text-center leading-relaxed">
          جامعة 21 سبتمبر<br/>كلية الطب البشري
          <div className="mt-3 pt-3 border-t border-slate-800">
            <div className="flex items-center justify-center gap-1 text-slate-400 font-semibold mb-1">
              <Code size={12} />
              <span>تطوير</span>
            </div>
            <span className="text-blue-400">عبدالحق.عبدالحق</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;