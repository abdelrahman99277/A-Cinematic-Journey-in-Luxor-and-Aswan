// طبقة إخفاء بسيطة قبل صفحات الأدمن (كلمة سر مشتركة).
// الحماية الحقيقية للبيانات على مستوى قاعدة البيانات (RLS + role).
const KEY = "__lx_gate";
const PASSWORD = "210062";

export function isGateUnlocked(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

export function tryUnlockGate(input: string): boolean {
  if (input.trim() !== PASSWORD) return false;
  try {
    sessionStorage.setItem(KEY, "1");
  } catch {}
  return true;
}

export function lockGate() {
  try {
    sessionStorage.removeItem(KEY);
  } catch {}
}
