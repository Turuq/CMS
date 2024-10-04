'use client';
import { useDictionary } from '@/providers/dictionary-provider';
import { DotIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Import usePathname
import { icons } from '../icons/icons';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Drawer, DrawerContent, DrawerTrigger } from '../ui/drawer';
import { Separator } from '../ui/separator';
import { courierManagementSystemLinks } from '@/utils/links';

export default function Navbar() {
  const { dictionary, locale } = useDictionary();
  const tabs = dictionary['courierManager']['tabs'];
  const pathname = usePathname();
  const type = 'courier-manager'; // This is a temporary fix

  const isActive = (tabPath: string) =>
    pathname.endsWith(tabPath) || pathname === tabPath;

  return (
    <nav className="col-span-12 grid grid-cols-6 gap-5 p-5">
      {type === 'courier-manager' ? (
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
      ) : (
        // Other conditions for different roles...
        // Assignment officer example
        <div className="col-span-2 flex items-center justify-center lg:hidden">
          <Drawer>
            <DrawerTrigger>{icons.menu}</DrawerTrigger>
            <DrawerContent className="px-5">
              <Link
                href={`/${locale}/courier-manager`}
                className={`flex items-center justify-start w-40 h-10 ${
                  isActive('/courier-manager') ? 'text-accent' : 'opacity-45'
                } hover:opacity-100 ease-in-out transition-opacity duration-300 text-sm`}
              >
                <span className="font-bold">Home</span>
              </Link>
              <Link
                href={`/${locale}/courier-manager/orders`}
                className={`flex items-center justify-start gap-2 w-40 h-10 ${
                  isActive('/courier-manager/assign')
                    ? 'text-accent'
                    : 'opacity-45'
                } hover:opacity-100 ease-in-out transition-opacity duration-300 text-sm`}
              >
                <span className="font-bold">Assign</span>
              </Link>
              <Separator className="bg-slate-100 dark:bg-dark my-5" />
            </DrawerContent>
          </Drawer>
        </div>
      )}

      <div className="col-span-2 lg:col-span-1 flex items-center justify-center">
        <img src="/babyblue.png" alt="Turuq.co" width={64} height={64} />
      </div>

      {type === 'courier-manager' && (
        <>
          {/* bg-light dark:bg-dark_border */}
          <div className="hidden px-3 col-span-3 lg:flex items-center justify-between gap-2 rounded-full ">
            {/* {courierManagementSystemLinks.map((link, index) => (
              <Link
                key={index}
                href={`/${locale}${link.href}`}
                className={`flex items-center justify-center w-40 h-10 ${
                  pathname.includes(`${locale}${link.path}`)
                    ? 'text-accent cursor-default'
                    : 'opacity-45'
                } hover:opacity-100 ease-in-out transition-opacity duration-300 text-sm`}
              >
                <DotIcon
                  size={16}
                  className={`text-inherit transition-opacity ${
                    pathname.includes(`${locale}${link.path}`)
                      ? 'opacity-100'
                      : 'opacity-0'
                  }`}
                />
                TODO: Add Translations
                <span className="font-bold">{link.title}</span>
              </Link>
            ))} */}
          </div>
          <div className="hidden col-span-2 lg:flex items-center justify-center gap-2">
            <button className="rounded-full bg-light dark:bg-dark_border size-10 flex items-center justify-center">
              {icons.search}
            </button>
            <button className="rounded-full bg-light dark:bg-dark_border size-10 flex items-center justify-center">
              {icons.bell}
            </button>
            <div className="rounded-full bg-light dark:bg-dark_border flex items-center gap-2 w-auto pr-5 h-10">
              <Avatar>
                <AvatarImage
                  src="https://www.google.com/url?sa=i&url=https%3A%2F%2Fgithub.com%2Fshadcn&psig=AOvVaw3z3zSzDPg9vVEsBx_1CnU-&ust=1724960604457000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCJjsm5W5mIgDFQAAAAAdAAAAABAE"
                  alt="operator"
                />
                <AvatarFallback>OP</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <h1 className="text-bold text-sm">John Doe</h1>
                <h3 className="text-semibold text-xs opacity-50">
                  Barcode Officer
                </h3>
              </div>
            </div>
          </div>
          <div className="col-span-2 flex items-center justify-center lg:hidden"></div>
        </>
      )}
    </nav>
  );
}
