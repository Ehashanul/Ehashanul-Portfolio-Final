import { useEffect, useState } from 'react';
import { motion, useMotionValue } from 'framer-motion';

const CustomCursor = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  useEffect(() => {
    const handlePointerMove = (event) => {
      if (event.pointerType === 'touch') return;
      // Align the visible tip within the transparent image with the pointer.
      cursorX.set(event.clientX - 12);
      cursorY.set(event.clientY - 9.36);
      setIsVisible(true);
      setIsHovering(Boolean(event.target.closest('a, button, [role="button"], .interactive')));
    };
    const hideCursor = () => setIsVisible(false);
    window.addEventListener('pointermove', handlePointerMove);
    document.documentElement.addEventListener('pointerleave', hideCursor);
    window.addEventListener('blur', hideCursor);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      document.documentElement.removeEventListener('pointerleave', hideCursor);
      window.removeEventListener('blur', hideCursor);
    };
  }, [cursorX, cursorY]);

  return (
    <motion.img
      src={`${import.meta.env.BASE_URL}cursor.png?v=2`}
      alt=""
      aria-hidden="true"
      draggable={false}
      className="fixed top-0 left-0 w-12 h-12 pointer-events-none z-[9999] select-none"
      style={{ x: cursorX, y: cursorY, transformOrigin: '12px 9.36px' }}
      animate={{ opacity: isVisible ? 1 : 0, scale: isHovering ? 1.2 : 1 }}
      transition={{ duration: 0.15 }}
    />
  );
};

export default CustomCursor;
