import type { EmployeeAgenda, WorkingHours } from "../../types";

export const defaultWorkingHours: WorkingHours[] = [
  { day: "Monday", isWorking: true, startTime: "12:00", endTime: "23:00", breaks: [{ start: "15:00", end: "16:00" }] },
  { day: "Tuesday", isWorking: true, startTime: "12:00", endTime: "23:00", breaks: [{ start: "15:00", end: "16:00" }] },
  { day: "Wednesday", isWorking: true, startTime: "12:00", endTime: "23:00", breaks: [{ start: "15:00", end: "16:00" }] },
  { day: "Thursday", isWorking: true, startTime: "12:00", endTime: "23:00", breaks: [{ start: "15:00", end: "16:00" }] },
  { day: "Friday", isWorking: true, startTime: "12:00", endTime: "23:30", breaks: [{ start: "15:00", end: "16:00" }] },
  { day: "Saturday", isWorking: true, startTime: "12:00", endTime: "23:30", breaks: [] },
  { day: "Sunday", isWorking: true, startTime: "12:00", endTime: "22:00", breaks: [] },
];

export const defaultAgendas: EmployeeAgenda[] = [
  {
    id: 1,
    name: "Garden floor",
    email: "garden@lejardin.ma",
    color: "#10B981",
    role: "Terrace & garden",
    workingHours: defaultWorkingHours,
    timeSlotDuration: 30,
    bufferTime: 10,
    maxAppointmentsPerDay: 40,
    allowOnlineBooking: true,
    services: ["Table Reservation", "Private Garden Dining"],
    status: "active",
  },
  {
    id: 2,
    name: "Indoor dining",
    email: "indoor@lejardin.ma",
    color: "#FFC900",
    role: "Indoor service",
    workingHours: defaultWorkingHours,
    timeSlotDuration: 30,
    bufferTime: 10,
    maxAppointmentsPerDay: 35,
    allowOnlineBooking: true,
    services: ["Table Reservation"],
    status: "active",
  },
  {
    id: 3,
    name: "Chef's table",
    email: "chef@lejardin.ma",
    color: "#8B5CF6",
    role: "Tasting experiences",
    workingHours: defaultWorkingHours,
    timeSlotDuration: 60,
    bufferTime: 30,
    maxAppointmentsPerDay: 4,
    allowOnlineBooking: true,
    services: ["Chef's Table Experience", "Private Garden Dining"],
    status: "active",
  },
];

export const sampleCollaborators = [
  { id: 1, name: "Garden floor", color: "#10B981", totalServices: 320, inSalon: 126, online: 194, onlineRate: 61, revenue: 148600, occupationRate: 82, workedHours: 214 },
  { id: 2, name: "Indoor dining", color: "#FFC900", totalServices: 280, inSalon: 98, online: 182, onlineRate: 65, revenue: 112400, occupationRate: 76, workedHours: 198 },
  { id: 3, name: "Chef's table", color: "#8B5CF6", totalServices: 42, inSalon: 8, online: 34, onlineRate: 81, revenue: 98400, occupationRate: 88, workedHours: 96 },
];

export const sampleOccupancyData = {
  LUN: { "12:00 - 13:00": 45, "13:00 - 14:00": 62, "19:00 - 20:00": 88, "20:00 - 21:00": 92, "21:00 - 22:00": 85 },
  MAR: { "12:00 - 13:00": 40, "13:00 - 14:00": 55, "19:00 - 20:00": 82, "20:00 - 21:00": 86, "21:00 - 22:00": 80 },
  MER: { "12:00 - 13:00": 48, "13:00 - 14:00": 68, "19:00 - 20:00": 90, "20:00 - 21:00": 94, "21:00 - 22:00": 88 },
  JEU: { "12:00 - 13:00": 52, "13:00 - 14:00": 70, "19:00 - 20:00": 91, "20:00 - 21:00": 96, "21:00 - 22:00": 90 },
  VEN: { "12:00 - 13:00": 58, "13:00 - 14:00": 75, "19:00 - 20:00": 95, "20:00 - 21:00": 98, "21:00 - 22:00": 94 },
  SAM: { "12:00 - 13:00": 72, "13:00 - 14:00": 85, "19:00 - 20:00": 97, "20:00 - 21:00": 99, "21:00 - 22:00": 96 },
  DIM: { "12:00 - 13:00": 55, "13:00 - 14:00": 68, "19:00 - 20:00": 84, "20:00 - 21:00": 88, "21:00 - 22:00": 82 },
};
