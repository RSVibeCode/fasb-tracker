"use client";

import { useState, useEffect, useCallback } from "react";
import { STANDARDS, TIER_META, IMPACT_DOT, type Standard } from "@/lib/standards";
import StandardCard from "./StandardCard";
import AskAI from "./AskAI";
import LiveFeed from "./LiveFeed";

type Tab = "tracker" | "ask" | "feed";

export default function TrackerApp() {
  const [tab, setTab] = useState<Tab>("tracker");
  const [filterTier, setFilterTier] = useState<string>("all");
  const [filterCat, setFilterCat] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [reviewed, setReviewed] = useState<Record<string, boolean>>({});

  // Persist reviewed state
  useEffect(() => {
    try {
      const saved = localStorage.getItem("fasb_reviewed_v2");
      if (saved) setReviewed(JSON.parse(saved));
    } catch {}
  }, []);

  const toggleReviewed = useCallback((id: string) => {
    setReviewed((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try { localStorage.setItem("fasb_reviewed_v2", JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const categories = [...new Set(STANDARDS.map((s) => s.category))].sort();

  const filtered = STANDARDS.filter((s) => {
    const tierOk = filterTier === "all" || String(s.tier) === filterTier;
    const catOk  = filterCat  === "all" || s.category === filterCat;
    const q      = search.toLowerCase();
    const searchOk = !q ||
      s.title.toLowerCase().includes(q) ||
      s.topic.toLowerCase().includes(q) ||
      s.asu.toLowerCase().includes(q) ||
      s.tags.some((t) => t.toLowerCase().includes(q));
    return tierOk && catOk && searchOk;
  });

  const reviewedCount = Object.values(reviewed).filter(Boolean).length;
  const pct = Math.round((reviewedCount / STANDARDS.length) * 100);

  const tier1Done = STANDARDS.filter((s) => s.tier === 1 && reviewed[s.id]).length;
  const tier1Total = STANDARDS.filter((s) => s.tier === 1).length;

  return (
    <div className="min-h-screen flex flex-col">
      {/* ── Header ── */}
      <header style={{ background: "#0f172a" }} className="text-white px-6 pt-5 pb-0 shadow-xl">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="text-xs tracking-widest text-slate-400 uppercase mb-1">
                FASB Standards Intelligence
              </p>
              <h1 className="text-xl font-bold text-white leading-tight">
                SerpApi GAAP Compliance Tracker
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Private SaaS · Non-Public Business Entity · First Accrual Year: FY 2026
              </p>
            </div>

            {/* Progress tiles */}
            <div className="flex gap-3">
              <div
                style={{ background: "#1e293b", border: "1px solid #334155" }}
                className="rounded-xl px-4 py-2.5 text-center"
              >
                <div className="text-2xl font-bold" style={{ color: "#34d399" }}>
                  {reviewedCount}/{STANDARDS.length}
                </div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider">Reviewed</div>
              </div>
              <div
                style={{ background: "#1e293b", border: "1px solid #334155" }}
                className="rounded-xl px-4 py-2.5 text-center"
              >
                <div
                  className="text-2xl font-bold"
                  style={{ color: tier1Done === tier1Total ? "#34d399" : "#f59e0b" }}
                >
                  {tier1Done}/{tier1Total}
                </div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider">Tier 1 Done</div>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4 h-1 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${pct}%`, background: "linear-gradient(90deg, #34d399, #059669)" }}
            />
          </div>

          {/* Tabs */}
          <div className="flex gap-0 mt-4">
            {(
              [
                { id: "tracker", label: "📋 Standards Tracker" },
                { id: "ask",     label: "🤖 Ask AI" },
                { id: "feed",    label: "📡 Live ASU Feed" },
              ] as { id: Tab; label: string }[]
            ).map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className="px-5 py-2.5 text-sm font-medium transition-all rounded-t-lg"
                style={{
                  background: tab === t.id ? "#f8fafc" : "transparent",
                  color: tab === t.id ? "#0f172a" : "#64748b",
                  fontWeight: tab === t.id ? 600 : 400,
                  borderBottom: tab === t.id ? "none" : "1px solid #1e293b",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ── Body ── */}
      <main className="flex-1 px-6 py-6">
        <div className="max-w-5xl mx-auto">

          {/* TRACKER TAB */}
          {tab === "tracker" && (
            <>
              {/* Filters */}
              <div className="flex gap-3 flex-wrap mb-5">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by topic, ASU, or tag…"
                  className="flex-1 min-w-48 px-4 py-2 rounded-lg border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-300"
                />
                <select
                  value={filterTier}
                  onChange={(e) => setFilterTier(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white cursor-pointer"
                >
                  <option value="all">All Tiers</option>
                  <option value="1">Tier 1 — Foundation</option>
                  <option value="2">Tier 2 — Operational</option>
                  <option value="3">Tier 3 — Monitor</option>
                </select>
                <select
                  value={filterCat}
                  onChange={(e) => setFilterCat(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white cursor-pointer"
                >
                  <option value="all">All Categories</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                {(filterTier !== "all" || filterCat !== "all" || search) && (
                  <button
                    onClick={() => { setFilterTier("all"); setFilterCat("all"); setSearch(""); }}
                    className="px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white text-slate-500 hover:bg-slate-50 cursor-pointer"
                  >
                    ✕ Clear
                  </button>
                )}
              </div>

              <p className="text-xs text-slate-400 mb-3">
                Showing {filtered.length} of {STANDARDS.length} standards
              </p>

              <div className="flex flex-col gap-3">
                {filtered.map((std) => (
                  <StandardCard
                    key={std.id}
                    std={std}
                    isExpanded={expanded === std.id}
                    isReviewed={!!reviewed[std.id]}
                    onToggleExpand={() => setExpanded(expanded === std.id ? null : std.id)}
                    onToggleReviewed={() => toggleReviewed(std.id)}
                  />
                ))}
              </div>
            </>
          )}

          {tab === "ask"  && <AskAI />}
          {tab === "feed" && <LiveFeed />}
        </div>
      </main>
    </div>
  );
}
