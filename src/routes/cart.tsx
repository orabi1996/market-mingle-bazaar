import { createFileRoute } from "@tanstack/react-router";
import { PRODUCTS, useStore } from "@/lib/store";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "السلة | Souqly" },
      { name: "description", content: "راجع منتجاتك في سلة سوقلي." },
      { property: "og:title", content: "السلة | Souqly" },
      { property: "og:description", content: "راجع منتجاتك في سلة سوقلي." },
    ],
  }),
  component: Cart,
});

function Cart() {
  const { cart, lang, t, price, remove } = useStore();
  const items = PRODUCTS.filter((p) => cart[p.id]);
  const total = items.reduce((s, p) => s + p.price * cart[p.id], 0);
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold">{t.cart}</h1>
      {items.length === 0 ? <p className="text-muted-foreground">{t.empty}</p> : (
        <div className="space-y-3">
          {items.map((p) => (
            <div key={p.id} className="flex items-center gap-4 rounded-xl bg-card p-3 shadow-card">
              <img src={p.image} alt="" width={80} height={80} className="h-20 w-20 rounded-lg" />
              <div className="flex-1">
                <p className="font-medium">{p.name[lang]}</p>
                <p className="text-sm text-muted-foreground">× {cart[p.id]}</p>
              </div>
              <span className="font-bold">{price(p.price * cart[p.id])}</span>
              <button onClick={() => remove(p.id)} className="text-sm text-destructive">{t.remove}</button>
            </div>
          ))}
          <div className="flex items-center justify-between pt-4 text-xl font-bold">
            <span>{t.total}</span><span>{price(total)}</span>
          </div>
          <button className="w-full rounded-lg bg-primary py-3 font-semibold text-primary-foreground">{t.checkout}</button>
        </div>
      )}
    </main>
  );
}
