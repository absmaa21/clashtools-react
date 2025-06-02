export function snakeToHumanReadable(input: string): string {
  return input
    .toLowerCase()                     // "this_is_a_test"
    .split('_')                        // ["this", "is", "a", "test"]
    .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // capitalize each
    .join(' ');                        // "This Is A Test"
}