import { Link } from "@tanstack/react-router";
import { useStore, type Product } from "@/lib/store";

export function ProductCard({ p }: { p: Product }) {
  const { lang, t, price, add } = useStore();
  return (
    <div className="group flex flex-col overflow-hidden rounded-xl bg-card shadow-card transition hover:-translate-y-1">
      <Link to="/product/$id" params={{ id: p.id }} className="aspect-square overflow-hidden bg-secondary">
        <img src={p.image} alt={p.name[lang]} loading="lazy" width={816} height={816} className="h-full w-full object-cover transition group-hover:scale-105" />
      </Link>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <span className="text-xs text-muted-foreground">{p.category[lang]}</span>
        <Link to="/product/$id" params={{ id: p.id }} className="line-clamp-2 font-medium hover:text-primary">{p.name[lang]}</Link>
        <span className="text-xs text-gold">★ {p.rating} <span className="text-muted-foreground">({p.reviews})</span></span>
        <div className="mt-auto flex items-baseline gap-2 pt-2">
          <span className="text-lg font-bold">{price(p.price)}</span>
          {p.oldPrice && <span className="text-xs text-muted-foreground line-through">{price(p.oldPrice)}</span>}
        </div>
        <button onClick={() => add(p.id)} className="mt-2 rounded-lg bg-primary py-2 text-sm font-semibold text-primary-foreground hover:opacity-90">{t.add}</button>
      </div>
    </div>
  );
}
