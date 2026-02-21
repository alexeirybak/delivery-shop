export const formatTimeSlot = (
  timeSlot: string
): { mobileLabel: string; desktopLabel: string } => {
  const [start, end] = timeSlot.split("-");

  const mobileStart = start
    .replace(/^0(\d):00$/, "$1")
    .replace(/^(\d+):00$/, "$1");
  const mobileEnd = end.replace(/^0(\d):00$/, "$1").replace(/^(\d+):00$/, "$1");
  const mobileLabel = `${mobileStart}-${mobileEnd}`;

  const desktopStart = start.replace(":", ".");
  const desktopEnd = end.replace(":", ".");
  const desktopLabel = `${desktopStart} - ${desktopEnd}`;

  return { mobileLabel, desktopLabel };
};
