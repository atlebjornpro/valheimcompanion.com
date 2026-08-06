"use client";

import { useMemo, useState } from "react";

type Platform = "windows" | "linux";
type Backend = "steam" | "crossplay";
type Visibility = "public" | "private";
type Preset = "none" | "normal" | "casual" | "easy" | "hard" | "hardcore" | "immersive" | "hammer";

const textFieldClass =
  "w-full rounded-lg border border-[#514537] bg-[#0d120f] px-3 py-2.5 text-sm text-[#eee4d1] outline-none transition focus:border-[#8db6ba] focus:ring-2 focus:ring-[#8db6ba]/20";

const safeText = /^[A-Za-z0-9 ._-]+$/;
const safePassword = /^[A-Za-z0-9._-]+$/;

function quote(value: string) {
  return `"${value}"`;
}

export default function ServerConfigGenerator() {
  const [platform, setPlatform] = useState<Platform>("windows");
  const [serverName, setServerName] = useState("My Valheim Server");
  const [worldName, setWorldName] = useState("Dedicated");
  const [password, setPassword] = useState("change-me-123");
  const [port, setPort] = useState(2456);
  const [backend, setBackend] = useState<Backend>("crossplay");
  const [visibility, setVisibility] = useState<Visibility>("public");
  const [saveDirectory, setSaveDirectory] = useState("");
  const [saveInterval, setSaveInterval] = useState(1800);
  const [backups, setBackups] = useState(4);
  const [backupShort, setBackupShort] = useState(7200);
  const [backupLong, setBackupLong] = useState(43200);
  const [preset, setPreset] = useState<Preset>("none");
  const [noMap, setNoMap] = useState(false);
  const [copyState, setCopyState] = useState("Copy command");

  const errors = useMemo(() => {
    const next: string[] = [];
    if (!serverName.trim() || !safeText.test(serverName)) {
      next.push("Server name may use letters, numbers, spaces, periods, hyphens, and underscores.");
    }
    if (!worldName.trim() || !safeText.test(worldName)) {
      next.push("World name may use letters, numbers, spaces, periods, hyphens, and underscores.");
    }
    if (!password || !safePassword.test(password)) {
      next.push("Password may use letters, numbers, periods, hyphens, and underscores, with no spaces.");
    }
    if (!Number.isInteger(port) || port < 1 || port > 65534) {
      next.push("Base port must be a whole number from 1 to 65534 because Valheim also uses port +1.");
    }
    if (!Number.isInteger(saveInterval) || saveInterval < 60) {
      next.push("Save interval must be a whole number of at least 60 seconds.");
    }
    if (!Number.isInteger(backups) || backups < 1 || backups > 100) {
      next.push("Backup count must be a whole number from 1 to 100.");
    }
    if (!Number.isInteger(backupShort) || backupShort < 60 || !Number.isInteger(backupLong) || backupLong < 60) {
      next.push("Backup intervals must be whole numbers of at least 60 seconds.");
    }
    if (saveDirectory) {
      const safeWindowsPath = /^[A-Za-z]:\\[A-Za-z0-9 _\\.\-]+$/;
      const safeLinuxPath = /^\/[A-Za-z0-9 _/.\-]+$/;
      const valid = platform === "windows" ? safeWindowsPath.test(saveDirectory) : safeLinuxPath.test(saveDirectory);
      if (!valid) {
        next.push(
          platform === "windows"
            ? "Use a full Windows save path such as D:\\Valheim\\Saves, without shell symbols."
            : "Use an absolute Linux save path such as /srv/valheim/saves, without shell symbols.",
        );
      }
    }
    return next;
  }, [backupLong, backupShort, backups, password, platform, port, saveDirectory, saveInterval, serverName, worldName]);

  const command = useMemo(() => {
    if (errors.length) return "Fix the input guidance to generate a command.";

    const executable = platform === "windows" ? "valheim_server.exe" : "./valheim_server.x86_64";
    const argumentsList = [
      "-nographics",
      "-batchmode",
      "-name",
      quote(serverName.trim()),
      "-port",
      String(port),
      "-world",
      quote(worldName.trim()),
      "-password",
      quote(password),
      "-public",
      visibility === "public" ? "1" : "0",
      "-saveinterval",
      String(saveInterval),
      "-backups",
      String(backups),
      "-backupshort",
      String(backupShort),
      "-backuplong",
      String(backupLong),
    ];

    if (saveDirectory) argumentsList.push("-savedir", quote(saveDirectory));
    if (backend === "crossplay") argumentsList.push("-crossplay");
    if (preset !== "none") argumentsList.push("-preset", preset);
    if (noMap) argumentsList.push("-setkey", "nomap");

    return `${executable} ${argumentsList.join(" ")}`;
  }, [backend, backupLong, backupShort, backups, errors.length, noMap, password, platform, port, preset, saveDirectory, saveInterval, serverName, visibility, worldName]);

  async function copyCommand() {
    if (errors.length) return;
    try {
      await navigator.clipboard.writeText(command);
      setCopyState("Copied");
      window.setTimeout(() => setCopyState("Copy command"), 1800);
    } catch {
      setCopyState("Select and copy manually");
    }
  }

  return (
    <section className="not-prose my-8 overflow-hidden rounded-2xl border border-[#514537] bg-[#141914] shadow-2xl shadow-black/20">
      <div className="border-b border-[#393126] bg-[#191f19] px-5 py-4 sm:px-6">
        <p className="section-kicker">Practical server tool</p>
        <h2 className="mt-2 text-2xl font-black text-[#eee4d1]">Server configuration generator</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#aaa18f]">
          Build a reviewed launch line from documented Valheim server arguments. Nothing entered here is saved or sent anywhere.
        </p>
      </div>

      <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-2">
        <div className="grid content-start gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1.5 text-sm font-bold text-[#d7cdbb]">
              Operating system
              <select className={textFieldClass} value={platform} onChange={(event) => setPlatform(event.target.value as Platform)}>
                <option value="windows">Windows</option>
                <option value="linux">Linux</option>
              </select>
            </label>
            <label className="grid gap-1.5 text-sm font-bold text-[#d7cdbb]">
              Networking backend
              <select className={textFieldClass} value={backend} onChange={(event) => setBackend(event.target.value as Backend)}>
                <option value="crossplay">PlayFab crossplay</option>
                <option value="steam">Steam only</option>
              </select>
            </label>
          </div>

          <label className="grid gap-1.5 text-sm font-bold text-[#d7cdbb]">
            Server name
            <input className={textFieldClass} value={serverName} onChange={(event) => setServerName(event.target.value)} />
          </label>
          <label className="grid gap-1.5 text-sm font-bold text-[#d7cdbb]">
            World name
            <input className={textFieldClass} value={worldName} onChange={(event) => setWorldName(event.target.value)} />
          </label>
          <label className="grid gap-1.5 text-sm font-bold text-[#d7cdbb]">
            Password
            <input className={textFieldClass} type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} />
            <span className="font-normal text-[#81796b]">The generated command displays the password. Do not publish or share it.</span>
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1.5 text-sm font-bold text-[#d7cdbb]">
              Base port
              <input className={textFieldClass} type="number" min={1} max={65534} value={port} onChange={(event) => setPort(Number(event.target.value))} />
            </label>
            <label className="grid gap-1.5 text-sm font-bold text-[#d7cdbb]">
              Visibility
              <select className={textFieldClass} value={visibility} onChange={(event) => setVisibility(event.target.value as Visibility)}>
                <option value="public">Public list (-public 1)</option>
                <option value="private">Hidden (-public 0)</option>
              </select>
            </label>
          </div>

          <label className="grid gap-1.5 text-sm font-bold text-[#d7cdbb]">
            Save directory override (optional)
            <input
              className={textFieldClass}
              value={saveDirectory}
              placeholder={platform === "windows" ? "D:\\Valheim\\Saves" : "/srv/valheim/saves"}
              onChange={(event) => setSaveDirectory(event.target.value)}
            />
          </label>
        </div>

        <div className="grid content-start gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1.5 text-sm font-bold text-[#d7cdbb]">
              Save interval (seconds)
              <input className={textFieldClass} type="number" min={60} value={saveInterval} onChange={(event) => setSaveInterval(Number(event.target.value))} />
            </label>
            <label className="grid gap-1.5 text-sm font-bold text-[#d7cdbb]">
              Backups retained
              <input className={textFieldClass} type="number" min={1} max={100} value={backups} onChange={(event) => setBackups(Number(event.target.value))} />
            </label>
            <label className="grid gap-1.5 text-sm font-bold text-[#d7cdbb]">
              Short backup interval
              <input className={textFieldClass} type="number" min={60} value={backupShort} onChange={(event) => setBackupShort(Number(event.target.value))} />
            </label>
            <label className="grid gap-1.5 text-sm font-bold text-[#d7cdbb]">
              Long backup interval
              <input className={textFieldClass} type="number" min={60} value={backupLong} onChange={(event) => setBackupLong(Number(event.target.value))} />
            </label>
          </div>

          <label className="grid gap-1.5 text-sm font-bold text-[#d7cdbb]">
            World preset
            <select className={textFieldClass} value={preset} onChange={(event) => setPreset(event.target.value as Preset)}>
              <option value="none">Keep current world settings</option>
              <option value="normal">Normal</option>
              <option value="casual">Casual</option>
              <option value="easy">Easy</option>
              <option value="hard">Hard</option>
              <option value="hardcore">Hardcore</option>
              <option value="immersive">Immersive</option>
              <option value="hammer">Hammer</option>
            </select>
          </label>

          <label className="flex items-start gap-3 rounded-lg border border-[#393126] bg-[#0d120f] p-3 text-sm text-[#d7cdbb]">
            <input className="mt-1 size-4 accent-[#d69a45]" type="checkbox" checked={noMap} onChange={(event) => setNoMap(event.target.checked)} />
            <span>
              <strong className="block">Enable no-map world key</strong>
              <span className="text-[#81796b]">Adds <code>-setkey nomap</code>. Some modifiers can affect 1.0 achievement eligibility.</span>
            </span>
          </label>

          {errors.length ? (
            <div role="alert" className="rounded-lg border border-[#8e6232] bg-[#2b2114] p-4 text-sm text-[#edc58d]">
              <strong>Review these inputs:</strong>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {errors.map((error) => <li key={error}>{error}</li>)}
              </ul>
            </div>
          ) : null}
        </div>
      </div>

      <div className="border-t border-[#393126] bg-[#0d120f] p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-sm font-black uppercase tracking-wider text-[#8db6ba]">Generated launch line</h3>
          <button
            type="button"
            disabled={Boolean(errors.length)}
            onClick={copyCommand}
            className="rounded-lg bg-[#d69a45] px-4 py-2 text-sm font-black text-[#17130d] transition hover:bg-[#e8ad58] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {copyState}
          </button>
        </div>
        <pre className="mt-3 overflow-x-auto whitespace-pre-wrap break-words rounded-lg border border-[#393126] bg-black/30 p-4 text-sm leading-6 text-[#eee4d1]">
          <code>{command}</code>
        </pre>
        <p aria-live="polite" className="mt-3 text-xs leading-5 text-[#81796b]">
          Review the line against the server manual distributed with your current Valheim Dedicated Server installation before production use.
        </p>
      </div>
    </section>
  );
}
