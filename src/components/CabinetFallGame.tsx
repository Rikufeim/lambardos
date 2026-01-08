import React, { useState, useRef, useCallback } from "react";

type Phase = "idle" | "falling" | "gameover";

interface CabinetFallGameProps {
  /** Allow replaying the game */
  allowReplay?: boolean;
  /** Custom button text */
  buttonText?: string;
  /** Callback when game ends */
  onGameOver?: () => void;
}

export default function CabinetFallGame({
  allowReplay = true,
  buttonText = "Kokeile",
  onGameOver,
}: CabinetFallGameProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  const timeoutRefs = useRef<NodeJS.Timeout[]>([]);

  const clearAllTimeouts = () => {
    timeoutRefs.current.forEach(clearTimeout);
    timeoutRefs.current = [];
  };

  const addTimeout = (callback: () => void, delay: number) => {
    const id = setTimeout(callback, delay);
    timeoutRefs.current.push(id);
    return id;
  };

  const start = useCallback(() => {
    if (phase !== "idle") return;

    setPhase("falling");

    addTimeout(() => {
      setPhase("gameover");
      onGameOver?.();

      if (allowReplay) {
        addTimeout(() => {
          setPhase("idle");
        }, 2500);
      }
    }, 1100);
  }, [phase, allowReplay, onGameOver]);

  const reset = useCallback(() => {
    clearAllTimeouts();
    setPhase("idle");
  }, []);

  return (
    <div className="cabinet-game">
      <div className="cabinet-game__arena" aria-hidden="true">
        {/* Floor */}
        <div className="cabinet-game__floor" />

        {/* Cabinet */}
        <div
          className={`cabinet-game__cabinet ${
            phase === "falling" || phase === "gameover"
              ? "cabinet-game__cabinet--fall"
              : ""
          }`}
        >
          <div className="cabinet-game__cabinet-top" />
          <div className="cabinet-game__cabinet-body">
            <div className="cabinet-game__cabinet-door">
              <div className="cabinet-game__cabinet-panel cabinet-game__cabinet-panel--top" />
              <div className="cabinet-game__cabinet-panel cabinet-game__cabinet-panel--bottom" />
            </div>
            <div className="cabinet-game__cabinet-handle" />
          </div>
          <div className="cabinet-game__cabinet-leg cabinet-game__cabinet-leg--left" />
          <div className="cabinet-game__cabinet-leg cabinet-game__cabinet-leg--right" />
        </div>

        {/* Target object (flower pot) */}
        <div className="cabinet-game__target">
          <div className="cabinet-game__pot" />
          <div className="cabinet-game__plant">
            <div className="cabinet-game__leaf cabinet-game__leaf--1" />
            <div className="cabinet-game__leaf cabinet-game__leaf--2" />
            <div className="cabinet-game__leaf cabinet-game__leaf--3" />
          </div>
        </div>

        {/* Impact effect */}
        <div
          className={`cabinet-game__impact ${
            phase === "gameover" ? "cabinet-game__impact--show" : ""
          }`}
        />

        {/* Debris particles */}
        {phase === "gameover" && (
          <div className="cabinet-game__debris">
            <div className="cabinet-game__particle cabinet-game__particle--1" />
            <div className="cabinet-game__particle cabinet-game__particle--2" />
            <div className="cabinet-game__particle cabinet-game__particle--3" />
            <div className="cabinet-game__particle cabinet-game__particle--4" />
          </div>
        )}

        {/* Game Over overlay */}
        {phase === "gameover" && (
          <div className="cabinet-game__overlay">
            <div className="cabinet-game__gameover">
              <div className="cabinet-game__gameover-title">Game Over</div>
              <div className="cabinet-game__gameover-text">
                Kaappi kaatui kukan päälle
              </div>
            </div>
          </div>
        )}

        {/* Instruction overlay when idle */}
        {phase === "idle" && (
          <div className="cabinet-game__instruction">
            <span>Klikkaa nappia</span>
          </div>
        )}
      </div>

      <div className="cabinet-game__footer">
        <button
          className="cabinet-game__btn"
          onClick={start}
          disabled={phase !== "idle"}
          type="button"
        >
          {phase === "idle" ? buttonText : phase === "falling" ? "Kaatuu..." : "Kaatui!"}
        </button>
        {phase === "gameover" && allowReplay && (
          <button
            className="cabinet-game__btn cabinet-game__btn--secondary"
            onClick={reset}
            type="button"
          >
            Yritä uudelleen
          </button>
        )}
      </div>

      <style>{cabinetGameStyles}</style>
    </div>
  );
}

