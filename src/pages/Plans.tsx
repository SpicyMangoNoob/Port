import { ArrowLeft, CheckCircle2, ExternalLink, Gamepad2, MessageCircle, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { CurrencySwitcher } from "@/components/CurrencySwitcher";
import { Button } from "@/components/ui/button";
import { useCurrency } from "@/components/CurrencyProvider";
import { formatFromINR } from "@/lib/currency";
import { tebexHref } from "@/lib/site";
import { plans, type Plan, type PlanCategory } from "@/data/plans";

const categoryMeta: Record<PlanCategory, {
  label: string;
  eyebrow: string;
  description: string;
  icon: typeof Gamepad2;
}> = {
  minecraft: {
    label: "Minecraft Development",
    eyebrow: "NETWORK SYSTEMS",
    description: "Performance-first builds for Paper, Purpur, Velocity, GeyserMC, and serious player loads.",
    icon: Gamepad2,
  },
  discord: {
    label: "Discord Development",
    eyebrow: "COMMUNITY SYSTEMS",
    description: "Structured communities with automation, moderation, support flows, and Minecraft sync.",
    icon: MessageCircle,
  },
};

function PlanCard({ plan, currency }: { plan: Plan; currency: Parameters<typeof formatFromINR>[1] }) {
  return (
    <article className={`relative flex flex-col overflow-hidden rounded-2xl border p-6 transition-all hover:-translate-y-1 hover:shadow-xl ${
      plan.highlight
        ? "border-primary bg-primary/[0.06] shadow-lg shadow-primary/10"
        : "border-border/60 bg-card shadow-sm"
    }`}>
      {plan.highlight && <div className="absolute inset-x-0 top-0 h-1 bg-primary" />}
      <div className="mb-6 flex items-start justify-between gap-3">
        <div>
          <p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">{plan.highlight ? "Recommended build" : "Flexible scope"}</p>
          <h3 className="text-2xl font-bold text-foreground">{plan.tier}</h3>
        </div>
        {plan.highlight && <Sparkles className="mt-1 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />}
      </div>

      <p className="mb-6 text-sm leading-6 text-muted-foreground">{plan.desc}</p>

      <div className="mb-6 border-y border-border/50 py-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Investment</p>
        <p className="mt-1 text-3xl font-extrabold tracking-tight text-foreground">
          {plan.priceINR === null ? "Custom Quote" : formatFromINR(plan.priceINR, currency)}
        </p>
      </div>

      <Button asChild variant={plan.highlight ? "default" : "outline"} className="mb-7 h-11 w-full gap-2 rounded-xl font-semibold">
        <a
          href={tebexHref()}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${plan.tier} plan on Tebex (opens in new tab)`}
        >
          {plan.priceINR === null ? "Start a conversation" : "Deploy this plan"}
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
        </a>
      </Button>

      <div className="mt-auto space-y-3">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-foreground">Included</p>
        {plan.features.map((feature) => (
          <div key={feature} className="flex items-start gap-2.5 text-sm text-muted-foreground">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            <span>{feature}</span>
          </div>
        ))}
      </div>
    </article>
  );
}

export default function Plans() {
  const { currency } = useCurrency();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="relative overflow-hidden px-4 pb-24 pt-32 sm:px-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--primary)/0.12),transparent_45%),linear-gradient(to_right,hsl(var(--border)/0.18)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.18)_1px,transparent_1px)] bg-[size:auto,3rem_3rem,3rem_3rem] opacity-70" />
        <div className="relative mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col gap-8 border-b border-border/50 pb-10 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Link href="/" className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground">
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Back to overview
              </Link>
              <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-primary sm:text-xs">SPICYMANGO / SERVICE CATALOG</p>
              <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">Plans built for communities that want to grow.</h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                Compare every Minecraft and Discord plan in one place. Choose a baseline, then I tailor the implementation to your network, host, and community.
              </p>
            </div>
            <div className="shrink-0 rounded-2xl border border-border/60 bg-card/80 p-4 shadow-sm backdrop-blur-sm">
              <p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Display currency</p>
              <CurrencySwitcher className="w-full sm:w-[150px]" />
            </div>
          </div>

          <div className="space-y-16">
            {(Object.keys(plans) as PlanCategory[]).map((category) => {
              const meta = categoryMeta[category];
              const Icon = meta.icon;
              return (
                <section key={category} aria-labelledby={`${category}-plans`}>
                  <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="mt-1 rounded-xl bg-primary/10 p-3 text-primary">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-primary">{meta.eyebrow}</p>
                        <h2 id={`${category}-plans`} className="mt-1 text-2xl font-bold sm:text-3xl">{meta.label}</h2>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{meta.description}</p>
                      </div>
                    </div>
                    <span className="font-mono text-xs text-muted-foreground">{plans[category].length} tiers · custom scopes available</span>
                  </div>
                  <div className="grid gap-5 lg:grid-cols-3">
                    {plans[category].map((plan) => <PlanCard key={plan.tier} plan={plan} currency={currency} />)}
                  </div>
                </section>
              );
            })}
          </div>

          <div className="mt-16 flex flex-col items-start justify-between gap-5 rounded-2xl border border-primary/20 bg-primary/[0.06] p-6 sm:flex-row sm:items-center sm:p-8">
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Not sure where to start?</p>
              <h2 className="mt-2 text-xl font-bold">Tell me what is breaking and I’ll map the right build.</h2>
            </div>
            <Button asChild className="w-full shrink-0 rounded-xl sm:w-auto">
              <Link href="/#contact">Talk through your setup</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}