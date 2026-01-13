import React, { useState, useRef, useEffect } from 'react';
import { getSimulationResponse } from '../services/geminiService';
import { Send, User, Bot, RefreshCw, Printer } from 'lucide-react';
import { GeminiModel } from '../types';

interface Props {
  model: GeminiModel;
}

const SimulationTool: React.FC<Props> = ({ model }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'أهلاً دكتور شادي. أنا المريض "أحمد". جئت اليوم للعيادة لأنني لا أشعر أنني بخير...' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages: Message[] = [...messages, { role: 'user', text: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    // Prepare history for API
    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const responseText = await getSimulationResponse(history, input, model);
    
    setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    setLoading(false);
  };

  const resetSimulation = () => {
    setMessages([{ role: 'model', text: 'أهلاً دكتور شادي. أنا المريض "أحمد". جئت اليوم للعيادة لأنني لا أشعر أنني بخير...' }]);
    setInput('');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col">
      <header className="mb-4 flex justify-between items-center no-print">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <span className="w-2 h-8 bg-indigo-600 rounded-full"></span>
            المحاكاة السريرية (Virtual Patient)
          </h2>
          <div className="flex items-center gap-2">
              <p className="text-slate-500 text-sm">مارس مهارات أخذ التاريخ المرضي (History Taking) مع مريض افتراضي.</p>
              <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 rounded border border-indigo-100">{model}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
             onClick={handlePrint}
             className="bg-white border border-slate-200 text-slate-600 p-2 rounded-lg hover:text-red-600 hover:bg-slate-50 transition-colors"
             title="حفظ المحادثة PDF"
           >
             <Printer size={16} />
           </button>
          <button 
            onClick={resetSimulation}
            className="bg-white border border-slate-200 text-slate-600 p-2 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2 text-sm font-medium"
          >
            <RefreshCw size={16} />
            <span>حالة جديدة</span>
          </button>
        </div>
      </header>

      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
          <div id="printable-area" className="space-y-6 bg-slate-50 p-2">
            <div className="text-center border-b pb-4 mb-4">
                <h3 className="text-xl font-bold">سجل محادثة - محاكاة سريرية</h3>
                <p className="text-gray-500">د. شادي</p>
            </div>
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-start max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mx-2 ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-indigo-500 text-white'}`}>
                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-tl-none' 
                      : 'bg-white text-slate-700 border border-slate-100 rounded-tr-none'
                  }`}>
                    <span className="font-bold block text-xs mb-1 opacity-70">{msg.role === 'user' ? 'د. شادي' : 'المريض'}</span>
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {loading && (
             <div className="flex justify-start no-print">
               <div className="flex items-center gap-2 text-slate-400 bg-white px-4 py-2 rounded-full text-xs shadow-sm">
                 <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                 <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-100"></div>
                 <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-200"></div>
                 جاري الكتابة...
               </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-100 flex gap-2 no-print">
          <input
            type="text"
            className="flex-1 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            placeholder="اكتب سؤالك للمريض هنا..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

interface Message {
  role: 'user' | 'model';
  text: string;
}

export default SimulationTool;