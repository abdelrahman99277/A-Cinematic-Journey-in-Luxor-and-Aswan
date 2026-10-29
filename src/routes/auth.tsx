import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SiteGate } from "@/components/SiteGate";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "تسجيل الدخول — لوحة التحكم" },
      { name: "description", content: "تسجيل الدخول لإدارة الرحلات والحجوزات." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: () => (
    <SiteGate>
      <AuthPage />
    </SiteGate>
  ),
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      navigate({ to: "/admin" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div dir="rtl" className="min-h-screen bg-black text-[#e9d8a6] flex items-center justify-center px-4 font-[Cairo]">
      <div className="w-full max-w-md border border-[#d4af37]/30 bg-[#0a0a0a] p-8 rounded-lg shadow-2xl">
        <Link to="/" className="text-xs text-[#d4af37]/60 hover:text-[#d4af37]">← العودة للموقع</Link>
        <h1 className="text-3xl font-bold text-[#d4af37] mt-4 mb-2 text-center">
          {mode === "signin" ? "تسجيل الدخول" : "إنشاء حساب"}
        </h1>
        <p className="text-center text-sm text-[#e9d8a6]/60 mb-6">لوحة إدارة الرحلات والحجوزات</p>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">البريد الإلكتروني</label>
            <input
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black border border-[#d4af37]/30 rounded px-3 py-2 text-[#e9d8a6] focus:border-[#d4af37] focus:outline-none"
              dir="ltr"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">كلمة السر</label>
            <input
              type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border border-[#d4af37]/30 rounded px-3 py-2 text-[#e9d8a6] focus:border-[#d4af37] focus:outline-none"
              dir="ltr"
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit" disabled={loading}
            className="w-full bg-[#d4af37] text-black font-semibold py-2 rounded hover:bg-[#e9c552] transition disabled:opacity-50"
          >
            {loading ? "..." : mode === "signin" ? "دخول" : "تسجيل"}
          </button>
        </form>
        <button
          type="button" onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="w-full mt-4 text-sm text-[#d4af37]/70 hover:text-[#d4af37]"
        >
          {mode === "signin" ? "ليس لديك حساب؟ سجّل الآن" : "لديك حساب؟ سجّل الدخول"}
        </button>
      </div>
    </div>
  );
}
