import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [showTagline, setShowTagline] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let current = 0;
    let paused = false;

    const interval = setInterval(() => {
      if (paused) return;

      current += 1;
      setProgress(current);

      // At 50% — pause for 3 seconds and show tagline
      if (current === 50) {
        paused = true;
        setShowTagline(true);
        setTimeout(() => {
          paused = false;
          setShowTagline(false);
        }, 3000);
      }

      // At 100% — wait then hide
      if (current >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setDone(true);
          setTimeout(onComplete, 600);
        }, 400);
      }
    }, 25);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-navy-50"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.04,
            filter: "blur(8px)",
            transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
          }}
        >
          {/* Logo + Name */}
          <motion.div
            className="flex flex-col items-center mb-12"
            initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.img
              src="/src/assets/logo.png"
              alt="Campus Bridge"
              className="w-24 h-24 rounded-3xl object-cover mb-6 shadow-lg"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            />
            <motion.h1
              className="text-3xl font-bold text-navy-800 tracking-wide"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              CAMPUS BRIDGE
            </motion.h1>
          </motion.div>

          {/* Progress Bar */}
          <motion.div
            className="w-72 md:w-96"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Percentage */}
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-navy-400 font-medium">Loading</span>
              <motion.span
                className="text-xs text-navy-600 font-bold"
              >
                {progress}%
              </motion.span>
            </div>

            {/* Bar Track */}
            <div className="w-full bg-navy-200 rounded-full h-3 overflow-hidden">
              <motion.div
                className="h-3 rounded-full bg-navy-800"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.05 }}
              />
            </div>

            {/* Tagline */}
            <div className="h-8 mt-4 flex items-center justify-center">
              <AnimatePresence mode="wait">
                {showTagline && (
                  <motion.p
                    className="text-sm text-navy-600 text-center font-semibold"
                    initial={{ opacity: 0, y: 6, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -6, filter: "blur(4px)" }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  >
                    "Connecting students with the right opportunities."
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default LoadingScreen;