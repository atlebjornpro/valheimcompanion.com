"use client";

import { useMemo, useState } from "react";

const checks = [
  { id: "players-offline", label: "All players have left and the source game or server is stopped." },
  { id: "source-backup", label: "I created an untouched, dated source backup." },
  { id: "transfer-copy", label: "I created a separate working copy for the transfer." },
  { id: "cloud-export", label: "Cloud-managed saves were exported or moved using the current in-game controls." },
  { id: "destination-stopped", label: "The destination server is stopped and automatic restart is disabled." },
  { id: "save-root", label: "I confirmed the destination save root and any -savedir override." },
  { id: "complete-world", label: "I transferred the complete world data without overwriting the only good copy." },
  { id: "world-name", label: "The -world value exactly matches the transferred world name." },
  { id: "permissions", label: "The server account can read and write the destination directory." },
  { id: "versions", label: "Game version, mods, world modifiers, and networking backend are recorded." },
  { id: "restart-test", label: "The world loaded, saved, restarted, and accepted a test connection." },
  { id: "post-backup", label: "I created a post-migration backup and retained the original rollback copy." },
] as const;

export default function WorldMigrationChecklist() {
  const [completed, setCompleted] = useState<Set<string>>(() => new Set());
  const completeCount = completed.size;
  const progress = useMemo(() => Math.round((completeCount / checks.length) * 100), [completeCount]);

  function toggle(id: string) {
    setCompleted((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <section className="not-prose my-8 overflow-hidden rounded-2xl border border-[#514537] bg-[#141914] shadow-2xl shadow-black/20">
      <div className="border-b border-[#393126] bg-[#191f19] px-5 py-4 sm:px-6">
        <p className="section-kicker">Interactive migration tool</p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-black text-[#eee4d1]">World migration checklist</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#aaa18f]">
              Check each control as you complete it. Progress stays in this browser tab and is not uploaded or stored.
            </p>
          </div>
          <strong className="text-sm text-[#8db6ba]">{completeCount}/{checks.length} complete</strong>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#0d120f]" aria-hidden="true">
          <div className="h-full bg-[#d69a45] transition-[width]" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="grid gap-2 p-5 sm:p-6">
        {checks.map((check) => {
          const checked = completed.has(check.id);
          return (
            <label
              key={check.id}
              className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-sm leading-6 transition ${
                checked
                  ? "border-[#47635e] bg-[#17231f] text-[#b9c9c3]"
                  : "border-[#393126] bg-[#0d120f] text-[#d7cdbb] hover:border-[#6e5a3e]"
              }`}
            >
              <input
                type="checkbox"
                className="mt-1 size-4 shrink-0 accent-[#d69a45]"
                checked={checked}
                onChange={() => toggle(check.id)}
              />
              <span className={checked ? "line-through decoration-[#74817c]" : undefined}>{check.label}</span>
            </label>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#393126] bg-[#0d120f] px-5 py-4 sm:px-6">
        <p aria-live="polite" className="text-sm text-[#aaa18f]">
          {completeCount === checks.length
            ? "Checklist complete. Keep both rollback copies until the migrated server has been accepted."
            : `${progress}% complete — do not retire the source world yet.`}
        </p>
        <button
          type="button"
          onClick={() => setCompleted(new Set())}
          disabled={!completeCount}
          className="rounded-lg border border-[#78664d] px-3 py-2 text-sm font-bold text-[#e8e0cf] hover:border-[#a58a63] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Reset checklist
        </button>
      </div>
    </section>
  );
}
