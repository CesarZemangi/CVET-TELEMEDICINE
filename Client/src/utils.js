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
  const apiOrigin = (() => {
    try {
      return new URL(API_BASE_URL).origin;
    } catch {
      return API_BASE_URL;
    }
  })();

  // If the server returns a built asset path (served by the client app), keep it relative
  // so it uses the same origin as the frontend and avoids CORP/CORS issues.
  if (path.startsWith("/assets/")) return path;
  if (path.startsWith("http")) {
    try {
      const url = new URL(path);
      // If backend returns localhost/127.0.0.1 but the app is opened from another host,
      // rewrite the origin so media loads correctly.
      if (url.hostname === "localhost" || url.hostname === "127.0.0.1") {
        return `${apiOrigin}${url.pathname}${url.search}${url.hash}`;
      }
      return path;
    } catch {
      return path;
    }
  }
  return `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}
