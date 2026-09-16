import { useState, useEffect } from "react";
import { useTheme } from "./ThemeProvider";
import { Menu, X, Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { useLocation } from "wouter";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Plans", href: "/plans" },
    { name: "Store", href: "#store" },
    { name: "Projects", href: "#projects" },
    { name: "Logs", href: "#faq" },
  ];

  const navigateTo = (href: string) => {
    setMobileMenuOpen(false);
    if (href.startsWith("/")) {
      setLocation(href);
      return;
    }
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-background/85 backdrop-blur-md border-b border-border/50 py-3 shadow-sm" : "bg-background/55 backdrop-blur-sm py-4 sm:py-5"}`}>
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl flex items-center justify-between">
        <button
          type="button"
          aria-label="SpicyMango, scroll to top"
          className="flex items-center gap-2.5 font-black text-lg sm:text-xl tracking-tight"
          onClick={() => navigateTo("#home")}
        >
          <img
            src="/assets/avatar.png"
            alt="SpicyMango avatar"
            className="w-9 h-9 rounded-full object-cover ring-2 ring-primary shadow-md"
          />
          <span className="text-foreground">Spicy<span className="text-primary">Mango</span></span>
        </button>

        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-6 text-sm font-medium">
            {navLinks.map((link) => (
              <button 
                key={link.name} 
                onClick={() => navigateTo(link.href)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.name}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
              className="text-muted-foreground hover:text-foreground h-9 w-9"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <Button onClick={() => navigateTo("#contact")} size="sm" className="font-semibold shadow-md shadow-primary/20">
              Connect
            </Button>
          </div>
        </div>

        <div className="md:hidden flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
            className="text-muted-foreground hover:text-foreground h-9 w-9"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            className="text-foreground h-9 w-9"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-background/95 backdrop-blur-md border-b border-border shadow-lg py-4 px-6 flex flex-col gap-4 md:hidden font-medium">
          {navLinks.map((link) => (
            <button 
              key={link.name} 
              onClick={() => navigateTo(link.href)}
              className="text-left py-3 text-muted-foreground hover:text-foreground transition-colors border-b border-border/50 last:border-0"
            >
              {link.name}
            </button>
          ))}
          <Button onClick={() => navigateTo("#contact")} className="w-full mt-4 h-11 font-semibold">
            Connect
          </Button>
        </div>
      )}
    </nav>
  );
}
