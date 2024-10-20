import type { Method } from "./Method";

export type RequestOptions = {
  method: (typeof Method)[keyof typeof Method];
  headers: {
    "Content-Type": "application/json";
    authorization?: string;
  };
  body?: string;
};

export type Payload = {
  endpoint: string;
  method: (typeof Method)[keyof typeof Method];
  body?: Record<string, unknown>;
  query?: Record<string, unknown>;
};

export type LightweightPayload = {
  body?: Record<string, unknown>;
  query?: Record<string, unknown>;
};

type SuccessResponse<T> = {
  data: T;
  error: null;
};

type ErrorResponse = {
  data: null;
  error: any;
};

export type Response<T> = SuccessResponse<T> | ErrorResponse;
