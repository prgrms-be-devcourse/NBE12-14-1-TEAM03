import Link from "next/link";

export default function CustomerHeader() {
  return (
    <header className="border-bottom bg-white">
      <nav
        className="container d-flex flex-wrap align-items-center justify-content-between gap-3 py-3"
        aria-label="고객 메뉴"
      >
        <Link
          href="/orders"
          className="navbar-brand mb-0 fw-semibold text-dark text-decoration-none"
        >
          GRIDS &amp; CIRCLE
        </Link>

        <div className="d-flex align-items-center gap-3">
          <Link href="/orders" className="nav-link px-0 text-dark">
            주문
          </Link>
          <Link href="/my-orders" className="nav-link px-0 text-dark">
            내 주문 내역
          </Link>
        </div>
      </nav>
    </header>
  );
}
