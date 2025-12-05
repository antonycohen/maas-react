import { ReactNode } from "react";
import { PrimitiveType, useIntl } from "react-intl";

export type TFunction = (
  id: string,
  options?: Record<string, PrimitiveType | any>,
) => string;

export type TFunctionNode = (
  id: string,
  options?: Record<string, PrimitiveType | any>,
) => ReactNode;

export function useTranslation() {
  const intl = useIntl();

  const t: TFunction = (
    id: string,
    options?: Record<string, PrimitiveType | any>,
  ) => {
    return intl.formatMessage({ id }, options) as string;
  };

  const tNode: TFunctionNode = (
    id: string,
    options?: Record<string, PrimitiveType | any>,
  ) => {
    return intl.formatMessage(
      { id },
      {
        b: (chunks: any) => <strong>{chunks}</strong>,
        br: <br />,
        "ul-decimal": (chunks: any) => (
          <ul className="list-decimal ps-4">{chunks}</ul>
        ),
        li: (chunks: any) => <li>{chunks}</li>,
        ...options,
      },
    );
  };

  const isKeyExist = (id?: string): boolean => {
    return !!(id && intl.messages[id]);
  };

  return { t, tNode, isKeyExist, intl };
}
