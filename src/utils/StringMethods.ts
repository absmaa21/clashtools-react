export function snakeToHumanReadable(input: string): string {
  return input
    .toLowerCase()                     // "this_is_a_test"
    .split('_')                        // ["this", "is", "a", "test"]
    .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // capitalize each
    .join(' ');                        // "This Is A Test"
}


export function secondsToString(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);

  return parts.join(' ');
}


export function millisToString(totalMillis: number): string {
  return secondsToString(totalMillis / 1000)
}