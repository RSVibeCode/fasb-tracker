"use client";

import { type Standard, TIER_META, IMPACT_DOT } from "@/lib/standards";

interface Props {
  std: Standard;
  isExpanded: boolean;
  isReviewed: boolean;
  onToggleExpand: () => void;
  onToggleReviewed: () => void;
}

export default function StandardCard({ std, isExpanded, isReviewed, onToggleExpand, onToggleReviewed }: Props) {
  const tier = TIER_META[std.tier];

  return (
    <div
      className="rounded-xl overflow-hidden transition-all duration-200"
      style={{
        background: "#fff",
        border: `1px solid ${isReviewed ? "#bbf7d0" : "#e2e8f0"}`,
        opacity: isReviewed ? 0.72 : 1,
      }}
    >
      {/* Card header — always visible */}
      <div
        className="px-5 py-4 cursor-pointer flex items-center gap-3"
        onClick={onToggleExpand}
      >
        <div className="flex-1 min-w-0">
          {/* Top row */}
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-sm font-bold text-slate-900">{std.topic}</span>
            <span className="text-slate-300 text-xs">·</span>
            <span className="text-xs text-slate-500">{std.asu}</span>
            {/* Tier badge */}
            <span
              className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full"
              style={{
                background: tier.bg,
                color: tier.color,
                border: `1px solid ${tier.border}`,
              }}
            >
              {tier.shortLabel}
            </span>
          </div>

          {/* Title */}
          <div className="text-sm font-semibold text-slate-800 mb-1.5">{std.title}</div>

          {/* Meta row */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="flex items-center gap-1.5 text-xs text-slate-500">
              <span
                className="inline-block w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: IMPACT_DOT[std.impact] || "#9ca3af" }}
              />
              {std.impact} impact
            </span>
            <span className="text-xs text-slate-400">📅 {std.private_effective}</span>
            <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
              {std.category}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={(e) => { e.stopPropagation(); onToggleReviewed(); }}
            className="text-xs font-semibold px-3 py-1.5 rounded-full border transition-all"
            style={{
              background: isReviewed ? "#ecfdf5" : "#fff",
              color: isReviewed ? "#059669" : "#94a3b8",
              borderColor: isReviewed ? "#34d399" : "#e2e8f0",
            }}
          >
            {isReviewed ? "✓ Reviewed" : "Mark Reviewed"}
          </button>
          <span className="text-slate-400 text-sm select-none">
            {isExpanded ? "▲" : "▼"}
          </span>
        </div>
      </div>

      {/* Expanded detail */}
      {isExpanded && (
        <div style={{ borderTop: "1px solid #f1f5f9" }}>
          {/* Two-column content */}
          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5" style={{ background: "#f8fafc" }}>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                What It Requires
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">{std.summary}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                SerpApi Specific Impact
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">{std.serpapi_impact}</p>
            </div>
          </div>

          {/* Action bar */}
          <div
            className="px-5 py-3 flex items-start gap-3"
            style={{ background: "#fffbeb", borderTop: "1px solid #fef3c7" }}
          >
            <span className="text-base mt-0.5">⚡</span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700 mb-1">
                Action Required
              </p>
              <p className="text-sm text-amber-800">{std.action}</p>
            </div>
          </div>

          {/* Tags + link */}
          <div
            className="px-5 py-2.5 flex items-center justify-between gap-3 flex-wrap"
            style={{ borderTop: "1px solid #f1f5f9" }}
          >
            <div className="flex gap-1.5 flex-wrap">
              {std.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                  style={{ background: "#e2e8f0", color: "#475569" }}
                >
                  {tag}
                </span>
              ))}
            </div>
            {std.fasb_url && (
              <a
                href={std.fasb_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:underline flex-shrink-0"
              >
                View FASB source ↗
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
