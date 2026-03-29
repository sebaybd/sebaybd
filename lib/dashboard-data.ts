import { readMockStore } from "@/lib/mock-store";

const sampleCustomerName = "Nafisa";
const sampleProviderId = "p2";

export function getProviderDashboardData() {
  const store = readMockStore();
  const provider = store.providers.find((item) => item.id === sampleProviderId) ?? store.providers[0];
  const services = store.services.filter((service) => service.providerId === provider.id);
  const bookings = store.bookings.filter((booking) => booking.providerName === provider.name);
  const completedBookings = bookings.filter((booking) => booking.status === "COMPLETED");
  const pendingBookings = bookings.filter((booking) => booking.status === "PENDING");
  const relatedMessages = store.messages.filter((message) => message.to === provider.name || message.from === provider.name);

  return {
    provider,
    services,
    bookings,
    completedBookings,
    pendingBookings,
    relatedMessages,
    estimatedEarnings: completedBookings.length * 2200 + pendingBookings.length * 900,
  };
}

export function getUserDashboardData() {
  const store = readMockStore();
  const bookings = store.bookings.filter((booking) => booking.customerName === sampleCustomerName);
  const bookedServices = bookings
    .map((booking) => store.services.find((service) => service.id === booking.serviceId))
    .filter(Boolean);
  const bookedCategorySlugs = new Set(bookedServices.map((service) => service!.categorySlug));

  const recommendedServices = store.services.filter(
    (service) => !bookings.some((booking) => booking.serviceId === service.id) && bookedCategorySlugs.has(service.categorySlug)
  );

  const relatedMessages = store.messages.filter(
    (message) => message.from === sampleCustomerName || message.to === sampleCustomerName
  );

  return {
    customerName: sampleCustomerName,
    bookings,
    bookedServices,
    recommendedServices,
    relatedMessages,
    reviewedBookingIds: store.reviews.map((review) => review.bookingId),
  };
}

export function getAdminDashboardData() {
  const store = readMockStore();
  const totalUsers = new Set([
    ...store.bookings.map((booking) => booking.customerName),
    ...store.providers.map((provider) => provider.name),
  ]).size;

  const pendingBookings = store.bookings.filter((booking) => booking.status === "PENDING");
  const completedBookings = store.bookings.filter((booking) => booking.status === "COMPLETED");

  const categoryBreakdown = store.categories
    .filter((category) => !category.parentSlug)
    .map((category) => {
      const totalServices = store.services.filter((service) => {
        if (service.categorySlug === category.slug) return true;
        return store.categories.some(
          (sub) => sub.parentSlug === category.slug && sub.slug === service.categorySlug
        );
      }).length;

      return {
        name: category.name,
        totalServices,
      };
    })
    .filter((item) => item.totalServices > 0);

  const providerLeaderboard = store.providers.map((provider) => ({
    ...provider,
    activeServices: store.services.filter((service) => service.providerId === provider.id).length,
    totalBookings: store.bookings.filter((booking) => booking.providerName === provider.name).length,
  }));

  return {
    totalUsers,
    totalProviders: store.providers.length,
    totalServices: store.services.length,
    pendingBookings,
    completedBookings,
    categoryBreakdown,
    providerLeaderboard,
  };
}
