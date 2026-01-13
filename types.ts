export enum AppView {
  DASHBOARD = 'DASHBOARD',
  DIAGNOSIS = 'DIAGNOSIS',
  IMAGING = 'IMAGING',
  SIMULATION = 'SIMULATION',
  CASE_STUDY = 'CASE_STUDY',
  PATIENT_DB = 'PATIENT_DB',
  REPORTS = 'REPORTS'
}

export type GeminiModel = 'gemini-3-pro-preview' | 'gemini-3-flash-preview' | 'gemini-2.5-flash-lite';

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface DiagnosisResult {
  differential: string[];
  reasoning: string;
  suggestedTests: string[];
}

export interface PatientRecord {
  id: string;
  name: string;
  age: string;
  gender: 'ذكر' | 'أنثى';
  symptoms: string;
  physicalExam: string;
  radiology: string;
  initialDiagnosis: string;
  finalDiagnosis: string;
  treatmentPlan: string;
  date: string;
}
