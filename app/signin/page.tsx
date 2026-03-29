import { Metadata } from "next";
import Link from "next/link";
import { SignInForm } from "@/components/auth/signin-form";

export const metadata: Metadata = {
  title: "Sign In",
};

export default function SignInPage() {
  return (
    <section className="container-shell py-12">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-stone-200 bg-white p-6">
        <h1 className="text-2xl font-bold">Sign In</h1>
        <p className="mt-2 text-sm text-stone-600">Sign in as Admin, Provider, or User and get redirected to the correct dashboard.</p>

        <div className="mt-5">
          <SignInForm />
        </div>

        <div className="mt-5 rounded-xl border border-stone-200 bg-stone-50 p-3 text-xs text-stone-700">
          <p className="font-semibold">New here?</p>
          <p className="mt-1">Create an account as User or Provider. Only sebaybd@gmail.com can register as Admin.</p>
          <Link href="/signup" className="mt-2 inline-block font-semibold text-(--brand)">
            Go to registration
          </Link>
        </div>
      </div>
    </section>
  );
}
