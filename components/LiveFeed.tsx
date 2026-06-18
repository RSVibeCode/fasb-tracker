"use client";

import { useState, useEffect } from "react";

interface FeedItem {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  relevance?: string;
  loading?: boolean;
}

export default function LiveFeed() {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [feedLoading, setFeedLoading] = useState(true);
  const [feedError, setFeedError] = useState("");
  const [analyzingAll, setAnalyzingAll] = useState(false);

  useEffect(() => {
    fetch("/api/asu-feed")
      .then((r) => r.json())
      .then((data) => {
        setItems(data.items || []);
        if (data.error) setFeedError(data.error);
      })
      .catch(() => setFeedError("Could not load FASB feed"))
      .finally(() => setFeedLoading(false));
  }, []);

  const analyzeItem = async (index: number) => {
    const item = items[index];
    setItems((prev) =>
      prev.map((it, i) => (i === index ? { ...it, loading: true } : it))
    );

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: `Analyze this FASB update for relevance to SerpApi:

Title: ${item.title}
Published: ${item.pubDate}
Description: ${item.description}

In 2-3 sentences: (1) What does this ASU change? (2) Does it apply to SerpApi (private SaaS, first accrual year FY2026, subscription revenue, Austin TX)? (3) What action if any should Rex take? Be direct and concise.`,
            },
          ],
        }),
      });
      const data = await res.json();
      setItems((prev) =>
        prev.map((it, i) =>
          i === index ? { ...it, loading: false, relevance: data.text || "Could not analyze." } : it
        )
      );
    } catch {
      setItems((prev) =>
        prev.map((it, i) =>
          i === index ? { ...it, loading: false, relevance: "Analysis failed — try again." } : it
        )
      );
    }
  };

  const analyzeAll = async () => {
    setAnalyzingAll(true);
    for (let i = 0; i < items.length; i++) {
      if (!items[i].relevance) await analyzeItem(i);
    }
    setAnalyzingAll(false);
  };

  if (feedLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-400 text-sm">
        Loading FASB feed…
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Live FASB ASU Feed</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Latest Accounting Standards Updates from fasb.org · Cached 1 hour
          </p>
        </div>
        {items.length > 0 && (
          <button
            onClick={analyzeAll}
            disabled={analyzingAll}
            className="text-xs px-4 py-2 rounded-lg font-semibold text-white disabled:opacity-50 cursor-pointer"
            style={{ background: "#0f172a" }}
          >
            {analyzingAll ? "Analyzing…" : "🤖 Analyze All for SerpApi"}
          </button>
        )}
      </div>

      {feedError && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4 text-sm text-amber-800">
          ⚠️ {feedError}. The FASB RSS feed may be temporarily unavailable. Check{" "}
          <a
            href="https://www.fasb.org/standards/accounting-standard-updates"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            fasb.org
          </a>{" "}
          directly.
        </div>
      )}

      {items.length === 0 && !feedError && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center text-sm text-slate-500">
          No recent ASU announcements found in the FASB feed.
        </div>
      )}

      <div className="flex flex-col gap-3">
        {items.map((item, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-slate-200 overflow-hidden"
          >
            <div className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-slate-900 hover:text-blue-600 transition-colors leading-snug block mb-1"
                  >
                    {item.title}
                  </a>
                  <p className="text-xs text-slate-400">{item.pubDate}</p>
                  {item.description && (
                    <p className="text-xs text-slate-500 mt-1.5 leading-relaxed line-clamp-2">
                      {item.description.replace(/<[^>]+>/g, "").slice(0, 200)}…
                    </p>
                  )}
                </div>
                {!item.relevance && (
                  <button
                    onClick={() => analyzeItem(i)}
                    disabled={item.loading}
                    className="flex-shrink-0 text-xs px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 cursor-pointer"
                  >
                    {item.loading ? "…" : "Analyze"}
                  </button>
                )}
              </div>

              {item.relevance && (
                <div className="mt-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    🤖 SerpApi Relevance Analysis
                  </p>
                  <p className="text-xs text-slate-700 leading-relaxed">{item.relevance}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl">
        <p className="text-xs font-semibold text-blue-800 mb-1">📅 Suggested Cadence</p>
        <p className="text-xs text-blue-700 leading-relaxed">
          Check this feed <strong>quarterly</strong>. FASB issues 8–15 ASUs per year; typically 1–2 are material to a private SaaS company. Click &ldquo;Analyze All&rdquo; each quarter to get an instant relevance assessment against SerpApi&rsquo;s profile.
        </p>
      </div>
    </div>
  );
}
