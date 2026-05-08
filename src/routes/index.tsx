import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Heart, Sparkles, Star } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Bağışla məni 💔" },
      { name: "description", content: "Səni çox sevirəm, bağışla məni." },
    ],
  }),
});

type Heartlet = { id: number; left: number; delay: number; size: number; duration: number };

type Stage = "welcome" | "ask" | "forgiven";

function Index() {
  const [stage, setStage] = useState<Stage>("welcome");
  const [noPos, setNoPos] = useState<{ x: number; y: number } | null>(null);
  const [hearts, setHearts] = useState<Heartlet[]>([]);
  const noBtnRef = useRef<HTMLDivElement>(null);
  const noPlaceholderRef = useRef<HTMLDivElement>(null);

  // When entering ask stage, align YOX button initially with the HƏ button row
  useEffect(() => {
    if (stage !== "ask") return;
    const id = requestAnimationFrame(() => {
      const ph = noPlaceholderRef.current;
      const btn = noBtnRef.current;
      if (!ph || !btn) return;
      const r = ph.getBoundingClientRect();
      const br = btn.getBoundingClientRect();
      setNoPos({
        x: r.left + r.width / 2 - br.width / 2,
        y: r.top + r.height / 2 - br.height / 2,
      });
    });
    return () => cancelAnimationFrame(id);
  }, [stage]);

  useEffect(() => {
    const arr: Heartlet[] = Array.from({ length: 22 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 6,
      size: 14 + Math.random() * 32,
      duration: 6 + Math.random() * 8,
    }));
    setHearts(arr);
  }, []);

  // Global mouse tracking — No button dodges anywhere on the screen
  useEffect(() => {
    if (stage !== "ask") return;
    const handler = (e: MouseEvent) => {
      const btn = noBtnRef.current;
      if (!btn) return;
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist < 200) {
        const w = window.innerWidth;
        const h = window.innerHeight;
        const padX = rect.width / 2 + 20;
        const padY = rect.height / 2 + 20;
        // Pick a random safe position anywhere on screen, far from cursor
        let nx = 0;
        let ny = 0;
        for (let i = 0; i < 20; i++) {
          const tx = padX + Math.random() * (w - padX * 2);
          const ty = padY + Math.random() * (h - padY * 2);
          if (Math.hypot(tx - e.clientX, ty - e.clientY) > 220) {
            nx = tx;
            ny = ty;
            break;
          }
        }
        if (nx === 0 && ny === 0) {
          nx = padX + Math.random() * (w - padX * 2);
          ny = padY + Math.random() * (h - padY * 2);
        }
        setNoPos({ x: nx - rect.width / 2, y: ny - rect.height / 2 });
      }
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, [stage]);

  const cartoonBg =
    "radial-gradient(circle at 20% 20%, oklch(0.88 0.15 350) 0%, transparent 40%), radial-gradient(circle at 80% 30%, oklch(0.85 0.18 50) 0%, transparent 45%), radial-gradient(circle at 50% 90%, oklch(0.82 0.16 320) 0%, transparent 50%), linear-gradient(135deg, oklch(0.78 0.16 20) 0%, oklch(0.65 0.22 350) 100%)";

  return (
    <div
      className="relative min-h-screen overflow-hidden flex items-center justify-center px-4"
      style={{ background: cartoonBg, fontFamily: "'Comic Sans MS', 'Comic Neue', cursive" }}
    >
      {/* Floating hearts & sparkles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {hearts.map((h) => (
          <Heart
            key={h.id}
            className="absolute text-white fill-rose-300 drop-shadow-lg"
            style={{
              left: `${h.left}%`,
              bottom: `-40px`,
              width: h.size,
              height: h.size,
              animation: `float ${h.duration}s linear infinite`,
              animationDelay: `${h.delay}s`,
            }}
          />
        ))}
        {/* Cartoon clouds */}
        <div className="absolute top-10 left-10 w-32 h-16 bg-white rounded-full opacity-80 animate-[drift_20s_linear_infinite]" style={{ filter: "drop-shadow(0 6px 0 rgba(0,0,0,0.15))" }} />
        <div className="absolute top-32 right-20 w-40 h-20 bg-white rounded-full opacity-70 animate-[drift_25s_linear_infinite_reverse]" style={{ filter: "drop-shadow(0 6px 0 rgba(0,0,0,0.15))" }} />
        <div className="absolute bottom-32 left-1/4 w-36 h-16 bg-white rounded-full opacity-75 animate-[drift_30s_linear_infinite]" style={{ filter: "drop-shadow(0 6px 0 rgba(0,0,0,0.15))" }} />

        {/* Sun */}
        <div className="absolute top-8 right-8 w-24 h-24 rounded-full" style={{
          background: "radial-gradient(circle, #fef08a 30%, #fbbf24 70%)",
          boxShadow: "0 0 60px #fbbf24, 0 0 100px rgba(251,191,36,0.4)",
        }} />

        {/* Couple silhouettes */}
        <div
          className="absolute bottom-0 pointer-events-none"
          style={{
            left: stage === "forgiven" ? "calc(50% - 130px)" : "1rem",
            transition: "left 1.6s cubic-bezier(0.6, 0.2, 0.2, 1)",
            animation: stage === "forgiven" ? "none" : "sway 4s ease-in-out infinite",
          }}
        >
          <svg width="160" height="240" viewBox="0 0 160 240" style={{ filter: "drop-shadow(8px 8px 0 rgba(0,0,0,0.25))" }}>
            <ellipse cx="70" cy="235" rx="50" ry="6" fill="rgba(0,0,0,0.2)" />
            <rect x="55" y="160" width="14" height="70" rx="6" fill="#1e3a8a" stroke="#0f172a" strokeWidth="3" />
            <rect x="71" y="160" width="14" height="70" rx="6" fill="#1e3a8a" stroke="#0f172a" strokeWidth="3" />
            <path d="M40 100 Q40 85 55 80 L85 80 Q100 85 100 100 L100 165 L40 165 Z" fill="#3b82f6" stroke="#0f172a" strokeWidth="3" />
            {/* Right arm — extends when hugging */}
            {stage === "forgiven" ? (
              <path d="M100 105 Q140 100 158 115 L158 130 Q140 122 100 125 Z" fill="#3b82f6" stroke="#0f172a" strokeWidth="3" />
            ) : (
              <>
                <path d="M100 110 Q120 115 125 130" stroke="#fde68a" strokeWidth="10" strokeLinecap="round" fill="none" />
                <path d="M100 110 Q120 115 125 130" stroke="#0f172a" strokeWidth="3" fill="none" />
              </>
            )}
            <circle cx="70" cy="55" r="28" fill="#fde68a" stroke="#0f172a" strokeWidth="3" />
            <path d="M44 50 Q45 28 70 25 Q95 28 96 50 Q90 38 70 38 Q50 38 44 50 Z" fill="#3f2a14" stroke="#0f172a" strokeWidth="3" />
            <circle cx="62" cy="55" r="3" fill="#0f172a" />
            <circle cx="78" cy="55" r="3" fill="#0f172a" />
            {stage === "forgiven" ? (
              <path d="M58 66 Q70 80 82 66" stroke="#0f172a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            ) : (
              <path d="M60 68 Q70 76 80 68" stroke="#0f172a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            )}
            <circle cx="56" cy="64" r="3" fill="#fb7185" opacity="0.7" />
            <circle cx="84" cy="64" r="3" fill="#fb7185" opacity="0.7" />
          </svg>
        </div>

        <div
          className="absolute bottom-0 pointer-events-none"
          style={{
            left: stage === "forgiven" ? "calc(50% - 30px)" : "auto",
            right: stage === "forgiven" ? "auto" : "1rem",
            transition: "left 1.6s cubic-bezier(0.6, 0.2, 0.2, 1), right 1.6s cubic-bezier(0.6, 0.2, 0.2, 1)",
            animation: stage === "forgiven" ? "none" : "sway2 4s ease-in-out infinite",
          }}
        >
          <svg width="160" height="240" viewBox="0 0 160 240" style={{ filter: "drop-shadow(-8px 8px 0 rgba(0,0,0,0.25))" }}>
            <ellipse cx="70" cy="235" rx="50" ry="6" fill="rgba(0,0,0,0.2)" />
            <rect x="58" y="160" width="11" height="70" rx="5" fill="#fce7f3" stroke="#0f172a" strokeWidth="3" />
            <rect x="71" y="160" width="11" height="70" rx="5" fill="#fce7f3" stroke="#0f172a" strokeWidth="3" />
            <path d="M42 95 Q42 82 55 78 L85 78 Q98 82 98 95 L110 170 L30 170 Z" fill="#ec4899" stroke="#0f172a" strokeWidth="3" />
            {/* Left arm — extends when hugging */}
            {stage === "forgiven" ? (
              <path d="M42 105 Q2 100 -16 115 L-16 130 Q2 122 42 125 Z" fill="#ec4899" stroke="#0f172a" strokeWidth="3" />
            ) : (
              <>
                <path d="M42 110 Q22 115 17 130" stroke="#fde68a" strokeWidth="10" strokeLinecap="round" fill="none" />
                <path d="M42 110 Q22 115 17 130" stroke="#0f172a" strokeWidth="3" fill="none" />
              </>
            )}
            <circle cx="70" cy="55" r="28" fill="#fde68a" stroke="#0f172a" strokeWidth="3" />
            <path d="M42 55 Q40 25 70 22 Q100 25 98 55 L100 95 Q90 80 88 60 Q70 50 52 60 Q50 80 40 95 Z" fill="#7c2d12" stroke="#0f172a" strokeWidth="3" />
            <circle cx="62" cy="56" r="3" fill="#0f172a" />
            <circle cx="78" cy="56" r="3" fill="#0f172a" />
            {stage === "forgiven" ? (
              <path d="M58 66 Q70 80 82 66" stroke="#0f172a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            ) : (
              <path d="M60 68 Q70 76 80 68" stroke="#0f172a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            )}
            <circle cx="56" cy="65" r="3.5" fill="#fb7185" opacity="0.8" />
            <circle cx="84" cy="65" r="3.5" fill="#fb7185" opacity="0.8" />
          </svg>
        </div>

        {/* Heart between them */}
        <div
          className="absolute pointer-events-none"
          style={{
            bottom: stage === "forgiven" ? "230px" : "180px",
            left: "50%",
            transform: "translateX(-50%)",
            animation: "pulseHeart 1.5s ease-in-out infinite",
            transition: "bottom 1.6s ease",
          }}
        >
          <Heart
            className="text-rose-500 fill-rose-500"
            size={stage === "forgiven" ? 56 : 42}
            style={{ filter: "drop-shadow(3px 3px 0 #0f172a)", transition: "all 1.6s ease" }}
          />
        </div>

        {/* Floating love hearts between the couple — only when forgiven */}
        {stage === "forgiven" && (
          <div
            className="absolute pointer-events-none"
            style={{ bottom: "200px", left: "50%", transform: "translateX(-50%)", width: "120px", height: "200px" }}
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <Heart
                key={i}
                className="absolute text-rose-500 fill-rose-400"
                size={14 + (i % 3) * 6}
                style={{
                  left: `${20 + (i * 11) % 80}%`,
                  bottom: 0,
                  filter: "drop-shadow(2px 2px 0 #0f172a)",
                  animation: `loveRise ${2.4 + (i % 4) * 0.4}s ease-in ${i * 0.35}s infinite`,
                  opacity: 0,
                }}
              />
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes float {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translateY(-110vh) rotate(360deg); opacity: 0; }
        }
        @keyframes beat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }
        @keyframes wobble {
          0%, 100% { transform: rotate(-2deg); }
          50% { transform: rotate(2deg); }
        }
        @keyframes drift {
          0% { transform: translateX(-100px); }
          100% { transform: translateX(calc(100vw + 100px)); }
        }
        @keyframes pop {
          0% { opacity: 0; transform: scale(0.5) rotate(-10deg); }
          60% { transform: scale(1.1) rotate(3deg); }
          100% { opacity: 1; transform: scale(1) rotate(0deg); }
        }
        @keyframes bounce-in {
          0% { opacity: 0; transform: translateY(50px); }
          60% { transform: translateY(-10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .cartoon-card {
          border: 4px solid #2d1b3d;
          box-shadow: 8px 8px 0 #2d1b3d;
        }
        .cartoon-btn {
          border: 3px solid #2d1b3d;
          box-shadow: 4px 4px 0 #2d1b3d, inset 0 -4px 0 rgba(0,0,0,0.15);
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .cartoon-btn:hover {
          transform: translate(-2px, -2px);
          box-shadow: 6px 6px 0 #2d1b3d, inset 0 -4px 0 rgba(0,0,0,0.15);
        }
        .cartoon-btn:active {
          transform: translate(2px, 2px);
          box-shadow: 2px 2px 0 #2d1b3d, inset 0 -4px 0 rgba(0,0,0,0.15);
        }
        .no-btn {
          border: 3px solid #2d1b3d;
          box-shadow: 4px 4px 0 #2d1b3d, inset 0 -4px 0 rgba(0,0,0,0.15);
        }
        @keyframes sway {
          0%, 100% { transform: translateY(0) rotate(-1deg); }
          50% { transform: translateY(-6px) rotate(1deg); }
        }
        @keyframes sway2 {
          0%, 100% { transform: translateY(-3px) rotate(1deg); }
          50% { transform: translateY(3px) rotate(-1deg); }
        }
        @keyframes pulseHeart {
          0%, 100% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.2); opacity: 1; }
        }
        @keyframes shrinkUp {
          0% { transform: translate(-50%, 60vh) scale(2.2); opacity: 0; }
          40% { transform: translate(-50%, 30vh) scale(1.6); opacity: 1; }
          100% { transform: translate(-50%, 0) scale(1); opacity: 1; }
        }
        @keyframes loveRise {
          0% { transform: translateY(0) scale(0.6) rotate(-10deg); opacity: 0; }
          15% { opacity: 1; }
          100% { transform: translateY(-180px) scale(1.1) rotate(15deg); opacity: 0; }
        }
      `}</style>

      {stage === "welcome" && (
        <div
          className="relative z-10 w-full max-w-xl rounded-3xl bg-yellow-100 cartoon-card p-8 md:p-10 text-center"
          style={{ animation: "pop 0.6s ease-out" }}
        >
          <div className="flex justify-center gap-3 mb-4">
            <Star className="text-yellow-500 fill-yellow-400" size={40} style={{ animation: "wobble 2s ease-in-out infinite" }} />
            <Sparkles className="text-pink-500" size={48} style={{ animation: "beat 1.5s ease-in-out infinite" }} />
            <Star className="text-yellow-500 fill-yellow-400" size={40} style={{ animation: "wobble 2s ease-in-out infinite reverse" }} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-rose-700 mb-2" style={{ textShadow: "3px 3px 0 #fff" }}>
            XOŞ GƏLMİSƏN! 🎉
          </h1>
          <p className="text-lg text-purple-900 mb-6 font-bold">Sevgi oyununa başlamazdan əvvəl...</p>

          <div className="bg-white rounded-2xl p-5 mb-6 text-left border-4 border-purple-700" style={{ boxShadow: "5px 5px 0 #6b21a8" }}>
            <h2 className="text-xl font-black text-purple-800 mb-3 text-center">📜 OYUNUN QAYDALARI 📜</h2>
            <div className="space-y-3">
              <div className="flex gap-3 items-start">
                <span className="text-2xl">1️⃣</span>
                <p className="text-purple-900 font-semibold">İkisindən birini seçməlisən. Seçimsiz keçid yoxdur!</p>
              </div>
              <div className="flex gap-3 items-start">
                <span className="text-2xl">2️⃣</span>
                <p className="text-purple-900 font-semibold">Hər hansı seçimi etdikdən sonra ona mütləq şəkildə uymalısan. Uymasan daxil ola bilməyəcəksən! 😤</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setStage("ask")}
            className="cartoon-btn px-10 py-4 rounded-full bg-gradient-to-r from-pink-400 to-rose-500 text-white font-black text-xl"
          >
            QAYDALARI QƏBUL EDİRƏM ✨
          </button>
        </div>
      )}

      {stage === "ask" && (
        <div
          className="relative z-10 w-full max-w-xl rounded-3xl bg-pink-100 cartoon-card p-8 md:p-12 text-center"
          style={{ animation: "bounce-in 0.7s ease-out" }}
        >
          <div className="flex justify-center mb-6">
            <Heart
              className="text-rose-600 fill-rose-500 drop-shadow-xl"
              size={80}
              style={{ animation: "beat 1.2s ease-in-out infinite" }}
            />
          </div>

          <h1 className="text-3xl md:text-4xl font-black text-rose-700 mb-4 leading-snug" style={{ textShadow: "2px 2px 0 #fff" }}>
            Səni üzdüyüm üçün bağışla məni 💔
          </h1>
          <p className="text-lg md:text-xl text-purple-900 leading-relaxed mb-10 font-bold">
            Ümid edirəm ki bağışlayarsan məni, çünki səni çox sevirəm. ❤️
          </p>

          <div className="flex items-center justify-center gap-6">
            <button
              onClick={() => setStage("forgiven")}
              className="cartoon-btn px-10 py-4 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 text-white font-black text-xl"
            >
              HƏ 💖
            </button>
            {/* Placeholder reserves the slot so YOX initially sits at the same level as HƏ */}
            <div
              ref={noPlaceholderRef}
              aria-hidden
              className="px-10 py-4 rounded-full text-xl font-black opacity-0 pointer-events-none select-none"
              style={{ border: "3px solid transparent" }}
            >
              YOX 😡
            </div>
          </div>

          {/* No button — dodges across whole screen, no click feedback */}
          <div
            ref={noBtnRef}
            className="no-btn fixed px-10 py-4 rounded-full bg-gradient-to-r from-red-500 to-rose-600 text-white font-black text-xl z-50 select-none"
            style={{
              left: noPos ? `${noPos.x}px` : "calc(50% + 80px)",
              top: noPos ? `${noPos.y}px` : "calc(50% + 100px)",
              transition: "left 0.05s linear, top 0.05s linear",
              cursor: "default",
              pointerEvents: "none",
            }}
          >
            YOX 😡
          </div>
        </div>
      )}

      {stage === "forgiven" && (
        <div
          className="absolute z-10 left-1/2 rounded-3xl bg-yellow-100 cartoon-card px-6 py-4 text-center"
          style={{
            top: "6%",
            transform: "translateX(-50%)",
            animation: "shrinkUp 1s ease-out forwards",
            maxWidth: "360px",
          }}
        >
          <div className="flex justify-center mb-2">
            <Heart
              className="text-rose-600 fill-rose-500"
              size={36}
              style={{ animation: "beat 0.9s ease-in-out infinite" }}
            />
          </div>
          <h1 className="text-xl md:text-2xl font-black text-rose-700 mb-1" style={{ textShadow: "2px 2px 0 #fff" }}>
            TƏŞƏKKÜR EDİRƏM ❤️
          </h1>
          <p className="text-sm text-purple-900 leading-snug font-bold">
            Səni dünyalar qədər sevirəm. Bir daha səni heç vaxt üzməyəcəm. 💕
          </p>
        </div>
      )}
    </div>
  );
}
