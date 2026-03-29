"use client";

import React, { useState } from "react";
import Image from "next/image";

interface ImageGalleryProps {
  images: Array<{
    src: string;
    alt: string;
    caption?: string;
  }>;
}

/**
 * ImageGallery - Responsive image gallery with lightbox
 *
 * @example
 * <ImageGallery images={[
 *   { src: "/image1.jpg", alt: "Description", caption: "Caption" },
 *   { src: "/image2.jpg", alt: "Description" }
 * ]} />
 */
export default function ImageGallery({ images }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number>(0);

  if (!images || images.length === 0) {
    return <div>No images available</div>;
  }

  return (
    <div className="my-8">
      <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
        <Image
          src={images[selectedImage].src}
          alt={images[selectedImage].alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
        />
        {images[selectedImage].caption && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-4">
            <p className="text-sm">{images[selectedImage].caption}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-4 gap-2">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`relative aspect-square rounded overflow-hidden border-2 transition-colors ${
              selectedImage === index
                ? "border-amber-500"
                : "border-transparent hover:border-gray-300"
            }`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 25vw, 200px"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
