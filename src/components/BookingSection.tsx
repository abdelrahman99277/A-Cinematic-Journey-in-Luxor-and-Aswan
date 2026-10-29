import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { motion } from "framer-motion";
import { listActiveTrips, createBooking } from "@/lib/booking.functions";

export function BookingSection() {
  const listFn = useServerFn(listActiveTrips);
  const bookFn = useServerFn(createBooking);
  const trips = useQuery({ queryKey: ["trips"], queryFn: () => listFn() });
  const [form, setForm] = useState({
    trip_id: "", full_name: "", email: "", phone: "", nationality: "",
    people_count: 2, trip_date: "", accommodation_type: "", budget: "",
    transportation: "", meals: "", notes: "",
  });

  const mut = useMutation({
    mutationFn: () => bookFn({ data: {
      trip_id: form.trip_id || null,
      full_name: form.full_name, email: form.email, phone: form.phone,
      nationality: form.nationality || null,
      people_count: Number(form.people_count),
      trip_date: form.trip_date || null,
      accommodation_type: form.accommodation_type || null,
      budget: form.budget || null,
      transportation: form.transportation || null,
      meals: form.meals || null,
      notes: form.notes || null,
    }}),
  });

  return (
    <section id="booking" dir="rtl" className="relative min-h-screen bg-black py-24 px-4 font-[Cairo] overflow-hidden">
      {/* Ambient gold glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/2 translate-x-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,#d4af37_0%,transparent_60%)] opacity-[0.08] blur-3xl" />
        <div className="absolute inset-x-6 inset-y-6 border border-[#d4af37]/5 rounded-sm pointer-events-none" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="relative max-w-2xl mx-auto"
      >
        {/* Hero header */}
        <header className="text-center mb-10">
          <h2 className="text-[#d4af37] text-6xl md:text-7xl font-bold mb-2" style={{ fontFamily: "'Amiri', serif" }}>
            احجز رحلتك
          </h2>
          <p className="text-gray-400 text-[10px] md:text-xs tracking-[0.4em] uppercase">Book Your Journey</p>
          <div className="w-10 h-px bg-[#d4af37] mx-auto mt-5" />
          <p className="text-[#e9d8a6]/60 text-sm mt-5 max-w-md mx-auto">
            اكتب بياناتك واختار الرحلة اللي عايزها وهنتواصل معاك في أقرب وقت.
          </p>
        </header>

        {mut.isSuccess ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center bg-zinc-900/80 border border-[#d4af37]/30 backdrop-blur-sm rounded-2xl p-12 shadow-2xl"
          >
            <div className="text-5xl text-[#d4af37] mb-4">✦</div>
            <p className="text-3xl text-[#d4af37] mb-2" style={{ fontFamily: "'Amiri', serif" }}>تم استلام حجزك</p>
            <p className="text-[#e9d8a6]/80 text-sm">هنتواصل معاك في أقرب وقت على الإيميل أو التليفون.</p>
          </motion.div>
        ) : (
          <div className="bg-zinc-900/80 border border-[#d4af37]/20 rounded-2xl p-6 md:p-8 backdrop-blur-sm shadow-[0_0_60px_-15px_rgba(212,175,55,0.3)]">
            {/* Card header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#d4af37]/10">
              <h3 className="text-[#d4af37] text-xl font-bold" style={{ fontFamily: "'Amiri', serif" }}>
                تفاصيل الحجز
              </h3>
              <span className="text-[10px] text-zinc-500 tracking-widest">LUXOR ✦ ASWAN ✦ EGYPT</span>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); mut.mutate(); }} className="space-y-4">
              {/* Trip */}
              <Field label="الرحلة المختارة">
                <select value={form.trip_id} onChange={(e) => setForm({ ...form, trip_id: e.target.value })} className={inp}>
                  <option value="">-- بدون تحديد --</option>
                 <option value="">-- بدون تحديد --</option>
                  <option value="1">رحلة الاقصر واسوان شامل  </option>
                  <option value="2">رحلة الاقصر واسوان غير شامل  </option>
                  <option value="3">رحلة ملكي  </option>
                </select>
               </Field>   

              {/* Date + People */}
              <div className="grid grid-cols-2 gap-3">
                <Field label="التاريخ المفضل">
                  <input type="date" value={form.trip_date} onChange={(e) => setForm({ ...form, trip_date: e.target.value })} className={inp} />
                </Field>
                <Field label="عدد الأفراد *">
                  <input required type="number" min={1} value={form.people_count} onChange={(e) => setForm({ ...form, people_count: Number(e.target.value) })} className={inp} />
                </Field>
              </div>

              {/* Name */}
              <Field label="الاسم بالكامل *">
                <input required value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} placeholder="الاسم الكامل" className={inp} />
              </Field>

              {/* Email + Phone */}
              <div className="grid grid-cols-2 gap-3">
                <Field label="الإيميل *">
                  <input required type="email" dir="ltr" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@mail.com" className={inp} />
                </Field>
                <Field label="التليفون *">
                  <input required dir="ltr" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+20" className={inp} />
                </Field>
              </div>

              {/* Nationality alone row */}
              <Field label="الجنسية">
                <input value={form.nationality} onChange={(e) => setForm({ ...form, nationality: e.target.value })} placeholder="مصري" className={inp} />
              </Field>

              {/* Accommodation + Budget */}
              <div className="grid grid-cols-2 gap-3">
                <Field label="نوع الإقامة">
                  <select value={form.accommodation_type} onChange={(e) => setForm({ ...form, accommodation_type: e.target.value })} className={inp}>
                    <option value="">--</option>
                    <option>فندق 5 نجوم</option>
                    <option>فندق 4 نجوم</option>
                    <option>فندق 3 نجوم</option>
                    <option>باخرة نيلية</option>
                    <option>شقة مفروشة</option>
                  </select>
                </Field>
                <Field label="الميزانية">
                  <select value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} className={inp}>
                    <option value="">--</option>
                    <option>أقل من 5000 ج.م</option>
                    <option>5000 - 15000 ج.م</option>
                    <option>15000 - 30000 ج.م</option>
                    <option>أكثر من 30000 ج.م</option>
                  </select>
                </Field>
              </div>

              {/* Transport + Meals */}
              <div className="grid grid-cols-2 gap-3">
                <Field label="وسيلة المواصلات">
                  <select value={form.transportation} onChange={(e) => setForm({ ...form, transportation: e.target.value })} className={inp}>
                    <option value="">--</option>
                    <option>طيران</option>
                    <option>قطار</option>
                    <option>سيارة خاصة</option>
                    <option>أتوبيس</option>
                  </select>
                </Field>
                <Field label="وجبات خاصة">
                  <input placeholder="نباتي / حلال..." value={form.meals} onChange={(e) => setForm({ ...form, meals: e.target.value })} className={inp} />
                </Field>
              </div>

              {/* Notes */}
              <Field label="ملاحظات إضافية">
                <textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="أي طلب خاص عايز نعرفه..." className={`${inp} resize-none`} />
              </Field>

              {mut.isError && (
                <p className="text-red-400 text-xs text-center bg-red-500/10 border border-red-500/30 rounded-lg py-2">
                  حصل خطأ، حاول تاني.
                </p>
              )}

              <button
                type="submit"
                disabled={mut.isPending}
                className="w-full bg-[#d4af37] text-black font-bold py-4 rounded-lg mt-2 shadow-[0_0_30px_rgba(212,175,55,0.35)] hover:bg-[#e9c552] hover:shadow-[0_0_45px_rgba(212,175,55,0.5)] active:scale-[0.98] transition-all text-sm tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {mut.isPending ? "جارٍ الإرسال..." : "تأكيد الحجز ✦"}
              </button>
            </form>
          </div>
        )}

        {/* Decorative dots */}
        <div className="mt-8 flex justify-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
          <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
          <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
        </div>
      </motion.div>
    </section>
  );
}

const inp = "w-full bg-black/40 border border-zinc-800 rounded-lg px-3 py-2.5 text-[#e9d8a6] text-sm focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/40 focus:outline-none transition-all placeholder:text-zinc-600";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[10px] text-[#d4af37] mb-1.5 mr-1 tracking-wider font-semibold">{label}</span>
      {children}
    </label>
  );
}
