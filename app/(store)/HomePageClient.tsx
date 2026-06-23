// app/HomePageClient.tsx (Client Component)
"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";

interface HomePageClientProps {
  initialSession: any; // or use proper Session type
}

export function HomePageClient({ initialSession }: HomePageClientProps) {
  // ✅ Client-side session check
  const { data: session, status } = useSession();

  // Debug logging (shows in browser console)
  useEffect(() => {
    console.log("🖥️ Client Session Status:", status);
    console.log("🖥️ Client Session Data:", session);
    console.log("🖥️ Initial Session (from server):", initialSession);
  }, [session, status, initialSession]);

  // Show loading state while checking session
  if (status === "loading") {
    return (
      <div className="max-w-5xl mx-auto px-4 py-4">
        <p className="text-muted-foreground">Memeriksa sesi...</p>
      </div>
    );
  }

  // Use client session if available, fallback to server session
  const currentUser = session?.user || initialSession?.user;
  const isAuthenticated = status === "authenticated" || !!initialSession;

  return (
    <div className="max-w-5xl mx-auto px-4 py-4 border-t">
      <div className="flex flex-col gap-2">
        <h3 className="font-semibold">Status Sesi:</h3>
        <div className="bg-muted p-4 rounded-lg">
          <p>
            <strong>Authenticated:</strong> {isAuthenticated ? "✅ Ya" : "❌ Tidak"}
          </p>
          {currentUser && (
            <>
              <p><strong>Nama:</strong> {currentUser.name}</p>
              <p><strong>Email:</strong> {currentUser.email}</p>
              <p><strong>Role:</strong> {currentUser.role}</p>
            </>
          )}
          <p className="text-xs text-muted-foreground mt-2">
            Session diambil dari {session ? "client" : "server"}
          </p>
        </div>
      </div>
    </div>
  );
}