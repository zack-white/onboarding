"use client";
import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-900">
      <SignIn path="/login" routing="path" signUpUrl="/sign-up" />
    </div>
  );
}
