"use client";

import React, { useState } from "react";
import Image from "next/image";

interface ImageGalleryProps {
  images: Array<{
    src: string;
    alt: string;
    caption?: string;
  }>;
  /** Gallery layout style */
  layout?: 'grid' | 'masonry' | 'carousel' | 'justified';
  /** Number of columns in grid layout */
  columns?: number;
  /** Gap between images in pixels */
  gap?: number;
  /** Enable lightbox on click */
  lightbox?: boolean;
  /** Caption display mode */
  captions?: 'below' | 'overlay' | 'hover' | 'none';
  /** Aspect ratio for images */
  aspectRatio?: 'auto' | '1:1' | '4:3' | '16:9' | '3:2';
}

const aspectRatioMap: Record<string, string> = {
  'auto': '',
  '1:1': 'aspect-square',
  '4:3': 'aspect-[4/3]',
  '16:9': 'aspect-video',
  '3:2': 'aspect-[3/2]',
};

/**
 * ImageGallery - Responsive image gallery with lightbox
 *
 * @example
 * <ImageGallery images={[
 *   { src: "/image1.jpg", alt: "Description", caption: "Caption" },
 *   { src: "/image2.jpg", alt: "Description" }
 * ]} />
 */
export default function ImageGallery({
  images,
  layout = 'grid',
  columns = 4,
  gap = 8,
  lightbox = true,
  captions = 'below',
  aspectRatio = 'auto',
}: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);

  if (!images || images.length === 0) {
    return <div>No images available</div>;
  }

  const gapClass = gap <= 2 ? 'gap-1' : gap <= 4 ? 'gap-2' : gap <= 8 ? 'gap-4' : 'gap-6';

  const colClass =
    columns <= 1
      ? 'grid-cols-1'
      : columns === 2
        ? 'grid-cols-2'
        : columns === 3
          ? 'grid-cols-3'
          : columns === 4
            ? 'grid-cols-4'
            : 'grid-cols-5';

  const arClass = aspectRatioMap[aspectRatio] || '';

  const handleImageClick = (index: number) => {
    if (lightbox) {
      setSelectedImage(index);
      setLightboxOpen(true);
    } else {
      setSelectedImage(index);
    }
  };

  // Lightbox overlay
  const renderLightbox = () => {
    if (!lightboxOpen || !lightbox) return null;
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
        onClick={() => setLightboxOpen(false)}
      >
        <button
          onClick={() => setLightboxOpen(false)}
          className="absolute top-4 right-4 text-white text-2xl z-10 p-2"
          aria-label="Close lightbox"
        >
          &times;
        </button>
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
              }}
              className="absolute left-4 text-white text-3xl p-2 z-10"
              aria-label="Previous image"
            >
              &#8249;
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage((prev) => (prev + 1) % images.length);
              }}
              className="absolute right-4 text-white text-3xl p-2 z-10"
              aria-label="Next image"
            >
              &#8250;
            </button>
          </>
        )}
        <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center p-8">
          <Image
            src={images[selectedImage].src}
            alt={images[selectedImage].alt}
            fill
            className="object-contain"
            sizes="100vw"
          />
        </div>
        {images[selectedImage].caption && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white text-center">
            <p className="text-sm">{images[selectedImage].caption}</p>
          </div>
        )}
      </div>
    );
  };

  // Carousel layout
  if (layout === 'carousel') {
    return (
      <div className="my-8">
        {renderLightbox()}
        <div className="relative rounded-lg overflow-hidden">
          <div
            className={`relative w-full ${arClass || 'aspect-video'}`}
          >
            <Image
              src={images[selectedImage].src}
              alt={images[selectedImage].alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              onClick={() => handleImageClick(selectedImage)}
            />
            {captions !== 'none' && images[selectedImage].caption && (
              <div
                className={
                  captions === 'overlay'
                    ? 'absolute bottom-0 left-0 right-0 p-4'
                    : captions === 'hover'
                      ? 'absolute bottom-0 left-0 right-0 p-4 opacity-0 hover:opacity-100 transition-opacity'
                      : 'hidden'
                }
                style={
                  captions === 'overlay' || captions === 'hover'
                    ? { background: 'rgba(0,0,0,0.6)', color: '#fff' }
                    : undefined
                }
              >
                <p className="text-sm">{images[selectedImage].caption}</p>
              </div>
            )}
          </div>
          {images.length > 1 && (
            <>
              <button
                onClick={() =>
                  setSelectedImage((prev) => (prev - 1 + images.length) % images.length)
                }
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-sm"
                style={{ background: 'var(--surface)', color: 'var(--foreground)' }}
                aria-label="Previous"
              >
                &#8249;
              </button>
              <button
                onClick={() => setSelectedImage((prev) => (prev + 1) % images.length)}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-sm"
                style={{ background: 'var(--surface)', color: 'var(--foreground)' }}
                aria-label="Next"
              >
                &#8250;
              </button>
            </>
          )}
        </div>
        {captions === 'below' && images[selectedImage].caption && (
          <p className="mt-2 text-sm text-center" style={{ color: 'var(--muted)' }}>
            {images[selectedImage].caption}
          </p>
        )}
        <div className={`flex mt-3 ${gapClass} overflow-x-auto`}>
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`relative flex-shrink-0 w-16 h-16 rounded overflow-hidden border-2 transition-colors ${
                selectedImage === index ? '' : 'border-transparent hover:border-gray-300'
              }`}
              style={{
                borderColor:
                  selectedImage === index ? 'var(--accent)' : 'transparent',
              }}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Masonry layout (CSS columns)
  if (layout === 'masonry') {
    return (
      <div className="my-8">
        {renderLightbox()}
        <div
          className={`columns-2 md:columns-${Math.min(columns, 4)} ${gapClass}`}
          style={{ columnGap: `${gap * 4}px` }}
        >
          {images.map((image, index) => (
            <div
              key={index}
              className="break-inside-avoid mb-4 cursor-pointer"
              onClick={() => handleImageClick(index)}
            >
              <div className="relative rounded-lg overflow-hidden">
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                {captions !== 'none' && captions !== 'hover' && image.caption && (
                  <div
                    className={
                      captions === 'overlay'
                        ? 'absolute bottom-0 left-0 right-0 p-2'
                        : ''
                    }
                    style={
                      captions === 'overlay'
                        ? { background: 'rgba(0,0,0,0.6)', color: '#fff' }
                        : { color: 'var(--muted)' }
                    }
                  >
                    <p className="text-xs">{image.caption}</p>
                  </div>
                )}
              </div>
              {captions === 'below' && image.caption && (
                <p className="mt-1 text-xs" style={{ color: 'var(--muted)' }}>
                  {image.caption}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Justified layout
  if (layout === 'justified') {
    return (
      <div className="my-8">
        {renderLightbox()}
        <div className={`flex flex-wrap ${gapClass}`}>
          {images.map((image, index) => (
            <div
              key={index}
              className="relative cursor-pointer flex-grow"
              style={{
                height: '200px',
                minWidth: '150px',
                maxWidth: '350px',
                margin: `${gap * 2}px`,
              }}
              onClick={() => handleImageClick(index)}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover rounded-lg"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              {captions === 'overlay' && image.caption && (
                <div
                  className="absolute bottom-0 left-0 right-0 p-2 rounded-b-lg"
                  style={{ background: 'rgba(0,0,0,0.6)', color: '#fff' }}
                >
                  <p className="text-xs">{image.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>
        {captions === 'below' && (
          <div className={`flex flex-wrap ${gapClass} mt-1`}>
            {images.map((image, index) => (
              <p
                key={index}
                className="text-xs flex-grow text-center"
                style={{ color: 'var(--muted)', minWidth: '150px', maxWidth: '350px', margin: `0 ${gap * 2}px` }}
              >
                {image.caption || ''}
              </p>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Default: grid layout
  return (
    <div className="my-8">
      {renderLightbox()}
      {!lightbox && (
        <div
          className={`relative w-full ${arClass || 'aspect-video'} rounded-lg overflow-hidden mb-4`}
        >
          <Image
            src={images[selectedImage].src}
            alt={images[selectedImage].alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
          />
          {captions !== 'none' && images[selectedImage].caption && (
            <div
              className={
                captions === 'overlay'
                  ? 'absolute bottom-0 left-0 right-0 p-4'
                  : captions === 'hover'
                    ? 'absolute bottom-0 left-0 right-0 p-4 opacity-0 hover:opacity-100 transition-opacity'
                    : ''
              }
              style={
                captions === 'overlay' || captions === 'hover'
                  ? { background: 'rgba(0,0,0,0.6)', color: '#fff' }
                  : captions === 'below'
                    ? { background: 'rgba(0,0,0,0.6)', color: '#fff' }
                    : undefined
              }
            >
              <p className="text-sm">{images[selectedImage].caption}</p>
            </div>
          )}
        </div>
      )}
      {captions === 'below' && !lightbox && images[selectedImage].caption && (
        <p className="mb-2 text-sm" style={{ color: 'var(--muted)' }}>
          {images[selectedImage].caption}
        </p>
      )}
      <div className={`grid ${colClass} ${gapClass}`}>
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => handleImageClick(index)}
            className={`relative ${arClass || 'aspect-square'} rounded overflow-hidden border-2 transition-colors cursor-pointer`}
            style={{
              borderColor:
                selectedImage === index && !lightbox
                  ? 'var(--accent)'
                  : 'transparent',
            }}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 25vw, 200px"
            />
            {captions === 'hover' && image.caption && (
              <div
                className="absolute inset-0 flex items-end p-2 opacity-0 hover:opacity-100 transition-opacity"
                style={{ background: 'rgba(0,0,0,0.4)', color: '#fff' }}
              >
                <p className="text-xs">{image.caption}</p>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
