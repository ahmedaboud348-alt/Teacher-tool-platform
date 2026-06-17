export function getExportDirection(track: "general" | "international"): "rtl" | "ltr" {
  return track === "general" ? "rtl" : "ltr";
}
