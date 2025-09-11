export const formatDate = (time?: string, date?: string) => {
  const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
  const baseDate = date || today;
  const baseTime = time || "00:00:00"; // si no hay hora, asumimos medianoche UTC

  // Creamos fecha como UTC
  const utcDate = new Date(`${baseDate}T${baseTime}Z`);

  if (isNaN(utcDate.getTime())) return ""; // 🚨 evita NaN

  // Restamos 3 horas para Argentina
  utcDate.setHours(utcDate.getHours() - 3);

  // Formateamos a DD/MM/YYYY
  const day = String(utcDate.getUTCDate()).padStart(2, "0");
  const month = String(utcDate.getUTCMonth() + 1).padStart(2, "0");
  const year = utcDate.getUTCFullYear();

  return `${day}/${month}/${year}`;
};



export const formatTime = (time: string, date?: string) => {
  const today = new Date().toISOString().split("T")[0];
  const baseDate = date || today;

  // Si ya viene con segundos, usamos tal cual; si no, agregamos ":00"
  const normalizedTime = time.length === 5 ? `${time}:00` : time;

  // Creamos la fecha como UTC
  const utcDate = new Date(`${baseDate}T${normalizedTime}Z`);

  if (isNaN(utcDate.getTime())) return "";

  // Restamos 3 horas (UTC-3)
  utcDate.setHours(utcDate.getHours() - 3);

  // Formateamos en HH:mm
  const hours = String(utcDate.getUTCHours()).padStart(2, "0");
  const minutes = String(utcDate.getUTCMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
};
