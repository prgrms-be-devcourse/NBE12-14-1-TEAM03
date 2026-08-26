import CustomerHeader from "@/components/layout/CustomerHeader";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <CustomerHeader />
      <main className="container py-4">{children}</main>
    </>
  );
}