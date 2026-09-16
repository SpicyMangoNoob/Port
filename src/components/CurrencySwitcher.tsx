import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCurrency } from "@/components/CurrencyProvider";
import { CURRENCIES, CurrencyCode } from "@/lib/currency";

export function CurrencySwitcher({ className = "" }: { className?: string }) {
  const { currency, setCurrency } = useCurrency();

  return (
    <Select value={currency} onValueChange={(v) => setCurrency(v as CurrencyCode)}>
      <SelectTrigger
        aria-label="Select display currency"
        className={`h-9 w-[86px] rounded-md border border-input bg-background font-sans text-xs font-semibold uppercase tracking-wider text-foreground hover:border-primary focus:ring-1 focus:ring-primary focus:ring-offset-0 transition-colors ${className}`}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="rounded-md border border-border font-sans shadow-lg shadow-black/5">
        {CURRENCIES.map((c) => (
          <SelectItem
            key={c.code}
            value={c.code}
            className="rounded-sm font-sans text-xs uppercase tracking-wider focus:bg-primary/10 focus:text-primary cursor-pointer"
          >
            {c.code} <span className="text-muted-foreground ml-1 normal-case tracking-normal">{c.label}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
