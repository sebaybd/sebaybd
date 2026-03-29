import { ProviderCard } from "@/components/cards/provider-card";
import { readMockStore } from "@/lib/mock-store";

export default function ProvidersPage() {
  const providers = readMockStore().providers;

  return (
    <section className="container-shell py-8">
      <h1 className="text-3xl font-bold">Verified Providers</h1>
      <p className="mt-2 text-stone-600">Browse approved professionals across Bangladesh.</p>
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {providers.map((provider) => (
          <ProviderCard key={provider.id} provider={provider} />
        ))}
      </div>
    </section>
  );
}
