export type ExceptionResponse<T = any> = {
  statusCode: number;
  message: T;
  error?: string;
};

export type Constraint = {
  [key: string]: string[];
};
