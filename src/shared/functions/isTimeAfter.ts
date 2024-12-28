export const isTimeAfter = (time1: string, time2: string): boolean => {
  const [hours1, minutes1] = time1.split(':').map(Number);
  const [hours2, minutes2] = time2.split(':').map(Number);

  const time1InMinutes = hours1 * 60 + minutes1;
  const time2InMinutes = hours2 * 60 + minutes2;

  return time2InMinutes > time1InMinutes;
};
