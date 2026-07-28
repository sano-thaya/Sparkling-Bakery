import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <section className="section text-center">
        <div className="container">
          <h1 className="title-xl mb-6">Handcrafted cakes for your sparkling moments.</h1>
          <p className="text-lead mb-8 max-w-2xl mx-auto">
            Welcome to Sparkling Bakery. We specialize in custom cakes and delicate pastries made from scratch with the finest ingredients.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/order" className="btn btn-primary">
              Order a Custom Cake
            </Link>
            <Link href="/gallery" className="btn btn-secondary">
              View Our Work
            </Link>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="grid grid-cols-2 items-center">
            <div>
              <h2 className="title-lg mb-6">Made with Love</h2>
              <p className="mb-4">
                Every cake from Sparkling Bakery is uniquely designed and crafted with careful attention to detail. Whether it's a birthday, wedding, or just because, we believe every celebration deserves something sweet.
              </p>
              <p className="mb-6">
                Explore our gallery to see past creations, or get in touch to start planning your perfect dessert.
              </p>
              <Link href="/about" className="btn btn-primary">
                Read Our Story
              </Link>
            </div>
            <div className="card">
              {/* We'll use a styled div as a placeholder since we don't have images yet */}
              <div style={{
                width: '100%',
                aspectRatio: '4/3',
                backgroundColor: 'var(--color-peach)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-rose)',
                fontWeight: '600'
              }}>
                [Featured Cake Image]
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
