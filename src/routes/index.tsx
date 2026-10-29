import { createFileRoute } from "@tanstack/react-router";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { BookingSection } from "@/components/BookingSection";

import luxorTemple from "@/assets/back.jpg";
import karnak from "@/assets/karnak.jpg";
import felucca from "@/assets/felucca.jpg";
import balloons from "@/assets/balloons.jpg";
import abuSimbel from "@/assets/abu-simbel.jpg";
import museum from "@/assets/museum.jpg";
import hatshepsut from "@/assets/hatshepsut.jpg";
import memnon from "@/assets/memnon.jpg";
import khan from "@/assets/khan.jpg";
import corniche from "@/assets/corniche.jpg";

import aswanDam from "@/assets/aswan-high-dam.jpg";
import aswanObelisk from "@/assets/aswan-unfinished-obelisk.jpg";
import aswanPhilae from "@/assets/aswan-philae-temple.jpg";
import luxorTempleEntrance from "@/assets/luxor.jpg";

export const Route = createFileRoute("/")({
  component: Index,
});

type Chapter = {
  n: string;
  place: string;
  placeEn: string;
  title: string;
  body: string;
  image: string;
  align: "right" | "left" | "center";
};

const chapters: Chapter[] = [
  // ═══ الأقصر ═══
  {
    n: "1",
    place: "معبد الأقصر",
    placeEn: "LUXOR TEMPLE",
    title: "جوهرة طيبة المتلألئة",
    body: "على كورنيش النيل، يقف معبد الأقصر بمسلّاته وتماثيله العملاقة كحارسٍ على المدينة منذ عهد أمنحتب الثالث ورمسيس الثاني. حين يسقط الغروب على أعمدته، يتحوّل الحجر إلى ذهبٍ سائل.",
    image: luxorTempleEntrance,
    align: "right",
  },
  {
    n: "2",
    place: "معبد الكرنك",
    placeEn: "KARNAK",
    title: "غابةٌ من الحجر",
    body: "مئةٌ وأربعةٌ وثلاثون عموداً تصطفّ كأشجارٍ من الجرانيت، منقوشةً بأسرار الآلهة وأسماء الملوك. هنا يمشي الزائر تحت سماءٍ نحتها الفراعنة قبل ثلاثة آلاف عام، فيهمس الحجر بما نسيه الزمن.",
    image: karnak,
    align: "left",
  },
  {
    n: "3",
    place: "معبد حتشبسوت",
    placeEn: "HATSHEPSUT",
    title: "الدير البحري..تحفة حتشبسوت المعمارية",
    body: "معبد يكسر قواعد العمارة التقليدية، منحوت في قلب الجبل بانسجام مذهل. استكشف قصة الملكة القوية التي حكمت مصر في العصر الذهبي.",
    image: hatshepsut,
    align: "right",
  },
  {
    n: "4",
    place: "تمثالا ممنون",
    placeEn: "COLOSSI",
    title: "حارسا طيبة..شامخان منذ الأزل",
    body: "عملاقان من الحجر يقفان منذ ١٣٥٠ قبل الميلاد حارسَين لمعبدٍ اندثر. كانا يوماً يغنّيان مع الفجر — أسطورةٌ روتها الرياح للمسافرين.",
    image: memnon,
    align: "left",
  },
  {
    n: "5",
    place: "البر الغربي",
    placeEn: "WEST BANK",
    title: "بالوناتٌ فوق الأبدية",
    body: "قبل شروق الشمس، تتحرّر البالونات نحو السماء، محلّقةً فوق وادي الملوك ومعابد الجبل. مشهدٌ يحوّل الفجر إلى لوحةٍ تتنفّس ذهباً وضباباً.",
    image: balloons,
    align: "center",
  },
  {
    n: "6",
    place: "كورنيش الأقصر",
    placeEn: "CORNICHE",
    title: "حيث ينام النيل",
    body: "عند المغيب، يتحوّل الكورنيش إلى مسرحٍ مفتوح: نخيلٌ يتمايل، مراكب تعود إلى مرساها، ومعبدٌ يستيقظ بنور الليل. هنا تبدأ الرحلة جنوباً نحو أسوان.",
    image: corniche,
    align: "left",
  },
  // ═══ العبّارة جنوباً ═══
  {
    n: "7",
    place: "النيل الخالد",
    placeEn: "SAILING SOUTH",
    title: "شراعٌ يعانق الغروب",
    body: "على صفحة النيل، تنساب المراكب الشراعية جنوباً كما فعلت منذ آلاف السنين. لحظةُ سكونٍ تختصر عمر النهر الذي أنجب حضارةً بأكملها، حاملةً المسافر من الأقصر إلى أسوان.",
    image: felucca,
    align: "center",
  },
  // ═══ أسوان ═══
  {
    n: "8",
    place: "المسلة الناقصة",
    placeEn: "UNFINISHED OBELISK",
    title: "حلمٌ نائمٌ في المحجر",
    body: "في محاجر أسوان الفرعونية، ترقد أكبر مسلّةٍ حاول المصريون القدماء نحتها — أكثر من ألف طنٍّ من الجرانيت الوردي. شقٌّ واحدٌ في الصخر أوقف الحلم، لكنه كشف سرّ صناعتهم للأبد.",
    image: aswanObelisk,
    align: "right",
  },
  {
    n: "9",
    place: "معبد فيلة",
    placeEn: "PHILAE TEMPLE",
    title: "جزيرةٌ تحكي قصة حب ",
    body: "وسط مياه النيل، يطفو معبد فيلة كأنه سفينةٌ من حجر. نُقل حجراً حجراً لينجو من الغرق، فحمل معه أسطورة إيزيس وأوزوريس عبر آلاف السنين إلى يومنا هذا.",
    image: aswanPhilae,
    align: "left",
  },
  {
    n: "10",
    place: "السد العالي",
    placeEn: "HIGH DAM",
    title: "نهرٌ روّضه الإنسان",
    body: "حيث يهدر الماء بين البوّابات الخرسانية، يقف السد العالي شاهداً على مصرَ الحديثة كما تقف المعابد شاهدةً على مصرَ القديمة. هنا وُلدت بحيرة ناصر، وتغيّر وجه الجنوب إلى الأبد.",
    image: aswanDam,
    align: "center",
  },
  {
    n: "11",
    place: "أبو سمبل",
    placeEn: "ABU SIMBEL",
    title: "معجزة الشمس",
    body: "مرّتين في العام، يخترق شعاع الشمس ظلمة الحرم ليضيء وجه رمسيس. هندسةٌ فلكيةٌ دقيقة نحتها المصريون في قلب الجبل قبل أن يعرف العالم الحساب.",
    image: abuSimbel,
    align: "right",
  },
  {
    n: "12",
    place: "متحف الحضارة",
    placeEn: "THE MUSEUM",
    title: "متحف التحنيط..علم لا يزال يبهر العلماء",
    body: "تعرّف على الأسرار الدفينة لعملية التحنيط الفرعونية.أدوات، طقوس،وفلسفة قدماءالمصريين في الحفاظ على أجسادهم للعبور إلى العالم الآخر",
    image: museum,
    align: "left",
  },
  {
    n: "13",
    place: "السوق السياحي",
    placeEn: "TOURIST BAZAAR",
    title: "حِرفةٌ لا تنام",
    body: "بين أسواق الأقصر وأسوان، تتشابك رائحة البخور مع ضوء الفوانيس، وتلمع النحاسيّات كأنها ذهبٌ فرعونيّ. هنا يصنع الحرفيّون التاريخ من جديد، بيدٍ ورثت المهنة عن الأجداد، وتذكارٌ يعود مع كلّ مسافر.",
    image: khan,
    align: "center",
  },
];

