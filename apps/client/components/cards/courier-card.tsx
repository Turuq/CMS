/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from 'next/link';
import { icons } from '../icons/icons';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Courier, CourierWithStatistics } from '@/api/validation/courier';

interface ICourierCardProps {
  courier: Courier | CourierWithStatistics;
  href?: string;
  locale: string;
  children?: JSX.Element;
  hrefOptions?: {
    icon?: JSX.Element;
    tooltip?: string;
    label?: string;
  };
}

export default function CourierCard({
  courier,
  href,
  locale,
  children,
  hrefOptions,
}: ICourierCardProps) {
  return (
    <Card className="w-full rounded-xl h-fit flex flex-col gap-0">
      <CardHeader>
        <CardTitle
          className={`flex ${locale === 'ar' && 'flex-row-reverse'} items-center justify-between gap-5`}
        >
          <div className="flex flex-col gap-1">
            <p className="text-lg font-bold capitalize">{courier.name}</p>
            <p className="text-sm font-semibold text-dark/50 dark:text-light/50">
              {courier.username}
            </p>
          </div>
          {href && (
            <Link
              href={href}
              className="text-sm bg-muted cursor-pointer text-dark dark:text-light hover:text-accent rounded-xl p-2 flex items-center justify-center gap-2 relative group"
            >
              {locale === 'ar' ? (
                <div className="transform scale-x-[-1]">
                  {href && hrefOptions && hrefOptions.icon
                    ? hrefOptions.icon
                    : icons.externalLink}
                </div>
              ) : href && hrefOptions && hrefOptions.icon ? (
                hrefOptions.icon
              ) : (
                icons.externalLink
              )}
              <span>{hrefOptions?.label ?? 'Assign'}</span>
              <span className="absolute bottom-0 flex-col hidden mb-12 group-hover:flex items-center">
                <span className="relative z-30 p-2 text-xs leading-none whitespace-nowrap text-white bg-accent rounded-md">
                  {/* {locale === 'en' ? 'Assign' : 'تعيين'} */}
                  {hrefOptions?.tooltip || locale === 'en' ? 'Assign' : 'تعيين'}
                </span>
              </span>
            </Link>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 lg:grid-cols-2 lg:items-center justify-between gap-5">
        <div className="col-span-1 flex flex-col lg:flex-row lg:items-center gap-5">
          <div className="flex items-center gap-2 group">
            <div className="group-hover:text-accent flex items-center justify-center">
              <div className="group-hover:hidden flex">{icons.phone}</div>
              <div className="hidden group-hover:flex">{icons.forwardCall}</div>
            </div>
            <Link
              href={`tel:${courier.phone}`}
              className="text-sm font-semibold hover:underline underline-offset-4"
            >
              {courier.phone}
            </Link>
          </div>
          <div className="flex items-center gap-2 group">
            <div className="group-hover:text-accent flex items-center justify-center">
              <div className="group-hover:hidden flex">
                {icons.emptyLocation}
              </div>
              <div className="hidden group-hover:flex">{icons.location}</div>
            </div>
            <p className="text-sm font-semibold capitalize">{courier.zone}</p>
          </div>
        </div>
        <div className="col-span-1">{children}</div>
      </CardContent>
    </Card>
  );
}
