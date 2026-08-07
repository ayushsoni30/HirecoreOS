/**
 * File: client/src/components/CustomCursor.jsx
 * Description: Scholarly interactive custom cursor.
 *              Displays a sharp 0-radius square cursor follower with a central crosshair dot
 *              that expands on interactive hover targets.
 */

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      const target = e.target;
      const isInteractive = target && (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.closest('button') ||
        target.closest('a') ||
        target.getAttribute('role') === 'button' ||
        target.classList.contains('cursor-pointer')
      );
      setIsHovered(!!isInteractive);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden hidden md:block">
      {/* Central Sharp Crosshair Dot */}
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-accent pointer-events-none z-50"
        animate={{
          x: mousePosition.x - 3,
          y: mousePosition.y - 3,
          scale: isHovered ? 0 : 1,
        }}
        transition={{ type: 'spring', damping: 30, stiffness: 450, mass: 0.1 }}
      />

      {/* Sharp Corner Square Bounding Cursor */}
      <motion.div
        className="fixed top-0 left-0 border border-accent/80 pointer-events-none z-40 bg-accent/5"
        animate={{
          x: mousePosition.x - (isHovered ? 20 : 10),
          y: mousePosition.y - (isHovered ? 20 : 10),
          width: isHovered ? 40 : 20,
          height: isHovered ? 40 : 20,
          borderColor: isHovered ? '#9A3412' : 'rgba(154, 52, 18, 0.5)',
          backgroundColor: isHovered ? 'rgba(154, 52, 18, 0.1)' : 'rgba(154, 52, 18, 0.02)',
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 300, mass: 0.2 }}
      />
    </div>
  );
};

export default CustomCursor;
