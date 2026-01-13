import React, { useState, useEffect } from 'react';
import { PatientRecord } from '../types';
import { Plus, Search, FileText, Calendar, User, Trash2, ChevronDown, ChevronUp, Printer } from 'lucide-react';

const PatientDatabase: React.FC = () => {
  const [patients, setPatients] = useState<PatientRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Form State
  const [newPatient, setNewPatient] = useState<Partial<PatientRecord>>({
    gender: 'ذكر',
    date: new Date().toISOString().split('T')[0]
  });

  // Load from local storage on mount
  useEffect(() => {
    const stored = localStorage.getItem('dr_shadi_patients');
    if (stored) {
      setPatients(JSON.parse(stored));
    }
  }, []);

  // Save to local storage whenever patients change
  useEffect(() => {
    localStorage.setItem('dr_shadi_patients', JSON.stringify(patients));
  }, [patients]);

  const handleAddPatient = () => {
    if (!newPatient.symptoms || !newPatient.finalDiagnosis) return;

    const record: PatientRecord = {
      id: crypto.randomUUID(),
      name: newPatient.name || 'مجهول',
      age: newPatient.age || '-',
      gender: newPatient.gender as 'ذكر' | 'أنثى',
      symptoms: newPatient.symptoms || '',
      physicalExam: newPatient.physicalExam || '',
      radiology: newPatient.radiology || '',
      initialDiagnosis: newPatient.initialDiagnosis || '',
      finalDiagnosis: newPatient.finalDiagnosis || '',
      treatmentPlan: newPatient.treatmentPlan || '',
      date: newPatient.date || new Date().toISOString().split('T')[0],
    };

    setPatients([record, ...patients]);
    setShowAddModal(false);
    setNewPatient({ gender: 'ذكر', date: new Date().toISOString().split('T')[0] });
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('هل أنت متأكد من حذف هذا السجل؟')) {
      setPatients(patients.filter(p => p.id !== id));
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredPatients = patients.filter(p => 
    p.name.includes(searchTerm) || 
    p.finalDiagnosis.includes(searchTerm) ||
    p.symptoms.includes(searchTerm)
  );

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-100px)] flex flex-col">
      <header className="mb-6 flex justify-between items-end no-print">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <span className="w-2 h-8 bg-orange-500 rounded-full"></span>
            قاعدة بيانات المرضى
          </h2>
          <p className="text-slate-500 mt-2 text-sm">أرشيف الحالات التعليمية (يتم الحفظ محلياً على المتصفح).</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-bold shadow-lg shadow-orange-100 transition-all"
        >
          <Plus size={20} />
          <span>إضافة حالة</span>
        </button>
      </header>

      {/* Search Bar */}
      <div className="relative mb-6 no-print">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input 
          type="text" 
          placeholder="بحث بالاسم، التشخيص، أو الأعراض..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-xl py-3 pr-12 pl-4 focus:ring-2 focus:ring-orange-500 outline-none transition-all shadow-sm"
        />
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-10">
        {filteredPatients.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <FileText size={48} className="mx-auto mb-4 opacity-20" />
            <p>لا توجد سجلات مطابقة.</p>
          </div>
        ) : (
          filteredPatients.map(patient => (
            <div key={patient.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden print:border-none print:shadow-none">
              <div 
                className="p-4 flex items-center justify-between cursor-pointer bg-slate-50/50 no-print"
                onClick={() => setExpandedId(expandedId === patient.id ? null : patient.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-200 text-slate-500 rounded-full flex items-center justify-center font-bold">
                    <User size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">{patient.name}</h3>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                      <span className="bg-white px-2 py-0.5 rounded border border-slate-200">{patient.gender}, {patient.age} سنة</span>
                      <span className="flex items-center gap-1"><Calendar size={12}/> {patient.date}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="hidden md:inline-block px-3 py-1 bg-orange-50 text-orange-700 text-sm font-medium rounded-full border border-orange-100">
                    {patient.finalDiagnosis}
                  </span>
                  <button onClick={(e) => handleDelete(patient.id, e)} className="text-slate-400 hover:text-red-500 p-2">
                    <Trash2 size={18} />
                  </button>
                  {expandedId === patient.id ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
                </div>
              </div>

              {expandedId === patient.id && (
                <div id="printable-area" className="p-6 border-t border-slate-100 bg-white relative print:border-none print:p-0">
                  <button 
                    onClick={() => handlePrint()}
                    className="absolute top-4 left-4 text-slate-400 hover:text-orange-600 flex items-center gap-1 text-xs border border-slate-200 rounded px-2 py-1 no-print"
                  >
                     <Printer size={14} />
                     طباعة السجل
                  </button>

                  {/* Print Header */}
                  <div className="text-center mb-8 border-b-2 border-orange-100 pb-6">
                     <div className="flex justify-between items-end mb-4 print:mb-8">
                        <div className="text-right">
                           <h2 className="text-2xl font-bold text-slate-800">سجل حالة طبية</h2>
                           <p className="text-slate-500 text-sm">Patient Medical Record</p>
                        </div>
                        <div className="text-left text-sm text-slate-500">
                           <p className="font-bold text-slate-800">{patient.date}</p>
                           <p>حقيبة د. شادي</p>
                        </div>
                     </div>
                     <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 grid grid-cols-3 gap-4 text-center">
                        <div>
                           <span className="block text-xs text-slate-400">الاسم</span>
                           <span className="font-bold text-slate-800">{patient.name}</span>
                        </div>
                        <div>
                           <span className="block text-xs text-slate-400">العمر / الجنس</span>
                           <span className="font-bold text-slate-800">{patient.age} / {patient.gender}</span>
                        </div>
                        <div>
                           <span className="block text-xs text-slate-400">رقم الملف</span>
                           <span className="font-mono text-slate-600 text-xs">{patient.id.slice(0,8)}</span>
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 text-sm">
                    <div className="print:break-inside-avoid">
                      <h4 className="font-bold text-slate-700 mb-2 border-b border-slate-100 pb-1 inline-block">الشكوى الرئيسية والأعراض (HPI)</h4>
                      <p className="text-slate-800 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100 print:bg-transparent print:border-none print:p-0">{patient.symptoms}</p>
                    </div>
                    
                    {patient.physicalExam && (
                        <div className="print:break-inside-avoid">
                        <h4 className="font-bold text-slate-700 mb-2 border-b border-slate-100 pb-1 inline-block">الفحص السريري (Physical Exam)</h4>
                        <p className="text-slate-800 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100 print:bg-transparent print:border-none print:p-0">{patient.physicalExam}</p>
                        </div>
                    )}

                    {patient.radiology && (
                        <div className="print:break-inside-avoid">
                        <h4 className="font-bold text-slate-700 mb-2 border-b border-slate-100 pb-1 inline-block">النتائج المخبرية والشعاعية (Investigation)</h4>
                        <p className="text-slate-800 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100 print:bg-transparent print:border-none print:p-0">{patient.radiology}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-2 mt-4">
                        <div className="bg-orange-50/50 p-4 rounded-lg border border-orange-100 print:bg-transparent print:border-2 print:border-slate-200">
                           <h4 className="font-bold text-orange-800 mb-2">القرار التشخيصي (Diagnosis)</h4>
                           <p className="text-lg font-bold text-slate-800">{patient.finalDiagnosis}</p>
                        </div>
                        <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100 print:bg-transparent print:border-2 print:border-slate-200">
                           <h4 className="font-bold text-blue-800 mb-2">خطة العلاج (Plan)</h4>
                           <p className="text-slate-800">{patient.treatmentPlan}</p>
                        </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 pt-8 border-t border-slate-100 text-center text-xs text-slate-400 hidden print:block">
                     تم إنشاء هذا السجل إلكترونياً ولا يحتاج إلى توقيع في الأغراض التعليمية.
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 backdrop-blur-sm no-print">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
            <h3 className="text-xl font-bold mb-6 text-slate-800 border-b pb-2">إضافة سجل مريض جديد</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">الاسم (اختياري)</label>
                <input type="text" className="w-full p-2 border rounded-lg" value={newPatient.name || ''} onChange={e => setNewPatient({...newPatient, name: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">العمر</label>
                    <input type="text" className="w-full p-2 border rounded-lg" value={newPatient.age || ''} onChange={e => setNewPatient({...newPatient, age: e.target.value})} />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">الجنس</label>
                    <select className="w-full p-2 border rounded-lg" value={newPatient.gender} onChange={e => setNewPatient({...newPatient, gender: e.target.value as any})}>
                      <option>ذكر</option>
                      <option>أنثى</option>
                    </select>
                 </div>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">الشكوى والأعراض الرئيسية *</label>
                <textarea className="w-full p-2 border rounded-lg h-20" value={newPatient.symptoms || ''} onChange={e => setNewPatient({...newPatient, symptoms: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">الفحص السريري</label>
                <textarea className="w-full p-2 border rounded-lg h-16" value={newPatient.physicalExam || ''} onChange={e => setNewPatient({...newPatient, physicalExam: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">الأشعة والفحوصات</label>
                <textarea className="w-full p-2 border rounded-lg h-16" value={newPatient.radiology || ''} onChange={e => setNewPatient({...newPatient, radiology: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">التشخيص النهائي *</label>
                   <input type="text" className="w-full p-2 border rounded-lg" value={newPatient.finalDiagnosis || ''} onChange={e => setNewPatient({...newPatient, finalDiagnosis: e.target.value})} />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">التاريخ</label>
                   <input type="date" className="w-full p-2 border rounded-lg" value={newPatient.date} onChange={e => setNewPatient({...newPatient, date: e.target.value})} />
                 </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">خطة العلاج</label>
                <textarea className="w-full p-2 border rounded-lg h-16" value={newPatient.treatmentPlan || ''} onChange={e => setNewPatient({...newPatient, treatmentPlan: e.target.value})} />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-lg">إلغاء</button>
              <button onClick={handleAddPatient} className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-bold">حفظ السجل</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDatabase;