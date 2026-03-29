import Link from "next/link";
import { redirect } from "next/navigation";
import { ServiceCard } from "@/components/cards/service-card";
import { StatCard } from "@/components/dashboard/stat-card";
import { UserBookingCenter } from "@/components/dashboard/user-booking-center";
import { QuickAccessPanel } from "@/components/dashboard/quick-access-panel";
import { ActivityTimeline } from "@/components/dashboard/activity-timeline";
import { auth } from "@/auth";
import { getUserDashboardData } from "@/lib/dashboard-data";
import { ServiceSummary } from "@/types/marketplace";

export default async function UserDashboardPage() {
	const session = await auth();
	if (!session?.user) {
		redirect("/signin?next=/dashboard/user");
	}
	if (session.user.role !== "CUSTOMER") {
		redirect("/dashboard");
	}

	const { customerName, bookings, bookedServices, recommendedServices, relatedMessages, reviewedBookingIds } =
		getUserDashboardData();
	const validBookedServices = bookedServices.filter(
		(service): service is ServiceSummary => Boolean(service)
	);

	return (
		<section className="container-shell py-8">
			<h1 className="text-3xl font-bold">User Dashboard</h1>
			<p className="mt-2 text-stone-600">Track bookings, see related services, and continue conversations with providers.</p>

			<div className="mt-6 rounded-3xl glass-card p-6">
				<div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
					<div>
						<p className="text-sm uppercase tracking-[0.18em] text-stone-500">Active User</p>
						<h2 className="mt-2 text-2xl font-bold">{customerName}</h2>
						<p className="text-sm text-stone-600">Your recent service activity and personalized recommendations</p>
					</div>
					<Link href="/search" className="rounded-full bg-(--accent) px-4 py-2 text-sm font-semibold text-foreground">
						Find Another Service
					</Link>
				</div>
			</div>

			<div className="mt-6 grid gap-4 md:grid-cols-3">
				<StatCard label="Total Bookings" value={bookings.length} note="Across all services" />
				<StatCard
					label="Completed Services"
					value={bookings.filter((item) => item.status === "COMPLETED").length}
					note="Eligible for review"
				/>
				<StatCard label="Message Threads" value={relatedMessages.length} note="Provider communications" />
			</div>

			<QuickAccessPanel />

			<div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1fr]">
				<div className="rounded-2xl border border-stone-200 bg-white p-5">
					<h2 className="text-xl font-bold">Booked Services</h2>
					<div className="mt-4 grid gap-4">
						{validBookedServices.map((service) => <ServiceCard key={service.id} service={service} />)}
					</div>
				</div>

				<ActivityTimeline bookings={bookings} />
			</div>

			<div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
				<div className="rounded-2xl border border-stone-200 bg-white p-5">
					<div className="flex items-center justify-between">
						<h2 className="text-xl font-bold">Related Recommended Services</h2>
						<span className="text-sm text-stone-500">Based on your bookings</span>
					</div>
					<div className="mt-4 grid gap-4 md:grid-cols-2">
						{recommendedServices.length ? (
							recommendedServices.map((service) => <ServiceCard key={service.id} service={service} />)
						) : (
							<p className="text-sm text-stone-600">No related recommendations yet in sample mode.</p>
						)}
					</div>
				</div>

				<div className="rounded-2xl border border-stone-200 bg-white p-5">
					<h2 className="text-xl font-bold">Recent Messages</h2>
					<ul className="mt-4 space-y-3 text-sm">
						{relatedMessages.map((message) => (
							<li key={message.id} className="rounded-xl border border-stone-100 p-3">
								<p className="font-semibold">
									{message.from}
									{" -> "}
									{message.to}
								</p>
								<p className="mt-1 text-stone-600">{message.content}</p>
							</li>
						))}
					</ul>
				</div>
			</div>
		</section>
	);
}
