export function cn(...classes) {
  return classes.filter(Boolean).join(" ")
}

const resolveApiRoot = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) {
    const cleaned = String(envUrl).replace(/\/+$/, "");
    return cleaned.replace(/\/api\/v1$/i, "");
  }

  const host = window.location.hostname;
  const isLocalHost = host === "localhost" || host === "127.0.0.1";
  const apiHost = isLocalHost ? "localhost" : host;
  return `http://${apiHost}:5000`;
};

export const API_BASE_URL = resolveApiRoot();

export function getFileUrl(path) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}
