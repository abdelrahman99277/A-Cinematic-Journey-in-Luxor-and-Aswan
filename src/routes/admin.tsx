import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  getMyRole, claimAdmin,
  adminListBookings, adminListTrips,
  adminSaveTrip, adminDeleteTrip,
  adminUpdateBookingStatus, adminDeleteBooking,
} from "@/lib/booking.functions";
import { SiteGate } from "@/components/SiteGate";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "لوحة الإدارة" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: () => (
    <SiteGate>
      <AdminPage />
    </SiteGate>
  ),
});

function AdminPage() {
  const navigate = useNavigate();
  const [session, setSession] = useState<"loading" | "none" | "ok">("loading");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ? "ok" : "none");
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s ? "ok" : "none");
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session === "none") navigate({ to: "/auth" });
  }, [session, navigate]);

  if (session !== "ok") {
    return <div className="min-h-screen bg-black text-[#d4af37] flex items-center justify-center">جارٍ التحميل...</div>;
  }
  return <AdminDashboard />;
}

function AdminDashboard() {
  const roleFn = useServerFn(getMyRole);
  const claimFn = useServerFn(claimAdmin);
  const qc = useQueryClient();
  const roleQ = useQuery({ queryKey: ["my-role"], queryFn: () => roleFn() });

  const claim = useMutation({
    mutationFn: () => claimFn({ data: undefined as never }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["my-role"] }),
  });

  if (roleQ.isLoading) return <FullScreen>جارٍ التحقق...</FullScreen>;
  if (!roleQ.data?.isAdmin) {
    return (
      <FullScreen>
        <div className="text-center max-w-md">
          <h1 className="text-2xl text-[#d4af37] mb-4">ليس لديك صلاحية</h1>
          <p className="text-[#e9d8a6]/70 mb-6 text-sm">لو أنت أول شخص، اضغط أدناه للحصول على صلاحية الأدمن.</p>
          <button
            onClick={() => claim.mutate()}
            disabled={claim.isPending}
            className="bg-[#d4af37] text-black px-6 py-2 rounded font-semibold hover:bg-[#e9c552] disabled:opacity-50"
          >
            {claim.isPending ? "..." : "طلب صلاحية الأدمن"}
          </button>
          {claim.data && !claim.data.promoted && (
            <p className="text-red-400 text-sm mt-4">يوجد أدمن بالفعل. اتواصل معه.</p>
          )}
          <button onClick={() => supabase.auth.signOut()} className="block mx-auto mt-6 text-xs text-[#d4af37]/60 hover:text-[#d4af37]">
            تسجيل الخروج
          </button>
        </div>
      </FullScreen>
    );
  }

  return <AdminHome />;
}

function FullScreen({ children }: { children: React.ReactNode }) {
  return (
    <div dir="rtl" className="min-h-screen bg-black text-[#e9d8a6] flex items-center justify-center px-4 font-[Cairo]">
      {children}
    </div>
  );
}

