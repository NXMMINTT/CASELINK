import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json());

// Initialize GoogleGenAI server-side with telemetry header as required by Skill
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Fallback rule-based organizer if offline or key unavailable
function ruleBasedExtraction(rawText: string) {
  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
  const events: any[] = [];
  const peopleSet = new Set<string>();
  const docSet = new Set<string>();

  const dateRegex = /(วันที่\s*)?(\d{1,2}\s*(?:มกราคม|กุมภาพันธ์|มีนาคม|เมษายน|พฤษภาคม|มิถุนายน|กรกฎาคม|สิงหาคม|กันยายน|ตุลาคม|พฤศจิกายน|ธันวาคม|ม\.ค\.|ก\.พ\.|มี\.ค\.|เม\.ย\.|พ\.ค\.|มิ\.ย\.|ก\.ค\.|ส\.ค\.|ก\.ย\.|ต\.ค\.|พ\.ย\.|ธ\.ค\.)(?:\s*\d{2,4})?)/g;

  lines.forEach((line, index) => {
    let dateStr = 'ไม่ระบุวันที่';
    const match = line.match(dateRegex);
    if (match) {
      dateStr = match[0].replace(/^วันที่\s*/, '').trim();
    }

    let title = line.replace(dateRegex, '').trim();
    if (title.length > 40) {
      title = title.substring(0, 37) + '...';
    }
    if (!title) title = `เหตุการณ์ที่ ${index + 1}`;

    const linePeople: string[] = [];
    if (line.includes('สมชาย')) { peopleSet.add('นายสมชาย'); linePeople.push('นายสมชาย'); }
    if (line.includes('ABC')) { peopleSet.add('บริษัท ABC'); linePeople.push('บริษัท ABC'); }
    if (line.includes('ผู้ว่าจ้าง')) { peopleSet.add('ผู้ว่าจ้าง'); linePeople.push('ผู้ว่าจ้าง'); }
    if (line.includes('ผู้รับจ้าง')) { peopleSet.add('ผู้รับจ้าง'); linePeople.push('ผู้รับจ้าง'); }

    const lineDocs: string[] = [];
    if (line.includes('สัญญา')) { docSet.add('สัญญาจ้าง / บันทึกข้อตกลง'); lineDocs.push('สัญญาจ้าง / บันทึกข้อตกลง'); }
    if (line.includes('หนังสือเตือน') || line.includes('แจ้งเตือน') || line.includes('โนติส')) {
      docSet.add('หนังสือบอกกล่าวทวงถาม (Notice)'); lineDocs.push('หนังสือบอกกล่าวทวงถาม (Notice)');
    }
    if (line.includes('โอนเงิน') || line.includes('ชำระ') || line.includes('สลิป')) {
      docSet.add('สลิปหลักฐานการโอนเงิน'); lineDocs.push('สลิปหลักฐานการโอนเงิน');
    }
    if (line.includes('แชท') || line.includes('ไลน์')) {
      docSet.add('ภาพบันทึกบทสนทนา (Chat)'); lineDocs.push('ภาพบันทึกบทสนทนา (Chat)');
    }

    events.push({
      id: `ev-${Date.now()}-${index}`,
      title,
      date: dateStr,
      description: line,
      relatedPersonNames: linePeople,
      relatedDocNames: lineDocs,
    });
  });

  const people = Array.from(peopleSet).map((name, i) => ({
    id: `p-${Date.now()}-${i}`,
    name,
    role: name.includes('บริษัท') ? 'คู่กรณี / จำเลย' : 'ลูกความ / โจทก์',
  }));

  const documents = Array.from(docSet).map((name, i) => ({
    id: `doc-${Date.now()}-${i}`,
    name,
    type: name.includes('สัญญา') ? 'สัญญา' : name.includes('Notice') ? 'หนังสือแจ้งเตือน' : 'หลักฐาน',
    date: 'อ้างอิงตามเอกสาร',
  }));

  return {
    events,
    people,
    documents,
    summary: 'จัดระเบียบเหตุการณ์และเอกสารจากข้อความที่ผู้ใช้ระบุโดยไม่ตัดสินผลทางกฎหมาย',
  };
}

