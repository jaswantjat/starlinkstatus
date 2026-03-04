"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      "dotlottie-wc": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        src?: string;
        autoplay?: boolean | string;
        loop?: boolean | string;
        style?: React.CSSProperties;
      };
    }
  }
}

/* ─── types ─────────────────────────────────────────── */
type Grade = "pass" | "risk" | "fail";

interface VerificationRow {
  Estado?: { value: string } | string;
  Resultado?: { value: string } | string;
  "Puntuación Total"?: string | number;
  "Seguridad Aprobada"?: boolean | string;
  "Evidencia Faltante"?: string;
  "Puntuación: Ejecución"?: string | number;
  "Puntuación: Condición del Sitio"?: string | number;
  "Puntuación: Documentación"?: string | number;
  "Puntuación: Educación"?: string | number;
  "Resumen de IA"?: string;
}

/* ─── Demo data ─────────────────────────────────────── */
const DEMO_ROW: VerificationRow = {
  Estado: "APROBADO",
  Resultado: "Instalación completada con excelente rendimiento.",
  "Puntuación Total": 47,
  "Seguridad Aprobada": true,
  "Evidencia Faltante": "",
  "Puntuación: Ejecución": 14,
  "Puntuación: Condición del Sitio": 9,
  "Puntuación: Documentación": 14,
  "Puntuación: Educación": 10,
  "Resumen de IA":
    "La instalación cumple con todos los estándares aeroespaciales de Starlink × Eltex. El técnico demostró un excelente dominio del protocolo de montaje, orientación del plato y configuración de red. La documentación fotográfica es completa y la capacitación al cliente fue exhaustiva. Se recomienda como instalación modelo.",
};

/* ─── helpers ───────────────────────────────────────── */
function gradeOf(score: number, estado: string): Grade {
  if (estado.toUpperCase() !== "APROBADO") return "fail";
  return score >= 45 ? "pass" : "risk";
}

function str(v: { value: string } | string | undefined): string {
  if (!v) return "";
  return typeof v === "object" ? v.value : v;
}

