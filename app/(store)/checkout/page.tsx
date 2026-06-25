import { auth } from "@/lib/auth";
import CheckoutClient from "./CheckoutClient";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function CheckoutPage() {
  const session = await auth();

  if (!session?.user.id) {
    redirect("/login")
  }

  const addresses = await prisma.address.findMany({
    where: { userId: session.user.id }
  })

  console.log(addresses)

  if (!addresses || addresses.length === 0) {
    redirect("/settings")
  }

  return (
    <CheckoutClient addresses={addresses} />
  )
}
