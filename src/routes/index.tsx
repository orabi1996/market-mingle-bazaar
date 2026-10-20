import { createFileRoute } from "@tanstack/react-router";
import hero from "@/assets/hero.jpg";
import { PRODUCTS, useStore } from "@/lib/store";
import { ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Souqly | سوقلي - سوق الخليج الإلكتروني" },
      { name: "description", content: "سوقلي: سوق إلكتروني يجمع آلاف التجار والمنتجات في الخليج بتوصيل سريع." },
      { property: "og:title", content: "Souqly | سوقلي" },
      { property: "og:description", content: "سوق إلكتروني يجمع آلاف التجار والمنتجات في الخليج." },
    ],
  }),
  component: Index,
});

function Index() {
  const { t } = useStore();
  return (
    <main>
      <section className="relative overflow-hidden bg-sand">
        <img src={hero} alt="" width={1600} height={800} className="absolute inset-0 h-full w-full object-cover ltr:scale-x-[-1]" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 md:py-32">
          <div className="max-w-lg">
            <h1 className="text-4xl font-bold leading-tight md:text-6xl">{t.heroTitle}</h1>
            <p className="mt-4 text-lg text-muted-foreground">{t.heroSub}</p>
            <a href="#deals" className="mt-8 inline-block rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground">{t.shop}</a>
          </div>
        </div>
      </section>
      <section id="deals" className="mx-auto max-w-7xl px-4 py-12">
        <h2 className="mb-6 text-2xl font-bold">{t.deals}</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {PRODUCTS.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      </section>
    </main>
  );
}
