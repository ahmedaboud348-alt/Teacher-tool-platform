import type { CertificateData, CertificateType } from "../types";
import { CERTIFICATE_LABELS } from "../types";
import { CERTIFICATE_BG } from "./certificate-bg-data";

const REASONS: Record<CertificateType, string> = {
  excellence: "وذلك تقديراً لتفوقه الدراسي وتميّزه في مادة الفيزياء والكيمياء",
  encouragement: "وذلك تشجيعاً له على مجهوداته المبذولة في مادة الفيزياء والكيمياء",
  merit: "وذلك تنويهاً بأدائه المتميز في مادة الفيزياء والكيمياء",
};

export function buildCertificateHtml(data: CertificateData): string {
  const labels = CERTIFICATE_LABELS[data.type];
  const reason = REASONS[data.type];

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Cairo:wght@400;600;700;800;900&display=swap');

  @page {
    size: A4 landscape;
    margin: 0;
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    width: 297mm;
    height: 210mm;
    overflow: hidden;
    font-family: 'Cairo', sans-serif;
    direction: rtl;
  }

  .certificate {
    width: 297mm;
    height: 210mm;
    position: relative;
    background-image: url('${CERTIFICATE_BG}');
    background-size: cover;
    background-position: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 28mm 35mm;
  }

  .content {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    margin-top: -32mm;
  }

  .type-title {
    font-family: 'Cairo', sans-serif;
    font-size: 38px;
    font-weight: 900;
    color: #1A3055;
    margin-bottom: 2px;
    letter-spacing: 2px;
  }

  .type-subtitle {
    font-family: 'Amiri', serif;
    font-size: 16px;
    font-weight: 400;
    color: #8B7D3C;
    margin-bottom: 10px;
    letter-spacing: 1px;
  }

  .preamble {
    font-size: 14px;
    font-weight: 700;
    color: #475569;
    margin-bottom: 8px;
  }

  .student-name {
    font-family: 'Cairo', sans-serif;
    font-size: 32px;
    font-weight: 900;
    color: #1A3055;
    padding: 6px 40px;
    border-bottom: 3px solid #C8960C;
    margin-bottom: 10px;
  }

  .reason {
    font-size: 14px;
    font-weight: 700;
    color: #475569;
    max-width: 500px;
    line-height: 1.8;
    margin-bottom: 6px;
  }

  .level-info {
    font-size: 12px;
    font-weight: 800;
    color: #1A3055;
  }

  .year-info {
    font-size: 11px;
    font-weight: 700;
    color: #64748B;
  }

  /* Bottom section — labels above the three decorative elements
     (right seal circle @ 77mm from right, left seal circle @ 77mm from left,
      central ornament in the middle), all sitting ~60mm from bottom */
  .sig-right {
    position: absolute;
    bottom: 60mm;
    right: 52mm;
    width: 50mm;
    text-align: center;
  }

  .sig-left {
    position: absolute;
    bottom: 60mm;
    left: 52mm;
    width: 50mm;
    text-align: center;
  }

  .date-center {
    position: absolute;
    bottom: 60mm;
    left: 0;
    right: 0;
    text-align: center;
  }

  .sig-label {
    font-size: 12px;
    font-weight: 800;
    color: #8B7D3C;
    margin-bottom: 3px;
  }

  .sig-name {
    font-size: 15px;
    font-weight: 900;
    color: #1A3055;
    white-space: nowrap;
  }

  .date-label {
    font-size: 12px;
    font-weight: 700;
    color: #8B7D3C;
  }

  .date-value {
    font-size: 15px;
    font-weight: 900;
    color: #1A3055;
    margin-top: 3px;
  }
</style>
</head>
<body>
<div class="certificate">
  <div class="content">
    <div class="type-title">${labels.title}</div>
    <div class="type-subtitle">${labels.subtitle}</div>

    <div class="preamble">يشهد أستاذ(ة) مادة الفيزياء والكيمياء أن التلميذ(ة)</div>

    <div class="student-name">${data.studentName}</div>

    <div class="reason">${reason}</div>

    <div class="level-info">المستوى: ${data.level}  &#8212;  السنة الدراسية: ${data.year}</div>
  </div>

  <div class="sig-right">
    <div class="sig-label">توقيع الأستاذ(ة)</div>
    <div class="sig-name">${data.teacherName}</div>
  </div>

  <div class="sig-left">
    <div class="sig-label">المؤسسة</div>
    <div class="sig-name">${data.schoolName}</div>
  </div>

  <div class="date-center">
    <div class="date-label">بتاريخ: ${data.date}</div>
  </div>
</div>
</body>
</html>`;
}
