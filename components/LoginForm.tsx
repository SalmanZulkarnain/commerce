import Image from "next/image";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import {
  handleCredentialsSignIn,
  handleOAuthSignIn,
} from "@/app/(auth)/login/actions";
import { providerMap } from "@/lib/auth";

export default function LoginForm(callbackUrl: string) {
  return (
    <section className="max-w-sm w-full">
      <div className="flex h-full items-center justify-center">
        <div className="border-muted bg-background flex w-full max-w-md flex-col items-center gap-y-8 rounded-md border px-6 py-12 shadow-md">
          <div className="flex flex-col items-center gap-y-2">
            {/* Logo */}
            <div className="flex items-center gap-1 lg:justify-start">
              <Link href="/">
                <Image
                  width={100}
                  height={100}
                  src="https://www.shadcnblocks.com/images/block/logos/shadcnblockscom-wordmark.svg"
                  alt="logo"
                  title="my store"
                  className="h-10 dark:invert"
                />
              </Link>
            </div>
            {/* {heading && ( */}
            <h1 className="text-3xl font-semibold">Halo</h1>
            {/* )} */}
          </div>
          <div className="flex w-full flex-col gap-8">
            <div className="flex flex-col gap-4">
              <form
                action={handleCredentialsSignIn.bind(null, callbackUrl)}
                className="flex flex-col gap-4"
              >
                <div className="flex flex-col gap-2">
                  <Input
                    type="email"
                    name="email"
                    placeholder="Email"
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Input
                    type="password"
                    name="password"
                    placeholder="Password"
                    required
                  />
                </div>
                <Button type="submit" className="mt-2 w-full cursor-pointer">
                  Masuk
                </Button>
              </form>
              <div className="flex flex-col gap-4">
                <Separator />

                {Object.values(providerMap).map((provider) => (
                  <form
                    key={provider.id}
                    className="w-full"
                    action={handleOAuthSignIn.bind(
                      null,
                      provider.id,
                      callbackUrl,
                    )}
                  >
                    <Button
                      variant="outline"
                      className="w-full cursor-pointer"
                      type="submit"
                    >
                      <FcGoogle className="mr-2 size-5" />
                      Masuk dengan {provider.name}
                    </Button>
                  </form>
                ))}
              </div>
            </div>
          </div>
          <div className="text-muted-foreground flex justify-center gap-1 text-sm">
            <p>Belum mempunyai akun?</p>
            <Link
              href="/register"
              className="text-primary font-medium hover:underline"
            >
              Daftar
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}