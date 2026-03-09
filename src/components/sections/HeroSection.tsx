"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import heroImage from "../../../public/images/hero-image.jpg";
import type p5Type from "p5";

export default function HeroSection() {
  const typedRef = useRef<HTMLSpanElement>(null);
  const particleRef = useRef<HTMLDivElement>(null);
  const heroImageRef = useRef<HTMLDivElement>(null);

  // Typewriter effect
  useEffect(() => {
    let typed: { destroy: () => void } | null = null;

    async function initTyped() {
      const TypedModule = await import("typed.js");
      const TypedClass = TypedModule.default;

      if (typedRef.current) {
        typed = new TypedClass(typedRef.current, {
          strings: [
            "Hello, I'm Saithavy",
            "Growth Enabler",
            "Transformation Guide",
            "Authentic Leader",
          ],
          typeSpeed: 80,
          backSpeed: 50,
          backDelay: 2000,
          startDelay: 500,
          loop: true,
          showCursor: true,
          cursorChar: "|",
        });
      }
    }

    initTyped();
    return () => {
      if (typed) typed.destroy();
    };
  }, []);

  // Particle background with p5.js
  useEffect(() => {
    let p5Instance: p5Type | null = null;

    async function initParticles() {
      const p5Module = await import("p5");
      const p5 = p5Module.default;

      if (!particleRef.current) return;

      interface Particle {
        x: number;
        y: number;
        vx: number;
        vy: number;
        size: number;
        alpha: number;
      }

      const particles: Particle[] = [];

      p5Instance = new p5((p: p5Type) => {
        p.setup = () => {
          const container = particleRef.current;
          if (!container) return;
          const canvas = p.createCanvas(container.offsetWidth, container.offsetHeight);
          canvas.parent(container);
          canvas.style("position", "absolute");
          canvas.style("top", "0");
          canvas.style("left", "0");

          for (let i = 0; i < 50; i++) {
            particles.push({
              x: p.random(p.width),
              y: p.random(p.height),
              vx: p.random(-0.5, 0.5),
              vy: p.random(-0.5, 0.5),
              size: p.random(2, 6),
              alpha: p.random(0.1, 0.3),
            });
          }
        };

        p.draw = () => {
          p.clear();
          particles.forEach((particle) => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            if (particle.x < 0) particle.x = p.width;
            if (particle.x > p.width) particle.x = 0;
            if (particle.y < 0) particle.y = p.height;
            if (particle.y > p.height) particle.y = 0;

            p.fill(26, 54, 93, particle.alpha * 255);
            p.noStroke();
            p.circle(particle.x, particle.y, particle.size);
          });

          for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
              const dist = p.dist(
                particles[i].x, particles[i].y,
                particles[j].x, particles[j].y
              );
              if (dist < 100) {
                p.stroke(26, 54, 93, (1 - dist / 100) * 50);
                p.strokeWeight(1);
                p.line(
                  particles[i].x, particles[i].y,
                  particles[j].x, particles[j].y
                );
              }
            }
          }
        };

        p.windowResized = () => {
          const container = particleRef.current;
          if (container) {
            p.resizeCanvas(container.offsetWidth, container.offsetHeight);
          }
        };
      });
    }

    initParticles();
    return () => {
      if (p5Instance) p5Instance.remove();
    };
  }, []);

  // Parallax effect
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const imgEl = heroImageRef.current?.querySelector("img");
      if (imgEl && scrolled < window.innerHeight) {
        imgEl.style.transform = `translateY(${scrolled * -0.15}px)`;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center hero-bg overflow-hidden"
    >
      {/* Particle Background */}
      <div ref={particleRef} className="particle-canvas" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <h1
              className="font-[family-name:var(--font-poppins)] font-bold text-4xl md:text-6xl mb-6"
              style={{ color: "var(--heading)" }}
            >
              <span ref={typedRef} />
            </h1>
            <p className="text-xl md:text-2xl mb-8 leading-relaxed" style={{ color: "var(--foreground)" }}>
              Inspiring growth, creativity, and transformation through authentic
              leadership and innovative solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a
                href="#story"
                className="px-8 py-4 rounded-lg font-[family-name:var(--font-poppins)] font-semibold text-white transition-all duration-200 hover:opacity-90 hover:scale-105 transform"
                style={{ backgroundColor: "var(--accent)" }}
              >
                Discover My Story
              </a>
              <a
                href="#contact"
                className="border-2 px-8 py-4 rounded-lg font-[family-name:var(--font-poppins)] font-semibold transition-all duration-200 hover:text-white"
                style={{
                  borderColor: "var(--heading)",
                  color: "var(--heading)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--heading)";
                  e.currentTarget.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "var(--heading)";
                }}
              >
                Work With Me
              </a>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative" ref={heroImageRef}>
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={heroImage}
                alt="Saithavy working remotely in nature"
                className="w-full h-auto object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                placeholder="blur"
                priority
              />
            </div>
            <div
              className="absolute -bottom-6 -right-6 p-6 rounded-xl shadow-lg max-w-xs"
              style={{ backgroundColor: "var(--surface)" }}
            >
              <p
                className="font-[family-name:var(--font-playfair)] italic text-lg"
                style={{ color: "var(--heading)" }}
              >
                &ldquo;The only way out is through.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
