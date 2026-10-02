# ⚖️ CASELINK — Interactive Legal Workspace & Case Blueprint

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4.0-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Google Gemini API](https://img.shields.io/badge/Google_Gemini-3.8_Flash-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)
[![LINE Messaging API](https://img.shields.io/badge/LINE_Official-Messaging_API-06C755?logo=line&logoColor=white)](https://developers.line.biz/)
[![Figma UI Principles](https://img.shields.io/badge/Design_System-Figma_UI_Principles-F24E1E?logo=figma&logoColor=white)](#-การประยุกต์ใช้หลักการออกแบบ-uxui-จาก-figma)
[![Zero-Knowledge Architecture](https://img.shields.io/badge/Security-Zero--Knowledge_Vault-10B981?logo=shield&logoColor=white)](#-คำรับรองความปลอดภัย-zero-knowledge-architecture)
[![Thai Legal Ethics](https://img.shields.io/badge/Compliance-มรรยาททนายความ_ข้อ_14-8B5CF6)](https://www.lawyerscouncil.or.th/)

> **"เชื่อมโยงทุกข้อมูล ให้เห็นภาพรวมของคดี — ปราศจากการเก็บข้อมูลบนเครื่องแม่ข่าย (Zero-Knowledge)"**  
> พื้นที่ทำงานอัจฉริยะสำหรับทนายความและวิชาชีพกฎหมายในไทย จัดระเบียบข้อเท็จจริง คลังพยานหลักฐาน ข้อกฎหมาย ผังคดีแบบ Blueprint Graph พร้อมระบบแจ้งเตือนลูกความอัตโนมัติผ่าน LINE Official Account โดยคำนึงถึงมรรยาทวิชาชีพทนายความและความลับของลูกความตามประมวลกฎหมายอาญา มาตรา 323

---

## 📌 สารบัญ (Table of Contents)
- [ภาพรวมของระบบ (Overview)](#-ภาพรวมของระบบ-overview)
- [ภาพรวมฟีเจอร์เด่น (Feature Showcase Gallery)](#-ภาพรวมฟีเจอร์เด่น-feature-showcase-gallery)
  - [0. ระบบลงทะเบียน & ประตูเข้าสู่ระบบ (Authentication & Onboarding Gateway)](#0--ระบบลงทะเบียน--ประตูเข้าสู่ระบบ-authentication--onboarding-gateway)
  - [1. ผังคดีแบบโหนดเชื่อมโยง (Interactive Legal Mind Map & Blueprint Canvas)](#1--ผังคดีแบบโหนดเชื่อมโยง-interactive-legal-mind-map--blueprint-canvas)
  - [2. ระบบแจ้งเตือนลูกความผ่าน LINE Official (LINE OA Hub)](#2--ระบบแจ้งเตือนลูกความผ่าน-line-official-line-oa-hub)
  - [3. คลังเตรียมตัวว่าความ & คำนวณเบี้ยปรับดอกเบี้ย (Courtroom Arsenal)](#3--คลังเตรียมตัวว่าความ--คำนวณเบี้ยปรับดอกเบี้ย-courtroom-arsenal)
  - [4. สถาปัตยกรรมรักษาความลับขั้นสูงสุด (Zero-Knowledge Vault Architecture)](#4--สถาปัตยกรรมรักษาความลับขั้นสูงสุด-zero-knowledge-vault-architecture)
- [การประยุกต์ใช้หลักการออกแบบ UX/UI จาก Figma](#-การประยุกต์ใช้หลักการออกแบบ-uxui-จาก-figma)
- [ฟีเจอร์หลักของระบบ (Core Features Breakdown)](#-ฟีเจอร์หลักของระบบ-core-features-breakdown)
- [สถาปัตยกรรมระบบ (System Architecture)](#-สถาปัตยกรรมระบบ-system-architecture)
- [โครงสร้างโฟลเดอร์ (Project Structure)](#-โครงสร้างโฟลเดอร์-project-structure)
- [การติดตั้งและรันโปรเจกต์ (Getting Started)](#-การติดตั้งและรันโปรเจกต์-getting-started)
- [สิ่งที่ได้เรียนรู้จากการใช้ Google AI Studio (Lessons Learned & Retrospective)](#-สิ่งที่ฉันได้เรียนรู้จากการใช้-google-ai-studio-กับโปรเจกต์นี้)
- [บทวิเคราะห์ทางวิศวกรรมซอฟต์แวร์ (Senior Full-Stack Critique)](#-บทวิเคราะห์ทางวิศวกรรมซอฟต์แวร์-senior-full-stack-critique)
- [ลิขสิทธิ์และการใช้งาน](#-ลิขสิทธิ์และการใช้งาน)

---

## 🌟 ภาพรวมของระบบ (Overview)

**CASELINK** ถูกออกแบบขึ้นเพื่อแก้ปัญหาความกระจัดกระจายของข้อมูลในการทำคดีความในศาลไทย:
- **ทนายความ:** ต้องรับมือกับเอกสารมหาศาล ลำดับเวลาที่ซับซ้อน กลยุทธ์การสู้คดี และความเสี่ยงสูงสุดเรื่อง **"ความลับของลูกความรั่วไหล"**
- **ลูกความ:** มักไม่เข้าใจขั้นตอนคดี ไม่เห็นภาพรวม และไม่ทราบว่าเอกสารใดพร้อมหรือยังขาดตกบกพร่อง

CASELINK ปฏิวัติการทำงานด้วยแนวคิด **Visual Blueprint Graph** และ **Local-First Zero-Knowledge Vault** โดยแปลงข้อมูลคดีให้เห็นความเชื่อมโยงระหว่าง:
$$\text{บุคคล (People)} \longrightarrow \text{เหตุการณ์ (Events)} \longrightarrow \text{พยานหลักฐาน (Documents)} \longrightarrow \text{ข้อกฎหมาย (Statutes)} \longrightarrow \text{กลยุทธ์ต่อสู้ (Strategies)} \longrightarrow \text{ค่าเสียหาย (Damages)}$$

<img width="1911" height="993" alt="image" src="https://github.com/user-attachments/assets/a78d4d66-fb5c-45c3-8ff4-8cceb37d7c58" />



---

## 📸 ภาพรวมฟีเจอร์เด่น (Feature Showcase Gallery)

### 🚪 ระบบลงทะเบียน & ประตูเข้าสู่ระบบ (Authentication & Onboarding Gateway)

เมื่อผู้ใช้เข้าใช้งานระบบครั้งแรก หรือยังไม่ได้ลงชื่อเข้าใช้ ระบบจะบังคับเปิด **หน้าต่างลงทะเบียน/เข้าสู่ระบบเต็มจอ (Auth Gateway)** ทันที เพื่อป้องกันไม่ให้บุคคลภายนอกเข้าถึงสำนวนคดีความลับ

<img width="1920" height="1200" alt="image" src="https://github.com/user-attachments/assets/a546c600-9b7b-47c3-a514-e29baab6ccd1" />



---

### 🧠 ผังคดีแบบโหนดเชื่อมโยง (Interactive Legal Mind Map & Blueprint Canvas)

<img width="1920" height="1200" alt="02-case-mind-map" src="https://github.com/user-attachments/assets/0497264b-333f-4f1e-9de2-3606c5a21484" />


* **Dynamic Pin Colors:** เส้นเชื่อมโยง (Cables) ปรับเปลี่ยนสีตามกล่องต้นทางโดยอัตโนมัติ (เขียว=บุคคล, ส้ม=เอกสาร, ฟ้า=เหตุการณ์, ม่วง=กฎหมาย, แดง=กลยุทธ์)
* **AI Auto-Layout:** จัดเรียงคอลัมน์มาตรฐานโดยไม่ซ้อนทับกัน (No Overlap) พร้อมคำนวณความสูงตามเนื้อหาจริง
* **Freeform Pin Drag & Drop:** ลากพอร์ต (Output ➔ Input) เชื่อมโยงข้ามโหนดได้อย่างอิสระ พร้อมปุ่มกากบาทลบเส้นเชื่อมที่จุดกึ่งกลาง

---

### 📱 ระบบแจ้งเตือนลูกความผ่าน LINE Official (LINE OA Hub)


<img width="1920" height="1261" alt="03-line-oa" src="https://github.com/user-attachments/assets/d631edce-f744-48ee-a02d-12040382b1b8" />


* **4 เทมเพลตมาตรฐานงานศาล:** แจ้งเตือนวันนัดศาล, อัปเดตความคืบหน้าคดี, ขอเอกสารพยานเพิ่ม, สรุปผลคำพิพากษา
* **Live Smartphone Preview:** หน้าจอจำลองแชท LINE เสมือนจริง แสดงการ์ด Flex Card ทันทีขณะพิมพ์
* **Custom LINE Bot Token:** ทนายสามารถนำ Channel Access Token ของสำนักงานตนเองมาผูกใช้งานได้ฟรี โดย Token จะถูกเก็บในเครื่องของทนาย 100%

---

### ⚖️ คลังเตรียมตัวว่าความ 


<img width="1920" height="1237" alt="04-courtroom-checklist" src="https://github.com/user-attachments/assets/597407f8-cf69-4e74-9fbc-4cf02c751149" />



## 🎨 การประยุกต์ใช้หลักการออกแบบ UX/UI จาก Figma

จากแนวทางการออกแบบตาม [Figma UI Design Principles](https://www.figma.com/resource-library/ui-design-principles/) เราได้นำหลักการ 9 ประการมาใช้อย่างเคร่งครัดใน **CASELINK**:

| หลักการออกแบบ (Principle) | การประยุกต์ใช้จริงในระบบ CASELINK | ผลลัพธ์ต่อประสบการณ์ผู้ใช้ (UX Impact) |
| :--- | :--- | :--- |
| **1. Visual Hierarchy (ลำดับชั้นทางสายตา)** | จัดขนาด Heading เด่นชัด (Display font), ป้าย Kicker บอกหมวดหมู่, ปุ่ม CTA เด่นด้วย Gradient ม่วง-น้ำเงิน และข้อมูลย่อยใช้สี slate-400 | ทนายกวาดสายตาเพียง 2 วินาทีก็ทราบว่าจุดไหนสำคัญที่สุดในสำนวนคดี |
| **2. Alignment & 8px Grid System** | ใช้ระบบ Grid 8px (`gap-2`, `gap-4`, `p-6`) จัดแนว Layout 2 คอลัมน์บน Desktop แบบ 1440px และจัดคอลัมน์ผังคดีแบบแม่นยำ | หน้าจอเป็นระเบียบ สบายตา ลดความเครียดขณะเตรียมคดีที่มีความกดดันสูง |
| **3. Contrast & Legibility (WCAG AA)** | ใช้พื้นหลัง Neutral Dark Slate (`#070b14`) ตัดกับตัวหนังสือสีขาวและฟ้าอ่อน ค่า Contrast Ratio $\ge 4.5:1$ | อ่านตัวบทกฎหมายและข้อเท็จจริงได้ชัดเจนในทุกสภาพแสง แม้ในห้องพิจารณาคดี |
| **4. Consistency (ความสม่ำเสมอ)** | ควบคุมปุ่มทุกปุ่มให้มีความสูงมาตรฐาน $\ge 44\text{px}$, ขอบมน `rounded-xl`, Iconography จาก Lucide React ทั้งระบบ | ผู้ใช้เรียนรู้การใช้งานครั้งเดียว เข้าใจทั้งระบบโดยไม่ต้องเดา |
| **5. Affordance & Signifiers** | ช่องกรอกรหัสผ่านมีปุ่มเปิด-ปิดตา (Eye/EyeOff), กล่องเลือกบทบาทมี Checkmark, พอร์ตเชื่อมสายใน Mind Map แสดง Highlight เมื่อ Hover | ผู้ใช้รู้ทันทีว่าปุ่มไหนกดได้ และกดแล้วจะเกิดอะไรขึ้น |
| **6. Feedback & Status Visibility** | เมื่อส่งคำสั่ง มีสถานะ Loading ชัดเจน, แจ้งเตือนข้อผิดพลาดด้วยแบนเนอร์สีแดงพร้อมไอคอนเตือน, และมี Toast แจ้งเตือนแชทเด้งทันที | ผู้ใช้มั่นใจในสถานะของระบบตลอดเวลา ลดความผิดพลาด |
| **7. White Space & Zero-Pill Discipline** | เว้นระยะห่างหายใจรอบคอนเทนต์ ไม่ใช้ Badge รกหูรกตา ข้อมูลสถิติใช้ข้อความพร้อมตัวคั่น `·` หรือ `/` | รู้สึกหรูหราแบบ Professional Suite ไม่ใช่ "AI Slop" ทั่วไป |
| **8. Fitts's Law & Touch Targets** | ปุ่ม Action สำคัญวางอยู่ในตำแหน่งที่เข้าถึงง่าย พร้อมปุ่ม "ทดลองด่วน" สำหรับกรรมการประเมินระบบ | เข้าใช้งานได้ในคลิกเดียว ลดเวลาคลิกและพิมพ์ซ้ำซ้อน |
| **9. Error Prevention & Recovery** | มีระบบกู้คืนคดีที่เผลอลบ (Undo Toast) ภายใน 8 วินาที และยืนยันรหัสผ่านก่อนสมัคร | ป้องกันการสูญหายของข้อมูลสำนวนคดีโดยไม่ตั้งใจ |

---

## 🚀 ฟีเจอร์หลักของระบบ (Core Features Breakdown)

### 1. 🧠 Interactive Case Mind Map (Unreal Blueprint Engine Style)
* **ผังคดีแบบโหนดเชื่อมโยง (Node Graph):** ลากและวางโหนดได้อย่างอิสระ รองรับทั้งเส้นตั้งฉากหักมุม (Orthogonal) และเส้นโค้ง (Bezier)
* **ระบบเส้นเชื่อมโยงจำสีตามกล่องต้นทาง (Dynamic Box-Color Matching):** เส้นที่ลากและสร้างใหม่จะปรับสีตามประเภทของกล่องต้นทาง
* **AI Auto-Layout ผังคดีอัจฉริยะ:** จัดระเบียบผังคดีอัตโนมัติเป็นคอลัมน์มาตรฐาน ป้องกันบล็อกและเส้นเชื่อมซ้อนทับกัน
* **Full Screen Workspace:** โหมดขยายเต็มหน้าจอเพื่อการวางแผนยุทธวิธีคดีความ

### 2. 📱 ระบบแจ้งเตือนลูกความอัตโนมัติผ่าน LINE Official Account (LINE OA Hub)
* **Custom Bot Integration:** ทนายความสามารถตั้งค่า Channel ID, Secret และ Channel Access Token ของสำนักงานตนเองได้
* **4 Automated Legal Flex Message Templates:**
  1. **แจ้งเตือนวันนัดศาล:** ระบุศาล, เวลา, บัลลังก์, วาระการนัด และสิ่งที่ต้องเตรียม
  2. **แจ้งความคืบหน้าคดี:** รายงานสถานะคำฟ้อง, การส่งหมาย, หรือการยื่นบัญชีระบุพยาน
  3. **ทวงถามเอกสารเพิ่มเติม:** ระบุรายการเอกสารที่ขาด พร้อมกำหนดส่ง
  4. **สรุปผลคำพิพากษาและสิทธิอุทธรณ์:** ผลคำตัดสินและกำหนดเวลายื่นอุทธรณ์ 30 วัน
* **Live Smartphone Simulator:** จำลองหน้าจอแชท LINE พร้อมปุ่ม Action ลิงก์เข้าสู่พอร์ทัลลูกความ
* **QR Code Invite Generator:** ปุ่มแสดง QR Code เชิญลูกความเพิ่มเพื่อนบอทของสำนักงาน

### 3. 🛡️ คำรับรองความปลอดภัยและนโยบายความเป็นส่วนตัว (Zero-Knowledge Vault)
* **สอดคล้องกับข้อบังคับสภาทนายความว่าด้วยมรรยาททนายความ พ.ศ. 2529 (ข้อ 14):** คุ้มครองความลับของลูกความ (Attorney-Client Privilege)
* **ประมวลกฎหมายอาญา มาตรา 323:** ป้องกันความผิดฐานเปิดเผยความลับทางวิชาชีพ (จำคุกไม่เกิน 6 เดือน หรือปรับไม่เกิน 10,000 บาท)
* **พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA):** ผู้ใช้งานเป็นผู้ควบคุมข้อมูล (Data Controller) แต่เพียงผู้เดียว
* **ไม่มีการเก็บข้อมูลบนเครื่องแม่ข่าย:** ข้อมูลสำนวนคดี เอกสาร พยานหลักฐาน และรหัสผ่าน ถูกบันทึกไว้ในเบราว์เซอร์ของเครื่องที่ใช้งานเท่านั้น

### 4. ✨ AI Fact-Structuring & Post-Case Learning
* **จัดโครงสร้างข้อเท็จจริงด้วย AI:** ป้อนข้อความเล่าเรื่องคดีแบบภาษาธรรมชาติ AI จะช่วยแยกไทม์ไลน์, บุคคล, และเอกสารที่อ้างถึง
* **สรุปบทเรียนหลังจบคดี (Post-Case Analysis):** สกัดจุดเปลี่ยนของคดี (Turning Points), ข้อสังเกตเชิงยุทธวิธี และบทเรียนสำคัญสำหรับคดีถัดไป

### 5. 📂 คลังเอกสารและปฏิทินนัดหมายศาล
* **ระบบตรวจสถานะเอกสาร 4 ระดับ:** `ยังไม่ได้ส่ง`, `ส่งแล้ว`, `กำลังตรวจ`, `ตรวจแล้ว`
* **Checklist Matrix:** แบ่งงานตรวจเอกสารฝั่งทนายและฝั่งลูกความ
* **Month Grid Calendar:** ปฏิทินนัดศาลแยกตามสี พร้อมระบบเตือนล่วงหน้า 3 วัน / 7 วัน

---

## 🏗 สถาปัตยกรรมระบบ (System Architecture)

### Tech Stack
* **Frontend Framework:** React 19 + TypeScript
* **Bundler & Build Tool:** Vite 8
* **Styling:** Tailwind CSS v4 (`@tailwindcss/vite`)
* **Design Constitution:** Figma UI Design Principles & Domain-Specific Legal Architecture
* **Icons & Micro-interactions:** Lucide React, CSS Transitions
* **Backend Proxy Server:** Express + Node.js (tsx) — *Stateless Proxy, Zero Persistence*
* **AI Engine:** Google Gemini API (`@google/genai` TypeScript SDK)
* **External Integration:** LINE Messaging API (Flex Messages)
* **Storage Engine:** Local-First Storage (LocalStorage with 250ms Debounced Sync & Deduplication Pipeline)

---

## 📁 โครงสร้างโฟลเดอร์ (Project Structure)

```text
├── src/
│   ├── components/
│   │   ├── auth/            # AuthGatewayView (Figma-inspired UI), AuthModals
│   │   ├── chat/            # หน้าต่างแชทสนทนาระหว่างทนายและลูกความ
│   │   ├── checklist/       # ตารางเช็กลิสต์ตรวจเอกสาร (ChecklistView)
│   │   ├── client/          # หน้าแดชบอร์ดเฉพาะมุมมองของลูกความ
│   │   ├── common/          # คอมโพเนนต์ส่วนกลาง (ThaiDatePicker, PrivacyPolicyModal)
│   │   ├── documents/       # คลังจัดเก็บเอกสารและพยานหลักฐาน (DocumentsView)
│   │   ├── lawyer/          # LawyerDashboard, CaseDetailView, CalendarView, LineBotIntegrationView
│   │   ├── layout/          # Sidebar, Navbar (พร้อมปุ่ม Logout และ Zero-Knowledge)
│   │   ├── mindmap/         # Interactive Blueprint MindMapView, AiStructuringModal
│   │   ├── roadmap/         # แผนพัฒนาฟีเจอร์ในอนาคต (RoadmapView)
│   │   ├── settings/        # ตั้งค่าโปรไฟล์สำนักงาน, LINE Bot, และนโยบายความลับ
│   │   └── timeline/        # ลำดับเหตุการณ์ตามวันเวลา (TimelineView)
│   ├── context/
│   │   └── AppContext.tsx   # ศูนย์กลาง State, Auth Session Gate, Data Sanitization
│   ├── mockData.ts          # คดีตัวอย่างและข้อมูลตั้งต้น
│   ├── types.ts             # ประกาศ TypeScript Interfaces ทั้งหมด
│   ├── App.tsx              # Root Component ควบคุม Auth Gate & Navigation
│   └── main.tsx             # Entry Point
├── server.ts                # Express Server (Stateless Gemini API Proxy)
├── metadata.json            # AI Studio Applet Metadata
└── package.json             # รายการ Dependencies และ Scripts
```

---

## 💻 การติดตั้งและรันโปรเจกต์ (Getting Started)

### ข้อกำหนดเบื้องต้น
- Node.js (v18 หรือสูงกว่า)
- npm หรือ yarn

### ขั้นตอนการรัน
1. **ติดตั้ง Dependencies:**
   ```bash
   npm install
   ```

2. **ตั้งค่า Environment Variable (สำหรับใช้งานฟีเจอร์ AI):**
   สร้างไฟล์ `.env` (ดูตัวอย่างใน `.env.example`):
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=3000
   ```

3. **รันในโหมดพัฒนา (Development):**
   ```bash
   npm run dev
   ```
   เข้าใช้งานผ่านเบราว์เซอร์ที่: `http://localhost:3000`

4. **ตรวจสอบความสมบูรณ์ของโค้ด (Lint & Type-Check):**
   ```bash
   npm run lint
   ```

5. **คอมไพล์โปรเจกต์ (Production Build):**
   ```bash
   npm run build
   ```

---

## 💡 สิ่งที่ฉันได้เรียนรู้จากการใช้ Google AI Studio กับโปรเจกต์นี้

การพัฒนา **CASELINK** โดยใช้ **Google AI Studio** ร่วมกับการวิเคราะห์ความต้องการจริงของทนายความไทย ได้สร้างบทเรียนที่มีคุณค่าและเปิดโลกการพัฒนาซอฟต์แวร์ในหลายมิติ:

### 1. การก้าวข้ามจาก "AI แชตบอตธรรมดา" สู่ "Domain-Specific Workflow Tool"
* บทเรียนแรกที่สำคัญที่สุดคือ **วิชาชีพกฎหมายไม่ต้องการ Chatbot ทั่วไป** เพราะทนายไม่สามารถนำคำตอบแบบบทความยาวๆ ไปยื่นศาลหรือวางแผนคดีได้ทันที
* Google AI Studio ช่วยให้เราเห็นว่า การสร้างคุณค่าที่แท้จริงคือการนำ AI มาเป็น **Engine เบื้องหลัง (Invisible AI)** เช่น การทำหน้าที่ **แปลงข้อความเล่าเรื่องคดีความ ให้กลายเป็นโหนดและเส้นเชื่อมโยงใน Blueprint Canvas** ทำให้ทนายเห็นภาพรวมความขัดแย้ง พยาน และช่องว่างแห่งกฎหมายได้อย่างรวดเร็ว

### 2. กฎหมายและความลับทางวิชาชีพ คือตัวกำหนด Architecture (Zero-Knowledge)
* ในระหว่างทำโปรเจกต์ เราได้ตระหนักถึงความอ่อนไหวขั้นสูงสุดของข้อมูลคดีความ ทั้งตาม **มรรยาททนายความ พ.ศ. 2529 ข้อ 14** และ **ประมวลกฎหมายอาญา มาตรา 323**
* หากเก็บข้อมูลบน Cloud Database กลาง ทนายส่วนใหญ่จะไม่กล้าใช้เพราะกังวลเรื่องการถูกแฮกหรือหมายศาลเรียกตรวจข้อมูล
* Google AI Studio สอนให้เราออกแบบ **Stateless Proxy Pipeline**: ทำ Client-side PII Masking เซนเซอร์เลขบัตรประชาชน 13 หลักและเบอร์โทรศัพท์ก่อนส่ง และใช้ Local-First Storage ในเครื่องทนาย 100% ทำให้ระบบปลอดภัยและสอดคล้องกับจริยธรรมวิชาชีพอย่างแท้จริง

### 3. ประสิทธิภาพของ Gemini Structured Outputs (JSON Schema)
* การใช้ `@google/genai` ร่วมกับ Structured Output Schema (`Type.OBJECT`, `Type.ARRAY`) เป็นฟีเจอร์ที่สร้างความประทับใจสูงสุด
* ในอดีต การสั่ง LLM ให้ตอบ JSON มักเจอปัญหา Markdown Backticks ปนเปื้อน หรือ Field ไม่ครบ แต่เมื่อกำหนด Schema ชัดเจน โมเดล Gemini สามารถส่งคืน Array ของ `events`, `people`, และ `documents` ที่ Typed ตรงกับ TypeScript Interfaces ของเราอย่างสมบูรณ์แบบ ทำให้การ Render กราฟิกบน Canvas ไม่เคยพัง

### 4. การจัดการความซับซ้อนของ Interactive Canvas & State Synchronization
* การสร้าง Interactive Canvas ที่ลากเส้นสายแบบ Unreal Engine Blueprint นำมาซึ่งความท้าทายทางคณิตศาสตร์และ State Management:
  - การคำนวณตำแหน่งพอร์ต Pin Coordinates ให้แม่นยำตามการเลื่อน Scroll
  - การป้องกัน **Key Collision** เมื่อสร้างหลายโหนดพร้อมกัน
  - การป้องกัน **Node Overlap** เมื่อข้อความในการ์ดยาวกว่าปกติ
* การใช้ AI Studio ช่วยให้เราสามารถ Refactor ฟังก์ชันคำนวณเรขาคณิตเวกเตอร์ และสร้างระบบ `deduplicateAndEnsureUnique` ที่เสถียร รองรับการทำงานแบบ Real-time ได้อย่างไร้รอยต่อ

### 5. การผนวกเข้ากับวัฒนธรรมการสื่อสารของคนไทย (LINE Ecosystem)
* การได้เรียนรู้ว่าในชีวิตจริงของลูกความไทย พวกเขาไม่ได้เปิดแอปพลิเคชันหรือเช็กอีเมลทุกวัน แต่เปิด **LINE** ทุกวัน
* การออกแบบให้มี **LINE OA Hub** ที่ทนายสามารถผูก Token ของตนเอง และส่ง Flex Messages แจ้งเตือนวันนัดศาลได้ ถือเป็นการเชื่อมช่องว่างระหว่างเทคโนโลยีขั้นสูงกับการใช้งานจริงของประชาชนได้อย่างยอดเยี่ยม

---

## 👨‍💻 บทวิเคราะห์ทางวิศวกรรมซอฟต์แวร์ (Senior Full-Stack Critique)

### สิ่งที่ระบบทำได้ยอดเยี่ยมในปัจจุบัน:
1. **Figma UI/UX Principles Adherence:** หน้าจอถูกจัดวางอย่างมีลำดับชั้น (Visual Hierarchy), Contrast คมชัด, ตัวหนังสืออ่านง่าย และปุ่มสัมผัสมีขนาดตามหลัก Fitts's Law
2. **Zero-Knowledge Privacy:** มั่นใจได้ 100% ว่าไม่มีการรั่วไหลของข้อมูลสำนวนคดีสู่เซิร์ฟเวอร์ส่วนกลาง
3. **Deterministic UI State:** การจัดระเบียบโหนดคดี (Auto-Layout) มีการเว้นระยะห่างตามความยาวข้อความจริง ไม่ทับซ้อนกัน
4. **Dual-Role Workflow & Auth Gate:** มีหน้าลงทะเบียน/เข้าสู่ระบบที่ปลอดภัย และสลับบทบาทระหว่างทนายความและลูกความได้อย่างไร้รอยต่อ

### แผนการพัฒนาในเฟสถัดไป (Production Roadmap):
1. **IndexedDB Migration (Dexie.js):** ยกระดับพื้นที่จัดเก็บเอกสารสแกน PDF ขนาดใหญ่จาก 5MB สู่หลายกิกะไบต์ในเครื่องของทนาย
2. **Client-to-Client Direct File Transfer (WebRTC P2P):** ให้ลูกความส่งไฟล์พยานหลักฐานเข้าสู่คอมพิวเตอร์ของทนายโดยตรงโดยไม่ต้องมี Server ตัวกลาง
3. **High-DPI Mind Map Export:** ส่งออกผังคดีเป็นไฟล์ภาพ PNG/PDF ความละเอียดสูง 300 DPI สำหรับพิมพ์แนบสำนวนยื่นต่อศาล

---

