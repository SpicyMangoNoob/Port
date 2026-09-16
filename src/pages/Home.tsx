import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { DevTerminal } from "@/components/DevTerminal";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Code2, Server, TerminalSquare, CheckCircle2, ExternalLink } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useCurrency } from "@/components/CurrencyProvider";
import { formatFromUSD } from "@/lib/currency";
import { plans, type PlanCategory } from "@/data/plans";
import { tebexHref } from "@/lib/site";
import { Link } from "wouter";

// Rotating role text shown in the hero. Cycles every 2s.
const ROLES = ["Minecraft Developer", "Web Developer", "Discord Developer", "Host Engineer"];

function RotatingRole() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % ROLES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Fixed height (1.3em) prevents layout shift when text changes
  return (
    <span
      className="relative block overflow-hidden"
      style={{ height: "1.3em" }}
      aria-live="polite"
      aria-atomic="true"
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={ROLES[index]}
          initial={{ opacity: 0, y: "100%" }}
          animate={{ opacity: 1, y: "0%" }}
          exit={{ opacity: 0, y: "-100%" }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="text-primary italic font-bold absolute inset-0"
        >
          {ROLES[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

// Star rating display
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg key={star} className={`w-4 h-4 ${star <= Math.floor(rating) ? "text-secondary fill-current" : star - 0.5 <= rating ? "text-secondary fill-current opacity-60" : "text-muted-foreground fill-current opacity-30"}`} viewBox="0 0 20 20" aria-hidden="true">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-sm font-bold text-foreground ml-1">{rating}</span>
    </div>
  );
}

const ALL_REVIEWS = [
  { name: "Alex Rivera", role: "Owner · Frostpeak SMP", rating: 5, content: "SpicyMango rebuilt our entire backend from scratch. TPS holds rock-solid at 20 even during 100+ player launch windows — no rubber-banding, no complaints. Flawless execution." },
  { name: "Jordan Lee", role: "Admin · Nightfall Discord", rating: 4, content: "The automation workflows he deployed on our Discord completely eliminated manual moderation overhead. Clean logic, zero bloat, and the ticket system just works exactly how we needed it." },
  { name: "Marcus Chen", role: "Founder · VoidCraft Network", rating: 4, content: "Our server was bleeding players because of lag. SpicyMango ran a full diagnostic, rebuilt the plugin stack, and optimized everything. Went from 12 TPS to a steady 19.8. Best investment we made." },
];

function ReviewCarousel() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward
  const count = ALL_REVIEWS.length;

  const go = (next: number) => {
    setDirection(next > current ? 1 : -1);
    setCurrent(next);
  };

  const advance = (delta: number) => {
    const next = (current + delta + count) % count;
    setDirection(delta > 0 ? 1 : -1);
    setCurrent(next);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((c) => (c + 1) % count);
    }, 4000);
    return () => clearInterval(timer);
  }, [count]);

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? "60%" : "-60%", opacity: 0 }),
    center: { x: "0%", opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? "-60%" : "60%", opacity: 0 }),
  };

  const review = ALL_REVIEWS[current];

  return (
    <div className="relative">
      {/* Header row: overall rating + nav arrows */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <StarRating rating={4.3} />
          <span className="text-muted-foreground text-xs font-medium">{count} reviews</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => advance(-1)}
            aria-label="Previous review"
            className="w-8 h-8 rounded-full border border-border/50 bg-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <button
            onClick={() => advance(1)}
            aria-label="Next review"
            className="w-8 h-8 rounded-full border border-border/50 bg-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>
      </div>

      {/* Single-card display with fixed height to prevent layout shift */}
      <div className="overflow-hidden rounded-2xl border border-border/50 bg-card shadow-sm" style={{ minHeight: 160 }}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="px-7 py-5 flex flex-col gap-4"
          >
            <p className="text-base text-foreground leading-relaxed">"{review.content}"</p>
            <div className="flex items-center justify-between pt-3 border-t border-border/40">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-sm text-foreground leading-tight">{review.name}</div>
                  <div className="text-xs text-muted-foreground">{review.role}</div>
                </div>
              </div>
              <StarRating rating={review.rating} />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-1.5 mt-4">
        {ALL_REVIEWS.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to review ${i + 1}`}
            onClick={() => go(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? "bg-primary w-5" : "bg-border w-1.5"}`}
          />
        ))}
      </div>
    </div>
  );
}

