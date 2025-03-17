/**
 * Normalized response for various service responses.
 */
interface ServiceResponse {
  type: 'success' | 'warn' | 'error',
  message: string,
}