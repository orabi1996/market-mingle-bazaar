import { Link } from "@tanstack/react-router";
import { useStore, type Product } from "@/lib/store";
import { Heart } from "lucide-react";

export function ProductCard({ p }: { p: Product }) {
  const { lang, t, price, add, wishlist, toggleWishlist } = useStore();
  const isFav = wishlist.includes(p.id);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl bg-card shadow-card transition hover:-translate-y-1">
      {/* Wishlist toggle button */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleWishlist(p.id);
        }}
        className="absolute top-2.5 end-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 backdrop-blur-xs shadow-xs transition hover:scale-110"
        title={isFav ? t.inWishlist : t.addToWishlist}
      >
        <Heart
          className={`h-4 w-4 transition ${
            isFav ? "fill-red-500 text-red-500" : "text-muted-foreground hover:text-red-500"
          }`}
        />
      </button>

      <Link to="/product/$id" params={{ id: p.id }} className="aspect-square overflow-hidden bg-secondary">
        <img
          src={p.image}
          alt={p.name[lang]}
          loading="lazy"
          width={816}
          height={816}
          className="h-full w-full object-cover transition group-hover:scale-105"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <div className="flex items-center justify-between text-[11px] text-muted-foreground gap-1">
          <span>{p.category[lang]}</span>
          <Link
            to="/store/$id"
            params={{ id: p.sellerId || "seller_techhub" }}
            className="hover:text-gold transition truncate max-w-[110px] font-medium"
            title={p.seller}
          >
            {p.seller}
          </Link>
        </div>
        <Link to="/product/$id" params={{ id: p.id }} className="line-clamp-2 font-medium hover:text-primary">
          {p.name[lang]}
        </Link>
        <span className="text-xs text-gold">★ {p.rating} <span className="text-muted-foreground">({p.reviews})</span></span>
        <div className="mt-auto flex items-baseline gap-2 pt-2">
          <span className="text-lg font-bold">{price(p.price)}</span>
          {p.oldPrice && <span className="text-xs text-muted-foreground line-through">{price(p.oldPrice)}</span>}
        </div>
        <button
          onClick={() => add(p.id)}
          className="mt-2 rounded-lg bg-primary py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          {t.add}
        </button>
      </div>
    </div>
  );
}
