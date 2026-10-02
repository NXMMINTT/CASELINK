// Browser-only mock AI structuring utility for static demo (No external API calls, No network traffic)

export interface ExtractedCaseStructure {
  events: Array<{
    id: string;
    title: string;
    date: string;
    description: string;
    relatedPersonNames: string[];
    relatedDocNames: string[];
  }>;
  people: Array<{
    id: string;
    name: string;
    role: string;
  }>;
  documents: Array<{
    id: string;
    name: string;
    type: string;
    date: string;
  }>;
  summary: string;
}

export function simulateLocalCaseStructuring(rawText: string): ExtractedCaseStructure {
  const lines = rawText.split('\n').map((l) => l.trim()).filter(Boolean);
  const events: ExtractedCaseStructure['events'] = [];
  const peopleSet = new Set<string>();
  const docSet = new Set<string>();

  const dateRegex =
    /(วันที่\s*)?(\d{1,2}\s*(?:มกราคม|กุมภาพันธ์|มีนาคม|เมษายน|พฤษภาคม|มิถุนายน|กรกฎาคม|สิงหาคม|กันยายน|ตุลาคม|พฤศจิกายน|ธันวาคม|ม\.ค\.|ก\.พ\.|มี\.ค\.|เม\.ย\.|พ\.ค\.|มิ\.ย\.|ก\.ค\.|ส\.ค\.|ก\.ย\.|ต\.ค\.|พ\.ย\.|ธ\.ค\.)(?:\s*\d{2,4})?)/g;

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
    if (line.includes('สมชาย')) {
      peopleSet.add('นายสมชาย');
      linePeople.push('นายสมชาย');
    }
    if (line.includes('ABC')) {
      peopleSet.add('บริษัท ABC');
      linePeople.push('บริษัท ABC');
    }
    if (line.includes('ผู้ว่าจ้าง')) {
      peopleSet.add('ผู้ว่าจ้าง');
      linePeople.push('ผู้ว่าจ้าง');
    }
    if (line.includes('ผู้รับจ้าง')) {
      peopleSet.add('ผู้รับจ้าง');
      linePeople.push('ผู้รับจ้าง');
    }
    if (line.includes('พยาน')) {
      peopleSet.add('พยานบุคคล');
      linePeople.push('พยานบุคคล');
    }

    const lineDocs: string[] = [];
    if (line.includes('สัญญา')) {
      docSet.add('สัญญาจ้าง / บันทึกข้อตกลง');
      lineDocs.push('สัญญาจ้าง / บันทึกข้อตกลง');
    }
    if (line.includes('หนังสือเตือน') || line.includes('แจ้งเตือน') || line.includes('โนติส') || line.includes('Notice')) {
      docSet.add('หนังสือบอกกล่าวทวงถาม (Notice)');
      lineDocs.push('หนังสือบอกกล่าวทวงถาม (Notice)');
    }
    if (line.includes('โอนเงิน') || line.includes('ชำระ') || line.includes('สลิป')) {
      docSet.add('สลิปหลักฐานการโอนเงิน');
      lineDocs.push('สลิปหลักฐานการโอนเงิน');
    }
    if (line.includes('แชท') || line.includes('ไลน์') || line.includes('LINE')) {
      docSet.add('ภาพบันทึกบทสนทนา (Chat)');
      lineDocs.push('ภาพบันทึกบทสนทนา (Chat)');
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

  // Default fallback if no events parsed
  if (events.length === 0) {
    events.push({
      id: `ev-${Date.now()}-0`,
      title: 'ข้อเท็จจริงเบื้องต้น',
      date: 'ไม่ระบุวันที่',
      description: rawText.substring(0, 100),
      relatedPersonNames: [],
      relatedDocNames: [],
    });
  }

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
    summary: 'ตัวอย่างการจัดระเบียบเหตุการณ์จำลองในเบราว์เซอร์ — ไม่ได้ส่งข้อมูลออกนอกเครื่อง และไม่ได้ให้คำแนะนำทางกฎหมาย',
  };
}
