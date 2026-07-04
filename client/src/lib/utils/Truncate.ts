export function truncate(message: string, maxLength: number): string {
  if (message.length <= maxLength) return message;
  return `${message.slice(0, maxLength).trimEnd()}…`;
}