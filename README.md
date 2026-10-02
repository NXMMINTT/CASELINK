# ⚖️ CASELINK — Interactive Legal Workspace & Case Blueprint

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4.0-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Google Gemini API](https://img.shields.io/badge/Google_Gemini-3.8_Flash-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)
[![LINE Messaging API](https://img.shields.io/badge/LINE_Official-Messaging_API-06C755?logo=line&logoColor=white)](https://developers.line.biz/)
[![Zero-Knowledge Architecture](https://img.shields.io/badge/Security-Zero--Knowledge_Vault-10B981?logo=shield&logoColor=white)](#-คำรับรองความปลอดภัย-zero-knowledge-architecture)
[![Thai Legal Ethics](https://img.shields.io/badge/Compliance-มรรยาททนายความ_ข้อ_14-8B5CF6)](https://www.lawyerscouncil.or.th/)

> **"เชื่อมโยงทุกข้อมูล ให้เห็นภาพรวมของคดี — ปราศจากการเก็บข้อมูลบนเครื่องแม่ข่าย (Zero-Knowledge)"**  
> พื้นที่ทำงานอัจฉริยะสำหรับทนายความและวิชาชีพกฎหมายในไทย จัดระเบียบข้อเท็จจริง คลังพยานหลักฐาน ข้อกฎหมาย ผังคดีแบบ Blueprint Graph พร้อมระบบแจ้งเตือนลูกความอัตโนมัติผ่าน LINE Official Account

---

## 📌 สารบัญ (Table of Contents)
- [ภาพรวมของระบบ (Overview)](#-ภาพรวมของระบบ-overview)
- [ภาพรวมฟีเจอร์เด่น (Feature Showcase Gallery)](#-ภาพรวมฟีเจอร์เด่น-feature-showcase-gallery)
- [ฟีเจอร์หลัก (Core Features)](#-ฟีเจอร์หลัก-core-features)
  - [1. Interactive Blueprint Mind Map](#1-interactive-case-mind-map-unreal-blueprint-engine-style)
  - [2. ระบบแจ้งเตือนลูกความผ่าน LINE Official Bot](#2-ระบบแจ้งเตือนลูกความอัตโนมัติผ่าน-line-official-account-line-oa-hub)
  - [3. คำรับรองความปลอดภัย & Zero-Knowledge Architecture](#3-คำรับรองความปลอดภัยและนโยบายความเป็นส่วนตัว-zero-knowledge-vault)
  - [4. AI Fact-Structuring & Post-Case Learning](#4-ai-fact-structuring--post-case-learning)
  - [5. คลังเอกสาร & ปฏิทินนัดหมายศาล](#5-คลังเอกสารและปฏิทินนัดหมายศาล)
- [สถาปัตยกรรมระบบ (System Architecture)](#-สถาปัตยกรรมระบบ-system-architecture)
- [โครงสร้างโฟลเดอร์ (Project Structure)](#-โครงสร้างโฟลเดอร์-project-structure)
- [การติดตั้งและรันโปรเจกต์ (Getting Started)](#-การติดตั้งและรันโปรเจกต์-getting-started)
- [สิ่งที่ได้เรียนรู้จากการใช้ Google AI Studio (Lessons Learned & Retrospective)](#-สิ่งที่ได้เรียนรู้จากการใช้-google-ai-studio-กับโปรเจกต์นี้)
- [บทวิเคราะห์ทางวิศวกรรมซอฟต์แวร์ (Senior Full-Stack Critique)](#-บทวิเคราะห์ทางวิศวกรรมซอฟต์แวร์-senior-full-stack-critique)
- [ลิขสิทธิ์และการใช้งาน](#-ลิขสิทธิ์และการใช้งาน)

---

## 🌟 ภาพรวมของระบบ (Overview)

**CASELINK** ถูกออกแบบขึ้นเพื่อแก้ปัญหาความกระจัดกระจายของข้อมูลในการทำคดีความในศาลไทย:
- **ทนายความ:** ต้องรับมือกับเอกสารมหาศาล ลำดับเวลาที่ซับซ้อน กลยุทธ์การสู้คดี และความเสี่ยงสูงสุดเรื่อง **"ความลับของลูกความรั่วไหล"**
- **ลูกความ:** มักไม่เข้าใจขั้นตอนคดี ไม่เห็นภาพรวม และไม่ทราบว่าเอกสารใดพร้อมหรือยังขาดตกบกพร่อง

CASELINK ปฏิวัติการทำงานด้วยแนวคิด **Visual Blueprint Graph** และ **Local-First Zero-Knowledge Vault** โดยแปลงข้อมูลคดีให้เห็นความเชื่อมโยงระหว่าง:
$$\text{บุคคล (People)} \longrightarrow \text{เหตุการณ์ (Events)} \longrightarrow \text{พยานหลักฐาน (Documents)} \longrightarrow \text{ข้อกฎหมาย (Statutes)} \longrightarrow \text{กลยุทธ์ต่อสู้ (Strategies)} \longrightarrow \text{ค่าเสียหาย (Damages)}$$

---

## 📸 ภาพรวมฟีเจอร์เด่น (Feature Showcase Gallery)

### 1. 🧠 Interactive Legal Mind Map & Blueprint Canvas
```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ [CASELINK] คดีพิพาทสัญญาจะซื้อจะขายที่ดิน • มูลค่าพิพาท 5,400,000 บาท                 │
├───────────────────┬───────────────────┬───────────────────┬────────────────────────────┤
│  บุคคลที่เกี่ยวข้อง   │   คดีหลัก & ไทม์ไลน์ │ พยานหลักฐาน/สัญญา  │ ข้อกฎหมาย & ยุทธวิธีทนาย     │
│  (Column 0 - x:80)│  (Column 1 - x:440)│(Column 2 - x:840) │ (Column 3 - x:1260)        │
├───────────────────┼───────────────────┼───────────────────┼────────────────────────────┤
│ ┌───────────────┐ │ ┌───────────────┐ │ ┌───────────────┐ │ ┌────────────────────────┐ │
│ │ 🟢 นายสมชาย   │─┼─┼►│ 🔷 คดีหลัก   │─┼─┼►│ 🟡 สัญญาจะซื้อ │─┼─┼►│ 🟣 ป.พ.พ. ม. 456       │ │
│ │ (ลูกความ/โจทก์)│ │ │ │ สัญญาจะซื้อขาย│ │ │ │ ขายที่ดินฉบับจริง│ │ │ (แบบของสัญญาจะซื้อจะขาย)│ │
│ └───────────────┘ │ │ └───────┬───────┘ │ └───────────────┘ │ └────────────────────────┘ │
│         │         │           │         │                   │              ▲             │
│         │ (เขียว)  │           ▼         │                   │              │ (ม่วง)       │
│         ▼         │ ┌───────────────┐ │ ┌───────────────┐ │ ┌──────────────┴─────────┐ │
│ ┌───────────────┐ │ │ 🔷 12 ม.ค. 69 │─┼─┼►│ 🟡 สลิปโอนเงิน │ │ │ 🔴 กลยุทธ์: เรียกเงินมัดจำ │ │
│ │ 🟢 บริษัท ABC │ │ │ โอนเงินมัดจำ  │ │ │ งวดแรก 5 แสน  │ │ │ คืนพร้อมเบี้ยปรับ 15%   │ │
│ │ (คู่กรณี/จำเลย)│ │ └───────────────┘ │ └───────────────┘ │ └────────────────────────┘ │
└───────────────────┴───────────────────┴───────────────────┴────────────────────────────┘
```
* **Dynamic Pin Colors:** เส้นเชื่อมโยง (Cables) ปรับเปลี่ยนสีตามกล่องต้นทางโดยอัตโนมัติ (เช่น เขียว=บุคคล, ส้ม=เอกสาร, ฟ้า=เหตุการณ์, ม่วง=กฎหมาย, แดง=กลยุทธ์)
* **AI Auto-Layout:** จัดเรียงคอลัมน์มาตรฐานโดยไม่ซ้อนทับกัน (No Overlap) พร้อมคำนวณความสูงตามเนื้อหาจริง
* **Freeform Pin Drag & Drop:** ลากพอร์ต (Output ➔ Input) เชื่อมโยงข้ามโหนดได้อย่างอิสระ พร้อมปุ่มกากบาทลบเส้นเชื่อมที่จุดกึ่งกลาง

---

### 2. 📱 ระบบแจ้งเตือนลูกความผ่าน LINE Official (LINE OA Hub)
```
┌─────────────────────────────────┐
│     LINE Official Account       │
│    [CASELINK Alert - ทนายความ]   │
├─────────────────────────────────┤
│                                 │
│  ┌───────────────────────────┐  │
│  │ ⚖️ แจ้งเตือนวันนัดพิจารณาคดี  │  │ (LINE Flex Message สีเขียว)
│  │ คดี: พิพาทสัญญาจะซื้อจะขาย    │  │
│  ├───────────────────────────┤  │
│  │ • วันนัด: 24 พ.ย. 69 (09:00)│  │
│  │ • ศาล: ศาลแพ่งกรุงเทพใต้      │  │
│  │ • บัลลังก์: ห้อง 402         │  │
│  │ • วาระ: ไกล่เกลี่ยและชี้สองสถาน │  │
│  │ • เตรียมตัว: นำบัตร ปชช. ตัวจริง│  │
│  ├───────────────────────────┤  │
│  │ [ เปิดแฟ้มคดีในระบบ CASELINK ] │  │
│  │ [ส่งเอกสารให้ทนาย] [โทรด่วน] │  │
│  └───────────────────────────┘  │
│                           10:45 │
└─────────────────────────────────┘
```
* **4 เทมเพลตมาตรฐานงานศาล:** แจ้งเตือนวันนัดศาล, อัปเดตความคืบหน้าคดี, ขอเอกสารพยานเพิ่ม, สรุปผลคำพิพากษา
* **Live Smartphone Preview:** หน้าจอจำลองแชท LINE เสมือนจริง แสดงการ์ด Flex Card ทันทีขณะพิมพ์
* **Custom LINE Bot Token:** ทนายสามารถนำ Channel Access Token ของสำนักงานตนเองมาผูกใช้งานได้ฟรี โดย Token จะถูกเก็บในเครื่องของทนาย 100%

---

### 3. 🔒 คำรับรองความปลอดภัย & Zero-Knowledge Architecture
```
┌────────────────────────────────────────────────────────────────────────┐
│                        อุปกรณ์ของทนายความ (Client Device)                │
│                                                                        │
│   ┌────────────────────┐   ┌───────────────────┐   ┌────────────────┐  │
│   │ UI, Mind Map Canvas│◄─►│ Web Crypto API    │◄─►│ Local Storage/ │  │
│   │ & Case Management  │   │ AES-GCM (256-bit) │   │ IndexedDB      │  │
│   └─────────┬──────────┘   └───────────────────┘   └────────────────┘  │
│             │                                                          │
│             │ (1) Client-side Data Masking (ลบเลขบัตร 13 หลัก, เบอร์โทร)│
│             ▼                                                          │
│   ┌────────────────────┐                                               │
│   │ PII Sanitizer      │                                               │
│   └─────────┬──────────┘                                               │
└─────────────┼──────────────────────────────────────────────────────────┘
              │ (2) ส่งเฉพาะข้อความไร้ข้อมูลระบุตัวตน (Stateless TLS 1.3)
              ▼
┌───────────────────────────────┐
│     Stateless AI Proxy        │ ➔ ไม่มี Database (Database-less)
│    (Express + Gemini Flash)   │ ➔ ไม่บันทึก Request Log (No Retention)
└───────────────────────────────┘
```

---

## 🚀 ฟีเจอร์หลัก (Core Features)

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
* **Icons & UI Micro-interactions:** Lucide React, CSS Transitions
* **Backend Proxy Server:** Express + Node.js (tsx) — *Stateless Proxy, Zero Persistence*
* **AI Engine:** Google Gemini API (`@google/genai` TypeScript SDK)
* **External Integration:** LINE Messaging API (Flex Messages)
* **Storage Engine:** Local-First Storage (LocalStorage with 250ms Debounced Sync & Deduplication Pipeline)

---

## 📁 โครงสร้างโฟลเดอร์ (Project Structure)

```text
├── src/
│   ├── components/
│   │   ├── auth/            # ระบบลงทะเบียนและเข้าสู่ระบบแบบ Local Vault
│   │   ├── chat/            # หน้าต่างแชทสนทนาระหว่างทนายและลูกความ
│   │   ├── checklist/       # ตารางเช็กลิสต์ตรวจเอกสาร (ChecklistView)
│   │   ├── client/          # หน้าแดชบอร์ดเฉพาะมุมมองของลูกความ
│   │   ├── common/          # คอมโพเนนต์ส่วนกลาง (ThaiDatePicker, PrivacyPolicyModal)
│   │   ├── documents/       # คลังจัดเก็บเอกสารและพยานหลักฐาน (DocumentsView)
│   │   ├── lawyer/          # LawyerDashboard, CaseDetailView, CalendarView, LineBotIntegrationView
│   │   ├── layout/          # Sidebar, Navbar (พร้อมปุ่ม Zero-Knowledge)
│   │   ├── mindmap/         # Interactive Blueprint MindMapView, AiStructuringModal
│   │   ├── roadmap/         # แผนพัฒนาฟีเจอร์ในอนาคต (RoadmapView)
│   │   ├── settings/        # ตั้งค่าโปรไฟล์สำนักงาน, LINE Bot, และนโยบายความลับ
│   │   └── timeline/        # ลำดับเหตุการณ์ตามวันเวลา (TimelineView)
│   ├── context/
│   │   └── AppContext.tsx   # ศูนย์กลาง State, Data Sanitization, Unique ID Generator
│   ├── mockData.ts          # คดีตัวอย่างและข้อมูลตั้งต้น
│   ├── types.ts             # ประกาศ TypeScript Interfaces ทั้งหมด
│   ├── App.tsx              # Root Component ควบคุม Role & Navigation
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

## 💡 สิ่งที่ได้เรียนรู้จากการใช้ Google AI Studio กับโปรเจกต์นี้

การพัฒนา **CASELINK** ร่วมกับ **Google AI Studio** มอบบทเรียนและประสบการณ์เชิงวิศวกรรมซอฟต์แวร์ที่ลึกซึ้งใน 5 มิติสำคัญ:

### 1. การเปลี่ยนผ่านจาก "Prototype ธรรมดา" สู่ "Production-Grade Domain Tool"
* ในโลกความจริง การเขียนโค้ดสำหรับวิชาชีพเฉพาะทาง เช่น **ทนายความ** ไม่สามารถใช้โค้ดแบบ Generic SaaS ทั่วไปได้
* AI Studio ช่วยให้เรามองเห็นข้อกำหนดทางกฎหมายไทย เช่น **ข้อบังคับสภาทนายความว่าด้วยมรรยาททนายความ พ.ศ. 2529 ข้อ 14** และ **ป.อ. ม.323** นำไปสู่การตัดสินใจทางสถาปัตยกรรมที่ถูกต้อง: **การเลือกใช้ Zero-Knowledge & Local-First Architecture แทนการเก็บข้อมูลบน Central Database** ซึ่งตอบโจทย์ Pain Point เรื่อง "ทนายกลัวข้อมูลลูกความหลุด" ได้ตรงจุดที่สุด

### 2. เทคนิคการผสาน AI แบบ "Zero Data Leakage" (Privacy-Preserving AI)
* ปัญหาใหญ่ของ LegalTech คือ **ทนายไม่กล้าส่งข้อความคดีไปหา AI เพราะกลัวถูกนำไปเทรนโมเดลสาธารณะ**
* จากการทำงานกับ AI Studio ทำให้เราได้เรียนรู้การสร้าง **Stateless Proxy Pipeline**:
  1. การทำ **Client-side PII Masking** บนเบราว์เซอร์ เพื่อเซนเซอร์เลขบัตรประชาชน 13 หลัก, เบอร์โทรศัพท์, และเลขบัญชีก่อนส่ง
  2. การตั้งค่า Express Proxy ให้เป็นช่องทางผ่านชั่วคราว พร้อม Header `Cache-Control: no-store` โดยปราศจากการเก็บ Request Body ลง Disk หรือ Log ใดๆ

### 3. พลังของ Structured Outputs (JSON Schema) กับ Gemini API
* ในฟีเจอร์ **"จัดโครงสร้างคดีด้วย AI" (AI Structuring Modal)** การสั่งให้ AI สกัดข้อเท็จจริงออกมาเป็นภาษาธรรมชาติแบบ Chatbot มักจะนำไปเรนเดอร์ต่อใน Canvas ได้ยาก
* การใช้ **Schema Definition (Type.OBJECT, Type.ARRAY)** ของ `@google/genai` SDK ทำให้โมเดล Gemini ส่งคืนโครงสร้างข้อมูลที่ Typed 100% สอดคล้องกับ Interface `CaseEvent`, `Person`, และ `Document` ทำให้การแปลงข้อความภาษาไทยธรรมดาไปเป็น **โหนด Mind Map และเส้นสาย Bezier Curve** เกิดขึ้นได้ทันทีโดยไม่มีข้อผิดพลาดด้านการ Parse JSON

### 4. การจัดการปัญหาความซับซ้อนของ Interactive Canvas (Mathematical & State Rigor)
* การทำ Mind Map ที่มีสายเชื่อมโยงระหว่างโหนด (Blueprint Cables) ก่อให้เกิดปัญหาทางเทคนิคจริง เช่น:
  - ปัญหา **Key Collision** เมื่อสร้างโหนดใหม่พร้อมกัน
  - ปัญหา **Node Overlapping** เมื่อการ์ดมีเนื้อหาหลายบรรทัด
  - ปัญหาสายเคเบิลจำสีผิด เมื่อลากเส้นเชื่อมใหม่
* AI Studio ช่วยในการ Debug เชิงลึก ทั้งการสร้างฟังก์ชันคำนวณ **Bounding Box Clearance**, การสร้างระบบ **Content Fingerprinting Deduplication**, และการคำนวณเวกเตอร์ **Orthogonal / Bezier Path Math** ทำให้ Canvas ทำงานได้อย่างลื่นไหลและเสถียร

### 5. การผสาน External Ecosystem อย่างชาญฉลาด (LINE Messaging API)
* ในประเทศไทย ทนายความและลูกความสื่อสารกันผ่าน **LINE** เป็นช่องทางหลัก
* การออกแบบให้ทนายสามารถมี **Custom LINE Bot ของสำนักงานตนเอง** โดยเก็บ Channel Access Token ไว้บนอุปกรณ์ของทนาย (Zero-Knowledge) แสดงให้เห็นว่าเราสามารถผสานความสะดวกของ Consumer Messaging App เข้ากับมาตรฐานความปลอดภัยระดับสูงของวิชาชีพกฎหมายได้อย่างลงตัว

---

## 👨‍💻 บทวิเคราะห์ทางวิศวกรรมซอฟต์แวร์ (Senior Full-Stack Critique)

### สิ่งที่ระบบทำได้ยอดเยี่ยมในปัจจุบัน:
1. **Zero-Knowledge Privacy:** มั่นใจได้ 100% ว่าไม่มีการรั่วไหลของข้อมูลสำนวนคดีสู่เซิร์ฟเวอร์ส่วนกลาง
2. **Deterministic UI State:** การจัดระเบียบโหนดคดี (Auto-Layout) มีการเว้นระยะห่างตามความยาวข้อความจริง ไม่ทับซ้อนกัน
3. **Dual-Role Workflow:** สลับบทบาทระหว่างทนายความและลูกความได้อย่างไร้รอยต่อ

### แผนการพัฒนาในเฟสถัดไป (Production Roadmap):
1. **IndexedDB Migration (Dexie.js):** ยกระดับพื้นที่จัดเก็บเอกสารสแกน PDF ขนาดใหญ่จาก 5MB สู่หลายกิกะไบต์ในเครื่องของทนาย
2. **Client-to-Client Direct File Transfer (WebRTC P2P):** ให้ลูกความส่งไฟล์พยานหลักฐานเข้าสู่คอมพิวเตอร์ของทนายโดยตรงโดยไม่ต้องมี Server ตัวกลาง
3. **High-DPI Mind Map Export:** ส่งออกผังคดีเป็นไฟล์ภาพ PNG/PDF ความละเอียดสูง 300 DPI สำหรับพิมพ์แนบสำนวนยื่นต่อศาล

---

## 📄 ลิขสิทธิ์และการใช้งาน
พัฒนาขึ้นสำหรับแอปพลิเคชัน **CASELINK** — มาตรฐานใหม่แห่งการจัดการคดีความอย่างชาญฉลาดและปลอดภัยสูงสุดในประเทศไทย
