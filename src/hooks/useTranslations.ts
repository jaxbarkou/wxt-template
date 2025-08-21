import en from "@/assets/i18n/en.json";
import zh from "@/assets/i18n/zh.json";
import { env } from "@/env";

type Values = Record<string, string | number> | undefined;

function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

function detectLocale(): "en" | "zh" {
  const cookieLocale = getCookie("NEXT_LOCALE");
  const defaultLocale = env.LANGUAGE || "en";
  if (cookieLocale || defaultLocale) {
    const lowered = cookieLocale?.toLowerCase() || defaultLocale.toLowerCase();
    if (lowered.startsWith("zh")) return "zh";
    return "en";
  }
  if (typeof navigator !== "undefined") {
    const nav = (navigator.language || "en").toLowerCase();
    console.log("nav", nav);
    if (nav.startsWith("zh")) return "zh";
  }
  return "en";
}

function getByPath(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

function interpolate(template: string, values: Values): string {
  if (!values) return template;
  return template.replace(/\{(.*?)\}/g, (_, key: string) => {
    const v = values[key.trim()];
    return v === undefined || v === null ? `{${key}}` : String(v);
  });
}

export function useTranslations(namespace?: string) {
  const locale = detectLocale();
  const dict = locale === "zh" ? (zh as unknown) : (en as unknown);
  const fallback = en as unknown;

  const translate = (key: string, values?: Values): any => {
    const fullKey = namespace ? `${namespace}.${key}` : key;
    let result = getByPath(dict, fullKey);
    if (result === undefined) {
      result = getByPath(fallback, fullKey);
    }

    if (typeof result === "string") {
      return interpolate(result, values);
    }
    return result ?? key;
  };

  return translate;
}

export default useTranslations;