/* ─── Aurora Background ─────────────────────────────── */
function AuroraBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Deep space base */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 120% 80% at 50% 0%, #060d1f 0%, #030508 60%, #020304 100%)",
        }}
      />
      {/* Aurora blob 1 — blue */}
      <div
        className="absolute animate-aurora-1"
        style={{
          width: "80vw",
          height: "60vh",
          top: "-20vh",
          left: "-10vw",
          background:
            "radial-gradient(ellipse at center, rgba(56,109,255,0.18) 0%, transparent 70%)",
          filter: "blur(48px)",
        }}
      />
      {/* Aurora blob 2 — indigo/violet */}
      <div
        className="absolute animate-aurora-2"
        style={{
          width: "70vw",
          height: "50vh",
          top: "5vh",
          right: "-15vw",
          background:
            "radial-gradient(ellipse at center, rgba(120,60,255,0.14) 0%, transparent 70%)",
          filter: "blur(56px)",
        }}
      />
      {/* Aurora blob 3 — cyan accent */}
      <div
        className="absolute animate-aurora-3"
        style={{
          width: "50vw",
          height: "40vh",
          top: "10vh",
          left: "25vw",
          background:
            "radial-gradient(ellipse at center, rgba(0,200,255,0.09) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      {/* Subtle bottom glow */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: "30vh",
          background:
            "linear-gradient(to top, rgba(30,60,120,0.08) 0%, transparent 100%)",
        }}
      />
      {/* Fine grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
    </div>
  );
}

/* ─── Starfield ─────────────────────────────────────── */
function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const stars = Array.from({ length: 220 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      size: Math.random() * 1.2 + 0.2,
      speed: Math.random() * 0.15 + 0.03,
      opacity: Math.random(),
      fadeSpeed: Math.random() * 0.008 + 0.002,
      fadeDir: Math.random() > 0.5 ? 1 : -1,
    }));

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, w, h);
      stars.forEach((star) => {
        star.opacity += star.fadeSpeed * star.fadeDir;
        if (star.opacity >= 1) { star.opacity = 1; star.fadeDir = -1; }
        else if (star.opacity <= 0.05) { star.opacity = 0.05; star.fadeDir = 1; }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,220,255,${star.opacity * 0.8})`;
        ctx.fill();

        star.y -= star.speed;
        if (star.y < 0) { star.y = h; star.x = Math.random() * w; }
      });
      animationFrameId = requestAnimationFrame(render);
    };
    render();

    const resize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
    window.addEventListener("resize", resize);

    return () => { cancelAnimationFrame(animationFrameId); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[1]" />;
}

/* ─── confetti ──────────────────────────────────────── */
function runConfetti(canvas: HTMLCanvasElement) {
  canvas.style.display = "block";
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext("2d")!;
  const pal = ["#22c55e", "#3b82f6", "#f59e0b", "#a855f7", "#ffffff", "#38bdf8"];
  const bits = Array.from({ length: 150 }, () => ({
    x: Math.random() * canvas.width,
    y: -Math.random() * canvas.height * 0.5,
    r: Math.random() * 6 + 2,
    d: Math.random() * 3 + 1.5,
    c: pal[Math.floor(Math.random() * pal.length)],
    a: Math.random() * 360,
    s: (Math.random() - 0.5) * 8,
  }));
  let f = 0;
  (function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    bits.forEach((b) => {
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate((b.a * Math.PI) / 180);
      ctx.globalAlpha = Math.max(0, 1 - f / 180);
      ctx.fillStyle = b.c;
      ctx.fillRect(-b.r / 2, -b.r / 2, b.r, b.r * 2);
      ctx.restore();
      b.y += b.d;
      b.a += b.s;
      if (b.y > canvas.height) { b.y = -10; b.x = Math.random() * canvas.width; }
    });
    if (++f < 220) requestAnimationFrame(draw);
    else { ctx.clearRect(0, 0, canvas.width, canvas.height); canvas.style.display = "none"; }
  })();
}

/* ─── Animated Score ────────────────────────────────── */
function AnimatedScore({ value }: { value: number }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const duration = 2000;
    const startTime = performance.now();
    const animate = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOut * value));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [value]);
  return <>{count}</>;
}

/* ─── Loading component ─────────────────────────────── */
const MESSAGES = [
  "Estableciendo enlace satelital...",
  "Sincronizando telemetría...",
  "Recibiendo datos de la instalación...",
  "Analizando coordenadas...",
  "Verificando integridad estructural...",
  "Evaluando fotografías...",
];

function LoadingState({ msgIdx }: { msgIdx: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.03 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center gap-10 py-8"
    >
      {/* Lottie ring */}
      <div className="relative flex items-center justify-center">
        {/* outer glow ring */}
        <div
          className="absolute rounded-full animate-pulse-ring"
          style={{
            width: 280,
            height: 280,
            background:
              "radial-gradient(ellipse at center, rgba(56,109,255,0.12) 0%, transparent 70%)",
            border: "1px solid rgba(56,109,255,0.15)",
          }}
        />
        <div
          className="relative rounded-full overflow-hidden"
          style={{ width: 240, height: 240 }}
        >
          <dotlottie-wc
            src="https://lottie.host/897a4194-1cc9-4e83-8185-b1b4540c951f/46f51OeLjq.lottie"
            style={{ width: "240px", height: "240px", display: "block" }}
            autoplay="true"
            loop="true"
          />
        </div>
      </div>

      {/* Messages */}
      <div className="flex flex-col items-center gap-3 h-16">
        <AnimatePresence mode="wait">
          <motion.p
            key={msgIdx}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
            className="text-base md:text-lg font-medium tracking-wide text-white/80 text-center"
          >
            {MESSAGES[msgIdx % MESSAGES.length]}
          </motion.p>
        </AnimatePresence>
        <p className="text-[10px] text-blue-400/60 tracking-[0.25em] font-mono uppercase">
          Sistema de Verificación Activo
        </p>
      </div>

      {/* Progress bar */}
      <div className="w-48 h-[3px] bg-white/5 rounded-full overflow-hidden relative border border-white/[0.04]">
        <div className="absolute inset-y-0 w-1/2 rounded-full animate-loading-bar bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
      </div>
    </motion.div>
  );
}

/* ─── Result component ──────────────────────────────── */
function ResultState({
  row,
  editUrl,
  barReady,
}: {
  row: VerificationRow;
  editUrl: string | null;
  barReady: boolean;
}) {
  const estado = str(row.Estado);
  const res = str(row.Resultado);
  const score = Number(row["Puntuación Total"] ?? 0);
  const safety = row["Seguridad Aprobada"];
  const summary = row["Resumen de IA"] ?? "";
  const missing = (row["Evidencia Faltante"] ?? "").split("\n").filter(Boolean);
  const g = gradeOf(score, estado);

  const icons = {
    pass: (
      <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
      </svg>
    ),
    risk: (
      <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    fail: (
      <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
  };

  const badges = { pass: "Aprobado", risk: "Revisión necesaria", fail: "Requiere correcciones" };
  const titles = {
    pass: "¡Instalación completada!",
    risk: "Instalación en revisión",
    fail: "Hay puntos que mejorar",
  };
  const subs = { pass: "Tu instalación cumple todos los estándares aeroespaciales.", risk: res, fail: res };

  const theme = {
    pass: {
      glow: "shadow-[0_0_60px_rgba(34,197,94,0.18)]",
      text: "text-green-400",
      bgBadge: "bg-green-500/10 border-green-500/25",
      bar: "bg-gradient-to-r from-green-700 via-green-400 to-emerald-300",
      barShadow: "shadow-[0_0_20px_rgba(74,222,128,0.5)]",
      iconBg: "bg-green-500/10 border-green-500/30",
      iconGlow: "drop-shadow(0 0 12px rgba(74,222,128,0.6))",
      ringColor: "rgba(34,197,94,0.2)",
    },
    risk: {
      glow: "shadow-[0_0_60px_rgba(245,158,11,0.18)]",
      text: "text-amber-400",
      bgBadge: "bg-amber-500/10 border-amber-500/25",
      bar: "bg-gradient-to-r from-amber-700 via-amber-400 to-yellow-300",
      barShadow: "shadow-[0_0_20px_rgba(251,191,36,0.5)]",
      iconBg: "bg-amber-500/10 border-amber-500/30",
      iconGlow: "drop-shadow(0 0 12px rgba(251,191,36,0.6))",
      ringColor: "rgba(245,158,11,0.2)",
    },
    fail: {
      glow: "shadow-[0_0_60px_rgba(244,63,94,0.18)]",
      text: "text-rose-400",
      bgBadge: "bg-rose-500/10 border-rose-500/25",
      bar: "bg-gradient-to-r from-rose-700 via-rose-400 to-pink-300",
      barShadow: "shadow-[0_0_20px_rgba(251,113,133,0.5)]",
      iconBg: "bg-rose-500/10 border-rose-500/30",
      iconGlow: "drop-shadow(0 0 12px rgba(251,113,133,0.6))",
      ringColor: "rgba(244,63,94,0.2)",
    },
  }[g];

  const safetyFail = safety === false || safety === "false";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col gap-5"
    >
      {/* Hero */}
      <div className="flex flex-col items-center gap-4 py-2">
        <motion.div
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 18, delay: 0.1 }}
          className={`w-28 h-28 rounded-full flex items-center justify-center relative border-2 ${theme.iconBg} ${theme.text} ${theme.glow}`}
          style={{ filter: theme.iconGlow }}
        >
          {/* Animated ring */}
          <div
            className="absolute inset-[-8px] rounded-full animate-pulse-ring"
            style={{ border: `1px solid ${theme.ringColor}` }}
          />
          <div
            className="absolute inset-[-18px] rounded-full animate-pulse-ring"
            style={{ border: `1px solid ${theme.ringColor}`, animationDelay: "0.8s", opacity: 0.5 }}
          />
          {icons[g]}
        </motion.div>

        <motion.span
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
          className={`text-[10px] font-bold tracking-[0.22em] uppercase px-5 py-2 rounded-full border backdrop-blur-md ${theme.bgBadge} ${theme.text}`}
        >
          {badges[g]}
        </motion.span>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.32 }}
          className="text-2xl sm:text-3xl font-bold text-center leading-tight tracking-tight text-white"
        >
          {titles[g]}
        </motion.h1>

        {subs[g] && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.42 }}
            className="text-sm text-white/45 text-center max-w-[82%] leading-relaxed"
          >
            {subs[g]}
          </motion.p>
        )}
      </div>

      {/* Safety banner */}
      {safetyFail && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-rose-500/8 border border-rose-500/20 backdrop-blur-md rounded-2xl p-4 text-sm text-rose-200 leading-relaxed flex gap-3"
        >
          <div className="text-xl mt-0.5">⚠️</div>
          <div>
            <strong className="text-rose-400 font-semibold block mb-1">Atención Crítica</strong>
            Se detectó un problema de seguridad que debe subsanarse antes de la aprobación.
          </div>
        </motion.div>
      )}

      {/* Score card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="relative overflow-hidden rounded-[24px] border border-white/[0.07] backdrop-blur-xl shadow-2xl"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)",
        }}
      >
        {/* Inner grid */}
        <div className="absolute inset-0 bg-grid-white opacity-30 pointer-events-none" />
        {/* Shimmer top edge */}
        <div
          className="absolute top-0 left-0 right-0 h-px animate-shimmer"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${theme.ringColor.replace("0.2", "0.6")} 50%, transparent 100%)`,
          }}
        />

        <div className="relative z-10 p-5 sm:p-6">
          <div className="flex justify-between items-end mb-5">
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/35">
              Índice de Rendimiento
            </span>
            <span className={`text-5xl font-extralight tracking-tighter ${theme.text}`}>
              <AnimatedScore value={score} />
              <span className="text-2xl text-white/20 font-light tracking-normal ml-1">/ 50</span>
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-2 bg-black/40 rounded-full overflow-hidden mb-6 border border-white/[0.04]">
            <div
              className={`h-full rounded-full transition-all duration-[1800ms] ease-[cubic-bezier(.16,1,.3,1)] relative overflow-hidden ${theme.bar} ${theme.barShadow}`}
              style={{ width: barReady ? `${(score / 50) * 100}%` : "0%" }}
            >
              <div className="absolute inset-0 w-full h-full animate-scanline bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            </div>
          </div>

          {/* Sub scores */}
          <div className="grid grid-cols-2 gap-3">
            {[
              ["Ejecución", "/ 15", row["Puntuación: Ejecución"]],
              ["Estado del sitio", "/ 10", row["Puntuación: Condición del Sitio"]],
              ["Documentación", "/ 15", row["Puntuación: Documentación"]],
              ["Formación", "/ 10", row["Puntuación: Educación"]],
            ].map(([label, max, val], idx) => (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + idx * 0.08 }}
                key={label as string}
                className="bg-black/25 border border-white/[0.04] rounded-2xl p-3.5 hover:bg-white/[0.025] transition-all duration-200 group"
              >
                <div className="text-[9px] text-white/35 uppercase tracking-[0.12em] mb-2 leading-snug">
                  {label as string}
                  <span className="text-white/20 ml-1">{max as string}</span>
                </div>
                <div className={`text-xl font-semibold ${theme.text}`}>
                  {val ?? "—"}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Missing evidence */}
      {missing.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-rose-500/5 border border-rose-500/12 backdrop-blur-md rounded-[24px] p-5 sm:p-6"
        >
          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-rose-400 mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            Evidencia Faltante
          </div>
          <ul className="flex flex-col gap-3">
            {missing.map((m, i) => (
              <li key={i} className="text-sm text-rose-200/70 flex gap-3 leading-relaxed">
                <span className="text-rose-500/40 mt-0.5 shrink-0">›</span>
                {m}
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* AI Summary */}
      {summary && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="relative overflow-hidden rounded-[24px] border border-white/[0.05] backdrop-blur-xl p-5 sm:p-6"
          style={{ background: "rgba(255,255,255,0.015)" }}
        >
          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/35 mb-3 flex items-center gap-2">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Análisis de Diagnóstico IA
          </div>
          <p className="text-[13px] sm:text-sm text-white/60 leading-[1.8] whitespace-pre-line">
            {summary}
          </p>
        </motion.div>
      )}

      {/* CTA */}
      {g !== "pass" && editUrl && (
        <motion.a
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          href={editUrl}
          className="mt-2 group relative overflow-hidden flex items-center justify-center gap-2.5 w-full py-4 bg-white text-black text-[13px] font-bold uppercase tracking-[0.07em] rounded-2xl no-underline shadow-[0_4px_30px_rgba(255,255,255,0.15)] active:scale-[0.98] transition-all duration-150"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-200/20 via-transparent to-purple-200/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          Actualizar Documentación
          <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </motion.a>
      )}
    </motion.div>
  );
}

