export type ApiCollectionResponse<T> = {
    data: T[];
    pagination: {
        count: number;
        offset: number;
        limit: number;
    };
};

export type GetQueryByIdParams<T, Q = undefined> = {
    fields?: FieldQuery<T>;
    id: string;
    staticParams?: Q;
};

export type GetQueryBySlugParams<T> = {
    fields?: FieldQuery<T>;
    slug: string;
};

export type QueryParams = {
    [key: string]: string | number | boolean | unknown | Array<string | number | boolean | unknown>;
};

export type GetCollectionQueryParams<T, Q = undefined> = {
    fields?: FieldQuery<T>;
    offset: number;
    limit: number;
    filters?: QueryParams;
    staticParams?: Q;
    sort?: {
        field: keyof T;
        direction: 'asc' | 'desc';
    };
};

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
