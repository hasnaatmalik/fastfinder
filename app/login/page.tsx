"use client";

import type React from "react";

import {useState, useEffect} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {AlertCircle, Loader2} from "lucide-react";
import {Logo} from "@/components/logo";
import {useToast} from "@/components/ui/use-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/dashboard";
  const {toast} = useToast();

  // Check if there's a status message in the URL (e.g., after registration)
  useEffect(() => {
    const status = searchParams.get("status");
    const message = searchParams.get("message");

    if (status === "success" && message) {
      toast({
        title: "Success",
        description: decodeURIComponent(message),
        variant: "default",
      });
    }
  }, [searchParams, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
        credentials: "include",
      });

      const data = await response.json();

      if (!data.success) {
        if (data.needsVerification) {
          // Redirect to verification page if email is not verified
          router.push(`/verify?email=${encodeURIComponent(data.email)}`);
          return;
        }

        setError(data.error || "Login failed. Please check your credentials.");
        setLoading(false);
        return;
      }

      // Show success toast
      toast({
        title: "Login successful",
        description: "Welcome back to FastFinder!",
        variant: "default",
      });

      // Set redirecting state to show feedback to user
      setRedirecting(true);

      // Force a hard navigation to dashboard instead of client-side routing
      window.location.href = redirectPath;
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred during login. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-8rem)] py-8">
      <Card className="mx-auto max-w-sm border-secondary/10">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <Logo />
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            Welcome back
          </CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to sign in
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m.example@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                disabled={loading || redirecting}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-primary underline-offset-4 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                disabled={loading || redirecting}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button
              type="submit"
              className="w-full"
              disabled={loading || redirecting}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : redirecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Redirecting to dashboard...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="text-primary underline-offset-4 hover:underline"
              >
                Register
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
