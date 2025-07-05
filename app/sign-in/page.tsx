"use client";

import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormEvent, useState } from "react";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import { Label } from "@radix-ui/react-label";
import { Eye, EyeOff } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

function SignInPage() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  if (!isLoaded) {
    return (
      <TextGenerateEffect duration={1} filter={false} words="Loading..." />
    );
  }

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      const result = await signIn?.create({
        identifier: email,
        password,
      });
      if (result?.status === "complete") {
        setActive?.({
          session: result.createdSessionId,
        });
        router.push("/dashboard");
      } else {
        console.log(JSON.stringify(result, null, 2));
      }
    } catch (error) {
      if (isClerkAPIResponseError(error)) {
        setError(error.errors[0].message);
      } else if (error instanceof Error) {
        setError(error.message);
      }
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background max-w-xl m-auto">
      <Card className="w-full max-w-d">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Sign In for Todo Master
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </button>
              </div>
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>
        </CardContent>
        <div id="clerk-captcha" />
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/sign-up"
              className="font-medium text-primary hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default SignUp;
