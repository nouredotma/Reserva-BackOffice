import type {
  CancelledAppointment,
  ClientRanking,
  NewClient,
  ServiceCategory,
} from "../../types";
import { moroccanNames, sampleClients, servicesList } from "./clients";
import { defaultAgendas } from "./agendas";

const now = new Date();

const daysAgo = (days: number, hour = 10, minute = 0) => {
  const date = new Date(now);
  date.setDate(now.getDate() - days);
  date.setHours(hour, minute, 0, 0);
  return date;
};

export function generateSampleNewClients(length: number = 50): NewClient[] {
  return Array.from({ length }, (_, i) => {
    const name = `${moroccanNames[i % moroccanNames.length]} ${["Alaoui", "Alami", "Tazi", "Benali", "Bennis"][i % 5]}`;
    const visits = (i % 6) + 1;
    const firstVisit = daysAgo((i % 28) + 1, 12, 0);
    const lastVisit = visits > 1 ? daysAgo(i % 12, 18, 0) : undefined;
    return {
      id: i + 1,
      name,
      email: `${name.toLowerCase().replace(/\s+/g, ".")}@email.com`,
      phone: `+212 6 ${String(10000000 + i * 73921).slice(0, 8)}`,
      joinedDate: firstVisit,
      visits,
      totalSpent: 350 + visits * 420 + (i % 4) * 180,
      rating: 4 + (i % 10) / 10,
      growth: (i % 9) + 2,
      firstVisit,
      lastVisit,
    };
  });
}

export function generateSampleServiceCategories(): ServiceCategory[] {
  return servicesList.map((name, i) => {
    const totalVisits = 80 + i * 34;
    const malePercentage = [48, 52, 44][i] ?? 50;
    const femalePercentage = 100 - malePercentage;
    return {
      id: i + 1,
      name,
      totalVisits,
      maleVisits: Math.round(totalVisits * (malePercentage / 100)),
      femaleVisits: Math.round(totalVisits * (femalePercentage / 100)),
      malePercentage,
      femalePercentage,
      avgDuration: [90, 120, 150][i] ?? 90,
      revenue: 32000 + i * 18500,
      growth: [12, 8, 19][i] ?? 8,
    };
  });
}

export function enrichAndRankClients(parsedClients: unknown[]): ClientRanking[] {
  return (parsedClients as Record<string, unknown>[])
    .map((client, index) => {
      const totalVisits = Number(client.totalVisits ?? client.visits ?? (index % 8) + 1);
      const totalSpent = Number(client.totalSpent ?? totalVisits * (420 + (index % 5) * 160));
      const averageRating = Number(client.averageRating ?? client.rating ?? 4 + (index % 8) / 10);
      const loyaltyScore = Math.min(
        100,
        Math.round(totalVisits * 7 + averageRating * 10 + totalSpent / 500),
      );
      return {
        id: Number(client.id ?? index + 1),
        name: (client.name as string) ?? `Client ${index + 1}`,
        email: (client.email as string) ?? `client${index + 1}@email.com`,
        phone: (client.phone as string) ?? `+212 6 ${String(20000000 + index * 54321).slice(0, 8)}`,
        status: (client.status as string) ?? "Active",
        address: client.address as string | undefined,
        totalSpent,
        totalVisits,
        averageRating,
        lastVisit: client.lastVisit ? new Date(client.lastVisit as string) : undefined,
        lifetimeValue: totalSpent + totalVisits * 180,
        favoriteService: servicesList[index % servicesList.length],
        rank: 0,
        growth: (index % 12) + 1,
        loyaltyScore,
      };
    })
    .sort((a, b) => b.loyaltyScore - a.loyaltyScore)
    .map((client, index) => ({ ...client, rank: index + 1 }));
}

export function generateSampleRankedClients(length: number = 100): ClientRanking[] {
  const generatedClients = Array.from({ length }, (_, i) => {
    const name = `${moroccanNames[i % moroccanNames.length]} ${["Alaoui", "Alami", "Tazi", "Benali", "Bennis"][i % 5]}`;
    const totalVisits = 3 + (i % 22);
    const totalSpent = 900 + totalVisits * (280 + (i % 6) * 90);
    const averageRating = 4 + (i % 10) / 10;
    return {
      id: i + 1,
      name,
      email: `${name.toLowerCase().replace(/\s+/g, ".")}@email.com`,
      phone: `+212 6 ${String(30000000 + i * 61813).slice(0, 8)}`,
      status: "Active",
      totalSpent,
      totalVisits,
      averageRating,
      lastVisit: daysAgo(i % 45, 18, 0),
      lifetimeValue: totalSpent + totalVisits * 240,
      favoriteService: servicesList[i % servicesList.length],
      rank: i + 1,
      growth: (i % 15) + 1,
      loyaltyScore: Math.min(
        100,
        Math.round(totalVisits * 4 + averageRating * 9 + totalSpent / 900),
      ),
    };
  });

  return generatedClients
    .sort((a, b) => b.loyaltyScore - a.loyaltyScore)
    .map((client, index) => ({ ...client, rank: index + 1 }));
}

export function generateSampleCancelledAppointments(length: number = 10): CancelledAppointment[] {
  const resources = defaultAgendas.map((agenda) => agenda.name);
  const clients = sampleClients.map((client) => client.name);
  const formatDate = (date: Date) => date.toLocaleDateString("en-US");
  const formatTime = (date: Date) =>
    date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  return Array.from({ length }, (_, i) => {
    const appointmentDate = daysAgo((i % 18) + 1, 10 + (i % 10), i % 2 === 0 ? 0 : 30);
    const creationDate = daysAgo((i % 18) + 5, 9, 15);
    const cancellationDate = daysAgo(i % 7, 11, 20);
    return {
      id: i + 1,
      collaborator: resources[i % resources.length],
      date: formatDate(appointmentDate),
      client: clients[i % clients.length],
      takenOnline: i % 3 !== 0,
      creationDate: formatDate(creationDate),
      creationTime: formatTime(creationDate),
      cancellationDate: formatDate(cancellationDate),
      cancellationTime: formatTime(cancellationDate),
      cancelledByClient: i % 2 === 0,
    };
  });
}
