export function getTrackDirection(track: "general" | "international"): "rtl" | "ltr" {
  return track === "general" ? "rtl" : "ltr";
}
