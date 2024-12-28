export const getStartAndEndOfWeek = (dateString: string): { startOfWeek: string; endOfWeek: string } => {
  const date = new Date(dateString);
  
  const currentDay = date.getDay();

  const startOffset = (currentDay === 0 ? -6 : 1) - currentDay;
  const endOffset = startOffset + 6;

  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() + startOffset);
  
  const endOfWeek = new Date(date);
  endOfWeek.setDate(date.getDate() + endOffset);
  
  return {
    startOfWeek: startOfWeek.toISOString().split('T')[0],
    endOfWeek: endOfWeek.toISOString().split('T')[0],
  };
};
