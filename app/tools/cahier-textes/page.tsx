"use client";
import dynamic from "next/dynamic";

const CahierTextesTool = dynamic(
  () => import("@/tools/cahier-textes/components/CahierTextesTool").then(m => m.CahierTextesTool),
  { ssr: false }
);

export default function CahierTextesPage() {
  return <CahierTextesTool />;
}
