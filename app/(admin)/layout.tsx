import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <h1>Admin Panel</h1>
      <Link href="/admin">List order</Link>
      {children}
    </>
  );
}
