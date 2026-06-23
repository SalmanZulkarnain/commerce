import { Navbar } from "@/components/layout/Navbar";
import { auth } from "@/lib/auth";

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
