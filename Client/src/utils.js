export function cn(...classes) {
  return classes.filter(Boolean).join(" ")
}

export const API_BASE_URL = "http://localhost:5000";

export function getFileUrl(path) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}