/* ─── Error component ───────────────────────────────── */
function ErrorState({ rowId }: { rowId: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center gap-5 py-10 text-center"
    >
      <div className="w-20 h-20 rounded-full border border-white/8 bg-white/[0.03] flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.04)]">
        <svg className="w-9 h-9 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h2 className="text-xl font-bold tracking-tight text-white/90">Interferencia en la Señal</h2>
      <p className="text-sm text-white/45 leading-relaxed max-w-[280px]">
        No hemos podido enlazar con los datos. Si esto persiste, contacta al centro de control indicando tu ID.
      </p>
      {rowId && (
        <div className="mt-2 px-5 py-2.5 bg-white/[0.04] border border-white/8 rounded-full text-xs font-mono text-white/35 tracking-wider">
          ID: {rowId}
        </div>
      )}
    </motion.div>
  );
}

/* ─── Demo Banner ───────────────────────────────────── */
function DemoBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2.2 }}
      className="w-full flex justify-center mb-2"
    >
      <span className="text-[10px] font-mono uppercase tracking-[0.2em] px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400/70">
        ✦ Modo demo — datos de ejemplo ✦
      </span>
    </motion.div>
  );
}

/* ─── Main inner component ──────────────────────────── */
function VerificationInner() {
  const params = useSearchParams();
  const rowId = params.get("row_id") ?? "";
  const editUrlParam = params.get("edit_url") ?? null;
  const isDemo = !rowId;

  type AppState = "loading" | "result" | "error";
  const [appState, setAppState] = useState<AppState>("loading");
  const [msgIdx, setMsgIdx] = useState(0);
  const [resultRow, setResultRow] = useState<VerificationRow | null>(null);
  const [editUrl, setEditUrl] = useState<string | null>(editUrlParam);
  const [barReady, setBarReady] = useState(false);
  const [showDemoBanner, setShowDemoBanner] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const msgRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startRef = useRef(Date.now());

  useEffect(() => {
    msgRef.current = setInterval(() => setMsgIdx((i) => i + 1), 3500);

    if (isDemo) {
      // Show loading animation for 3.5 s, then reveal demo results
      const timer = setTimeout(() => {
        clearInterval(msgRef.current!);
        clearInterval(pollRef.current!);
        setResultRow(DEMO_ROW);
        setEditUrl(null);
        setShowDemoBanner(true);
        setTimeout(() => {
          setAppState("result");
          setTimeout(() => setBarReady(true), 150);
          setTimeout(() => {
            if (canvasRef.current) runConfetti(canvasRef.current);
          }, 700);
        }, 600);
      }, 3500);
      return () => {
        clearTimeout(timer);
        clearInterval(msgRef.current!);
      };
    }

    async function poll() {
      try {
        const res = await fetch(`/api/verification?row_id=${encodeURIComponent(rowId)}`);
        const data = await res.json();

        if (!data.found) {
          if (Date.now() - startRef.current > 90000) {
            clearInterval(pollRef.current!);
            clearInterval(msgRef.current!);
            setAppState("error");
          }
          return;
        }

        clearInterval(pollRef.current!);
        clearInterval(msgRef.current!);
        setResultRow(data.row);
        setEditUrl(editUrlParam ?? data.editUrl ?? null);

        setTimeout(() => {
          setAppState("result");
          setTimeout(() => setBarReady(true), 150);
          const estado = typeof data.row.Estado === "object" ? data.row.Estado?.value : data.row.Estado ?? "";
          const score = Number(data.row["Puntuación Total"] ?? 0);
          if (gradeOf(score, estado) === "pass" && canvasRef.current) {
            setTimeout(() => runConfetti(canvasRef.current!), 600);
          }
        }, 800);
      } catch (e) {
        console.warn("poll error:", e);
      }
    }

    poll();
    pollRef.current = setInterval(poll, 3000);

    return () => {
      clearInterval(pollRef.current!);
      clearInterval(msgRef.current!);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <AuroraBackground />
      <Starfield />

      <canvas
        ref={canvasRef}
        style={{ display: "none" }}
        className="fixed inset-0 pointer-events-none z-[999]"
      />

      <div className="w-full max-w-[480px] flex flex-col items-center relative z-10 mx-auto">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="w-full flex justify-center py-8 sm:py-12"
        >
          <img
            src="https://uploads.onecompiler.io/4454edy2w/4454ed8yh/Starlink-x-Eltex.png"
            alt="Starlink × Eltex"
            className="h-11 w-auto object-contain opacity-90"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
        </motion.header>

        {/* Demo banner */}
        {showDemoBanner && <DemoBanner />}

        {/* Main content */}
        <div className="w-full px-4 sm:px-0 pb-4">
          <AnimatePresence mode="wait">
            {appState === "loading" && (
              <motion.div key="loading" exit={{ opacity: 0, scale: 0.96 }} className="w-full">
                <LoadingState msgIdx={msgIdx} />
              </motion.div>
            )}

            {appState === "result" && resultRow && (
              <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full">
                <ResultState row={resultRow} editUrl={editUrl} barReady={barReady} />
              </motion.div>
            )}

            {appState === "error" && (
              <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full">
                <ErrorState rowId={rowId} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-10 text-[10px] uppercase tracking-[0.18em] text-white/20 text-center flex flex-col items-center gap-2 pb-4"
        >
          <div className="w-8 h-px bg-white/15" />
          Starlink × Eltex · Sistema de Verificación
        </motion.footer>
      </div>
    </>
  );
}

/* ─── Page ──────────────────────────────────────────── */
export default function Page() {
  return (
    <div
      className="min-h-[100dvh] flex flex-col selection:bg-blue-500/30 selection:text-white relative overflow-x-hidden"
      style={{
        background: "#03050e",
        color: "#ffffff",
        fontFamily: "var(--font-inter, Inter, -apple-system, sans-serif)",
        WebkitFontSmoothing: "antialiased",
        paddingTop: "env(safe-area-inset-top, 0px)",
        paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 32px)",
      }}
    >
      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 text-white/40">
            <div className="w-8 h-8 rounded-full border-2 border-blue-500/40 border-t-blue-400 animate-spin" />
            <span className="text-xs uppercase tracking-[0.2em]">Iniciando...</span>
          </div>
        }
      >
        <VerificationInner />
      </Suspense>
    </div>
  );
}
