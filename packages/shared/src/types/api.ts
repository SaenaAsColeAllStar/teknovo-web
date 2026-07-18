export type ApiOk<T> = {
  ok: true;
  data: T;
};

export type ApiErr = {
  ok: false;
  error: {
    code: string;
    message: string;
  };
};

export type ApiListResponse<T> = ApiOk<T[]> & {
  meta: {
    page: number;
    limit: number;
    total: number;
  };
};

export type ApiResponse<T> = ApiOk<T> | ApiErr;
