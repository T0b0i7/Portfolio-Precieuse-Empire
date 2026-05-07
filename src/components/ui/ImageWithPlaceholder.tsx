import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../../lib/utils";

interface ImageWithPlaceholderProps {
  src: string;
  alt: string;
  className?: string;
  placeholderSrc?: string;
  onLoad?: () => void;
  priority?: boolean;
}

export const ImageWithPlaceholder = ({
  src,
  alt,
  className,
  placeholderSrc,
  onLoad,
  priority = false,
}: ImageWithPlaceholderProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setIsLoaded(true);
      if (onLoad) onLoad();
    };
    img.onerror = () => setError(true);
  }, [src, onLoad]);

  // Use a generic placeholder if none provided
  const placeholderStyle = placeholderSrc 
    ? { backgroundImage: `url(${placeholderSrc})` } 
    : { backgroundColor: "rgba(193, 154, 107, 0.05)" };

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Low-res Placeholder / Background */}
      <AnimatePresence>
        {!isLoaded && !error && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-cover bg-center blur-xl scale-110"
            style={placeholderStyle}
          />
        )}
      </AnimatePresence>

      {/* Main Image */}
      <motion.img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ 
          opacity: isLoaded ? 1 : 0,
          scale: isLoaded ? 1 : 1.05,
          filter: isLoaded ? "blur(0px)" : "blur(10px)"
        }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "w-full h-full object-cover",
          !isLoaded && "invisible"
        )}
        onLoad={() => setIsLoaded(true)}
      />

      {/* Error State */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-brand-obsidian/20">
          <span className="text-[10px] micro-label opacity-20">IMAGE NON DISPONIBLE</span>
        </div>
      )}
    </div>
  );
};
