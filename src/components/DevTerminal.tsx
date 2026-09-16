import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { Check, ChevronRight, Copy, RotateCcw, Terminal } from "lucide-react";

type TerminalLine = {
  kind: "input" | "output" | "muted" | "accent";
  text: string;
};

const WELCOME_LINES: TerminalLine[] = [
  { kind: "accent", text: "SpicyMango shell v2.4.1 — Minecraft infrastructure online." },
  { kind: "muted", text: "Type help to see available commands." },
];

const COMMANDS: Record<string, string | TerminalLine[]> = {
  help: [
    "Available commands:",
    "  neofetch   show the SpicyMango developer profile",
    "  mc status  check the Minecraft stack",
    "  stack      list the tools I work with",
    "  projects   show current builds",
    "  about      learn what I build",
    "  contact    jump to the contact form",
    "  clear      clear the terminal",
  ].join("\n"),
  neofetch: [
    { kind: "accent", text: "╭─ SPICYMANGO // MINECRAFT DEV ─╮" },
    { kind: "output", text: "│  ████  profile  spicymango    │" },
    { kind: "output", text: "│  █  █  stack    Paper / React │" },
    { kind: "output", text: "│  ████  focus    high-TPS UX   │" },
    { kind: "accent", text: "╰───────────────────────────────╯" },
    { kind: "output", text: "  ● systems   Minecraft · Web · Discord" },
    { kind: "output", text: "  ● mode      accepting projects" },
  ],
  "mc status": [
    "Minecraft systems",
    "  proxy       Velocity ........ online",
    "  server      Paper 1.21 ...... optimized",
    "  crossplay   GeyserMC ......... ready",
    "  performance TPS 20.0 ....... stable",
  ].join("\n"),
  stack: "Paper · Purpur · Velocity · GeyserMC · LuckPerms · Pterodactyl · React · TypeScript",
  projects: [
    "Active builds",
    "  Lixoriois      survival network / pre-release",
    "  custom portals  Discord + Minecraft account sync",
    "  infra audits    TPS profiling and host tuning",
  ].join("\n"),
  about: "I build Minecraft networks, web experiences, Discord systems, and hosting setups that stay fast as communities grow.",
  contact: "Opening the project intake form...",
};

function getCommandOutput(command: string): TerminalLine[] {
  if (command === "clear" || command === "cls") return [];

  if (command === "contact") {
    window.setTimeout(() => {
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
  }

  if (COMMANDS[command]) {
    const result = COMMANDS[command];
    return Array.isArray(result)
      ? result
      : [{ kind: command === "contact" ? "accent" : "output", text: result }];
  }

  return [
    {
      kind: "muted",
      text: `command not found: ${command}. Type "help" for available commands.`,
    },
  ];
}

export function DevTerminal() {
  const [lines, setLines] = useState<TerminalLine[]>(WELCOME_LINES);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [copied, setCopied] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [lines]);

  const run = (rawCommand: string) => {
    const command = rawCommand.trim().toLowerCase();
    if (!command) return;

    if (command === "clear" || command === "cls") {
      setLines([]);
    } else {
      setLines((current) => [
        ...current,
        { kind: "input", text: command },
        ...getCommandOutput(command),
      ]);
    }

    setHistory((current) => [...current.filter((item) => item !== command), command]);
    setHistoryIndex(-1);
    setInput("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    run(input);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setHistoryIndex((current) => {
        const next = Math.min(current + 1, history.length - 1);
        setInput(history[history.length - 1 - next] ?? "");
        return next;
      });
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHistoryIndex((current) => {
        const next = current - 1;
        setInput(next < 0 ? "" : history[history.length - 1 - next] ?? "");
        return next;
      });
    }

    if (event.ctrlKey && event.key.toLowerCase() === "l") {
      event.preventDefault();
      setLines([]);
    }
  };

  const copyTranscript = async () => {
    const transcript = lines.map((line) => line.text).join("\n");
    try {
      await navigator.clipboard?.writeText(transcript);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  };

  const resetTerminal = () => {
    setLines(WELCOME_LINES);
    setInput("");
    setHistory([]);
    setHistoryIndex(-1);
  };

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-primary/20 bg-[#0d090b] text-left shadow-2xl shadow-primary/10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_0%,rgba(244,63,94,0.14),transparent_38%)]" />
      <div className="relative flex items-center justify-between gap-3 border-b border-white/10 bg-white/[0.04] px-4 py-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex min-w-0 items-center gap-2 text-xs text-white/60">
            <Terminal className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
            <span className="truncate">spicymango@dev:~</span>
            <span className="hidden rounded border border-primary/30 px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-primary sm:inline">mc dev mode</span>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={copyTranscript}
            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-white/50 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label={copied ? "Terminal copied" : "Copy terminal output"}
          >
            {copied ? <Check className="h-3.5 w-3.5 text-[#28c840]" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
          <button
            type="button"
            onClick={resetTerminal}
            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-white/50 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Reset terminal"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div ref={outputRef} className="relative h-64 overflow-y-auto bg-black/10 px-4 py-4 font-mono text-[11px] leading-5 text-white/75 sm:h-72 sm:text-xs">
        {lines.map((line, index) => (
          <div
            key={`${index}-${line.text}`}
            className={`whitespace-pre-wrap break-words ${
              line.kind === "input"
                ? "text-white"
                : line.kind === "accent"
                  ? "text-primary"
                  : line.kind === "muted"
                    ? "text-white/45"
                    : "text-white/75"
            }`}
          >
            {line.kind === "input" ? (
              <span>
                <span className="text-[#28c840]">➜</span> {line.text}
              </span>
            ) : (
              line.text
            )}
          </div>
        ))}
        <form onSubmit={handleSubmit} className="mt-1 flex items-center gap-2">
          <span className="shrink-0 text-[#28c840]" aria-hidden="true">➜</span>
          <label htmlFor="terminal-command" className="sr-only">Terminal command</label>
          <input
            ref={inputRef}
            id="terminal-command"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            className="min-w-0 flex-1 bg-transparent text-white outline-none placeholder:text-white/30"
            placeholder="type a command..."
            autoComplete="off"
            spellCheck={false}
          />
          <ChevronRight className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
        </form>
      </div>

      <div className="relative flex flex-wrap items-center gap-2 border-t border-white/10 bg-white/[0.03] px-4 py-3">
        <span className="mr-1 text-[10px] uppercase tracking-wider text-white/35">Try</span>
        {["neofetch", "mc status", "stack", "help"].map((command) => (
          <button
            key={command}
            type="button"
            onClick={() => {
              inputRef.current?.focus();
              run(command);
            }}
            className="rounded-md border border-white/10 px-2 py-1 font-mono text-[10px] text-white/60 transition-colors hover:border-primary/50 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {command}
          </button>
        ))}
        <span className="ml-auto hidden text-[10px] text-white/30 sm:inline">↑↓ history · ctrl+l clear</span>
      </div>
    </div>
  );
}