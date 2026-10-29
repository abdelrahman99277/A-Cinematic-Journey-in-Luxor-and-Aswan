import { useEffect, useState } from "react";
import { isGateUnlocked, tryUnlockGate } from "@/lib/site-gate";

export function SiteGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    setUnlocked(isGateUnlocked());
    setReady(true);
  }, []);

  if (!ready) {
    return <div className="min-h-screen bg-black" />;
  }

  if (unlocked) return <>{children}</>;

  return (
    <div dir="rtl" className="min-h-screen bg-black text-[#e9d8a6] flex items-center justify-center px-4 font-[Cairo]">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (tryUnlockGate(pw)) {
            setUnlocked(true);
          } else {
            setError(true);
            setPw("");
          }
        }}
        className="w-full max-w-sm border border-[#d4af37]/30 bg-[#0a0a0a] p-8 rounded-lg shadow-2xl text-center"
      >
        <h1 className="text-2xl text-[#d4af37] mb-2">🔒 منطقة خاصة</h1>
        <p className="text-sm text-[#e9d8a6]/60 mb-6">أدخل كلمة السر للمتابعة</p>
        <input
          type="password"
          value={pw}
          onChange={(e) => {
            setPw(e.target.value);
            setError(false);
          }}
          autoFocus
          className="w-full bg-black border border-[#d4af37]/30 rounded px-3 py-2 text-center text-[#e9d8a6] tracking-widest focus:border-[#d4af37] focus:outline-none"
          dir="ltr"
        />
        {error && <p className="text-red-400 text-sm mt-3">كلمة سر خاطئة</p>}
        <button
          type="submit"
          className="w-full mt-4 bg-[#d4af37] text-black font-semibold py-2 rounded hover:bg-[#e9c552] transition"
        >
          دخول
        </button>
      </form>
    </div>
  );
}