// POST endpoint for Mind Map AI Structuring
app.post('/api/ai/structure-case', async (req, res) => {
  const { storyText } = req.body;

  if (!storyText || typeof storyText !== 'string' || !storyText.trim()) {
    return res.status(400).json({ error: 'กรุณากรอกข้อความเหตุการณ์' });
  }

  // If Gemini is available, run structure extraction
  if (ai) {
    try {
      const prompt = `
คุณคือผู้ช่วยจัดระเบียบข้อมูลคดีสำหรับแอปพลิเคชัน CASELINK สำหรับทนายความ

ข้อกำหนดสำคัญมาก (Strict Non-Negotiable Instructions):
1. คุณไม่ใช่ AI Lawyer และ "ห้าม" ให้คำปรึกษาทางกฎหมาย ห้ามสรุปว่าใครถูกหรือผิด และห้ามทำนายผลคดีเด็ดขาด
2. คุณมีหน้าที่เพียง "จัดโครงสร้างข้อมูลที่ผู้ใช้พิมพ์มาให้เป็นระเบียบ" (Extract & Organize)
3. ห้ามแต่งเติมหรือสร้างข้อเท็จจริงใหม่ที่ไม่มีในข้อความ
4. สกัดข้อมูลออกเป็น:
   - events: ลำดับเหตุการณ์ (title: สั้นกระชับ, date: วันที่ที่ระบุ, description: เนื้อหาเหตุการณ์, relatedPersonNames: บุคคลที่เกี่ยวข้อง, relatedDocNames: เอกสารที่เกี่ยวข้อง)
   - people: บุคคลหรือนิติบุคคลที่ระบุ (name: ชื่อ, role: บทบาท เช่น ผู้ว่าจ้าง, บริษัทคู่สัญญา, ผู้ค้ำประกัน ฯลฯ)
   - documents: เอกสารหรือหลักฐานที่ถูกอ้างอิงถึง (name: ชื่อเอกสาร, type: ประเภทเอกสาร เช่น สัญญา, หนังสือบอกกล่าว, สลิปโอนเงิน)
   - summary: สรุปข้อความสั้นๆ 1-2 บรรทัดตามข้อเท็จจริงเท่านั้น

ข้อความเหตุการณ์ที่ผู้ใช้ป้อน:
"""
${storyText}
"""
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: 'คุณคือระบบจัดหมวดหมู่ข้อมูลข้อเท็จจริงในคดีความสำหรับทนายความ ไม่ตัดสินทางกฎหมาย ไม่สร้างข้อมูลเท็จ ให้คืนค่าเป็น JSON โครงสร้างตามที่กำหนดเท่านั้น',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              events: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    title: { type: Type.STRING },
                    date: { type: Type.STRING },
                    description: { type: Type.STRING },
                    relatedPersonNames: { type: Type.ARRAY, items: { type: Type.STRING } },
                    relatedDocNames: { type: Type.ARRAY, items: { type: Type.STRING } },
                  },
                  required: ['title', 'date', 'description'],
                },
              },
              people: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    name: { type: Type.STRING },
                    role: { type: Type.STRING },
                  },
                  required: ['name', 'role'],
                },
              },
              documents: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    name: { type: Type.STRING },
                    type: { type: Type.STRING },
                    date: { type: Type.STRING },
                  },
                  required: ['name', 'type'],
                },
              },
              summary: { type: Type.STRING },
            },
            required: ['events', 'people', 'documents', 'summary'],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json({ success: true, data: parsed });
    } catch (err: any) {
      console.warn('Gemini API call failed, falling back to rule-based parser:', err?.message || err);
      const fallbackData = ruleBasedExtraction(storyText);
      return res.json({ success: true, data: fallbackData, isFallback: true });
    }
  }

  // If no API key configured, use intelligent rule-based extraction
  const fallbackData = ruleBasedExtraction(storyText);
  return res.json({ success: true, data: fallbackData, isFallback: true });
});

// POST endpoint for AI Post-Case Analysis and Learning
app.post('/api/ai/post-case-analysis', async (req, res) => {
  const { caseData, courtVerdict } = req.body;

  if (!caseData) {
    return res.status(400).json({ error: 'ไม่พบข้อมูลคดี' });
  }

  const eventsSummary = (caseData.events || []).map((e: any) => `- ${e.date}: ${e.title} (${e.description})`).join('\n');
  const docsSummary = (caseData.documents || []).map((d: any) => `- ${d.title} (ประเภท: ${d.type}, สถานะ: ${d.status})`).join('\n');
  const lawsSummary = (caseData.legalLaws || []).map((l: any) => `- ${l.code}: ${l.title}`).join('\n');
  const stratsSummary = (caseData.strategies || []).map((s: any) => `- ${s.title} (${s.side === 'our_claim' ? 'ฝ่ายเรา' : 'ฝ่ายคู่กรณี'}): ${s.keyArgument}`).join('\n');

  if (ai) {
    try {
      const prompt = `
คุณคือผู้ช่วยสรุปและวิเคราะห์ผลการดำเนินคดี (Post-Case Learning & Review) สำหรับสำนักงานกฎหมาย
หน้าที่ของคุณคือ สรุปภาพรวมลำดับเหตุการณ์หลังจบคดี สกัดบทเรียนสำคัญ วิเคราะห์ยุทธวิธี และให้ข้อสังเกตเชิงบรรทัดฐานสำหรับเป็นคลังความรู้ในการทำคดีถัดไป

ข้อมูลคดี:
ชื่อคดี: ${caseData.title}
ประเภทคดี: ${caseData.type}
ลูกความ: ${caseData.clientName}
คำสั่ง/คำพิพากษาของศาล:
- ผลคดี: ${courtVerdict?.verdictResult || 'เสร็จสิ้นคดี'}
- ศาล: ${courtVerdict?.courtName || 'ศาล'}
- หมายเลขคดีแดง: ${courtVerdict?.redCaseNumber || '-'}
- สาระสำคัญคำพิพากษา: ${courtVerdict?.details || '-'}
- ค่าเสียหาย/ผลตอบแทน: ${courtVerdict?.compensationAmount || '-'}
- ระยะเวลาบังคับคดี: ${courtVerdict?.executionDeadline || '-'}

ลำดับเหตุการณ์สำคัญ:
${eventsSummary || 'ไม่มีการบันทึกเหตุการณ์'}

พยานเอกสารและหลักฐาน:
${docsSummary || 'ไม่มีการบันทึกเอกสาร'}

ข้อกฎหมายและยุทธวิธีที่ใช้:
${lawsSummary || '-'}
${stratsSummary || '-'}

กรุณาสรุปและวิเคราะห์ออกมาเป็น JSON โดยมีโครงสร้างดังนี้:
1. summary: สรุปภาพรวมลำดับเหตุการณ์ตั้งแต่เกิดเรื่องจนถึงศาลมีคำสั่ง (3-5 ประโยคที่กระชับ ชัดเจน)
2. keyLearnings: รายการข้อคิด/บทเรียนสำคัญ 3-5 ข้อ (array of string) เช่น เรื่องการรวบรวมพยานหลักฐาน, การส่งหนังสือบอกกล่าว, ความชัดเจนของข้อสัญญา
3. tacticalAnalysis: วิเคราะห์ยุทธวิธีทางคดีและจุดเปลี่ยนสำคัญ (Turning Points) ที่ส่งผลต่อผลคำพิพากษา
4. precedentTakeaways: บรรทัดฐานทางกฎหมายและข้อสังเกตที่สามารถนำไปปรับใช้กับคดีในอนาคต
5. futurePrecautions: ข้อพึงระวังหรือจุดที่ต้องระมัดระวังในการทำคดีลักษณะนี้ (array of string) 2-4 ข้อ
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: 'คุณคือระบบวิเคราะห์สรุปบทเรียนคดีความหลังจบคดี คืนค่าเป็น JSON เท่านั้น',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING },
              keyLearnings: { type: Type.ARRAY, items: { type: Type.STRING } },
              tacticalAnalysis: { type: Type.STRING },
              precedentTakeaways: { type: Type.STRING },
              futurePrecautions: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ['summary', 'keyLearnings', 'tacticalAnalysis', 'precedentTakeaways', 'futurePrecautions'],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      parsed.generatedAt = new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' });
      return res.json({ success: true, data: parsed });
    } catch (err: any) {
      console.warn('Gemini Post-case analysis failed, using fallback:', err?.message || err);
    }
  }

  // Fallback heuristic generator
  const fallback = {
    summary: `คดี "${caseData.title}" (${caseData.type}) ได้มีคำสั่งหรือคำพิพากษาแล้วโดยผลคือ "${courtVerdict?.verdictResult || 'ปิดคดี'}". จากการรวบรวมพยานหลักฐานและข้อเท็จจริงในสำนวนคดี พบว่าลำดับเหตุการณ์และพยานเอกสารสัญญามีความสำคัญอย่างยิ่งในการพิสูจน์ข้อเท็จจริง`,
    keyLearnings: [
      'การจัดลำดับ Timeline เหตุการณ์ที่ละเอียดทำให้ศาลเห็นภาพความสุจริตและเจตนาของคู่สัญญาได้ชัดเจน',
      'ความครบถ้วนของพยานเอกสาร เช่น สัญญา หนังสือบอกกล่าว และหลักฐานการชำระเงิน เป็นหลักฐานชี้ขาดน้ำหนักคดี',
      'การชี้แจงประเด็นข้อต่อสู้ล่วงหน้าช่วยลดข้อโต้แย้งในชั้นไต่สวนได้อย่างมีประสิทธิภาพ'
    ],
    tacticalAnalysis: `ยุทธวิธีในการฟ้องและการต่อสู้คดีนี้อาศัยการยึดพยานเอกสารต้นฉบับเป็นหลักในการสืบพยาน โดยจุดเปลี่ยนสำคัญคือการที่พยานหลักฐานเอกสารมีความสอดคล้องกับพฤติการณ์ในไทม์ไลน์ ทำให้ผลของคำสั่งศาลออกมาเป็น ${courtVerdict?.verdictResult || 'ตามที่ต้องการ'}`,
    precedentTakeaways: `นำไปใช้เป็นแม่แบบในการจัดโครงสร้างพยานหลักฐานสำหรับ ${caseData.type} อื่นๆ โดยเฉพาะการเตรียมบัญชีระบุพยานและการทำสรุปข้อเท็จจริง (Case Brief) ให้ชัดเจนก่อนขึ้นว่าความ`,
    futurePrecautions: [
      'ควรตรวจสอบการบอกเลิกสัญญาและการส่งหนังสือบอกกล่าวให้ถูกต้องตามขั้นตอนของกฎหมายทุกครั้ง',
      'ต้องติดตามกรอบระยะเวลาบังคับคดีตามคำพิพากษาอย่างเคร่งครัดเพื่อรักษาสิทธิของลูกความ'
    ],
    generatedAt: new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' }),
    isFallback: true,
  };

  return res.json({ success: true, data: fallback });
});

// Setup Vite or static serving
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);

    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      if (url.startsWith('/api')) {
        return next();
      }
      try {
        let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`CASELINK Server running on port ${PORT} (production: ${isProduction})`);
  });
}

startServer();
