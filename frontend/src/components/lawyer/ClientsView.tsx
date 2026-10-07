import React from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { Users, Phone, Mail, Briefcase, ArrowRight } from 'lucide-react';

export const ClientsView: React.FC = () => {
  const { cases, setSelectedCaseId, setActiveLawyerNav, setActiveCaseTab, setIsViewingCaseDetail } = useApp();

  const clientsMap = new Map<string, { name: string; cases: string[]; caseId: string }>();

  cases.forEach((c) => {
    if (!clientsMap.has(c.clientName)) {
      clientsMap.set(c.clientName, {
        name: c.clientName,
        cases: [c.title],
        caseId: c.id,
      });
    } else {
      clientsMap.get(c.clientName)?.cases.push(c.title);
    }
  });

  const clients = Array.from(clientsMap.values());

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">รายชื่อลูกความ</h1>
        <p className="text-slate-500 text-sm mt-0.5">
          ลูกความทั้งหมดที่กำลังติดต่อและมีคดีความในระบบ
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {clients.map((client, i) => (
          <div
            key={i}
            onClick={() => {
              setSelectedCaseId(client.caseId);
              setIsViewingCaseDetail(true);
              setActiveLawyerNav('cases');
              setActiveCaseTab('overview');
            }}
            className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs hover:border-indigo-300 transition cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 font-bold text-sm flex items-center justify-center">
                  {client.name.slice(0, 2)}
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 group-hover:text-indigo-600 transition">
                    {client.name}
                  </h3>
                  <span className="text-xs text-slate-400">ลูกความที่ยืนยันตัวตนแล้ว</span>
                </div>
              </div>

              <div className="text-xs text-slate-600 space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="flex items-center space-x-2">
                  <Briefcase className="w-3.5 h-3.5 text-indigo-500" />
                  <span>คดีที่เกี่ยวข้อง: {client.cases.join(', ')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-3.5 h-3.5 text-emerald-500" />
                  <span>โทร: 081-234-5678</span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-600">
              <span>เปิดดูแฟ้มคดี</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
