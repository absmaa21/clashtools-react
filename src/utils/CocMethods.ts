
export function secondsToGems(seconds: number): number {
  if (seconds <= 0) return 0
  if (seconds <= 60) return 1
  if (seconds <= 3_600) return (20 - 1) / (3600 - 60) * (seconds - 60) + 1
  if (seconds <= 86_400) return (260 - 20) / (86400 - 3600) * (seconds - 3600) + 20
  return (1000 - 260) / (604800 - 86400) * (seconds - 86400) + 260
}


export function gemsToSeconds(gems: number): number {
  if (gems <= 0) return 0
  if (gems <= 1) return 60
  if (gems <= 20) return (gems - 1) * (3600 - 60) / (20 - 1) + 60;
  if (gems <= 260) return (gems - 20) * (86400 - 3600) / (260 - 20) + 3600;
  return (gems - 260) * (604800 - 86400) / (1000 - 260) + 86400;
}