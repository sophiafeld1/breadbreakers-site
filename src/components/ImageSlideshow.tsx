"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

export type SlideshowImage = {
  src: string;
  alt: string;
};

type ImageSlideshowProps = {
  images: SlideshowImage[];
  intervalMs?: number;
  className?: string;
};

export default function ImageSlideshow({
  images,
  intervalMs = 2000,
  className = "",
}: ImageSlideshowProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const goTo = useCallback((index: number) => {
    setActiveIndex(index);
    setIsPaused(true);
  }, []);

  useEffect(() => {
    if (isPaused || images.length <= 1) return;

    const id = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length);
    }, intervalMs);

    return () => window.clearInterval(id);
  }, [activeIndex, images.length, intervalMs, isPaused]);

  if (images.length === 0) return null;

  return (
    <div
      className={`relative overflow-hidden rounded-lg ${className}`}
      aria-roledescription="carousel"
      aria-label="Photo slideshow"
    >
      {images.map((image, index) => (
        <Image
          key={image.src}
          src={image.src}
          alt={image.alt}
          fill
          priority={index === 0}
          className={`object-cover object-center transition-opacity duration-500 ${
            index === activeIndex ? "opacity-100" : "opacity-0"
          }`}
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      ))}

      <div
        className="absolute inset-x-0 bottom-0 flex justify-center gap-2 bg-gradient-to-t from-black/50 to-transparent px-4 pb-4 pt-12"
        role="tablist"
        aria-label="Choose a photo"
      >
        {images.map((image, index) => {
          const isActive = index === activeIndex;

          return (
            <button
              key={image.src}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={`Show photo ${index + 1} of ${images.length}: ${image.alt}`}
              onClick={() => goTo(index)}
              className={`h-2.5 w-2.5 rounded-full transition-all ${
                isActive
                  ? "scale-110 bg-cream"
                  : "bg-cream/40 hover:bg-cream/65"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
