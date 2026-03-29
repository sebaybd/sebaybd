import { Metadata } from "next";
import Link from "next/link";
import { SignUpForm } from "@/components/auth/signup-form";

export const metadata: Metadata = {
  title: "Register",
};

export default function SignUpPage() {
  return (
    <section className="container-shell py-12">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-stone-200 bg-white p-6">
        <h1 className="text-2xl font-bold">Create Account</h1>
        <p className="mt-2 text-sm text-stone-600">
          Register as User, Provider, or Admin. Provider accounts require admin approval before login.
        </p>

        <div className="mt-5">
          <SignUpForm />
        </div>

        <div className="mt-5 text-xs text-stone-700">
          Already registered? <Link href="/signin" className="font-semibold text-(--brand)">Sign in</Link>
        </div>
      </div>
    </section>
  );
}