function AdminHome() {
  const [tab, setTab] = useState<"bookings" | "trips">("bookings");
  return (
    <div dir="rtl" className="min-h-screen bg-black text-[#e9d8a6] font-[Cairo]">
      <header className="border-b border-[#d4af37]/20 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl text-[#d4af37]">لوحة الإدارة</h1>
        <div className="flex gap-4 items-center">
          <Link to="/" className="text-sm text-[#d4af37]/70 hover:text-[#d4af37]">الموقع</Link>
          <button onClick={() => supabase.auth.signOut()} className="text-sm text-[#d4af37]/70 hover:text-[#d4af37]">
            خروج
          </button>
        </div>
      </header>
      <nav className="px-6 py-3 flex gap-2 border-b border-[#d4af37]/10">
        {(["bookings", "trips"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded text-sm ${tab === t ? "bg-[#d4af37] text-black" : "text-[#e9d8a6]/70 hover:bg-[#d4af37]/10"}`}>
            {t === "bookings" ? "الحجوزات" : "الرحلات"}
          </button>
        ))}
      </nav>
      <main className="p-6">
        {tab === "bookings" ? <BookingsPanel /> : <TripsPanel />}
      </main>
    </div>
  );
}

function BookingsPanel() {
  const listFn = useServerFn(adminListBookings);
  const statusFn = useServerFn(adminUpdateBookingStatus);
  const delFn = useServerFn(adminDeleteBooking);
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["admin-bookings"], queryFn: () => listFn() });

  const upd = useMutation({
    mutationFn: (v: { id: string; status: "pending" | "confirmed" | "cancelled" | "completed" }) => statusFn({ data: v }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-bookings"] }),
  });
  const del = useMutation({
    mutationFn: (id: string) => delFn({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-bookings"] }),
  });

  if (q.isLoading) return <p>جارٍ التحميل...</p>;
  if (!q.data?.length) return <p className="text-[#e9d8a6]/60">لا توجد حجوزات.</p>;

  return (
    <div className="space-y-3">
      {q.data.map((b: any) => (
        <div key={b.id} className="border border-[#d4af37]/20 rounded p-4 bg-[#0a0a0a]">
          <div className="flex justify-between flex-wrap gap-2">
            <div>
              <p className="text-[#d4af37] font-semibold">{b.full_name} <span className="text-xs text-[#e9d8a6]/60">— {b.trips?.title ?? "بدون رحلة"}</span></p>
              <p className="text-sm text-[#e9d8a6]/80" dir="ltr">{b.email} · {b.phone}</p>
              <p className="text-xs text-[#e9d8a6]/60 mt-1">
                {b.people_count} أشخاص · {b.trip_date ?? "بدون تاريخ"} · {b.nationality ?? "—"}
              </p>
              <p className="text-xs text-[#e9d8a6]/60">إقامة: {b.accommodation_type ?? "—"} · ميزانية: {b.budget ?? "—"} · مواصلات: {b.transportation ?? "—"}</p>
              {b.meals && <p className="text-xs text-[#e9d8a6]/60">وجبات: {b.meals}</p>}
              {b.notes && <p className="text-xs text-[#e9d8a6]/70 mt-1">📝 {b.notes}</p>}
            </div>
            <div className="flex flex-col gap-1 items-end">
              <select value={b.status} onChange={(e) => upd.mutate({ id: b.id, status: e.target.value as any })}
                className="bg-black border border-[#d4af37]/30 rounded px-2 py-1 text-sm">
                <option value="pending">قيد الانتظار</option>
                <option value="confirmed">مؤكد</option>
                <option value="completed">مكتمل</option>
                <option value="cancelled">ملغي</option>
              </select>
              <button onClick={() => { if (confirm("حذف؟")) del.mutate(b.id); }}
                className="text-xs text-red-400 hover:text-red-300">حذف</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function TripsPanel() {
  const listFn = useServerFn(adminListTrips);
  const saveFn = useServerFn(adminSaveTrip);
  const delFn = useServerFn(adminDeleteTrip);
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["admin-trips"], queryFn: () => listFn() });
  const [editing, setEditing] = useState<any | null>(null);

  const save = useMutation({
    mutationFn: (v: { id?: string | null; trip: any }) => saveFn({ data: v }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-trips"] }); setEditing(null); },
  });
  const del = useMutation({
    mutationFn: (id: string) => delFn({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-trips"] }),
  });

  return (
    <div className="space-y-4">
      <button onClick={() => setEditing({ title: "", description: "", price: 0, duration: "", image_url: "", is_active: true })}
        className="bg-[#d4af37] text-black px-4 py-2 rounded text-sm font-semibold">+ رحلة جديدة</button>

      {editing && (
        <form onSubmit={(e) => {
          e.preventDefault();
          const t = editing;
          save.mutate({ id: t.id ?? null, trip: {
            title: t.title, description: t.description || null,
            price: t.price ? Number(t.price) : null,
            duration: t.duration || null, image_url: t.image_url || null,
            is_active: !!t.is_active,
          }});
        }} className="border border-[#d4af37]/30 rounded p-4 bg-[#0a0a0a] space-y-2">
          <input required placeholder="العنوان" value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })}
            className="w-full bg-black border border-[#d4af37]/20 rounded px-3 py-2" />
          <textarea placeholder="الوصف" value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })}
            className="w-full bg-black border border-[#d4af37]/20 rounded px-3 py-2" rows={3} />
          <div className="grid grid-cols-2 gap-2">
            <input placeholder="السعر" type="number" value={editing.price ?? ""} onChange={(e) => setEditing({ ...editing, price: e.target.value })}
              className="bg-black border border-[#d4af37]/20 rounded px-3 py-2" />
            <input placeholder="المدة (يوم/ساعات)" value={editing.duration ?? ""} onChange={(e) => setEditing({ ...editing, duration: e.target.value })}
              className="bg-black border border-[#d4af37]/20 rounded px-3 py-2" />
          </div>
          <input placeholder="رابط الصورة" value={editing.image_url ?? ""} onChange={(e) => setEditing({ ...editing, image_url: e.target.value })}
            className="w-full bg-black border border-[#d4af37]/20 rounded px-3 py-2" dir="ltr" />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={!!editing.is_active} onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })} />
            متاح للحجز
          </label>
          <div className="flex gap-2">
            <button type="submit" disabled={save.isPending} className="bg-[#d4af37] text-black px-4 py-2 rounded font-semibold">حفظ</button>
            <button type="button" onClick={() => setEditing(null)} className="border border-[#d4af37]/30 px-4 py-2 rounded">إلغاء</button>
          </div>
        </form>
      )}

      {q.isLoading ? <p>جارٍ التحميل...</p> : (
        <div className="space-y-2">
          {q.data?.map((t: any) => (
            <div key={t.id} className="border border-[#d4af37]/20 rounded p-4 bg-[#0a0a0a] flex justify-between items-center">
              <div>
                <p className="text-[#d4af37] font-semibold">{t.title} {!t.is_active && <span className="text-xs text-red-400">(مخفي)</span>}</p>
                <p className="text-xs text-[#e9d8a6]/60">{t.duration} · {t.price ? `${t.price} ج.م` : "بدون سعر"}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setEditing(t)} className="text-sm text-[#d4af37] hover:underline">تعديل</button>
                <button onClick={() => { if (confirm("حذف؟")) del.mutate(t.id); }} className="text-sm text-red-400">حذف</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
