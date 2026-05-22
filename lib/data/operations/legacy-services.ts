import type { BookableServiceFixture } from "../../types";
import { ownerServices } from "../services";

/** Maps catalog services to the legacy fixture shape used by older dashboard widgets. */
export const sampleBookableServices: BookableServiceFixture[] = ownerServices.map((service, index) => ({
  id: index + 1,
  name: service.name,
  abbreviation: service.name.split(" ")[0],
  description: service.short_description,
  color: ["#FFC900", "#10B981", "#8B5CF6"][index] ?? "#64748B",
  price: service.price,
  priceType: service.price === 0 ? "fixed" : service.requires_deposit ? "from" : "fixed",
  priceFrom: service.price || undefined,
  onQuote: service.requires_confirmation,
  duration: service.duration_minutes ?? 90,
  category: "RESTAURANTS",
  visibility: service.status === "active" ? "bookable" : "hidden",
}));

export const sampleBookableCategories = ["RESTAURANTS"];
