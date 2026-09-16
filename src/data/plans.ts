export type Plan = {
  tier: string;
  desc: string;
  priceINR: number | null;
  features: string[];
  highlight?: boolean;
};

export const plans = {
  minecraft: [
    {
      tier: "Starter",
      desc: "For fresh servers that need a solid foundation fast. I set up the core plugins, lock down permissions properly, and tune your ranks and chat so the server feels professional from day one — no more duct-taped configs.",
      priceINR: null,
      features: ["Base Plugin Integration", "Permissions Matrix", "Chat Formatting", "Basic TPS Tuning"],
    },
    {
      tier: "Professional",
      desc: "Built for servers that are actively growing and starting to strain under real player load. I wire up multi-node routing, a proper player-driven economy, and anti-cheat rules, then squeeze extra performance out of your hardware.",
      priceINR: null,
      features: ["Bungee/Velocity Routing", "Advanced Economy", "Anti-Cheat Config", "Deep Server Optimization"],
    },
    {
      tier: "Maximum",
      desc: "The full network build for serious, high-traffic communities. Everything is custom-engineered end to end — crossplay support, hardened hosting, aggressive tick-rate optimization, and full staff tooling — so nothing breaks when the player count spikes.",
      priceINR: 1200,
      features: ["Full Network Development", "GeyserMC Crossplay", "Pterodactyl Deployment", "Aggressive Optimization", "Pre-Launch Audits", "Staff Tools"],
      highlight: true,
    },
  ],
  discord: [
    {
      tier: "Starter",
      desc: "For new servers that need proper structure from the first day. I build a clean role hierarchy, organize your channels so members can actually find things, and set up sane baseline permissions.",
      priceINR: null,
      features: ["Role Hierarchy", "Channel Taxonomy", "Basic Permissions"],
    },
    {
      tier: "Professional",
      desc: "For active communities ready to stop moderating by hand. I deploy a support ticket system, automated moderation logging, guided onboarding flows, and spam/scam filters that actually catch things.",
      priceINR: null,
      features: ["Ticket Bot Deployment", "Moderation Logs", "Onboarding Workflows", "Automated Filters"],
    },
    {
      tier: "Maximum",
      desc: "The complete control center for a Minecraft-and-Discord community running as one system. Full server overhaul, live account sync between platforms, a custom bot built around your community, and deep automation across both.",
      priceINR: 500,
      features: ["Complete Overhaul", "Minecraft Account Sync", "Custom Bot Implementation", "Advanced Automation"],
      highlight: true,
    },
  ],
} satisfies Record<string, Plan[]>;

export type PlanCategory = keyof typeof plans;