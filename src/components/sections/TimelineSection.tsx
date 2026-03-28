"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import beginningsImg from "../../../public/images/journey-beginnings.jpg";
import turningPointImg from "../../../public/images/journey-turning-point.jpg";
import remoteWorkImg from "../../../public/images/journey-remote-work.jpg";
import saithavyPhotoImg from "../../../public/images/saithavy-photo.jpg";

const timelineData = [
  {
    id: "beginnings",
    label: "Humble Beginnings",
    title: "Humble Beginnings",
    paragraphs: [
      "I started my career in traditional corporate environments, where I learned the value of structure and discipline. But I also discovered the limitations of conventional thinking and the importance of authentic leadership.",
      "Early challenges taught me that resilience isn't about avoiding failure—it's about using setbacks as fuel for growth. Every obstacle became an opportunity to develop anti-fragile mindsets.",
    ],
    quote: "In the depths of challenge, I discovered my true strength.",
    image: beginningsImg,
    imageAlt: "Early career reflection",
    reverse: false,
  },
  {
    id: "turning-point",
    label: "Turning Point",
    title: "The Turning Point",
    paragraphs: [
      "A pivotal moment came when I realized that traditional success metrics weren't aligned with my values. I made the bold decision to redefine success on my own terms, embracing authenticity over conformity.",
      "This shift led me to explore remote work and digital entrepreneurship, discovering new ways to create impact while maintaining personal freedom and authentic expression.",
    ],
    quote: "Sometimes the greatest risk is playing it safe.",
    image: turningPointImg,
    imageAlt: "Transformation moment",
    reverse: true,
  },
  {
    id: "remote-work",
    label: "Embracing Remote",
    title: "Embracing Remote Work & AI",
    paragraphs: [
      "The transition to remote work opened new possibilities for location independence and flexible living. I discovered how technology could amplify human potential rather than replace it.",
      "Leveraging AI automation and digital tools, I created systems that enhanced creativity and productivity while maintaining the human touch that's essential for authentic leadership.",
    ],
    quote: "Technology is most powerful when it amplifies human potential.",
    image: remoteWorkImg,
    imageAlt: "Remote work lifestyle",
    reverse: false,
  },
  {
    id: "empowering",
    label: "Empowering Others",
    title: "Empowering Others",
    paragraphs: [
      "Today, my mission is to help others discover their own paths to authentic success. Through coaching, consulting, and content creation, I share the strategies and mindsets that transformed my own journey.",
      "Every client I work with, every person I inspire, reinforces my belief that we're all capable of creating meaningful change in our lives and the lives of others.",
    ],
    quote: "Your transformation can inspire transformation in others.",
    image: saithavyPhotoImg,
    imageAlt: "Empowering others",
    reverse: true,
  },
];

export default function TimelineSection() {
  const [activeTab, setActiveTab] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleTabClick = useCallback(
    async (index: number) => {
      if (index === activeTab) return;

      // Animate out
      const container = contentRef.current;
      if (container) {
        container.style.opacity = "0";
        container.style.transform = "translateY(20px)";
      }

      setTimeout(() => {
        setActiveTab(index);
        // Animate in
        if (container) {
          requestAnimationFrame(() => {
            container.style.opacity = "1";
            container.style.transform = "translateY(0)";
          });
        }
      }, 300);
    },
    [activeTab],
  );

  const item = timelineData[activeTab];

  return (
    <section
      id="story"
      className="py-20"
      style={{
        background:
          "linear-gradient(to bottom right, rgba(104,211,145,0.06), rgba(192,86,33,0.06))",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2
            className="font-[family-name:var(--font-poppins)] font-bold text-3xl md:text-5xl mb-6"
            style={{ color: "var(--heading)" }}
          >
            My Journey
          </h2>
          <p
            className="text-xl max-w-3xl mx-auto"
            style={{ color: "var(--foreground)" }}
          >
            Every challenge became a stepping stone, every setback a setup for
            growth. This is my story of transformation.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center mb-12 gap-3">
          {timelineData.map((tab, index) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(index)}
              className="px-6 py-3 rounded-full font-[family-name:var(--font-poppins)] font-medium transition-all duration-300 text-sm"
              style={{
                backgroundColor:
                  activeTab === index ? "var(--accent)" : "var(--surface)",
                color: activeTab === index ? "white" : "var(--foreground)",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Timeline Content */}
        <div
          ref={contentRef}
          className="transition-all duration-300 ease-out"
          style={{ opacity: 1, transform: "translateY(0)" }}
        >
          <div
            className={`grid lg:grid-cols-2 gap-12 items-center ${
              item.reverse ? "direction-rtl" : ""
            }`}
          >
            <div className={item.reverse ? "lg:order-2" : ""}>
              <h3
                className="font-[family-name:var(--font-poppins)] font-bold text-2xl md:text-3xl mb-6"
                style={{ color: "var(--heading)" }}
              >
                {item.title}
              </h3>
              {item.paragraphs.map((p, i) => (
                <p
                  key={i}
                  className="text-lg mb-6 leading-relaxed"
                  style={{ color: "var(--foreground)" }}
                >
                  {p}
                </p>
              ))}
              <blockquote
                className="font-[family-name:var(--font-playfair)] italic text-xl border-l-4 pl-6"
                style={{
                  color: "var(--heading)",
                  borderColor: "var(--accent)",
                }}
              >
                &ldquo;{item.quote}&rdquo;
              </blockquote>
            </div>
            <div className={`relative ${item.reverse ? "lg:order-1" : ""}`}>
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src={item.image}
                  alt={item.imageAlt}
                  className="w-full h-96 object-cover"
                  placeholder="blur"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority={activeTab === 0}
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
