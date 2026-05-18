export interface ApiResponse<T = unknown> {
  messageCode: string;
  message: string;
  httpCode: number;
  data?: T;
}

export const apiResponse = {
  generate({messageCode, message, httpCode, data}: { messageCode: string; message: string; httpCode: number; data?: unknown }): ApiResponse {
    return { messageCode, message, httpCode, data };
  },
};