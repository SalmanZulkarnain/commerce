import LoginForm from "@/components/LoginForm";

interface LoginPageProps {
  searchParams: Promise<{ callbackUrl?: string | undefined }>;
}

export default async function LoginPage({
  searchParams
}: LoginPageProps) {
  const resolvedSearchParams = await searchParams;
  const callbackUrl = resolvedSearchParams.callbackUrl ?? "/";
  return (
    LoginForm(callbackUrl)
  );
}