const cabinetGameStyles = `
.cabinet-game {
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #fff;
}

.cabinet-game__arena {
  position: relative;
  height: 280px;
  background: linear-gradient(180deg, #e0f2fe 0%, #f0f9ff 40%, #fef3c7 100%);
  overflow: hidden;
}

@media (min-width: 768px) {
  .cabinet-game__arena {
    height: 340px;
  }
}

/* Floor */
.cabinet-game__floor {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 36px;
  background: linear-gradient(180deg, #a3a3a3, #737373);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
}
.cabinet-game__floor::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(180deg, #d4d4d4, #a3a3a3);
}

/* Target (Flower pot) */
.cabinet-game__target {
  position: absolute;
  right: 28%;
  bottom: 36px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.cabinet-game__pot {
  width: 56px;
  height: 50px;
  background: linear-gradient(180deg, #c2410c, #9a3412);
  border-radius: 4px 4px 10px 10px;
  clip-path: polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%);
  box-shadow: 
    inset -4px 0 8px rgba(0, 0, 0, 0.2),
    inset 4px 0 8px rgba(255, 255, 255, 0.1);
}
.cabinet-game__plant {
  position: absolute;
  bottom: 46px;
  display: flex;
  gap: 3px;
}
.cabinet-game__leaf {
  width: 18px;
  height: 40px;
  background: linear-gradient(180deg, #22c55e, #15803d);
  border-radius: 50% 50% 50% 50% / 80% 80% 20% 20%;
  transform-origin: bottom center;
}
.cabinet-game__leaf--1 {
  transform: rotate(-25deg);
  height: 34px;
}
.cabinet-game__leaf--2 {
  transform: rotate(0deg);
  height: 46px;
}
.cabinet-game__leaf--3 {
  transform: rotate(25deg);
  height: 34px;
}

/* Cabinet */
.cabinet-game__cabinet {
  position: absolute;
  left: 25%;
  bottom: 36px;
  width: 120px;
  height: 160px;
  transform-origin: 104px 160px;
  transform: rotate(0deg);
  transition: transform 950ms cubic-bezier(0.22, 1, 0.36, 1);
}
.cabinet-game__cabinet--fall {
  transform: rotate(72deg);
}

.cabinet-game__cabinet-top {
  position: absolute;
  left: -4px;
  top: -6px;
  width: 128px;
  height: 14px;
  border-radius: 6px 6px 2px 2px;
  background: linear-gradient(180deg, #854d0e, #713f12);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.25);
}

.cabinet-game__cabinet-body {
  position: absolute;
  left: 0;
  top: 8px;
  width: 120px;
  height: 144px;
  border-radius: 8px;
  background: linear-gradient(135deg, #a16207, #854d0e);
  box-shadow: 
    inset 0 0 0 2px rgba(255, 255, 255, 0.12),
    inset -8px 0 16px rgba(0, 0, 0, 0.15),
    0 8px 24px rgba(0, 0, 0, 0.3);
}

.cabinet-game__cabinet-door {
  position: absolute;
  left: 8px;
  top: 8px;
  width: 104px;
  height: 128px;
  border-radius: 6px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(0, 0, 0, 0.05));
  box-shadow: inset 0 0 0 2px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 6px;
}

.cabinet-game__cabinet-panel {
  flex: 1;
  border-radius: 4px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(0, 0, 0, 0.08));
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.1);
}

.cabinet-game__cabinet-handle {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  width: 8px;
  height: 26px;
  border-radius: 4px;
  background: linear-gradient(180deg, #fbbf24, #d97706);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.cabinet-game__cabinet-leg {
  position: absolute;
  bottom: -6px;
  width: 12px;
  height: 8px;
  border-radius: 2px;
  background: linear-gradient(180deg, #57534e, #44403c);
}
.cabinet-game__cabinet-leg--left {
  left: 12px;
}
.cabinet-game__cabinet-leg--right {
  right: 12px;
}

/* Impact effect */
.cabinet-game__impact {
  position: absolute;
  right: 30%;
  bottom: 100px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  opacity: 0;
  pointer-events: none;
}
.cabinet-game__impact--show {
  animation: cabinet-boom 600ms ease-out forwards;
}

@keyframes cabinet-boom {
  0% {
    opacity: 0;
    transform: scale(0.5);
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
  }
  20% {
    opacity: 1;
    transform: scale(1.5);
    box-shadow: 
      0 0 16px 8px rgba(239, 68, 68, 0.4),
      0 0 32px 16px rgba(251, 191, 36, 0.2);
  }
  60% {
    opacity: 0.8;
    transform: scale(2.5);
    box-shadow: 
      0 0 24px 12px rgba(239, 68, 68, 0.2),
      0 0 48px 24px rgba(251, 191, 36, 0.1);
  }
  100% {
    opacity: 0;
    transform: scale(3.5);
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
  }
}

/* Debris particles */
.cabinet-game__debris {
  position: absolute;
  right: 30%;
  bottom: 80px;
  pointer-events: none;
}
.cabinet-game__particle {
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 2px;
  background: #22c55e;
  animation: cabinet-debris-fly 800ms ease-out forwards;
}
.cabinet-game__particle--1 {
  animation-delay: 0ms;
  --fly-x: -35px;
  --fly-y: -70px;
}
.cabinet-game__particle--2 {
  animation-delay: 50ms;
  --fly-x: 25px;
  --fly-y: -85px;
  background: #c2410c;
}
.cabinet-game__particle--3 {
  animation-delay: 100ms;
  --fly-x: 45px;
  --fly-y: -55px;
}
.cabinet-game__particle--4 {
  animation-delay: 75ms;
  --fly-x: -12px;
  --fly-y: -75px;
  background: #854d0e;
  width: 6px;
  height: 6px;
}

@keyframes cabinet-debris-fly {
  0% {
    opacity: 1;
    transform: translate(0, 0) rotate(0deg);
  }
  100% {
    opacity: 0;
    transform: translate(var(--fly-x), var(--fly-y)) rotate(180deg);
  }
}

/* Game Over overlay */
.cabinet-game__overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(2px);
  animation: cabinet-overlay-appear 200ms ease-out;
}

@keyframes cabinet-overlay-appear {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.cabinet-game__gameover {
  text-align: center;
  animation: cabinet-gameover-appear 300ms ease-out;
}
.cabinet-game__gameover-title {
  font-size: 22px;
  font-weight: 900;
  color: #dc2626;
  text-shadow: 0 2px 4px rgba(220, 38, 38, 0.2);
  text-transform: uppercase;
  letter-spacing: -0.02em;
}
.cabinet-game__gameover-text {
  margin-top: 4px;
  font-size: 13px;
  color: #475569;
  font-weight: 600;
}

@keyframes cabinet-gameover-appear {
  0% {
    opacity: 0;
    transform: translateY(8px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Instruction overlay */
.cabinet-game__instruction {
  position: absolute;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 11px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}

/* Footer with buttons */
.cabinet-game__footer {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px 20px;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
}

@media (min-width: 480px) {
  .cabinet-game__footer {
    flex-direction: row;
    padding: 16px 24px;
  }
}

.cabinet-game__btn {
  flex: 1;
  appearance: none;
  border: 0;
  border-radius: 12px;
  padding: 16px 24px;
  font-weight: 800;
  font-size: 15px;
  background: linear-gradient(180deg, #22c55e, #16a34a);
  color: white;
  cursor: pointer;
  box-shadow: 
    0 0 0 1px rgba(0, 0, 0, 0.1),
    0 6px 20px rgba(22, 163, 74, 0.3);
  transition: transform 150ms ease, box-shadow 150ms ease, opacity 150ms ease;
}
.cabinet-game__btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 
    0 0 0 1px rgba(0, 0, 0, 0.1),
    0 10px 28px rgba(22, 163, 74, 0.35);
}
.cabinet-game__btn:active:not(:disabled) {
  transform: translateY(0);
}
.cabinet-game__btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.cabinet-game__btn:focus-visible {
  outline: 2px solid #22c55e;
  outline-offset: 2px;
}

.cabinet-game__btn--secondary {
  background: linear-gradient(180deg, #f1f5f9, #e2e8f0);
  color: #475569;
  box-shadow: 
    0 0 0 1px rgba(0, 0, 0, 0.08),
    0 2px 8px rgba(0, 0, 0, 0.08);
}
.cabinet-game__btn--secondary:hover:not(:disabled) {
  box-shadow: 
    0 0 0 1px rgba(0, 0, 0, 0.1),
    0 6px 16px rgba(0, 0, 0, 0.12);
}

/* Mobile adjustments */
@media (max-width: 640px) {
  .cabinet-game__arena {
    height: 220px;
  }
  .cabinet-game__cabinet {
    width: 80px;
    height: 110px;
    transform-origin: 70px 110px;
    left: 18%;
  }
  .cabinet-game__cabinet-top {
    width: 88px;
    height: 10px;
  }
  .cabinet-game__cabinet-body {
    width: 80px;
    height: 96px;
  }
  .cabinet-game__cabinet-door {
    width: 68px;
    height: 84px;
  }
  .cabinet-game__cabinet-handle {
    width: 6px;
    height: 18px;
    right: 10px;
  }
  .cabinet-game__target {
    right: 22%;
  }
  .cabinet-game__pot {
    width: 42px;
    height: 38px;
  }
  .cabinet-game__plant {
    bottom: 34px;
  }
  .cabinet-game__leaf {
    width: 14px;
    height: 30px;
  }
  .cabinet-game__leaf--1 {
    height: 26px;
  }
  .cabinet-game__leaf--2 {
    height: 36px;
  }
  .cabinet-game__leaf--3 {
    height: 26px;
  }
  .cabinet-game__floor {
    height: 28px;
  }
  .cabinet-game__impact {
    right: 24%;
    bottom: 70px;
  }
  .cabinet-game__debris {
    right: 24%;
    bottom: 60px;
  }
}
`;
