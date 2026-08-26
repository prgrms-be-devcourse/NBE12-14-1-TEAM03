import Link from "next/link";

export default function AdminHeader() {
  return (
    <header className="border-bottom bg-white">
      <nav
        className="container d-flex flex-wrap align-items-center justify-content-between gap-3 py-3"
        aria-label="관리자 메뉴"
      >
        <Link
          href="/admin/orders"
          className="navbar-brand mb-0 fw-semibold text-dark text-decoration-none"
        >
          GRIDS &amp; CIRCLE · ADMIN
        </Link>

        <div className="d-flex align-items-center gap-3">
          <Link href="/admin/orders" className="nav-link px-0 text-dark">
            주문 관리
          </Link>
          <Link href="/admin/products" className="nav-link px-0 text-dark">
            상품 관리
          </Link>
        </div>
      </nav>
    </header>
  );
}
