import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Analyzes symptoms to provide a differential diagnosis.
 */
export const getDifferentialDiagnosis = async (symptoms: string, history: string, modelId: string = 'gemini-2.5-flash-lite'): Promise<string> => {
  try {
    const prompt = `
      أنت مساعد طبي ذكي لطالب طب في السنة الرابعة (د. شادي).
      المادة: الباطنة العامة.
      المهمة: بناءً على الأعراض التالية والتاريخ المرضي، قم بإنشاء تشخيص تفريقي (Differential Diagnosis).
      
      الأعراض: ${symptoms}
      التاريخ المرضي: ${history}
      
      الرجاء تقديم الإجابة بتنسيق منظم:
      1. قائمة التشخيصات المحتملة (الأكثر احتمالاً أولاً).
      2. شرح موجز لسبب كل تشخيص.
      3. الفحوصات المقترحة لتأكيد التشخيص.
      
      تنبيه: أضف إخلاء مسؤولية أن هذا لأغراض تعليمية فقط.
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
    });

    return response.text || "عذراً، لم أتمكن من إنشاء التشخيص في الوقت الحالي.";
  } catch (error) {
    console.error("Diagnosis Error:", error);
    return "حدث خطأ أثناء الاتصال بالخادم الذكي.";
  }
};

/**
 * Simulates a patient for history taking practice.
 */
export const getSimulationResponse = async (history: { role: string; parts: { text: string }[] }[], userMessage: string, modelId: string = 'gemini-2.5-flash-lite'): Promise<string> => {
  try {
    const systemPrompt = `
      أنت مريض "افتراضي" في محاكاة طبية.
      المستخدم هو "د. شادي"، طالب طب سنة رابعة.
      تقمص شخصية مريض يعاني من حالة باطنة (مثل قرحة معدة، ربو، أو قصور قلب - اختر حالة عشوائية أو التزم بالسياق).
      لا تكشف عن تشخيصك فوراً. أجب على أسئلة الدكتور شادي بواقعية (بألم، أو قلق، أو غموض أحياناً).
      ردودك قصيرة وواقعية.
    `;

    const contents = [
      { role: 'user', parts: [{ text: systemPrompt }] },
      ...history,
      { role: 'user', parts: [{ text: userMessage }] }
    ];

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: modelId,
      contents: contents as any,
    });

    return response.text || "...";
  } catch (error) {
    console.error("Simulation Error:", error);
    return "نعتذر، حدث انقطاع في المحاكاة.";
  }
};

/**
 * Analyzes an uploaded medical image (X-Ray, CT, etc.).
 */
export const analyzeImage = async (base64Image: string, promptText: string, modelId: string = 'gemini-2.5-flash-lite'): Promise<string> => {
  try {
    const prompt = `
      أنت أستاذ أشعة مخضرم تساعد د. شادي (طالب طب).
      قم بتحليل هذه الصورة الطبية (أشعة سينية، مقطعية، إلخ).
      1. حدد نوع الصورة والمنطقة المصورة.
      2. صف أي شيء غير طبيعي تراه بوضوح (الكسور، التكثف الرئوي، تضخم القلب، إلخ).
      3. أعطِ تشخيصاً إشعاعياً محتملاً.
      
      سياق إضافي من المستخدم: ${promptText}
      
      تنبيه: هذا لأغراض تعليمية فقط.
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg', 
              data: base64Image
            }
          },
          { text: prompt }
        ]
      }
    });

    return response.text || "لم أتمكن من قراءة الصورة.";
  } catch (error) {
    console.error("Imaging Error:", error);
    return "حدث خطأ أثناء معالجة الصورة. تأكد أن الصورة واضحة وليست كبيرة جداً.";
  }
};

/**
 * Analyzes a text description of radiology findings.
 */
export const analyzeRadiologyText = async (description: string, modelId: string = 'gemini-2.5-flash-lite'): Promise<string> => {
  try {
    const prompt = `
      المهمة: تفسير نتائج أشعة بناءً على الوصف النصي لطالب طب (د. شادي).
      الوصف المقدم: "${description}"
      
      المطلوب:
      1. ترجمة هذه العلامات الشعاعية إلى حالات مرضية محتملة (Differential Diagnosis).
      2. شرح الفيزيولوجيا المرضية باختصار (لماذا تظهر هكذا؟).
      3. ما هي الخطوة التالية؟ (فحوصات لتأكيد الحالة).
      
      استخدم لغة طبية أكاديمية واضحة.
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
    });

    return response.text || "لم أتمكن من تحليل الوصف.";
  } catch (error) {
    console.error("Radiology Text Error:", error);
    return "حدث خطأ في المعالجة.";
  }
};

/**
 * Generates a medical report.
 */
export const generateReport = async (details: string, modelId: string = 'gemini-2.5-flash-lite'): Promise<string> => {
  try {
    const prompt = `
      قم بصياغة تقرير طبي احترافي (SOAP Note) بناءً على الملاحظات التالية.
      الملاحظات: ${details}
      
      التنسيق:
      S (Subjective): ...
      O (Objective): ...
      A (Assessment): ...
      P (Plan): ...
      
      اللغة: العربية (مع استخدام المصطلحات الطبية الإنجليزية بين قوسين عند الضرورة).
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
    });

    return response.text || "فشل إنشاء التقرير.";
  } catch (error) {
    console.error("Report Error:", error);
    return "حدث خطأ.";
  }
};

// --- Interactive Case Study Services ---

/**
 * Starts a new clinical case study.
 */
export const startNewCase = async (modelId: string = 'gemini-2.5-flash-lite'): Promise<string> => {
  try {
    const prompt = `
      قم بإنشاء سيناريو حالة سريرية (Clinical Case) لمادة الباطنة العامة.
      المستوى: طالب طب سنة رابعة.
      الناتج المطلوب:
      فقط أعطني "الشكوى الرئيسية" (Chief Complaint) و "التاريخ المرضي الحالي" (HPI) و "العلامات الحيوية" الأولية.
      لا تذكر التشخيص النهائي.
      اجعل الحالة غامضة قليلاً لتتطلب طلب فحوصات.
    `;
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
    });
    return response.text || "فشل بدء الحالة.";
  } catch (error) {
    return "خطأ في النظام.";
  }
};

/**
 * Processes a specific test request within a case context.
 */
export const performCaseAction = async (caseContext: string, action: string, modelId: string = 'gemini-2.5-flash-lite'): Promise<string> => {
  try {
    const prompt = `
      السياق الحالي للحالة الطبية:
      ${caseContext}

      الإجراء المطلوب من الطالب: "${action}"

      أنت المشرف الطبي (الكمبيوتر).
      إذا كان الإجراء هو طلب فحص (مثل ECG, Chest X-ray, CBC): أعط نتائج واقعية تتماشى مع التشخيص المخفي لهذه الحالة.
      إذا كان الإجراء هو تشخيص مقترح: قيّم التشخيص (صحيح/خاطئ) واشرح السبب.
      
      كن دقيقاً ومختصراً.
    `;
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
    });
    return response.text || "لا توجد نتائج.";
  } catch (error) {
    return "خطأ في تنفيذ الإجراء.";
  }
};
