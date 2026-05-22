import type { Photo } from "../../types";

const now = new Date();
const daysAgo = (days: number) => {
  const date = new Date(now);
  date.setDate(now.getDate() - days);
  return date;
};

export const samplePhotos: Photo[] = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80",
    title: "Garden terrace",
    status: "approved",
    date: daysAgo(12),
    category: "Establishment",
    tags: ["garden", "terrace", "dining"],
    size: "428 KB",
    dimensions: "1200 x 800",
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80",
    title: "Indoor dining room",
    status: "approved",
    date: daysAgo(18),
    category: "Establishment",
    tags: ["indoor", "ambiance"],
    size: "512 KB",
    dimensions: "1600 x 1067",
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80",
    title: "Private garden corner",
    status: "pending",
    date: daysAgo(4),
    category: "Experience",
    tags: ["private", "events"],
    size: "474 KB",
    dimensions: "1400 x 933",
  },
];
