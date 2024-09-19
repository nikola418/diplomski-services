export interface ExceptionResponse<T = any> {
  statusCode: number;
  message: T;
  error?: string;
}

export interface Constraint {
  [key: string]: string[];
}
