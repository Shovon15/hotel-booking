/** Demo data for the admin pages — replace with API calls later. */

export type BookingStatus = "confirmed" | "pending" | "checked-in" | "checked-out" | "cancelled";

export type Booking = {
  id: string;
  guest: string;
  phone: string;
  room: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  amount: number;
  status: BookingStatus;
  source: "Website" | "WhatsApp" | "Phone" | "Walk-in";
};

export const BOOKINGS: Booking[] = [
  { id: "RS-24816", guest: "Tahmina Rahman", phone: "01711-234567", room: "Lake View Cottage", checkIn: "2026-11-24", checkOut: "2026-11-26", nights: 2, guests: 2, amount: 36000, status: "checked-in", source: "Website" },
  { id: "RS-24815", guest: "Arif Hossain", phone: "01819-552301", room: "Family Villa", checkIn: "2026-11-25", checkOut: "2026-11-28", nights: 3, guests: 5, amount: 66000, status: "confirmed", source: "WhatsApp" },
  { id: "RS-24814", guest: "Nusrat Jahan", phone: "01912-778812", room: "Premium Suite", checkIn: "2026-11-25", checkOut: "2026-11-26", nights: 1, guests: 2, amount: 14500, status: "pending", source: "Website" },
  { id: "RS-24813", guest: "Kamal Uddin", phone: "01556-110934", room: "Deluxe Room", checkIn: "2026-11-23", checkOut: "2026-11-24", nights: 1, guests: 2, amount: 8500, status: "checked-out", source: "Phone" },
  { id: "RS-24812", guest: "Sadia Islam", phone: "01722-904455", room: "Deluxe Room", checkIn: "2026-11-27", checkOut: "2026-11-30", nights: 3, guests: 3, amount: 25500, status: "confirmed", source: "Website" },
  { id: "RS-24811", guest: "Rafiq Ahmed", phone: "01613-338190", room: "Lake View Cottage", checkIn: "2026-11-22", checkOut: "2026-11-24", nights: 2, guests: 2, amount: 36000, status: "checked-out", source: "Walk-in" },
  { id: "RS-24810", guest: "Farzana Akter", phone: "01988-120076", room: "Premium Suite", checkIn: "2026-11-28", checkOut: "2026-12-01", nights: 3, guests: 2, amount: 43500, status: "cancelled", source: "WhatsApp" },
  { id: "RS-24809", guest: "Mehedi Hasan", phone: "01744-650218", room: "Family Villa", checkIn: "2026-12-02", checkOut: "2026-12-05", nights: 3, guests: 4, amount: 66000, status: "confirmed", source: "Website" },
  { id: "RS-24808", guest: "Shirin Sultana", phone: "01833-417762", room: "Deluxe Room", checkIn: "2026-11-24", checkOut: "2026-11-25", nights: 1, guests: 1, amount: 8500, status: "checked-in", source: "Phone" },
  { id: "RS-24807", guest: "Imran Chowdhury", phone: "01511-982040", room: "Premium Suite", checkIn: "2026-12-04", checkOut: "2026-12-06", nights: 2, guests: 2, amount: 29000, status: "pending", source: "WhatsApp" },
];

/** Monthly revenue in BDT, last 12 months. */
export const REVENUE_BY_MONTH = [
  { month: "Dec", value: 1840000 },
  { month: "Jan", value: 2120000 },
  { month: "Feb", value: 1960000 },
  { month: "Mar", value: 1480000 },
  { month: "Apr", value: 1320000 },
  { month: "May", value: 1150000 },
  { month: "Jun", value: 980000 },
  { month: "Jul", value: 1060000 },
  { month: "Aug", value: 1240000 },
  { month: "Sep", value: 1410000 },
  { month: "Oct", value: 1780000 },
  { month: "Nov", value: 2050000 },
];

export type RoomStatus = "available" | "occupied" | "cleaning" | "maintenance";

