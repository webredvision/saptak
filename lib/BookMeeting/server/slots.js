export const SLOT_TIMES = [
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
];

export const buildSlots = (bookedDocs) =>
  SLOT_TIMES.map((time) => ({
    time,
    booked: bookedDocs.some((s) => s.time === time && s.booked),
  }));
