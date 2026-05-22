/**
 * Single mock-data entry point for the back office.
 * Import from `@/lib/mock-data` only.
 */

export type * from "./reserva-types";

export type {
  Appointment,
  ApprovedReview,
  BookableServiceFixture,
  BookingModeType,
  CancelledAppointment,
  Client,
  ClientRanking,
  CollaboratorStats,
  DuplicateClient,
  EmployeeAgenda,
  EmployeeReviewStats,
  ModerationRule,
  NewClient,
  PendingReview,
  Photo,
  RejectedReview,
  ReviewStats,
  ServiceCategory,
  Transaction,
  WorkingHours,
} from "./types";

export { cities } from "./data/cities";
export { categories } from "./data/categories";
export { subcategories, getSubcategoriesByCategory } from "./data/subcategories";
export { CUISINES_LOCALIZED } from "./data/cuisines";
export { ownerEstablishment } from "./data/establishment";
export { ownerRestaurantDetails } from "./data/details";
export { ownerServices } from "./data/services";
export { OWNER_ESTABLISHMENT_ID } from "./data/owner";
export { demoAuthUsers, categoryRegistrationOptions } from "./data/auth-users";
export type { DemoAuthUser } from "./data/auth-users";

export { sampleTransactions } from "./data/operations/transactions";
export { sampleAppointments } from "./data/operations/appointments";
export {
  sampleClients,
  sampleDuplicates,
  moroccanNames,
  servicesList,
} from "./data/operations/clients";
export {
  samplePendingReviews,
  sampleApprovedReviews,
  sampleRejectedReviews,
  sampleModerationRules,
  sampleReviewPeriodStats,
  sampleEmployeeReviewStats,
} from "./data/operations/reviews";
export {
  defaultAgendas,
  defaultWorkingHours,
  sampleCollaborators,
  sampleOccupancyData,
} from "./data/operations/agendas";
export { samplePhotos } from "./data/operations/photos";
export {
  sampleBookableServices,
  sampleBookableCategories,
} from "./data/operations/legacy-services";
export {
  sampleBookings,
  bookingModeLabels,
  type BookingRecord,
} from "./data/operations/bookings";
export {
  generateSampleNewClients,
  generateSampleServiceCategories,
  enrichAndRankClients,
  generateSampleRankedClients,
  generateSampleCancelledAppointments,
} from "./data/operations/generators";

import { cities } from "./data/cities";
import { ownerEstablishment } from "./data/establishment";
import { ownerRestaurantDetails } from "./data/details";
import { ownerServices } from "./data/services";
import { categories } from "./data/categories";
import { getSubcategoriesByCategory } from "./data/subcategories";
import type { EstablishmentCategory } from "./reserva-types";

export function getOwnerCity() {
  return cities.find((c) => c.id === ownerEstablishment.city_id);
}

export function getOwnerCategory() {
  return categories.find((c) => c.key === ownerEstablishment.category);
}

export function getOwnerSubcategoryOptions() {
  return getSubcategoriesByCategory(ownerEstablishment.category);
}

export function getOwnerCuisineOptions() {
  return ownerRestaurantDetails.cuisine_type;
}

export function getActiveOwnerServices() {
  return ownerServices.filter((s) => s.status === "active");
}

export function getCategoryLabel(category: EstablishmentCategory) {
  return categories.find((c) => c.key === category)?.label ?? category;
}
