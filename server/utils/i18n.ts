import type { H3Event } from "h3";
import pt from "../../i18n/locales/pt.json";
import en from "../../i18n/locales/en.json";

type Messages = Record<string, unknown>;

const dictionaries: Record<string, Messages> = { pt, en };

export const getServerLocale = (event: H3Event): "pt" | "en" => {
  const cookie = getCookie(event, "i18n_redirected");
  if (cookie === "pt" || cookie === "en") return cookie;
  const header = getRequestHeader(event, "accept-language") || "";
  return header.toLowerCase().startsWith("en") ? "en" : "pt";
};

const lookup = (messages: Messages, key: string): string | undefined => {
  const value = key
    .split(".")
    .reduce<unknown>((acc, part) => (acc as Messages | undefined)?.[part], messages);
  return typeof value === "string" ? value : undefined;
};

export const serverT = (
  event: H3Event,
  key: string,
  params: Record<string, string | number> = {},
): string => {
  const locale = getServerLocale(event);
  const template = lookup(dictionaries[locale]!, key) ?? lookup(pt, key) ?? key;
  return template.replace(/\{(\w+)\}/g, (_, name: string) =>
    String(params[name] ?? `{${name}}`),
  );
};
