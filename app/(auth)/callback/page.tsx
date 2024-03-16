"use client";
import { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getToken } from "@/services/auth.service";

export default function Callback() {
  const params = useSearchParams();
  const router = useRouter();
  const started = useRef(false);
  const [error, setError] = useState("");
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const code = params.get("code");
    if (!code || params.get("error")) {
      setError(
        "Sign-in was cancelled or the callback is incomplete. Start again.",
      );
      return;
    }
    getToken(code, params.get("state"))
      .then(() => router.replace("/"))
      .catch(() =>
        setError(
          "Sign-in could not be completed. Start again from this browser tab.",
        ),
      );
  }, [params, router]);
  return (
    <section className="p-8">
      <h1 className="text-2xl font-bold">Spotify sign-in</h1>
      <p role="status" className="my-4">
        {error || "Completing sign-in…"}
      </p>
      {error && (
        <Link href="/" className="underline">
          Return to library browser
        </Link>
      )}
    </section>
  );
}
