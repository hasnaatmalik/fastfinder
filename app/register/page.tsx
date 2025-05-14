"use client";

import type React from "react";
import {useState} from "react";
import {useRouter} from "next/navigation";
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
import {AlertCircle, Loader2, CheckCircle} from "lucide-react";
import {Logo} from "@/components/logo";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Basic validation
    if (!name || !email || !password || !confirmPassword || !contactNumber) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          confirmPassword,
          contactNumber,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error || "Registration failed. Please try again.");
        setLoading(false);
        return;
      }

      // Set verification code for demo purposes
      if (data.verificationCode) {
        setVerificationCode(data.verificationCode);
      }

      // Set success state
      setSuccess(true);

      // Redirect to verification page after a short delay
      setTimeout(() => {
        router.push(`/verify?email=${encodeURIComponent(email)}`);
      }, 2000);
    } catch (err) {
      console.error("Registration error:", err);
      setError("An error occurred during registration. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container flex items-center justify-center min-h-[calc(100vh-8rem)] py-8">
        <Card className="mx-auto max-w-md border-secondary/10">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <Logo />
            </div>
            <CardTitle className="text-2xl font-bold text-center">
              Registration Successful
            </CardTitle>
            <CardDescription className="text-center">
              Please verify your email to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center gap-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
              <p className="text-center">
                Your account has been created! For this demo, your verification
                code is:
              </p>
              <Alert>
                <AlertDescription className="font-mono text-center text-lg font-bold">
                  {verificationCode}
                </AlertDescription>
              </Alert>
              <p className="text-center text-sm text-muted-foreground">
                In a real application, this code would be sent to your email.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link href={`/verify?email=${encodeURIComponent(email)}`}>
              <Button>Verify Email</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-8rem)] py-8">
      <Card className="mx-auto max-w-sm border-secondary/10">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <Logo />
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            Create an account
          </CardTitle>
          <CardDescription className="text-center">
            Enter your information to create an account
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
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Hasnaat Malik"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m.example@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact">Contact Number</Label>
              <Input
                id="contact"
                placeholder="+92 300 1234567"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Password must be at least 8 characters
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </Button>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-primary underline-offset-4 hover:underline"
              >
                Login
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
