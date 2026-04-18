import { motion } from "framer-motion";

function AnimatedButton({
  children,
  onClick,
  className = "",
  type = "button",
  disabled = false,
}) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={className}
      whileHover={{
        scale: 1.03,
        y: -1,
        transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] }
      }}
      whileTap={{
        scale: 0.96,
        transition: { duration: 0.1 }
      }}
    >
      {children}
    </motion.button>
  );
}

export default AnimatedButton;