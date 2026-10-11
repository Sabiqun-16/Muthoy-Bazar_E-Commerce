import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import api from '../lib/api.js';
import ProductCard from '../components/ProductCard.jsx';
import { useCart } from '../context/CartContext.jsx';
import { emoji, money } from '../lib/helpers.js';

function Section({ title, to, products }) {
  const safeProducts = Array.isArray(products) ? products : [];
  if (!safeProducts.length) return null;
  return (
    <section className="mt-10">
      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="text-2xl font-bold">{title}</h2>
        {to && <Link to={to} className="font-semibold text-brand hover:underline">View all items</Link>}
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {safeProducts.map((p) => <ProductCard key={p._id} p={p} />)}
      </div>
    </section>
  );
}

const get = (params) => api.get('/products', { params }).then((r) => r.data).catch(() => ({ products: [], pages: 1 }));

const SLIDES = [
  { title: 'সাধ্যের মধ্যে স্বস্তির বাজার', text: 'Rice, oil, spices and daily needs from trusted brands. Cash on delivery across Bangladesh.', cta: 'Shop the offer zone', to: '/shop?flag=offer', bg: 'from-brand-dark to-emerald-700', img: '/banners/slide-1.jpg' },
  { title: 'New arrivals every week', text: 'See what just landed on our shelves.', cta: 'Shop new arrivals', to: '/shop?flag=new', bg: 'from-teal-900 to-teal-600', img: '/banners/slide-2.jpg' },
  { title: 'Pure honey and premium dates', text: 'Natural sweetness from trusted sources, packed fresh.', cta: 'Shop honey', to: '/shop?category=Honey', bg: 'from-amber-800 to-amber-500', img: '/banners/slide-3.jpg' },
];

const FEATURED = ['Rice', 'Cooking Oil', 'Ghee', 'Spices', 'Tea', 'Coffee', 'Honey', 'Dates', 'Dry Fruits', 'Noodles'];

