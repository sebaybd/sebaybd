import { MetadataRoute } from "next";
import { sampleServices } from "@/lib/sample-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://sebaybd.example";

  const staticRoutes = ["", "/search", "/providers", "/bookings", "/messages", "/admin"].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
  }));

  const serviceRoutes = sampleServices.map((service) => ({
    url: `${base}/services/${service.slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...serviceRoutes];
}
