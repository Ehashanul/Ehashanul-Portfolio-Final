import { motion } from 'framer-motion';

const FloatingElement = ({ children, delay = 0, duration = 6, yOffset = 20, className = "" }) => {
  return (
    <motion.div
      animate={{
        y: [0, -yOffset, 0],
        rotate: [0, 1, 0, -1, 0],
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay: delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default FloatingElement;
