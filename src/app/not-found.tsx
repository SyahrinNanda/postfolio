import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="not-found" style={{ 
      minHeight: '100vh', 
      display: 'grid', 
      placeItems: 'center', 
      padding: '24px', 
      textAlign: 'center', 
      position: 'relative', 
      overflow: 'hidden' 
    }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .not-found:before {
          content: "404";
          position: absolute;
          font-size: min(45vw, 540px);
          font-weight: 800;
          letter-spacing: -.1em;
          color: #ffffff05;
          line-height: 1;
        }
        .not-found main {
          position: relative;
          max-width: 650px;
        }
        .not-found .brand {
          justify-content: center;
          margin-bottom: 55px;
        }
        .not-found .mono {
          color: #b8f23f;
          font-size: 11px;
        }
        .not-found h1 {
          font-size: clamp(48px, 8vw, 92px);
          line-height: .95;
          letter-spacing: -.065em;
          margin: 20px 0 25px;
        }
        .not-found p {
          color: #969ca8;
          line-height: 1.75;
          max-width: 480px;
          margin: 0 auto 32px;
        }
        .not-found .actions {
          display: flex;
          justify-content: center;
          gap: 10px;
          flex-wrap: wrap;
        }
        .site-header, .site-footer {
          display: none !important;
        }
      ` }} />
      <main>
        <Link className="brand" href="/">
          <span className="brand-mark">AN</span>
          <span>syahrin.dev</span>
        </Link>
        <div className="mono">ERROR / 404</div>
        <h1>Tersesat di<br />antara route.</h1>
        <p>Halaman ini mungkin sudah dipindahkan, diganti nama, atau belum pernah di-deploy.</p>
        <div className="actions">
          <Link className="button button-primary" href="/">Kembali ke beranda →</Link>
          <Link className="button button-ghost" href="/projects">Lihat project</Link>
        </div>
      </main>
    </div>
  );
}

