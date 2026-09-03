const TOKEN_KEY = "savans_session_token";

export function getSessionToken() {
  return typeof window === "undefined" ? "" : (window.localStorage.getItem(TOKEN_KEY) ?? "");
}

export function setSessionToken(token: string) {
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearSessionToken() {
  window.localStorage.removeItem(TOKEN_KEY);
}