// Contact Schema
const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  service: z.string().min(1, "Please select a target"),
  message: z.string().min(10, "Message must be at least 10 characters")
});

export default function Home() {
  const { currency } = useCurrency();

  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      service: "",
      message: ""
    }
  });

  const onSubmit = (data: z.infer<typeof contactSchema>) => {
    const subject = encodeURIComponent(`[SpicyMango] Project Request – ${data.service}`);
    const body = encodeURIComponent(
      `Name: ${data.name}\nEmail: ${data.email}\nService: ${data.service}\n\n${data.message}`
    );
    window.open(`mailto:spicymanguu@gmail.com?subject=${subject}&body=${body}`, "_blank");
    toast.success("Opening your email client — message is ready to send!");
    form.reset();
  };

  // EDIT ME: replace each `url` with the real Tebex checkout link for that product.
  // priceUSD is the native Tebex listing price; the currency switcher converts it for display.
  const storeProducts = [
    { id: 1, name: "Survival Core v2", description: "Production-ready survival bundle. Custom biomes, configured economy, and optimized mob caps.", priceUSD: 15.0, url: "#" },
    { id: 2, name: "Automated Hub Bot", description: "Drop-in Discord bot configuration. Handles tickets, mod logs, economy tracking, and roles.", priceUSD: 10.0, url: "#" },
    { id: 3, name: "Perms Matrix Base", description: "LuckPerms base structure. 10+ ranks with inheritance trees pre-optimized for heavy loads.", priceUSD: 5.0, url: "#" },
  ];

  // EDIT ME: replace with real Discord invite / mailto / GitHub profile links.
  const socialLinks = {
    discord: "#",
    email: "mailto:contact@spicymango.dev",
    github: "#",
  };

  const faqs = [
    { q: "How do we initialize a deployment?", a: "Ping me directly via Discord or submit the transmission form below. We align on scope, scale, and timeline, then I provision a custom Tebex checkout link or direct invoice." },
    { q: "What is your payment processor?", a: "All transactions route through Tebex, which provides secure checkout and supports all major credit networks and PayPal without exposing data." },
    { q: "What's the typical lead time?", a: "Depends entirely on the payload. A standard Discord workflow takes ~48 hours. A full custom Velocity/Paper network can span weeks. I provide exact ETAs before any code is touched." },
    { q: "Is post-launch support included?", a: "Maximum tier deployments include a dedicated launch window support period. Ongoing retainer contracts are available for continuous maintenance." },
    { q: "Can you bridge Discord and Minecraft?", a: "Absolutely. Bridging the two environments—syncing chat, syncing ranks via OAuth, and streaming logs—is a core specialty." },
    { q: "Do you audit existing laggy networks?", a: "Yes. If your TPS is dropping or your players are rubberbanding, I can run diagnostics, profile the server, and rebuild the faulty configurations." },
  ];


  return (
    <div className="relative min-h-screen">
      <div>
        <Navbar />
        
        <main>
          {/* HERO SECTION */}
          <section id="home" className="min-h-[100dvh] scroll-mt-24 pt-28 pb-16 px-4 sm:px-6 border-b border-border/50 flex flex-col justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--primary)/0.08),transparent_50%),radial-gradient(ellipse_at_bottom_left,hsl(var(--primary)/0.05),transparent_50%)] pointer-events-none" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.3)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.3)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_40%,transparent_100%)] pointer-events-none" />
            
            <div className="container mx-auto max-w-6xl relative z-10">
              <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
                <div className="lg:col-span-7">
                  <p className="mb-4 font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-primary sm:text-xs">
                    Minecraft infrastructure · web · Discord
                  </p>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight leading-snug mb-5 text-foreground">
                    I am a
                    <RotatingRole />
                  </h1>
                  <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mb-8 leading-relaxed">
                    I build Minecraft networks and Discord communities that don't buckle under pressure. Raw performance, no bloated configs.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button size="lg" onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth'})} className="w-full sm:w-auto rounded-xl px-7 h-12 text-sm sm:text-base font-semibold transition-all">
                      View Plans Overview
                    </Button>
                    <Button size="lg" variant="outline" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth'})} className="w-full sm:w-auto rounded-xl px-7 h-12 text-sm sm:text-base font-semibold bg-background hover:bg-secondary/50 transition-all border-border/50">
                      Initialize Project
                    </Button>
                  </div>
                </div>
                
                <div className="lg:col-span-5 flex flex-col gap-3 font-mono text-sm">
                  <div className="flex items-center justify-between px-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    <span>Interactive developer shell</span>
                    <span className="text-primary">online</span>
                  </div>
                  <DevTerminal />
                </div>
              </div>
              <div className="mt-10 grid grid-cols-2 gap-3 lg:grid-cols-4">
                {[
                  { icon: Server, label: "Minecraft", value: "Paper + Velocity" },
                  { icon: Code2, label: "Web stack", value: "React + TypeScript" },
                  { icon: TerminalSquare, label: "Hosting", value: "Pterodactyl ready" },
                  { icon: CheckCircle2, label: "Approach", value: "Clean, no bloat" },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="rounded-xl border border-border/50 bg-card/60 px-3 py-3 backdrop-blur-sm sm:px-4">
                    <Icon className="mb-2 h-4 w-4 text-primary" aria-hidden="true" />
                    <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
                    <p className="mt-1 text-xs font-semibold text-foreground sm:text-sm">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ABOUT SECTION */}
          <section id="about" className="scroll-mt-24 py-24 border-b border-border/50 bg-secondary/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/3 h-full bg-[url('/assets/mc_landscape_2.png')] bg-cover bg-center opacity-[0.03] mix-blend-luminosity pointer-events-none" />
            <div className="container mx-auto px-6 max-w-6xl relative z-10">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div>
                  <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-8 leading-[1.1]">Less Overhead.<br/><span className="text-primary">More Performance.</span></h2>
                  <div className="text-lg text-muted-foreground space-y-6 leading-relaxed">
                    <p>
                      I'm SpicyMango. I engineer networks that actually survive player spikes.
                    </p>
                    <p>
                      For the past three years, I've been gutting laggy servers, untangling messy permissions, and building streamlined automated systems. No bloated setups. Just clean, optimized infrastructure designed to run quietly in the background while you focus on your community.
                    </p>
                  </div>
                </div>
                <div className="rounded-3xl border border-border/50 bg-card p-8 font-mono text-sm overflow-x-auto relative shadow-sm">
                  <div className="inline-flex bg-primary/10 text-primary px-3 py-1 rounded-md font-semibold text-xs mb-6">
                    system_capabilities.yml
                  </div>
                  <pre className="text-muted-foreground whitespace-pre-wrap leading-loose">
                    <code className="text-primary">architectural_skills:</code><br/>
                    &nbsp;&nbsp;<code className="text-foreground">- "BungeeCord / Velocity Networks"</code><br/>
                    &nbsp;&nbsp;<code className="text-foreground">- "Paper / Purpur Optimization"</code><br/>
                    &nbsp;&nbsp;<code className="text-foreground">- "LuckPerms Inheritance Trees"</code><br/>
                    &nbsp;&nbsp;<code className="text-foreground">- "Pterodactyl Panel Deployment"</code><br/>
                    &nbsp;&nbsp;<code className="text-foreground">- "GeyserMC Crossplay Tunnels"</code><br/>
                    &nbsp;&nbsp;<code className="text-foreground">- "Discord Bot Automation"</code><br/>
                  </pre>
                </div>
              </div>
            </div>
          </section>

          {/* PLANS OVERVIEW */}
          <section id="services" className="scroll-mt-24 border-b border-border/50 py-24 relative">
            <div className="container mx-auto max-w-6xl px-6">
              <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-primary">Service catalog</p>
                  <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Plans at a glance.</h2>
                  <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                    Six focused starting points for Minecraft networks and Discord communities. Open the full catalog to compare every feature, price, and delivery scope.
                  </p>
                </div>
                <Button asChild className="w-full shrink-0 gap-2 rounded-xl sm:w-auto">
                  <Link href="/plans">
                    Compare all plans
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                {(Object.keys(plans) as PlanCategory[]).map((category) => (
                  <Link
                    key={category}
                    href="/plans"
                    className="group rounded-2xl border border-border/60 bg-card/70 p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 sm:p-6"
                  >
                    <div className="mb-5 flex items-center justify-between gap-4">
                      <div>
                        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
                          {category === "minecraft" ? "Minecraft systems" : "Discord systems"}
                        </p>
                        <h3 className="mt-1 text-2xl font-bold">{category === "minecraft" ? "Minecraft Development" : "Discord Development"}</h3>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" aria-hidden="true" />
                    </div>
                    <div className="space-y-2">
                      {plans[category].map((plan) => (
                        <div key={plan.tier} className="flex items-center justify-between gap-4 rounded-xl border border-border/40 bg-background/40 px-4 py-3">
                          <div className="min-w-0">
                            <p className="font-semibold text-foreground">{plan.tier}</p>
                            <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{plan.desc}</p>
                          </div>
                          <span className={`shrink-0 rounded-full px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider ${plan.highlight ? "bg-primary/10 text-primary" : "bg-secondary/60 text-secondary-foreground"}`}>
                            {plan.highlight ? "Full build" : "Flexible"}
                          </span>
                        </div>
                      ))}
                    </div>
                    <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground transition-colors group-hover:text-primary">Open full plan catalog →</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* STORE SECTION */}
          <section id="store" className="scroll-mt-24 py-24 border-b border-border/50 bg-secondary/10 relative">
            <div className="container mx-auto px-6 max-w-6xl relative z-10">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                <div>
                  <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Off-the-shelf<br/>Configs</h2>
                </div>
                <div className="text-sm font-semibold flex items-center gap-2 bg-card border border-border/50 px-4 py-2.5 rounded-full shadow-sm">
                  <Server className="w-4 h-4 text-primary" /> SECURE TEBEX CHECKOUT
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {storeProducts.map((product, i) => (
                  <div key={product.id} className="rounded-3xl border border-border/50 bg-card flex flex-col overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group">
                    <div className="h-56 relative overflow-hidden bg-muted">
                      {product.name.includes("Bot") ? (
                        <img src="/assets/discord_screenshot.png" alt="" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-all duration-700 group-hover:scale-105" />
                      ) : (
                        <img src={`/assets/mc_landscape_${i % 2 === 0 ? '1.jpg' : '2.png'}`} alt="" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-all duration-700 group-hover:scale-105" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-background/95 to-transparent" />
                      <div className="absolute bottom-5 left-6 font-mono text-xs font-bold bg-background/80 backdrop-blur-md px-3 py-1.5 rounded-lg text-primary border border-primary/20">
                        ID: {product.id.toString().padStart(4, '0')}
                      </div>
                    </div>
                    <div className="p-6 md:p-8 flex flex-col flex-1">
                      <h3 className="text-2xl font-bold mb-3 leading-tight">{product.name}</h3>
                      <p className="text-sm text-muted-foreground mb-8 flex-1 leading-relaxed">{product.description}</p>
                      
                      <div className="flex items-center justify-between mt-auto pt-6 border-t border-border/50">
                        <div className="font-extrabold text-2xl text-foreground tracking-tight">
                          <span>{formatFromUSD(product.priceUSD, currency)}</span>
                        </div>
                        <Button asChild className="rounded-xl font-semibold px-6 gap-2">
                          <a href={tebexHref(product.url)} target="_blank" rel="noopener noreferrer" aria-label={`Purchase ${product.name} on Tebex (opens in new tab)`}>
                            Purchase
                            <ExternalLink className="w-4 h-4" aria-hidden="true" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* PROJECTS SECTION */}
          <section id="projects" className="scroll-mt-24 py-24 border-b border-border/50 relative">
            <div className="container mx-auto px-6 max-w-6xl">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-12">In Production</h2>
              
              <div className="rounded-3xl border border-border/50 bg-card overflow-hidden shadow-sm">
                <div className="grid md:grid-cols-12">
                  <div className="p-10 md:p-16 flex flex-col justify-center md:col-span-8 lg:col-span-7">
                    <div className="font-mono text-primary text-sm font-semibold tracking-widest mb-6 flex items-center gap-3">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
                      </span>
                      NETWORK BUILD
                    </div>
                    <h3 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Lixoriois</h3>
                    <p className="text-muted-foreground mb-10 text-lg leading-relaxed max-w-xl">
                      A high-stakes survival network engineered from the ground up for massive concurrency. Custom terrain, completely rebuilt economy structures, and zero-lag combat mechanics.
                    </p>
                    <div className="flex flex-wrap gap-3">
                       <span className="px-4 py-1.5 rounded-full border border-border/50 bg-secondary/50 text-foreground text-sm font-semibold">Velocity</span>
                       <span className="px-4 py-1.5 rounded-full border border-border/50 bg-secondary/50 text-foreground text-sm font-semibold">Paper</span>
                       <span className="px-4 py-1.5 rounded-full border border-border/50 bg-secondary/50 text-foreground text-sm font-semibold">Custom Core</span>
                    </div>
                  </div>
                  <div className="md:col-span-4 lg:col-span-5 bg-secondary/20 p-10 flex flex-col justify-center items-center border-t md:border-t-0 md:border-l border-border/50 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
                    <div className="relative z-10 w-full max-w-sm space-y-4">
                       <div className="bg-card border border-border/50 p-5 rounded-2xl shadow-sm">
                         <div className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-2">Status</div>
                         <div className="text-foreground font-semibold flex items-center gap-3 text-lg">
                           <div className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div> Pre-Release
                         </div>
                       </div>
                       <div className="bg-card border border-border/50 p-5 rounded-2xl shadow-sm">
                         <div className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-2">Architecture</div>
                         <div className="text-foreground font-mono font-medium text-sm">Multi-Node Proxy</div>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* REVIEWS SECTION */}
          <section className="py-24 border-b border-border/50 bg-secondary/10">
            <div className="container mx-auto px-6 max-w-6xl">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-12">Client Reviews</h2>
              <ReviewCarousel />
            </div>
          </section>

          {/* FAQ SECTION */}
          <section id="faq" className="scroll-mt-24 py-24 border-b border-border/50">
            <div className="container mx-auto px-6 max-w-3xl">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-12 text-center">Protocol / FAQ</h2>

              <Accordion type="single" collapsible className="w-full space-y-4">
                {faqs.map((faq, i) => (
                  <AccordionItem key={i} value={`item-${i}`} className="border border-border/50 bg-card rounded-2xl px-6 md:px-8 data-[state=open]:border-primary/50 data-[state=open]:shadow-md shadow-sm transition-all duration-300">
                    <AccordionTrigger className="text-left font-semibold text-lg hover:no-underline py-6 [&[data-state=open]>div]:text-primary group">
                      <div className="flex items-center gap-4 transition-colors">
                        {faq.q}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-8 pt-2">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </section>

          {/* CONTACT SECTION */}
          <section id="contact" className="scroll-mt-24 py-24 bg-card border-b border-border/50">
            <div className="container mx-auto px-6 max-w-6xl">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div>
                  <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.05]">Initialize<br/><span className="text-primary">Project</span></h2>
                  <p className="text-muted-foreground mb-12 max-w-md text-lg leading-relaxed">
                    Time to overhaul your infrastructure. Ping me directly or submit a brief below.
                  </p>
                  
                  <div className="space-y-4">
                    <a href={socialLinks.discord} className="flex items-center gap-6 p-6 rounded-2xl border border-border/50 bg-background hover:border-primary/50 hover:shadow-md transition-all group">
                       <img src="/assets/discord_logo.png" alt="Discord" className="w-8 h-8 object-contain dark:invert" />
                       <div className="flex-1">
                         <div className="text-xs text-muted-foreground mb-1 font-bold uppercase tracking-wider">Discord</div>
                         <div className="font-bold text-lg group-hover:text-primary transition-colors">@spicymango.dev</div>
                       </div>
                       <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors transform group-hover:translate-x-1" />
                    </a>
                    <a href={socialLinks.email} className="flex items-center gap-6 p-6 rounded-2xl border border-border/50 bg-background hover:border-primary/50 hover:shadow-md transition-all group">
                       <TerminalSquare className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                       <div className="flex-1">
                         <div className="text-xs text-muted-foreground mb-1 font-bold uppercase tracking-wider">Email Direct</div>
                         <div className="font-bold text-lg group-hover:text-primary transition-colors">contact@spicymango.dev</div>
                       </div>
                       <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors transform group-hover:translate-x-1" />
                    </a>
                    <a href={socialLinks.github} className="flex items-center gap-6 p-6 rounded-2xl border border-border/50 bg-background hover:border-primary/50 hover:shadow-md transition-all group">
                       <Code2 className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                       <div className="flex-1">
                         <div className="text-xs text-muted-foreground mb-1 font-bold uppercase tracking-wider">GitHub</div>
                         <div className="font-bold text-lg group-hover:text-primary transition-colors">github.com/SpicyMango</div>
                       </div>
                       <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors transform group-hover:translate-x-1" />
                    </a>
                  </div>
                </div>

                <div className="rounded-3xl border border-border/50 p-8 md:p-12 bg-background shadow-lg shadow-black/5">
                  <div className="font-bold text-primary text-sm mb-8 flex items-center gap-3 uppercase tracking-wider">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary" /> Transmission Form
                  </div>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2.5">
                      <label className="text-sm font-semibold">Commander Name</label>
                      <Input 
                        {...form.register("name")} 
                        className="rounded-xl bg-card border-border/50 focus-visible:ring-primary h-14 px-4 shadow-sm" 
                        placeholder="Steve"
                      />
                      {form.formState.errors.name && <p className="text-destructive text-xs font-medium">{form.formState.errors.name.message}</p>}
                    </div>

                    <div className="space-y-2.5">
                      <label className="text-sm font-semibold">Return Address</label>
                      <Input 
                        {...form.register("email")} 
                        className="rounded-xl bg-card border-border/50 focus-visible:ring-primary h-14 px-4 shadow-sm" 
                        placeholder="steve@mojang.com"
                        type="email"
                      />
                      {form.formState.errors.email && <p className="text-destructive text-xs font-medium">{form.formState.errors.email.message}</p>}
                    </div>

                    <div className="space-y-2.5">
                      <label className="text-sm font-semibold">Target Environment</label>
                      <select 
                        {...form.register("service")}
                        className="flex h-14 w-full items-center justify-between rounded-xl border border-border/50 bg-card px-4 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="">Select an environment...</option>
                        <option value="minecraft">Minecraft Network</option>
                        <option value="discord">Discord Community</option>
                        <option value="both">Integrated Deployment (Both)</option>
                        <option value="audit">System Audit / Optimization</option>
                      </select>
                      {form.formState.errors.service && <p className="text-destructive text-xs font-medium">{form.formState.errors.service.message}</p>}
                    </div>

                    <div className="space-y-2.5">
                      <label className="text-sm font-semibold">Mission Brief</label>
                      <Textarea 
                        {...form.register("message")} 
                        className="rounded-xl bg-card border-border/50 focus-visible:ring-primary min-h-[160px] p-4 shadow-sm resize-y" 
                        placeholder="Describe current architecture, player counts, and what's breaking..."
                      />
                      {form.formState.errors.message && <p className="text-destructive text-xs font-medium">{form.formState.errors.message.message}</p>}
                    </div>

                    <Button type="submit" size="lg" className="w-full rounded-xl h-14 text-base font-semibold shadow-md">
                      Transmit Data
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer className="py-12 border-t border-border/50 bg-background text-center">
          <div className="container mx-auto px-6 font-mono text-sm text-muted-foreground flex flex-col items-center gap-4">
             <div className="flex items-center gap-2.5">
               <img src="/assets/avatar.png" alt="SpicyMango" className="w-8 h-8 rounded-full object-cover ring-2 ring-primary" />
               <span className="font-semibold text-foreground">SpicyMango</span>
             </div>
             <div>© {new Date().getFullYear()} SpicyMango.dev. All rights reserved.</div>
             <div className="text-xs opacity-60">Not affiliated with Mojang AB or Discord Inc.</div>
          </div>
        </footer>
      </div>
    </div>
  );
}