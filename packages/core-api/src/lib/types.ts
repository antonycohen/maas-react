export type ApiCollectionResponse<T> = {
  data: T[];
  pagination: {
    count: number;
    offset: number;
    limit: number;
  }
};

export type GetQueryByIdParams<T> = {
  fields?: FieldQuery<T>;
  id: string;
}

export type QueryParams = {
  [key: string]: string | number | boolean | unknown | Array<string | number | boolean | unknown>;
}

export type GetCollectionQueryParams<T> = {
  fields?: FieldQuery<T>;
  offset: number;
  limit: number;
  filters?: QueryParams;
}

type FieldQueryValue<T> = T extends (infer U)[]
  ? {
      fields: FieldQuery<U>;
      offset?: number;
      limit?: number;
    }
  : T extends object
  ? {
      fields: FieldQuery<T>;
    }
  : null;

export type FieldQuery<T> = {
  [K in keyof T]?: FieldQueryValue<T[K]>;
};
