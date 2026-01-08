import React, { useEffect, useRef, useState, type ReactNode } from "react";

type Phase = "idle" | "falling" | "gameover" | "done";

interface IntroGameOverlayProps {
  children: ReactNode;
  /** Use localStorage instead of sessionStorage for permanent persistence */
  usePersistentStorage?: boolean;
}

const STORAGE_KEY = "intro_game_played";

export default function IntroGameOverlay({
  children,
  usePersistentStorage = false,
}: IntroGameOverlayProps) {
  const [showOverlay, setShowOverlay] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [canPlay, setCanPlay] = useState(true);
  const timeoutRefs = useRef<NodeJS.Timeout[]>([]);

  const storage = usePersistentStorage ? localStorage : sessionStorage;

  // Cleanup helper
  const clearAllTimeouts = () => {
    timeoutRefs.current.forEach(clearTimeout);
    timeoutRefs.current = [];
  };

  const addTimeout = (callback: () => void, delay: number) => {
    const id = setTimeout(callback, delay);
    timeoutRefs.current.push(id);
    return id;
  };

  useEffect(() => {
    const alreadyPlayed = storage.getItem(STORAGE_KEY) === "1";

    if (!alreadyPlayed) {
      setShowOverlay(true);
      setCanPlay(true);
      setPhase("idle");
      // Block background scrolling
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    } else {
      setShowOverlay(false);
      setPhase("done");
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    }

    return () => {
      clearAllTimeouts();
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [storage]);

  const start = () => {
    if (!canPlay || phase !== "idle") return;

    setCanPlay(false);
    storage.setItem(STORAGE_KEY, "1");

    // Always lose: trigger cabinet falling animation
    setPhase("falling");

    // Show impact effect near collision
    addTimeout(() => {
      // Impact appears slightly before game over
    }, 850);

    // Show game over after cabinet falls
    addTimeout(() => {
      setPhase("gameover");

      // Start fade out after showing game over
      addTimeout(() => {
        setPhase("done");

        // Remove overlay from DOM after fade completes
        addTimeout(() => {
          setShowOverlay(false);
          document.documentElement.style.overflow = "";
          document.body.style.overflow = "";
        }, 650);
      }, 900);
    }, 1100);
  };

  return (
    <>
      {/* Main site content */}
      <div className={showOverlay ? "intro-site intro-site--blur" : "intro-site"}>
        {children}
      </div>

      {/* Game overlay */}
      {showOverlay && (
        <div
          className={`intro-overlay ${phase === "done" ? "intro-overlay--hide" : ""}`}
          role="dialog"
          aria-modal="true"
          aria-label="Tervetuloa-peli: Kestääkö asennus?"
        >
          <div className="intro-card">
            <div className="intro-header">
              <div className="intro-title">Pikatesti: "Kestääkö asennus?"</div>
              <div className="intro-subtitle">Saat yhden yrityksen.</div>
            </div>

            <div className="intro-arena" aria-hidden="true">
              {/* Floor */}
              <div className="intro-floor" />

              {/* Cabinet */}
              <div
                className={`intro-cabinet ${
                  phase === "falling" || phase === "gameover" ? "intro-cabinet--fall" : ""
                }`}
              >
                <div className="intro-cabinet__top" />
                <div className="intro-cabinet__body">
                  <div className="intro-cabinet__door">
                    <div className="intro-cabinet__panel intro-cabinet__panel--top" />
                    <div className="intro-cabinet__panel intro-cabinet__panel--bottom" />
                  </div>
                  <div className="intro-cabinet__handle" />
                </div>
                <div className="intro-cabinet__leg intro-cabinet__leg--left" />
                <div className="intro-cabinet__leg intro-cabinet__leg--right" />
              </div>

              {/* Target object (vase/plant) */}
              <div className="intro-target">
                <div className="intro-target__pot" />
                <div className="intro-target__plant">
                  <div className="intro-target__leaf intro-target__leaf--1" />
                  <div className="intro-target__leaf intro-target__leaf--2" />
                  <div className="intro-target__leaf intro-target__leaf--3" />
                </div>
                <div className="intro-target__label">Kukka</div>
              </div>

              {/* Impact effect */}
              <div
                className={`intro-impact ${phase === "gameover" ? "intro-impact--show" : ""}`}
              />

              {/* Debris particles */}
              {phase === "gameover" && (
                <div className="intro-debris">
                  <div className="intro-debris__particle intro-debris__particle--1" />
                  <div className="intro-debris__particle intro-debris__particle--2" />
                  <div className="intro-debris__particle intro-debris__particle--3" />
                  <div className="intro-debris__particle intro-debris__particle--4" />
                </div>
              )}
            </div>

            <div className="intro-footer">
              {phase !== "gameover" ? (
                <>
                  <button
                    className="intro-btn"
                    onClick={start}
                    disabled={!canPlay}
                    type="button"
                  >
                    {canPlay ? "Kokeile" : "Käytetty"}
                  </button>
                  <div className="intro-hint">
                    Painamalla kaappi kaatuu… (spoileri: aina huonosti 😅)
                  </div>
                </>
              ) : (
                <div className="intro-gameover">
                  <div className="intro-gameover__title">Game Over</div>
                  <div className="intro-gameover__text">
                    Kaappi kaatui kukan päälle.
                  </div>
                  <div className="intro-gameover__text2">Siirrytään sivulle…</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{overlayStyles}</style>
    </>
  );
}

const overlayStyles = `
/* Site wrapper */
.intro-site {
  min-height: 100vh;
  transition: filter 350ms ease;
}
.intro-site--blur {
  filter: blur(3px) saturate(0.85);
}

/* Overlay */
.intro-overlay {
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
  background: 
    radial-gradient(ellipse 1400px 800px at 50% 30%, rgba(34, 197, 94, 0.08), transparent),
    linear-gradient(180deg, rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.92));
  z-index: 9999;
  padding: 16px;
  opacity: 1;
  transform: translateY(0) scale(1);
  transition: opacity 600ms ease, transform 600ms ease;
}
.intro-overlay--hide {
  opacity: 0;
  transform: translateY(-12px) scale(0.98);
  pointer-events: none;
}

/* Card */
.intro-card {
  width: min(680px, 94vw);
  border-radius: 20px;
  background: linear-gradient(180deg, #ffffff, #f8fafc);
  box-shadow: 
    0 0 0 1px rgba(255, 255, 255, 0.1),
    0 24px 80px rgba(0, 0, 0, 0.5),
    0 8px 32px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

/* Header */
.intro-header {
  padding: 20px 24px 14px;
  background: linear-gradient(180deg, #f0fdf4, #ffffff);
  border-bottom: 1px solid rgba(34, 197, 94, 0.15);
}
.intro-title {
  font-size: 22px;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.02em;
}
.intro-subtitle {
  margin-top: 6px;
  font-size: 14px;
  color: #475569;
  font-weight: 500;
}

/* Arena */
.intro-arena {
  position: relative;
  height: 260px;
  background: 
    linear-gradient(180deg, #e0f2fe 0%, #f0f9ff 40%, #fef3c7 100%);
  overflow: hidden;
}

/* Floor */
.intro-floor {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 32px;
  background: linear-gradient(180deg, #a3a3a3, #737373);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
}
.intro-floor::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(180deg, #d4d4d4, #a3a3a3);
}

/* Target (Flower pot) */
.intro-target {
  position: absolute;
  right: 100px;
  bottom: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.intro-target__pot {
  width: 50px;
  height: 45px;
  background: linear-gradient(180deg, #c2410c, #9a3412);
  border-radius: 4px 4px 8px 8px;
  clip-path: polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%);
  box-shadow: 
    inset -4px 0 8px rgba(0, 0, 0, 0.2),
    inset 4px 0 8px rgba(255, 255, 255, 0.1);
}
.intro-target__plant {
  position: absolute;
  bottom: 40px;
  display: flex;
  gap: 2px;
}
.intro-target__leaf {
  width: 16px;
  height: 36px;
  background: linear-gradient(180deg, #22c55e, #15803d);
  border-radius: 50% 50% 50% 50% / 80% 80% 20% 20%;
  transform-origin: bottom center;
}
.intro-target__leaf--1 {
  transform: rotate(-25deg);
  height: 32px;
}
.intro-target__leaf--2 {
  transform: rotate(0deg);
  height: 40px;
}
.intro-target__leaf--3 {
  transform: rotate(25deg);
  height: 32px;
}
.intro-target__label {
  position: absolute;
  bottom: -24px;
  font-size: 11px;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Cabinet */
.intro-cabinet {
  position: absolute;
  left: 100px;
  bottom: 32px;
  width: 110px;
  height: 150px;
  transform-origin: 95px 150px;
  transform: rotate(0deg);
  transition: transform 950ms cubic-bezier(0.22, 1, 0.36, 1);
}
.intro-cabinet--fall {
  transform: rotate(72deg);
}

.intro-cabinet__top {
  position: absolute;
  left: -4px;
  top: -6px;
  width: 118px;
  height: 12px;
  border-radius: 6px 6px 2px 2px;
  background: linear-gradient(180deg, #854d0e, #713f12);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.25);
}

.intro-cabinet__body {
  position: absolute;
  left: 0;
  top: 6px;
  width: 110px;
  height: 136px;
  border-radius: 8px;
  background: linear-gradient(135deg, #a16207, #854d0e);
  box-shadow: 
    inset 0 0 0 2px rgba(255, 255, 255, 0.12),
    inset -8px 0 16px rgba(0, 0, 0, 0.15),
    0 8px 24px rgba(0, 0, 0, 0.3);
}

.intro-cabinet__door {
  position: absolute;
  left: 8px;
  top: 8px;
  width: 94px;
  height: 120px;
  border-radius: 6px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(0, 0, 0, 0.05));
  box-shadow: inset 0 0 0 2px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 6px;
}

.intro-cabinet__panel {
  flex: 1;
  border-radius: 4px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(0, 0, 0, 0.08));
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.1);
}

.intro-cabinet__handle {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  width: 8px;
  height: 24px;
  border-radius: 4px;
  background: linear-gradient(180deg, #fbbf24, #d97706);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.intro-cabinet__leg {
  position: absolute;
  bottom: -6px;
  width: 12px;
  height: 8px;
  border-radius: 2px;
  background: linear-gradient(180deg, #57534e, #44403c);
}
.intro-cabinet__leg--left {
  left: 12px;
}
.intro-cabinet__leg--right {
  right: 12px;
}

/* Impact effect */
.intro-impact {
  position: absolute;
  right: 115px;
  bottom: 80px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  opacity: 0;
  pointer-events: none;
}
.intro-impact--show {
  animation: intro-boom 600ms ease-out forwards;
}

@keyframes intro-boom {
  0% {
    opacity: 0;
    transform: scale(0.5);
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
  }
  20% {
    opacity: 1;
    transform: scale(1.5);
    box-shadow: 
      0 0 20px 10px rgba(239, 68, 68, 0.4),
      0 0 40px 20px rgba(251, 191, 36, 0.2);
  }
  60% {
    opacity: 0.8;
    transform: scale(3);
    box-shadow: 
      0 0 30px 15px rgba(239, 68, 68, 0.2),
      0 0 60px 30px rgba(251, 191, 36, 0.1);
  }
  100% {
    opacity: 0;
    transform: scale(4);
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
  }
}

/* Debris particles */
.intro-debris {
  position: absolute;
  right: 100px;
  bottom: 60px;
  pointer-events: none;
}
.intro-debris__particle {
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 2px;
  background: #22c55e;
  animation: intro-debris-fly 800ms ease-out forwards;
}
.intro-debris__particle--1 {
  animation-delay: 0ms;
  --fly-x: -30px;
  --fly-y: -60px;
}
.intro-debris__particle--2 {
  animation-delay: 50ms;
  --fly-x: 20px;
  --fly-y: -80px;
  background: #c2410c;
}
.intro-debris__particle--3 {
  animation-delay: 100ms;
  --fly-x: 40px;
  --fly-y: -50px;
}
.intro-debris__particle--4 {
  animation-delay: 75ms;
  --fly-x: -10px;
  --fly-y: -70px;
  background: #854d0e;
  width: 6px;
  height: 6px;
}

@keyframes intro-debris-fly {
  0% {
    opacity: 1;
    transform: translate(0, 0) rotate(0deg);
  }
  100% {
    opacity: 0;
    transform: translate(var(--fly-x), var(--fly-y)) rotate(180deg);
  }
}

/* Footer */
.intro-footer {
  padding: 16px 24px 20px;
  background: #ffffff;
}

.intro-btn {
  appearance: none;
  border: 0;
  border-radius: 12px;
  padding: 14px 28px;
  font-weight: 800;
  font-size: 15px;
  background: linear-gradient(180deg, #22c55e, #16a34a);
  color: white;
  cursor: pointer;
  box-shadow: 
    0 0 0 1px rgba(0, 0, 0, 0.1),
    0 8px 24px rgba(22, 163, 74, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  transition: transform 150ms ease, box-shadow 150ms ease;
}
.intro-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 
    0 0 0 1px rgba(0, 0, 0, 0.1),
    0 12px 32px rgba(22, 163, 74, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}
.intro-btn:active:not(:disabled) {
  transform: translateY(0);
}
.intro-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.intro-btn:focus-visible {
  outline: 2px solid #22c55e;
  outline-offset: 2px;
}

.intro-hint {
  margin-top: 10px;
  font-size: 13px;
  color: #64748b;
  font-weight: 500;
}

/* Game Over */
.intro-gameover {
  text-align: center;
  padding: 8px 0;
  animation: intro-gameover-appear 400ms ease-out;
}
.intro-gameover__title {
  font-size: 26px;
  font-weight: 900;
  color: #dc2626;
  letter-spacing: -0.02em;
  text-shadow: 0 2px 4px rgba(220, 38, 38, 0.2);
}
.intro-gameover__text {
  margin-top: 6px;
  font-size: 14px;
  color: #475569;
  font-weight: 500;
}
.intro-gameover__text2 {
  margin-top: 4px;
  font-size: 13px;
  color: #94a3b8;
}

@keyframes intro-gameover-appear {
  0% {
    opacity: 0;
    transform: translateY(8px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Mobile responsiveness */
@media (max-width: 480px) {
  .intro-card {
    width: 100%;
    border-radius: 16px;
  }
  .intro-header {
    padding: 16px 18px 12px;
  }
  .intro-title {
    font-size: 18px;
  }
  .intro-arena {
    height: 220px;
  }
  .intro-cabinet {
    left: 60px;
    width: 90px;
    height: 120px;
    transform-origin: 78px 120px;
  }
  .intro-cabinet__top {
    width: 98px;
    height: 10px;
  }
  .intro-cabinet__body {
    width: 90px;
    height: 106px;
  }
  .intro-cabinet__door {
    width: 76px;
    height: 92px;
  }
  .intro-target {
    right: 50px;
  }
  .intro-target__pot {
    width: 40px;
    height: 36px;
  }
  .intro-target__leaf {
    width: 12px;
    height: 28px;
  }
  .intro-target__leaf--2 {
    height: 32px;
  }
  .intro-footer {
    padding: 14px 18px 18px;
  }
  .intro-btn {
    width: 100%;
    padding: 16px 24px;
  }
}
`;
