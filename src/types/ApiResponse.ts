export interface ErrorResponse {
  "timestamp": string, // 2025-05-05T17:15:24.7475043
  "status": number,
  "error": string,
  "message": string,
  "path": string,
  "fieldErrors"?: {
    "email"?: string,
    "username"?: string,
    "password"?: string,
  },
}


/**
 * How every response of the Api looks like (except auth!)
 */
export type ApiResponse<T> =
  | { success: true; data: T; message: string }
  | { success: false; data: undefined; message: string };