function Index() {
  return (
    <div className="relative bg-background text-foreground">
      <Cursor />
      <Nav />
      <ProgressRail />
      <Hero />
      <Intro />
      {chapters.map((c, i) => (
        <Chapter key={i} chapter={c} index={i} />
      ))}
      <BookingSection />
      <Finale />

    </div>
  );
}

/* ---------------- Cursor ---------------- */
function Cursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 400, damping: 30 });
  const sy = useSpring(y, { stiffness: 400, damping: 30 });
  useEffect(() => {
    const move = (e: MouseEvent) => { x.set(e.clientX); y.set(e.clientY); };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);
  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-[100] hidden h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold mix-blend-difference md:block"
      style={{ x: sx, y: sy }}
    />
  );
}

/* ---------------- Progress Rail ---------------- */
function ProgressRail() {
  const { scrollYProgress } = useScroll();
  const h = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  return (
    <div className="pointer-events-none fixed right-6 top-1/2 z-40 hidden h-48 w-px -translate-y-1/2 bg-gold/15 md:block">
      <motion.div style={{ height: h }} className="w-full origin-top bg-gold" />
    </div>
  );
}

/* ---------------- Nav ---------------- */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1.2, delay: 0.6 }}
      className={`fixed top-0 z-50 w-full transition-all duration-500 ${
        scrolled ? "backdrop-blur-md bg-background/70 border-b border-border" : ""
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:py-6">
        <a href="#" className="flex items-baseline gap-2">
          <span className="font-serif text-2xl text-gold tracking-latin">LUXOR · ASWAN</span>
          <span className="tracking-latin text-[10px] text-muted-foreground">CINEMA</span>
        </a>
        <nav className="hidden items-center gap-8 text-sm md:flex">
          {["البداية", "الفصول", "الرحلة", "تواصل"].map((l) => (
            <a key={l} href="#" className="group relative text-foreground/80 transition hover:text-gold">
              {l}
              <span className="absolute -bottom-1 right-0 h-px w-0 bg-gold transition-all duration-500 group-hover:w-full" />
            </a>
          ))}
        </nav>
        <a href="#booking" className="tracking-latin border border-gold/60 px-5 py-2 text-xs text-gold transition hover:bg-gold hover:text-ink">
          احجز رحلتك
        </a>
      </div>
    </motion.header>
  );
}

/* ---------------- Hero ---------------- */
function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"]);

  return (
    <section ref={ref} className="relative h-[110vh] w-full overflow-hidden">
      <motion.div style={{ y, scale }} className="absolute inset-0">
        <img src={luxorTemple} alt="مدخل معبد الأقصر عند الغروب" className="h-full w-full object-cover animate-ken-burns" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/10 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-background/40" />
      </motion.div>

      <motion.div style={{ y: textY, opacity }} className="relative z-10 flex h-screen flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1.4, delay: 0.4 }}
          className="mb-6 flex items-center gap-4"
        >
          <span className="h-px w-12 bg-gold" />
          <span className="tracking-latin text-[10px] text-gold md:text-xs">رحلةٌ سينمائية</span>
          <span className="h-px w-12 bg-gold" />
        </motion.div>

        <h1 className="font-serif leading-[0.95] text-shadow-cinema">
          <RevealWord text="الأقصر وأسوان" delay={0.6} className="block gradient-gold text-6xl font-bold md:text-[8.5rem]" />
          <RevealWord text="حيث ينام التاريخ" delay={1.4} className="mt-6 block text-2xl font-light text-foreground/95 md:text-5xl" />
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 2.2 }}
          className="mt-12 max-w-xl text-base leading-loose text-foreground/70 md:text-lg md:leading-[2]"
        >
          تجربةٌ بصريّة عبر قلب مصر القديمة، من معابد الأقصر إلى جزر أسوان —<br className="hidden md:block" /> نيلٌ يروي، وشمسٌ لا تغيب عن ذاكرة الحجر.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2.8 }}
          className="absolute bottom-14 flex flex-col items-center gap-3"
        >
          <span className="tracking-latin text-[10px] text-gold/70">SCROLL</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="h-14 w-px bg-gradient-to-b from-gold to-transparent"
          />
        </motion.div>
      </motion.div>

      <div className="vignette absolute inset-0 z-[5]" />
      <div className="noise absolute inset-0 z-[5]" />
    </section>
  );
}

function RevealWord({ text, delay = 0, className = "" }: { text: string; delay?: number; className?: string }) {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-2 align-bottom">
          <motion.span
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            transition={{ duration: 1.1, delay: delay + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="inline-block"
          >
            {w}
            {i < words.length - 1 && "\u00A0"}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/* ---------------- Intro ---------------- */
function Intro() {
  return (
    <section className="relative mx-auto max-w-4xl px-6 py-32 md:py-44">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.5 }}
        className="text-center"
      >
        <div className="mb-8 flex items-center justify-center gap-4">
          <span className="h-px w-12 bg-gold/60" />
          <span className="tracking-latin text-[10px] text-gold">PROLOGUE</span>
          <span className="h-px w-12 bg-gold/60" />
        </div>
        <p className="font-serif text-2xl leading-loose text-foreground/95 md:text-4xl md:leading-[1.7]">
          <ScrollReveal>
            في أرضٍ ولدت فيها الحضارة، لا يمرّ الوقت — بل يترسّب. كل حجرٍ يحمل ذكري، وكل نقشٍ يهمس باسمٍ نُسي منذ الفراعنة.
          </ScrollReveal>
        </p>
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay: 0.4 }}
          className="mx-auto mt-16 h-px w-32 origin-center bg-gold"
        />
      </motion.div>
    </section>
  );
}

function ScrollReveal({ children }: { children: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 40%"] });
  const words = children.split(" ");
  return (
    <span ref={ref}>
      {words.map((w, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;
        return <Word key={i} progress={scrollYProgress} range={[start, end]}>{w}</Word>;
      })}
    </span>
  );
}

function Word({ children, progress, range }: { children: string; progress: any; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block">
      {children}&nbsp;
    </motion.span>
  );
}

/* ---------------- Chapter ---------------- */
function Chapter({ chapter, index }: { chapter: Chapter; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.2, 1.05, 1.2]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 0.35, 0.9]);
  const watermarkX = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);
  const watermarkOpacity = useTransform(scrollYProgress, [0.1, 0.4, 0.7, 0.9], [0, 0.09, 0.09, 0]);

  const isLeft = chapter.align === "left";
  const isCenter = chapter.align === "center";

  return (
    <section ref={ref} className="relative h-[140vh] w-full overflow-hidden">
      {/* Image */}
      <motion.div style={{ y, scale }} className="absolute inset-0">
        <img src={chapter.image} alt={chapter.place} className="h-full w-full object-cover" loading="lazy" />
      </motion.div>
      <motion.div style={{ opacity: overlayOpacity }} className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
      <div className="vignette absolute inset-0" />

      {/* Giant Latin watermark of place name */}
      <motion.div
        style={{ x: watermarkX, opacity: watermarkOpacity }}
        className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none text-center"
      >
        <span className="tracking-latin block whitespace-nowrap font-serif text-[22vw] font-bold leading-none text-gold md:text-[18vw]">
          {chapter.placeEn}
        </span>
      </motion.div>

      <div className="sticky top-0 flex h-screen items-center">
        <div className={`relative z-10 mx-auto flex w-full max-w-7xl px-6 md:px-14 ${
          isLeft ? "justify-start" : isCenter ? "justify-center" : "justify-end"
        }`}>
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className={`max-w-xl ${isCenter ? "text-center" : ""}`}
          >
            {/* Chapter label */}
            <div className={`mb-8 flex items-center gap-4 ${isCenter ? "justify-center" : ""}`}>
              <span className="font-serif text-5xl text-gold md:text-6xl">{chapter.n}</span>
              <span className="h-px w-16 bg-gold/50" />
              <span className="tracking-latin text-[10px] text-gold">CHAPTER</span>
            </div>

            {/* Place name — bold Arabic */}
            <motion.p
              initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-15%" }}
              transition={{ duration: 1, delay: 0.3 }}
              className="mb-3 font-serif text-2xl font-bold text-gold md:text-3xl"
            >
              {chapter.place}
            </motion.p>

            {/* Title */}
            <h2 className="font-serif text-5xl leading-[1.1] text-foreground text-shadow-cinema md:text-7xl">
              <StaggerWords text={chapter.title} />
            </h2>

            {/* Ornamental divider */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: "-15%" }}
              transition={{ duration: 1, delay: 0.7 }}
              className={`mt-8 flex items-center gap-3 ${isCenter ? "justify-center" : ""} origin-right`}
            >
              <span className="h-px w-16 bg-gold" />
              <span className="text-gold text-lg">◆</span>
              <span className="h-px w-6 bg-gold/40" />
            </motion.div>

            {/* Body */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-15%" }}
              transition={{ duration: 1.2, delay: 0.9 }}
              className="mt-6 text-lg leading-loose text-foreground/90 md:text-xl md:leading-[2]"
            >
              {chapter.body}
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function StaggerWords({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <span className="inline-block">
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-3 align-bottom">
          <motion.span
            initial={{ y: "110%", opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 1, delay: 0.2 + i * 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="inline-block"
          >
            {w}
            {i < words.length - 1 && "\u00A0"}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/* ---------------- Finale ---------------- */
function Finale() {
  return (
    <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden px-6 py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold/5 to-background" />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4 }}
        className="relative text-center"
      >
        <div className="mb-8 flex items-center justify-center gap-4">
          <span className="h-px w-12 bg-gold/60" />
          <span className="tracking-latin text-[10px] text-gold">FIN</span>
          <span className="h-px w-12 bg-gold/60" />
        </div>
        <h3 className="font-serif text-5xl leading-tight md:text-8xl">
          <span className="gradient-gold">شكراً لأنّك سافرت معنا</span>
        </h3>
        <p className="mx-auto mt-10 max-w-lg text-base leading-loose text-foreground/70 md:text-lg">
          الأقصر وأسوان ليستا وجهةً… إنّهما ذاكرةٌ تنتظر أن تُروى مرّةً أخرى.
        </p>
        <motion.a
          href="#booking"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="tracking-latin mt-12 inline-block border border-gold px-10 py-4 text-xs text-gold transition hover:bg-gold hover:text-ink"
        >
          ابدأ رحلتك
        </motion.a>
        <p className="tracking-latin mt-20 text-[10px] text-muted-foreground">© LUXOR · ASWAN CINEMA — ٢٠٢٦</p>
      </motion.div>
    </section>
  );
}