export const ROOM_UNITS: {
  number: string;
  type: string;
  status: RoomStatus;
  floor: string;
  rate: number;
  guest?: string;
}[] = [
  { number: "101", type: "Deluxe Room", status: "occupied", floor: "Garden wing", rate: 8500, guest: "Shirin Sultana" },
  { number: "102", type: "Deluxe Room", status: "available", floor: "Garden wing", rate: 8500 },
  { number: "103", type: "Deluxe Room", status: "cleaning", floor: "Garden wing", rate: 8500 },
  { number: "201", type: "Premium Suite", status: "available", floor: "Pool wing", rate: 14500 },
  { number: "202", type: "Premium Suite", status: "maintenance", floor: "Pool wing", rate: 14500 },
  { number: "V1", type: "Family Villa", status: "available", floor: "Villa row", rate: 22000 },
  { number: "V2", type: "Family Villa", status: "occupied", floor: "Villa row", rate: 22000, guest: "Arif Hossain" },
  { number: "C1", type: "Lake View Cottage", status: "occupied", floor: "Lakeside", rate: 18000, guest: "Tahmina Rahman" },
  { number: "C2", type: "Lake View Cottage", status: "available", floor: "Lakeside", rate: 18000 },
];

/** Occupancy % by room type, this month. */
export const OCCUPANCY_BY_TYPE = [
  { type: "Lake View Cottage", value: 92 },
  { type: "Family Villa", value: 81 },
  { type: "Premium Suite", value: 74 },
  { type: "Deluxe Room", value: 68 },
];

export const GUESTS = [
  { name: "Tahmina Rahman", email: "tahmina@example.com", phone: "01711-234567", stays: 6, spent: 182000, lastStay: "2026-11-24", vip: true },
  { name: "Arif Hossain", email: "arif.h@example.com", phone: "01819-552301", stays: 3, spent: 148000, lastStay: "2026-11-25", vip: true },
  { name: "Nusrat Jahan", email: "nusrat.j@example.com", phone: "01912-778812", stays: 1, spent: 14500, lastStay: "2026-11-25", vip: false },
  { name: "Kamal Uddin", email: "kamal.u@example.com", phone: "01556-110934", stays: 2, spent: 17000, lastStay: "2026-11-23", vip: false },
  { name: "Sadia Islam", email: "sadia.i@example.com", phone: "01722-904455", stays: 4, spent: 96500, lastStay: "2026-11-27", vip: false },
  { name: "Rafiq Ahmed", email: "rafiq.a@example.com", phone: "01613-338190", stays: 5, spent: 121000, lastStay: "2026-11-22", vip: true },
  { name: "Mehedi Hasan", email: "mehedi.h@example.com", phone: "01744-650218", stays: 2, spent: 88000, lastStay: "2026-12-02", vip: false },
];

export const OFFERS = [
  { id: "weekend", title: "Weekend Escape", code: "WEEKEND15", discount: "15% off", validTill: "2026-12-31", redemptions: 48, active: true },
  { id: "honeymoon", title: "Honeymoon Package", code: "LOVE2026", discount: "৳5,000 off", validTill: "2027-02-14", redemptions: 21, active: true },
  { id: "family", title: "Family Fun Days", code: "KIDSFREE", discount: "Kids free", validTill: "2026-12-20", redemptions: 35, active: true },
  { id: "monsoon", title: "Monsoon Retreat", code: "RAIN25", discount: "25% off", validTill: "2026-09-30", redemptions: 64, active: false },
];

export const REVIEWS = [
  { id: 1, guest: "Tahmina Rahman", rating: 5, date: "2026-11-20", room: "Lake View Cottage", text: "Waking up to mist over the lake was magical. Staff remembered our names from the last visit!", replied: false },
  { id: 2, guest: "Rafiq Ahmed", rating: 4, date: "2026-11-18", room: "Lake View Cottage", text: "Beautiful property and great food. The Wi-Fi in the cottage was a bit slow.", replied: true },
  { id: 3, guest: "Sadia Islam", rating: 5, date: "2026-11-12", room: "Deluxe Room", text: "Spotless rooms, lovely pool and the kids loved the tea garden walk.", replied: false },
  { id: 4, guest: "Kamal Uddin", rating: 3, date: "2026-11-08", room: "Deluxe Room", text: "Good stay overall but check-in took almost 40 minutes on a Friday.", replied: false },
];
