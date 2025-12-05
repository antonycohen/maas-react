import React, { ReactNode, useState } from "react";
import dayjs from "dayjs";
import { IntlProvider, MessageFormatElement } from "react-intl";

import messages_fr from "../translations/fr.json";

export const messages: {
  [key: string]:
    | Record<string, MessageFormatElement[]>
    | Record<string, string>;
} = {
  fr: messages_fr,
  en: messages_fr,
};

export interface TranslationProviderProps {
  children: ReactNode;
}

export const ContextIntl = React.createContext({
  locale: "fr",
  selectLanguage: (_: string) => {
    // do nothing
  }
});

export function TranslationProvider(props: TranslationProviderProps) {
  const defaultLocale = "fr";

  const [locale, setLocale] = useState(defaultLocale);
  const [tradMessages, setTradMessages] = useState(messages[defaultLocale]);

  const selectLanguage = (lang: string) => {
    setLocale(lang);
    setTradMessages(messages[lang]);
    dayjs.locale(lang);
  };

  return (
    <ContextIntl.Provider value={{ locale, selectLanguage }}>
      <IntlProvider
        locale={defaultLocale}
        defaultLocale={defaultLocale}
        messages={tradMessages}
      >
        {props.children}
      </IntlProvider>
    </ContextIntl.Provider>
  );
}

export function useSelectedLanguage() {
  return React.useContext(ContextIntl).locale;
}

export default TranslationProvider;
