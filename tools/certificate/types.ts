export type CertificateType = "excellence" | "encouragement" | "merit";

export type CertificateData = {
  studentName: string;
  type: CertificateType;
  teacherName: string;
  schoolName: string;
  level: string;
  year: string;
  date: string;
};

export const CERTIFICATE_LABELS: Record<CertificateType, { title: string; subtitle: string }> = {
  excellence: { title: "شهادة تفوق", subtitle: "Certificate of Excellence" },
  encouragement: { title: "شهادة تشجيع", subtitle: "Certificate of Encouragement" },
  merit: { title: "شهادة تنويه", subtitle: "Certificate of Merit" },
};
