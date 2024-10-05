'use client';
import { courierManagementSystemLinks } from '@/utils/links';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Import usePathname
import { icons } from '../icons/icons';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Drawer, DrawerContent, DrawerTrigger } from '../ui/drawer';
import { Separator } from '../ui/separator';

export default function Navbar({ locale }: { locale: string }) {
  const pathname = usePathname();

  const isActive = (tabPath: string) =>
    pathname.endsWith(tabPath) || pathname === tabPath;

  return (
    <nav className="col-span-12 grid grid-cols-6 gap-5 p-5">
      <div className="col-span-2 flex items-center justify-center lg:hidden">
        <Drawer>
          <DrawerTrigger>{icons.menu}</DrawerTrigger>
          <DrawerContent className="px-5">
            {courierManagementSystemLinks.map((link, index) => (
              <Link
                key={index}
                href={`/${locale}${link.href}`}
                className={`flex items-center justify-start w-40 h-10 ${
                  isActive(`/${locale}${link.href}`)
                    ? 'text-accent'
                    : 'opacity-45'
                } hover:opacity-100 ease-in-out transition-opacity duration-300 text-sm`}
              >
                {/* TODO: Add Translations */}
                <span className="font-bold">{link.title}</span>
              </Link>
            ))}
            <Separator className="bg-slate-100 dark:bg-dark my-5" />
          </DrawerContent>
        </Drawer>
      </div>

      <div className="col-span-2 lg:col-span-1 flex items-center justify-center">
        <img src="/babyblue.png" alt="Turuq.co" width={64} height={64} />
      </div>

      <div className="hidden px-3 col-span-3 lg:flex items-center justify-between gap-2 rounded-full "></div>
      <div className="hidden col-span-2 lg:flex items-center justify-center gap-2">
        <button className="rounded-full bg-light dark:bg-dark_border size-10 flex items-center justify-center">
          {icons.search}
        </button>
        <button className="rounded-full bg-light dark:bg-dark_border size-10 flex items-center justify-center">
          {icons.bell}
        </button>
        <div
          className={`rounded-full bg-light dark:bg-dark_border flex items-center gap-2 w-auto ${locale === 'ar' ? 'pl-5' : 'pr-5'} h-10`}
        >
          <Avatar>
            <AvatarImage
              src="https://www.google.com/url?sa=i&url=https%3A%2F%2Fgithub.com%2Fshadcn&psig=AOvVaw3z3zSzDPg9vVEsBx_1CnU-&ust=1724960604457000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCJjsm5W5mIgDFQAAAAAdAAAAABAE"
              alt="operator"
            />
            <AvatarFallback>{locale === 'ar' ? 'ج د' : 'JD'}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <h1 className="text-bold text-sm">
              {locale === 'ar' ? 'جون دو' : 'John Doe'}
            </h1>
            <h3 className="text-semibold text-xs opacity-50">
              {locale === 'ar' ? 'مراقب المناديب' : 'Courier Manager'}
            </h3>
          </div>
        </div>
      </div>
      <div className="col-span-2 flex items-center justify-center lg:hidden"></div>
    </nav>
  );
}
