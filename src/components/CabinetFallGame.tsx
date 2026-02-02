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
  overflow: visible;
  background: transparent;
  justify-content: flex-start;
  min-width: 0;
}

.cabinet-game__arena {
  position: relative;
  height: 280px;
  background: transparent;
  overflow: visible;
  margin-bottom: auto;
  margin-top: -5%;
  min-width: 0;
}

@media (min-width: 768px) {
  .cabinet-game__arena {
    height: 340px;
  }
}

/* Floor - hidden */
.cabinet-game__floor {
  display: none;
}

/* Target (Flower pot) */
.cabinet-game__target {
  position: absolute;
  right: 28%;
  bottom: 0%;
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
  bottom: 0;
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
  bottom: 20%;
  width: 120px;
  height: 160px;
  transform-origin: 16px 160px;
  transform: rotate(0deg);
  transition: transform 950ms cubic-bezier(0.22, 1, 0.36, 1);
}
.cabinet-game__cabinet--fall {
  transform: rotate(-72deg);
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
  bottom: calc(0% - 20px);
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
  bottom: calc(0% - 40px);
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


/* Footer with buttons */
.cabinet-game__footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 16px 20px;
  background: transparent;
  border-top: none;
  margin-top: auto;
  margin-bottom: 15%;
  position: relative;
  z-index: 30;
}

@media (min-width: 480px) {
  .cabinet-game__footer {
    flex-direction: row;
    padding: 16px 24px;
  }
}

.cabinet-game__btn {
  flex: 0 0 auto;
  appearance: none;
  border: 0;
  border-radius: 8px;
  padding: 12px 24px;
  font-weight: 700;
  font-size: 14px;
  background: #ffffff;
  color: #000000;
  cursor: pointer;
  box-shadow: 
    0 0 0 1px rgba(0, 0, 0, 0.1),
    0 4px 12px rgba(0, 0, 0, 0.3);
  white-space: nowrap;
  width: auto;
  min-width: 0;
  transform: rotate(22deg);
  opacity: 1 !important;
}
.cabinet-game__btn:hover:not(:disabled) {
  transform: rotate(22deg);
  opacity: 1 !important;
}
.cabinet-game__btn:active:not(:disabled) {
  transform: rotate(22deg);
  opacity: 1 !important;
}
.cabinet-game__btn:disabled {
  cursor: not-allowed;
  opacity: 1;
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
    bottom: 0;
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
  .cabinet-game__impact {
    right: 24%;
    bottom: 44px;
  }
  .cabinet-game__debris {
    right: 24%;
    bottom: 30px;
  }
}
`;
