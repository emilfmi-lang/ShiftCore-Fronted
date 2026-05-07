import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Heart } from "lucide-react";

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

function Index() {
  const [forgiven, setForgiven] = useState(false);
  const [noPos, setNoPos] = useState<{ x: number; y: number } | null>(null);
  const [hearts, setHearts] = useState<Heartlet[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const arr: Heartlet[] = Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 6,
      size: 14 + Math.random() * 28,
      duration: 7 + Math.random() * 8,
    }));
    setHearts(arr);
  }, []);

  const dodge = () => {
    const c = containerRef.current;
    if (!c) return;
    const rect = c.getBoundingClientRect();
    const padding = 90;
    const x = Math.random() * (rect.width - padding * 2) + padding - rect.width / 2;
    const y = Math.random() * (rect.height - padding * 2) + padding - rect.height / 2;
    setNoPos({ x, y });
  };

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen overflow-hidden flex items-center justify-center px-4"
      style={{
        background:
          "radial-gradient(ellipse at top, oklch(0.82 0.13 12) 0%, oklch(0.55 0.22 18) 45%, oklch(0.28 0.15 15) 100%)",
      }}
    >
      {/* Floating hearts */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {hearts.map((h) => (
          <Heart
            key={h.id}
            className="absolute text-white/70 fill-white/40 animate-[float_linear_infinite]"
            style={{
              left: `${h.left}%`,
              bottom: `-40px`,
              width: h.size,
              height: h.size,
              animationDuration: `${h.duration}s`,
              animationDelay: `${h.delay}s`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes float {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translateY(-110vh) rotate(360deg); opacity: 0; }
        }
        @keyframes beat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div
        className="relative z-10 w-full max-w-xl rounded-3xl bg-white/15 backdrop-blur-xl border border-white/30 shadow-2xl p-8 md:p-12 text-center"
        style={{ animation: "fadeUp 0.8s ease-out" }}
      >
        {!forgiven ? (
          <>
            <div className="flex justify-center mb-6">
              <Heart
                className="text-white fill-rose-400"
                size={72}
                style={{ animation: "beat 1.2s ease-in-out infinite", filter: "drop-shadow(0 0 20px oklch(0.7 0.2 15))" }}
              />
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-snug">
              Səni üzdüyüm üçün bağışla məni 💔
            </h1>
            <p className="text-lg md:text-xl text-white/90 leading-relaxed mb-10">
              Ümid edirəm ki bağışlayarsan məni, çünki səni çox sevirəm. ❤️
            </p>

            <div className="relative flex items-center justify-center gap-6 h-20">
              <button
                onClick={() => setForgiven(true)}
                className="px-10 py-4 rounded-full bg-white text-rose-600 font-bold text-lg shadow-lg hover:scale-110 transition-transform duration-200"
              >
                Hə 💖
              </button>

              <button
                onMouseEnter={dodge}
                onTouchStart={dodge}
                onFocus={dodge}
                onClick={(e) => e.preventDefault()}
                className="px-10 py-4 rounded-full bg-rose-900/60 text-white font-bold text-lg border border-white/30 transition-transform duration-300 ease-out"
                style={{
                  transform: noPos
                    ? `translate(${noPos.x}px, ${noPos.y}px)`
                    : "translate(0,0)",
                }}
              >
                Yox
              </button>
            </div>
          </>
        ) : (
          <div style={{ animation: "fadeUp 0.7s ease-out" }}>
            <div className="flex justify-center mb-6">
              <Heart
                className="text-white fill-rose-400"
                size={96}
                style={{ animation: "beat 0.9s ease-in-out infinite", filter: "drop-shadow(0 0 30px oklch(0.75 0.22 15))" }}
              />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Təşəkkür edirəm ❤️
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              Səni dünyalar qədər sevirəm. Bir daha səni heç vaxt üzməyəcəm. 💕
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
