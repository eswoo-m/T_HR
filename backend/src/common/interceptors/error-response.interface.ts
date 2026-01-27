export interface ErrorResponse {
  success: false;
  statusCode: number;
  errorCode: string; // 예: 'USER_NOT_FOUND'
  message: string;
  timestamp: string;
  path: string;
}
