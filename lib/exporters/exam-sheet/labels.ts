export function getExportLabels(track: "general" | "international") {
  return track === "general"
    ? { title: "وثيقة الامتحان" }
    : { title: "Document d examen" };
}
