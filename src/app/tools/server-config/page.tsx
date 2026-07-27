"use client";

import { Check, Copy, Download, FileJson } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

const presets = ["Default", "Relaxed", "Hard", "Survival", "Custom"] as const;
type Preset = (typeof presets)[number];

export default function ServerConfigGeneratorPage() {
  const [name, setName] = useState("Enshrouded Server");
  const [slots, setSlots] = useState(8);
  const [queryPort, setQueryPort] = useState(15637);
  const [preset, setPreset] = useState<Preset>("Default");
  const [voiceChat, setVoiceChat] = useState(false);
  const [textChat, setTextChat] = useState(false);
  const [voiceMode, setVoiceMode] = useState<"Proximity" | "Global">("Proximity");
  const [copied, setCopied] = useState(false);

  const config = useMemo(() => ({
    name: name.trim() || "Enshrouded Server",
    saveDirectory: "./savegame",
    logDirectory: "./logs",
    ip: "0.0.0.0",
    queryPort: clamp(queryPort, 1, 65535),
    slotCount: clamp(slots, 1, 16),
    tags: [],
    voiceChatMode: voiceMode,
    enableVoiceChat: voiceChat,
    enableTextChat: textChat,
    gameSettingsPreset: preset,
  }), [name, preset, queryPort, slots, textChat, voiceChat, voiceMode]);

  const output = JSON.stringify(config, null, 2);

  async function copyConfig() {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  function downloadConfig() {
    const url = URL.createObjectURL(new Blob([`${output}\n`], { type: "application/json" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "enshrouded_server.json";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mx-auto max-w-5xl py-8">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400">Dedicated server tool</p>
      <h1 className="mt-2 text-4xl font-black tracking-tight text-stone-100">Server Config Generator</h1>
      <p className="mt-4 max-w-3xl leading-7 text-stone-400">
        Generate the core <code>enshrouded_server.json</code> file using values supported by Keen Games&apos; current dedicated-server schema.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="space-y-5 rounded-2xl border border-stone-800 bg-stone-900/45 p-6">
          <TextField label="Server name" value={name} onChange={setName} />
          <NumberField label="Player slots" value={slots} min={1} max={16} onChange={setSlots} help="Keen supports 1-16 slots. Lower this if the host is resource-constrained." />
          <NumberField label="Query port" value={queryPort} min={1} max={65535} onChange={setQueryPort} help="15637 is the official default. Match this value in the firewall and router." />

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-stone-200">Difficulty preset</span>
            <select value={preset} onChange={(event) => setPreset(event.target.value as Preset)} className="w-full rounded-xl border border-stone-700 bg-stone-950 px-3 py-2.5 text-stone-100 outline-none focus:border-amber-400/60">
              {presets.map((item) => <option key={item}>{item}</option>)}
            </select>
            {preset === "Custom" && <span className="mt-2 block text-xs leading-5 text-amber-300">This generator creates the core file only. Add a current <code>gameSettings</code> object from Keen&apos;s official settings reference before using Custom.</span>}
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-stone-200">Voice mode</span>
            <select value={voiceMode} onChange={(event) => setVoiceMode(event.target.value as "Proximity" | "Global")} disabled={!voiceChat} className="w-full rounded-xl border border-stone-700 bg-stone-950 px-3 py-2.5 text-stone-100 outline-none disabled:opacity-40 focus:border-amber-400/60">
              <option>Proximity</option>
              <option>Global</option>
            </select>
          </label>

          <Toggle label="Enable voice chat" checked={voiceChat} onChange={setVoiceChat} />
          <Toggle label="Enable text chat" checked={textChat} onChange={setTextChat} />
        </section>

        <section className="overflow-hidden rounded-2xl border border-stone-800 bg-stone-950">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-800 px-5 py-4">
            <span className="flex items-center gap-2 text-sm font-bold text-stone-200"><FileJson className="h-4 w-4 text-amber-400" /> enshrouded_server.json</span>
            <div className="flex gap-2">
              <button type="button" onClick={copyConfig} className="inline-flex items-center gap-2 rounded-lg border border-stone-700 px-3 py-2 text-xs font-bold text-stone-200 hover:border-amber-400/50">
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />} {copied ? "Copied" : "Copy"}
              </button>
              <button type="button" onClick={downloadConfig} className="inline-flex items-center gap-2 rounded-lg bg-amber-400 px-3 py-2 text-xs font-bold text-stone-950 hover:bg-amber-300">
                <Download className="h-3.5 w-3.5" /> Download
              </button>
            </div>
          </div>
          <pre className="max-h-[620px] overflow-auto p-5 text-sm leading-6 text-stone-300"><code>{output}</code></pre>
        </section>
      </div>

      <section className="mt-8 rounded-2xl border border-amber-400/15 bg-amber-500/5 p-6">
        <h2 className="text-lg font-bold text-stone-100">How to use the file</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-stone-400">
          <li>Run the dedicated server once so it creates its own config and folders.</li>
          <li>Stop the server and back up the generated file.</li>
          <li>Replace it with this downloaded file, then start the server.</li>
          <li>Follow the <Link className="text-amber-300 underline underline-offset-4" href="/servers/dedicated-server-setup">setup guide</Link> to configure the matching firewall and router port.</li>
        </ol>
        <p className="mt-4 text-xs leading-5 text-stone-500">Passwords and role groups are intentionally excluded so secrets are not accidentally reused or shared. Reviewed against Keen&apos;s server configuration documentation on July 27, 2026.</p>
      </section>
    </div>
  );
}

function clamp(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, Math.round(value)));
}

function TextField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-stone-200">{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} maxLength={64} className="w-full rounded-xl border border-stone-700 bg-stone-950 px-3 py-2.5 text-stone-100 outline-none focus:border-amber-400/60" />
    </label>
  );
}

function NumberField({ label, value, min, max, onChange, help }: { label: string; value: number; min: number; max: number; onChange: (value: number) => void; help: string }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-stone-200">{label}</span>
      <input type="number" value={value} min={min} max={max} onChange={(event) => onChange(Number(event.target.value))} className="w-full rounded-xl border border-stone-700 bg-stone-950 px-3 py-2.5 text-stone-100 outline-none focus:border-amber-400/60" />
      <span className="mt-2 block text-xs leading-5 text-stone-500">{help}</span>
    </label>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-stone-800 bg-stone-950/60 px-4 py-3">
      <span className="text-sm font-semibold text-stone-200">{label}</span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="h-4 w-4 accent-amber-400" />
    </label>
  );
}
