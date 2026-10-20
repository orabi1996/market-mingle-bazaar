import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PRODUCTS, useStore } from "@/lib/store";

export const Route = createFileRoute("/product/$id")({
  loader: ({ params }) => {
    const p = PRODUCTS.find((x) => x.id === params.id);
    if (!p) throw notFound();
    return p;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.name.ar} | Souqly` : "Souqly" },
      { name: "description", content: loaderData?.desc.ar ?? "منتج على سوقلي" },
      { property: "og:title", content: loaderData?.name.ar ?? "Souqly" },
      { property: "og:description", content: loaderData?.desc.ar ?? "منتج على سوقلي" },
    ],
  }),
  component: ProductPage,
});

function ProductPage() {
  const p = Route.useLoaderData();
  const { lang, t, price, add } = useStore();
  return (
    <main className="mx-auto grid max-w-6xl gap-10 px-4 py-10 md:grid-cols-2">
      <img src={p.image} alt={p.name[lang]} width={816} height={816} className="w-full rounded-2xl bg-secondary" />
      <div className="flex flex-col gap-4">
        <Link to="/" className="text-sm text-muted-foreground">← {t.back}</Link>
        <span className="text-sm text-muted-foreground">{p.category[lang]}</span>
        <h1 className="text-3xl font-bold">{p.name[lang]}</h1>
        <span className="text-gold">★ {p.rating} <span className="text-muted-foreground">({p.reviews} {t.reviews})</span></span>
        <p className="text-muted-foreground">{p.desc[lang]}</p>
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-bold">{price(p.price)}</span>
          {p.oldPrice && <span className="text-muted-foreground line-through">{price(p.oldPrice)}</span>}
        </div>
        <span className="text-sm">{t.by}: <b className="text-primary">{p.seller}</b></span>
        <button onClick={() => add(p.id)} className="rounded-lg bg-gold py-3 font-semibold text-gold-foreground">{t.add}</button>
      </div>
    </main>
  );
}
