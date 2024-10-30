import { locales } from '@/utils/locale.config';
import { useLocale, useTranslations } from 'next-intl';
import { SelectItem } from '../ui/select';
import LocaleSwitcherSelect from './locale-switcher-select';

export default function LocaleSwitcher() {
  const t = useTranslations('LocaleSwitcher');
  const locale = useLocale();

  return (
    <LocaleSwitcherSelect defaultValue={locale} label={t('label')}>
      {locales.map((cur) => (
        <SelectItem
          key={cur}
          value={cur}
          className="hover:bg-dark_border/10 dark:hover:bg-light_border/10"
        >
          <div
            className={`flex items-center gap-2`}
            dir={cur === 'ar' ? 'rtl' : 'ltr'}
          >
            {/* {cur === "ar" ? (
              <EG className="size-4" />
            ) : (
              <US className="size-4" />
            )} */}
            <p>{t('locale', { locale: cur })}</p>
          </div>
        </SelectItem>
      ))}
    </LocaleSwitcherSelect>
  );
}
