import { motion } from "motion/react";
import { cn } from "../../lib/utils";

/**
 * UI LORA Style: Text Slide Reveal
 * Premium entrance animation for headings.
 */
export const TextSlide = ({ 
  children, 
  className, 
  delay = 0 
}: { 
  children: React.ReactNode; 
  className?: string; 
  delay?: number;
}) => {
  return (
    <div className={cn("overflow-hidden py-1", className)}>
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        transition={{ 
          duration: 1, 
          ease: [0.16, 1, 0.3, 1], // Custom easing for premium feel
          delay 
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};

/**
 * Vengence UI Style: Magnetic Effect
 * Subtle pull towards the cursor.
 */
export const Magnetic = ({ 
  children, 
  className,
  strength = 0.5 
}: { 
  children: React.ReactNode; 
  className?: string;
  strength?: number 
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * Forge UI Style: Reveal On View
 * Staggered content reveal.
 */
export const Reveal = ({ 
  children, 
  className,
  delay = 0 
}: { 
  children: React.ReactNode; 
  className?: string;
  delay?: number 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ 
        duration: 0.8, 
        ease: [0.215, 0.61, 0.355, 1],
        delay 
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * Global Page Transition Wrapper
 */
export const PageTransition = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ 
        duration: 0.8, 
        ease: [0.16, 1, 0.3, 1] 
      }}
    >
      {children}
    </motion.div>
  );
};

/**
 * Cinematic Parallax Effect
 */
export const Parallax = ({ children, offset = 50 }: { children: React.ReactNode, offset?: number }) => {
  return (
    <motion.div
      whileInView={{ y: [offset, -offset] }}
      viewport={{ once: false }}
      transition={{ ease: "linear" }}
    >
      {children}
    </motion.div>
  );
};

/**
 * Cinematic Image (UI LORA Influence)
 * High dynamic range entrance for images.
 */
export const CinematicImage = ({ 
  src, 
  alt, 
  className 
}: { 
  src: string; 
  alt: string; 
  className?: string 
}) => {
  return (
    <div className={cn("overflow-hidden rounded-3xl", className)}>
      <motion.img
        src={src}
        alt={alt}
        initial={{ scale: 1.2, filter: "blur(10px) brightness(0.5)" }}
        animate={{ scale: 1, filter: "blur(0px) brightness(1)" }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="w-full h-full object-cover"
      />
    </div>
  );
};
