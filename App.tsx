import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import DiagnosisTool from './components/DiagnosisTool';
import ImagingTool from './components/ImagingTool';
import SimulationTool from './components/SimulationTool';
import ReportTool from './components/ReportTool';
import CaseStudyTool from './components/CaseStudyTool';
import PatientDatabase from './components/PatientDatabase';
import { AppView, GeminiModel } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [selectedModel, setSelectedModel] = useState<GeminiModel>('gemini-2.5-flash-lite');

  const renderContent = () => {
    switch (currentView) {
      case AppView.DASHBOARD:
        return <Dashboard onNavigate={setCurrentView} />;
      case AppView.DIAGNOSIS:
        return <DiagnosisTool model={selectedModel} />;
      case AppView.IMAGING:
        return <ImagingTool model={selectedModel} />;
      case AppView.SIMULATION:
        return <SimulationTool model={selectedModel} />;
      case AppView.CASE_STUDY:
        return <CaseStudyTool model={selectedModel} />;
      case AppView.PATIENT_DB:
        return <PatientDatabase />;
      case AppView.REPORTS:
        return <ReportTool model={selectedModel} />;
      default:
        return <Dashboard onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Sidebar 
        currentView={currentView} 
        onChangeView={setCurrentView} 
        selectedModel={selectedModel}
        onSelectModel={setSelectedModel}
      />
      
      {/* Main Content Area: Added print:mr-0 print:p-0 to reset layout during print */}
      <main className="flex-1 mr-16 md:mr-64 print:mr-0 p-4 md:p-8 print:p-0 transition-all duration-300 w-full overflow-x-hidden">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;