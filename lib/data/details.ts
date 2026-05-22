import type { RestaurantDetails } from "../reserva-types";
import { OWNER_ESTABLISHMENT_ID } from "./owner";

const STANDARD_HOURS: RestaurantDetails["opening_hours"] = {
  mon: { open: "12:00", close: "23:00" },
  tue: { open: "12:00", close: "23:00" },
  wed: { open: "12:00", close: "23:00" },
  thu: { open: "12:00", close: "23:00" },
  fri: { open: "12:00", close: "23:30" },
  sat: { open: "12:00", close: "23:30" },
  sun: { open: "12:00", close: "22:00" },
};

export const ownerRestaurantDetails: RestaurantDetails = {
  establishment_id: OWNER_ESTABLISHMENT_ID,
  cuisine_type: ["moroccan", "mediterranean"],
  opening_hours: STANDARD_HOURS,
  dress_code: "smart_casual",
  seating_options: ["indoor", "garden", "terrace"],
  total_seats: 80,
  average_meal_duration: 90,
  accepts_walkins: true,
  alcohol_served: false,
  dietary_options: ["halal", "vegetarian", "vegan"],
  menu_url: "https://lejardin-marrakech.com/menu",
  cancellation_policy: "Free cancellation up to 2 hours before reservation.",
};
