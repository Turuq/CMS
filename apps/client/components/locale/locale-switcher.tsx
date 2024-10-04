import { useLocale, useTranslations } from "next-intl";
import LocaleSwitcherSelect from "./locale-switcher-select";
import { locales } from "@/utils/locale.config";
import { SelectItem } from "../ui/select";

import { EG, US } from "country-flag-icons/react/3x2";

export default function LocaleSwitcher() {
  const t = useTranslations("LocaleSwitcher");
  const locale = useLocale();

  return (
    <LocaleSwitcherSelect defaultValue={locale} label={t("label")}>
      {locales.map((cur) => (
        <SelectItem
          key={cur}
          value={cur}
          className="hover:bg-dark_border/10 dark:hover:bg-light_border/10"
        >
          <div
            className={`flex ${
              cur === "ar" && "flex-row-reverse"
            } items-center gap-2`}
          >
            {cur === "ar" ? (
              <EG className="size-4" />
            ) : (
              <US className="size-4" />
            )}
            <p>{t("locale", { locale: cur })}</p>
          </div>
        </SelectItem>
      ))}
    </LocaleSwitcherSelect>
  );
}
