"use client";

import React, { useState } from "react";
import Link from "next/link";
import { LayoutGrid, List as ListIcon } from "lucide-react";

const statusStyles = {
  succeeded: { dot: "bg-emerald-400", text: "text-emerald-400", bg: "bg-emerald-400/10" },
  failed: { dot: "bg-rose-400", text: "text-rose-400", bg: "bg-rose-400/10" },
  processing: { dot: "bg-sky-400", text: "text-sky-400", bg: "bg-sky-400/10" },
};

function getStatusStyle(status) {
  return statusStyles[status] ?? statusStyles.processing;
}

function Thumbnail({ generation, size }) {
  const s = getStatusStyle(generation.status);
  if (generation.status === "succeeded" && generation.outputImageUrl) {
    return (
      <img
        src={generation.outputImageUrl}
        alt="Generated artwork"
        className="w-full h-full object-cover"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <div
      className="w-full h-full flex items-center justify-center bg-[#12141F]"
      style={{ width: size, height: size }}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot} ${generation.status === "processing" ? "animate-pulse" : ""}`} />
    </div>
  );
}

export default function GenerationsGallery({ generations }) {
  const [view, setView] = useState("list"); // "list" | "grid"
  const succeededCount = generations.filter((g) => g.status === "succeeded").length;

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
            Your generations
          </h1>
          <p className="mt-2 text-sm text-white/40">
            Everything you've created, in one place.
          </p>
        </div>

        {generations.length > 0 && (
          <div className="flex items-center gap-2">
            <div className="px-4 py-2 rounded-xl bg-white/[0.03] border border-white/10 backdrop-blur">
              <span className="text-lg font-semibold text-white">{generations.length}</span>
              <span className="ml-1.5 text-xs text-white/40">total</span>
            </div>
            <div className="px-4 py-2 rounded-xl bg-white/[0.03] border border-white/10 backdrop-blur">
              <span className="text-lg font-semibold text-emerald-400">{succeededCount}</span>
              <span className="ml-1.5 text-xs text-white/40">succeeded</span>
            </div>

            {/* View toggle */}
            <div className="flex items-center gap-0.5 p-1 rounded-xl bg-white/[0.03] border border-white/10 backdrop-blur ml-1">
              <button
                type="button"
                onClick={() => setView("list")}
                aria-pressed={view === "list"}
                aria-label="List view"
                className={`p-1.5 rounded-lg transition-colors ${
                  view === "list" ? "bg-white/10 text-white" : "text-white/40 hover:text-white/70"
                }`}
              >
                <ListIcon size={16} />
              </button>
              <button
                type="button"
                onClick={() => setView("grid")}
                aria-pressed={view === "grid"}
                aria-label="Grid view"
                className={`p-1.5 rounded-lg transition-colors ${
                  view === "grid" ? "bg-white/10 text-white" : "text-white/40 hover:text-white/70"
                }`}
              >
                <LayoutGrid size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {generations.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] py-24 px-8 text-center">
          <div className="mx-auto mb-5 w-12 h-12 rounded-full bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-white/10" />
          <p className="text-white font-medium text-lg">No generations yet</p>
          <p className="mt-2 text-sm text-white/40 max-w-xs mx-auto">
            Create your first image and it'll show up here.
          </p>
          <Link
            href="/generate"
            className="inline-flex items-center mt-6 px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 transition-all shadow-lg shadow-violet-600/20"
          >
            Start generating
          </Link>
        </div>
      ) : view === "list" ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
          {generations.map((generation, i) => {
            const s = getStatusStyle(generation.status);
            return (
              <Link
                key={generation.id}
                href={`/generate/${generation.id}`}
                className={`flex items-center gap-4 px-4 py-2.5 hover:bg-white/[0.04] transition-colors ${
                  i !== generations.length - 1 ? "border-b border-white/5" : ""
                }`}
              >
                <div className="w-9 h-9 rounded-md overflow-hidden flex-shrink-0 border border-white/10">
                  <Thumbnail generation={generation} size={36} />
                </div>

                <span className="flex-1 text-sm text-white/80 truncate">
                  {new Date(generation.createdAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>

                <span className="hidden sm:block text-xs text-white/30 tabular-nums">
                  {new Date(generation.createdAt).toLocaleTimeString(undefined, {
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </span>

                <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium capitalize ${s.text} ${s.bg} flex-shrink-0`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                  {generation.status}
                </span>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {generations.map((generation) => {
            const s = getStatusStyle(generation.status);
            return (
              <Link
                key={generation.id}
                href={`/generate/${generation.id}`}
                className="group relative rounded-2xl overflow-hidden border border-white/10 bg-white/[0.02] transition-all duration-200 hover:border-white/20 hover:-translate-y-0.5"
              >
                <div className="w-full aspect-[4/5] relative overflow-hidden bg-[#12141F]">
                  {generation.status === "succeeded" && generation.outputImageUrl ? (
                    <>
                      <img
                        src={generation.outputImageUrl}
                        alt="Generated artwork"
                        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                      <span className={`w-2 h-2 rounded-full ${s.dot} ${generation.status === "processing" ? "animate-pulse" : ""}`} />
                      <span className="text-sm text-white/40 capitalize">{generation.status}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between px-3.5 py-3">
                  <span className="text-xs text-white/40">
                    {new Date(generation.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium capitalize ${s.text} ${s.bg}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                    {generation.status}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}