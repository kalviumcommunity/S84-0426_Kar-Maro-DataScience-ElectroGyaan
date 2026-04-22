import React, { useEffect, useMemo, useRef, useState } from 'react';

const AnimatedGrid = () => {
  const containerRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: -9999, y: -9999 });
  const [isIdle, setIsIdle] = useState(false);
  const [randomGlowBoxes, setRandomGlowBoxes] = useState(new Set());
  const [lastMouseMove, setLastMouseMove] = useState(Date.now());
  const [dimensions, setDimensions] = useState({ width: 1280, height: 720 });

  const boxWidth = 60;
  const boxHeight = 120;

  useEffect(() => {
    const updateDimensions = () => {
      const parent = containerRef.current?.parentElement;
      if (parent) {
        setDimensions({
          width: parent.clientWidth,
          height: parent.clientHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const parent = containerRef.current?.parentElement;
      if (!parent) return;

      const rect = parent.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
        return;
      }

      setMousePosition({ x, y });
      setLastMouseMove(Date.now());
      setIsIdle(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const checkIdle = setInterval(() => {
      const now = Date.now();
      if (now - lastMouseMove > 1800) {
        setIsIdle(true);
      }
    }, 500);

    return () => clearInterval(checkIdle);
  }, [lastMouseMove]);

  useEffect(() => {
    if (!isIdle) {
      setRandomGlowBoxes(new Set());
      return;
    }

    const rows = Math.ceil(dimensions.height / boxHeight) + 2;
    const cols = Math.ceil(dimensions.width / boxWidth) + 2;

    const interval = setInterval(() => {
      const newGlowBoxes = new Set();
      const numBoxes = Math.floor(Math.random() * 2) + 2;

      for (let i = 0; i < numBoxes; i += 1) {
        const randomRow = Math.floor(Math.random() * rows);
        const randomCol = Math.floor(Math.random() * cols);
        newGlowBoxes.add(`${randomRow}-${randomCol}`);
      }

      setRandomGlowBoxes(newGlowBoxes);
    }, 1300);

    return () => clearInterval(interval);
  }, [isIdle, dimensions.height, dimensions.width]);

  const rows = Math.ceil(dimensions.height / boxHeight) + 2;
  const cols = Math.ceil(dimensions.width / boxWidth) + 2;

  const boxes = useMemo(() => {
    const allBoxes = [];

    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        const x = col * boxWidth;
        const y = row * boxHeight;
        const boxKey = `${row}-${col}`;

        let glowIntensity = 0;
        let glowColor = '59, 130, 246';

        if (isIdle && randomGlowBoxes.has(boxKey)) {
          glowIntensity = 0.45 + Math.random() * 0.3;
        } else if (!isIdle) {
          const boxCenterX = x + boxWidth / 2;
          const boxCenterY = y + boxHeight / 2;
          const dx = mousePosition.x - boxCenterX;
          const dy = mousePosition.y - boxCenterY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxDistance = Math.max(boxWidth, boxHeight) * 1.7;
          glowIntensity = Math.max(0, 1 - distance / maxDistance);
        }

        allBoxes.push(
          <div
            key={boxKey}
            className="absolute border border-[rgba(255,255,255,0.08)] transition-all duration-700 ease-out"
            style={{
              left: x,
              top: y,
              width: boxWidth,
              height: boxHeight,
              backgroundColor: glowIntensity > 0.08
                ? `rgba(${glowColor}, ${glowIntensity * 0.16})`
                : 'transparent',
              boxShadow: glowIntensity > 0.08
                ? `inset 0 0 ${24 * glowIntensity}px rgba(${glowColor}, ${glowIntensity * 0.38}), 0 0 ${16 * glowIntensity}px rgba(${glowColor}, ${glowIntensity * 0.22})`
                : 'none',
              borderColor: glowIntensity > 0.08
                ? `rgba(${glowColor}, ${glowIntensity * 0.55})`
                : 'rgba(255,255,255,0.08)',
            }}
          />
        );
      }
    }

    return allBoxes;
  }, [rows, cols, isIdle, randomGlowBoxes, mousePosition]);

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      <div className="absolute inset-0">{boxes}</div>
    </div>
  );
};

export default AnimatedGrid;