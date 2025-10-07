import React, { useEffect, useRef, useState } from 'react';
import './App.css';

function App() {
  const [dpi, setDpi] = useState<number>(0);
  const [fps, setFps] = useState<number>(0);
  const [cpuLoad, setCpuLoad] = useState<number>(0);
  const frameTimes = useRef<number[]>([]);
  const lastFrameTime = useRef<number>(performance.now());

  useEffect(() => {
    // === DPI Calculation ===
    const calculateDPI = () => {
      const dpiX = window.devicePixelRatio * 96;
      setDpi(Math.round(dpiX));
    };

    calculateDPI();
    window.addEventListener('resize', calculateDPI);

    return () => window.removeEventListener('resize', calculateDPI);
  }, []);

  useEffect(() => {
    let animationFrameId: number;

    const updateStats = () => {
      const now = performance.now();
      const delta = now - lastFrameTime.current;
      lastFrameTime.current = now;

      // FPS Calculation
      const currentFps = 1000 / delta;
      frameTimes.current.push(currentFps);
      if (frameTimes.current.length > 60) frameTimes.current.shift();
      const avgFps =
        frameTimes.current.reduce((sum, val) => sum + val, 0) /
        frameTimes.current.length;
      setFps(Math.round(avgFps));

      // Approximate CPU Load (% of time spent rendering this frame)
      const startCpu = performance.now();
      while (performance.now() - startCpu < 1) {
        // simulate some CPU work
      }
      const cpuUsage = ((performance.now() - startCpu) / delta) * 100;
      setCpuLoad(Math.min(Math.round(cpuUsage), 100));

      animationFrameId = requestAnimationFrame(updateStats);
    };

    animationFrameId = requestAnimationFrame(updateStats);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="App" style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h1>📊 Realtime System Monitor</h1>
      <p><strong>DPI:</strong> {dpi} DPI</p>
      <p><strong>FPS:</strong> {fps} frames/sec</p>
      <p><strong>Approx. CPU Load:</strong> {cpuLoad}%</p>
    </div>
  );
}

export default App;
