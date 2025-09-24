/**
 * Formatea una fecha opcional y hora opcional a formato DD/MM/YYYY.
 * Ajusta la fecha restando 3 horas (UTC-3).
 *
 * @param {string} [time] - Hora opcional en formato "HH:mm:ss" o "HH:mm".
 * @param {string} [date] - Fecha opcional en formato "YYYY-MM-DD".
 * @returns {string} La fecha formateada como "DD/MM/YYYY", o "" si la fecha no es válida.
 */
export const formatDate = (time?: string, date?: string) => {
  const today = new Date().toISOString().split("T")[0];
  const baseDate = date || today;
  const baseTime = time || "00:00:00";

  const utcDate = new Date(`${baseDate}T${baseTime}Z`);

  if (isNaN(utcDate.getTime())) return "";

  utcDate.setHours(utcDate.getHours() - 3);

  const day = String(utcDate.getUTCDate()).padStart(2, "0");
  const month = String(utcDate.getUTCMonth() + 1).padStart(2, "0");
  const year = utcDate.getUTCFullYear();

  return `${day}/${month}/${year}`;
};



export const formatTime = (time: string, date?: string) => {
  const today = new Date().toISOString().split("T")[0];
  const baseDate = date || today;

  const normalizedTime = time?.length === 5 ? `${time}:00` : time;

  const utcDate = new Date(`${baseDate}T${normalizedTime}Z`);

  if (isNaN(utcDate.getTime())) return "";

  utcDate.setHours(utcDate.getHours() - 3);

  const hours = String(utcDate.getUTCHours()).padStart(2, "0");
  const minutes = String(utcDate.getUTCMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
};
