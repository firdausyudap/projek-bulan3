export interface ApiResponse<T> {
  status: 'success' | 'error';
  message: string;
  data: T | null;
  code?: number;
}

export class ResponseHelper {
  static success<T>(data: T, message = 'Success', code = 200): ApiResponse<T> {
    return {
      status: 'success',
      message,
      data,
      code,
    };
  }

  static error(message = 'Error', code = 400): ApiResponse<null> {
    return {
      status: 'error',
      message,
      data: null,
      code,
    };
  }
}