function HeroSlider() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const go = (n) => setI((n + SLIDES.length) % SLIDES.length);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setI((x) => (x + 1) % SLIDES.length), 5000);
    return () => clearInterval(id);
  }, [paused]);

  const arrow = 'absolute top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-2 text-brand shadow hover:bg-white';

  return (
    <div
      className="relative min-h-60 overflow-hidden rounded-2xl sm:min-h-72 lg:min-h-80"
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
      role="region" aria-roledescription="carousel" aria-label="Promotions"
    >
      {SLIDES.map((s, n) => (
        <div key={s.title} aria-hidden={n !== i} className={`absolute inset-0 bg-gradient-to-br ${s.bg} transition-opacity duration-700 ${n === i ? 'opacity-100' : 'pointer-events-none opacity-0'}`}>
          <img src={s.img} alt="" onError={(e) => (e.currentTarget.style.display = 'none')} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />
          <div className="relative flex h-full max-w-lg flex-col justify-center gap-3 px-12 py-8 text-white sm:px-16">
            <h1 className="text-3xl font-bold leading-tight sm:text-4xl">{s.title}</h1>
            <p className="text-white/90">{s.text}</p>
            <Link to={s.to} tabIndex={n === i ? 0 : -1} className="w-fit rounded-lg bg-cta px-6 py-2.5 font-semibold text-white hover:bg-cta-dark">{s.cta}</Link>
          </div>
        </div>
      ))}
      <button onClick={() => go(i - 1)} aria-label="Previous slide" className={`${arrow} left-3`}><ChevronLeft size={20} /></button>
      <button onClick={() => go(i + 1)} aria-label="Next slide" className={`${arrow} right-3`}><ChevronRight size={20} /></button>
      <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {SLIDES.map((s, n) => (
          <button key={s.title} onClick={() => setI(n)} aria-label={`Go to slide ${n + 1}`} aria-current={n === i} className={`h-2.5 rounded-full transition-all ${n === i ? 'w-6 bg-white' : 'w-2.5 bg-white/60'}`} />
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const [d, setD] = useState({ best: [], offer: [], fresh: [], cats: [], brands: [] });
  const [more, setMore] = useState({ list: [], page: 1, pages: 1, loading: false });
  const { count, subtotal, setOpen } = useCart();
  const rail = useRef(null);

  useEffect(() => {
    Promise.all([
      get({ flag: 'best', limit: 10 }), get({ flag: 'offer', limit: 10 }), get({ flag: 'new', limit: 10 }), get({ limit: 10 }),
      api.get('/categories').then((r) => r.data).catch(() => []), 
      api.get('/products/brands').then((r) => r.data).catch(() => []),
    ]).then(([best, offer, fresh, all, cats, brands]) => {
      setD({ 
        best: Array.isArray(best?.products) ? best.products : [], 
        offer: Array.isArray(offer?.products) ? offer.products : [], 
        fresh: Array.isArray(fresh?.products) ? fresh.products : [], 
        cats: Array.isArray(cats) ? cats : [], 
        brands: Array.isArray(brands) ? brands : [] 
      });
      setMore({ 
        list: Array.isArray(all?.products) ? all.products : [], 
        page: 1, 
        pages: all?.pages || 1, 
        loading: false 
      });
    });
  }, []);

  const loadMore = async () => {
    setMore((m) => ({ ...m, loading: true }));
    const r = await get({ limit: 10, page: more.page + 1 });
    const newProducts = Array.isArray(r?.products) ? r.products : [];
    setMore((m) => ({ list: [...m.list, ...newProducts], page: m.page + 1, pages: r?.pages || m.pages, loading: false }));
  };

  const scrollRail = (dir) => rail.current?.scrollBy({ left: dir * 320, behavior: 'smooth' });

  // Safe brand array fallback
  const safeBrands = Array.isArray(d?.brands) ? d.brands : [];

  return (
    <main className="mx-auto max-w-7xl px-4 pb-6">
      {/* Floating cart widget on the right edge */}
      <button
        onClick={() => setOpen(true)}
        aria-label={`Open cart: ${count} items, ${money(subtotal)}`}
        className="fixed right-0 top-1/2 z-30 -translate-y-1/2 overflow-hidden rounded-l-xl bg-cta text-center text-white shadow-lg transition hover:bg-cta-dark"
      >
        <span className="flex flex-col items-center gap-1 px-3 pb-2 pt-2.5">
          <ShoppingBag size={22} />
          <span className="text-xs font-bold">{count} Items</span>
        </span>
        <span className="block bg-black/20 px-3 py-1.5 text-xs font-bold">{money(subtotal)}</span>
      </button>

      {/* Hero: slider on the left, promo card on the right */}
      <div className="mt-5 grid gap-4 lg:grid-cols-[2fr_1fr]">
        <HeroSlider />
        <Link to="/shop?flag=offer" className="relative flex min-h-48 flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br from-amber-100 to-orange-300 p-6 text-brand-dark transition hover:shadow-lg lg:min-h-80">
          <img src="/banners/promo.jpg" alt="" onError={(e) => (e.currentTarget.style.display = 'none')} className="absolute inset-0 h-full w-full object-cover" />
          <span className="relative w-fit rounded-full bg-cta px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">Offer zone</span>
          <span aria-hidden="true" className="relative self-end text-7xl drop-shadow sm:text-8xl">🛒</span>
          <span className="relative">
            <b className="block text-2xl font-bold leading-tight">Save more on your monthly bazar</b>
            <span className="mt-1 block text-sm">Discounted rice, oil, ghee, honey and more.</span>
            <span className="mt-3 inline-block rounded-lg bg-brand px-5 py-2 text-sm font-semibold text-white">Shop offers</span>
          </span>
        </Link>
      </div>

      {/* Featured categories: horizontally scrollable circles */}
      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Featured categories</h2>
          <div className="flex gap-2">
            <button onClick={() => scrollRail(-1)} aria-label="Scroll categories left" className="rounded-full border bg-white p-2 text-brand hover:bg-brand-light"><ChevronLeft size={18} /></button>
            <button onClick={() => scrollRail(1)} aria-label="Scroll categories right" className="rounded-full border bg-white p-2 text-brand hover:bg-brand-light"><ChevronRight size={18} /></button>
          </div>
        </div>
        <div ref={rail} className="flex snap-x gap-5 overflow-x-auto pb-3" style={{ scrollbarWidth: 'none' }}>
          {FEATURED.map((n) => (
            <Link key={n} to={`/shop?category=${encodeURIComponent(n)}`} className="group w-28 shrink-0 snap-start text-center sm:w-32">
              <span className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border-2 border-brand/10 bg-gradient-to-br from-brand-light to-white text-5xl shadow-sm transition group-hover:scale-105 group-hover:border-brand sm:h-28 sm:w-28 sm:text-6xl">{emoji(n)}</span>
              <span className="mt-2 block text-sm font-semibold group-hover:text-brand">{n}</span>
            </Link>
          ))}
        </div>
      </section>

      <Section title="Top selling products" to="/shop?flag=best" products={d.best} />

      {safeBrands.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-2xl font-bold">Our brands</h2>
          <div className="flex flex-wrap gap-2">
            {safeBrands.slice(0, 12).map((b) => (
              <Link key={b} to={`/shop?brand=${encodeURIComponent(b)}`} className="rounded-lg border bg-white px-4 py-2 font-semibold hover:border-brand hover:text-brand">
                {b}
              </Link>
            ))}
          </div>
        </section>
      )}

      <Section title="Offer zone" to="/shop?flag=offer" products={d.offer} />
      <Section title="New arrivals" to="/shop?flag=new" products={d.fresh} />
      <Section title="Just for you" to="/shop" products={more.list} />
      {more.page < more.pages && (
        <div className="mt-6 text-center">
          <button onClick={loadMore} disabled={more.loading} className="rounded-lg border-2 border-brand px-8 py-2 font-semibold text-brand hover:bg-brand-light disabled:opacity-60">
            {more.loading ? 'Loading…' : 'Load more'}
          </button>
        </div>
      )}

      <section className="mt-12">
        <h2 className="mb-4 text-2xl font-bold">What our customers say</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {[['Rice and oil arrived in two days, sealed and fresh. I will order again next month.', 'Rahim U.', 'Service holder, Dhaka'], ['Cash on delivery makes it easy. The ghee quality is better than the local shop.', 'Nusrat J.', 'Teacher, Chattogram'], ['Good prices on monthly bazar items. Support answered my questions the same day.', 'Sabbir A.', 'Business owner, Sylhet']].map(([q, n, r]) => (
            <figure key={n} className="rounded-xl border bg-white p-5"><blockquote className="mb-3">{q}</blockquote><figcaption className="text-sm"><b>{n}</b> <span className="text-gray-500">{r}</span></figcaption></figure>
          ))}
        </div>
      </section>
    </main>
  );
}