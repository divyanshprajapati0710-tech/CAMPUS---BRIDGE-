import { motion } from "framer-motion";

function AnimatedCard({ children, className = "", onClick, delay = 0 }) {
  return (
    <motion.div
      className={className}
      onClick={onClick}
      initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={onClick ? {
        scale: 1.025,
        y: -3,
        transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] }
      } : {}}
      whileTap={onClick ? {
        scale: 0.975,
        transition: { duration: 0.15 }
      } : {}}
    >
      {children}
    </motion.div>
  );
}

export default AnimatedCard;