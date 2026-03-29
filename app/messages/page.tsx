import { sampleMessages } from "@/lib/sample-data";

export default function MessagesPage() {
  return (
    <section className="container-shell py-8">
      <h1 className="text-3xl font-bold">Messages</h1>
      <p className="mt-2 text-stone-600">Basic customer-provider communication thread storage.</p>
      <div className="mt-6 space-y-3">
        {sampleMessages.map((message) => (
          <article key={message.id} className="rounded-2xl border border-stone-200 bg-white p-4 text-sm">
            <p className="font-semibold">{message.from} → {message.to}</p>
            <p className="mt-1 text-stone-700">{message.content}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
