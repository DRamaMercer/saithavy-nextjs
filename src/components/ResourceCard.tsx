"use client";

import { useState } from "react";
import Link from "next/link";
import { Clock, Target, Download, CheckCircle2, Lock } from "lucide-react";
import { Resource } from "@/lib/resourcesData";
import DownloadModal from "./DownloadModal";

export default function ResourceCard({ resource }: { resource: Resource }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleDownload = (e: React.MouseEvent) => {
    if (resource.isPremium) {
      e.preventDefault();
      setShowModal(true);
    }
  };

  return (
    <>
    <div
      className="flex flex-col relative group rounded-2xl p-6 transition-all duration-300 transform hover:-translate-y-1 shadow-sm hover:shadow-xl border"
      style={{ 
        backgroundColor: "var(--surface)", 
        borderColor: isExpanded ? "var(--accent)" : "var(--border)" 
      }}
    >
      {/* Category/Premium Badge */}
      <div className="absolute top-4 right-4 flex gap-2">
        {resource.isPremium && (
          <span className="text-xs font-semibold px-2 py-1 rounded-full text-white bg-amber-500 shadow-sm flex items-center gap-1">
            <Lock className="w-3 h-3" /> Premium
          </span>
        )}
        <span className="text-xs font-semibold px-2 py-1 rounded-full text-white" style={{ backgroundColor: "var(--accent)" }}>
          {resource.type}
        </span>
      </div>

      {resource.icon}
      
      <h3
        className="font-[family-name:var(--font-poppins)] font-bold text-lg mb-2"
        style={{ color: "var(--heading)" }}
      >
        {resource.title}
      </h3>
      
      <p className="text-sm mb-4" style={{ color: "var(--foreground)" }}>
        {resource.description}
      </p>

      {/* Quick Stats */}
      <div className="flex flex-wrap gap-3 mb-4 text-xs">
        <div className="flex items-center gap-1" style={{ color: "var(--foreground)" }}>
          <Clock className="w-3 h-3" />
          {resource.timeToRead}
        </div>
        <div className="flex items-center gap-1" style={{ color: "var(--foreground)" }}>
          <Target className="w-3 h-3" />
          {resource.difficulty}
        </div>
        <div className="flex items-center gap-1" style={{ color: "var(--foreground)" }}>
          <Download className="w-3 h-3" />
          {(resource.downloads / 1000).toFixed(0)}K
        </div>
      </div>

      {/* Expandable Details */}
      {isExpanded && (
        <div className="mb-4 p-4 rounded-xl" style={{ backgroundColor: "var(--surface-alt)" }}>
          <div className="mb-3">
            <h4 className="text-xs font-semibold mb-2" style={{ color: "var(--heading)" }}>
              Target Audience:
            </h4>
            <p className="text-xs" style={{ color: "var(--foreground)" }}>
              {resource.targetAudience}
            </p>
          </div>
          <div>
            <h4 className="text-xs font-semibold mb-2" style={{ color: "var(--heading)" }}>
              You&apos;ll Learn:
            </h4>
            <ul className="text-xs space-y-1">
              {resource.whatYoullLearn.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2" style={{ color: "var(--foreground)" }}>
                  <CheckCircle2 className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: "var(--accent)" }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      
      <div className="mt-auto pt-4 border-t flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
        <span className="text-xs font-medium" style={{ color: "var(--foreground)" }}>
          {resource.fileSize}
        </span>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs font-semibold transition-colors hover:text-amber-500"
            style={{ color: "var(--heading)" }}
          >
            {isExpanded ? "Less" : "More"}
          </button>
          
          {resource.isPremium ? (
            <button
              onClick={handleDownload}
              className="inline-flex items-center text-sm font-semibold transition-colors hover:text-amber-500"
              style={{ color: "var(--heading)" }}
            >
              <Download className="w-4 h-4" />
            </button>
          ) : (
            <Link
              href={resource.url}
              className="inline-flex items-center text-sm font-semibold transition-colors hover:text-amber-500"
              style={{ color: "var(--heading)" }}
            >
              <Download className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </div>
    
    {showModal && (
      <DownloadModal resource={resource} onClose={() => setShowModal(false)} />
    )}
    </>
  );
}
