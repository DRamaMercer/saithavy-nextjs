/**
 * TestimonialCard Component
 * Social proof cards with quotes and ratings
 */

"use client";

interface TestimonialCardProps {
  text: string;
  name: string;
  role: string;
  rating?: number;
}

function StarRating({ rating = 5 }: { rating?: number }) {
  return (
    <div className="flex mb-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          className={`w-5 h-5 ${i <= rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-300 text-gray-300"}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 0 24 24"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

export default function TestimonialCard({
  text,
  name,
  role,
  rating = 5,
}: TestimonialCardProps) {
  return (
    <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg">
      <StarRating rating={rating} />
      <p className="text-slate-700 dark:text-slate-300 mb-6 italic">
        &ldquo;{text}&rdquo;
      </p>
      <div>
        <div className="font-semibold text-slate-900 dark:text-slate-100">
          {name}
        </div>
        <div className="text-sm text-slate-500 dark:text-slate-400">{role}</div>
      </div>
    </div>
  );
}
