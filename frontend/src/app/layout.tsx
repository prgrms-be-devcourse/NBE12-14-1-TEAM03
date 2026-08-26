import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="min-vh-100">{children}</body>
    </html>
  );
}
