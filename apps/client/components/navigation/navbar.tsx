import { cookies } from 'next/headers';
import { icons } from '../icons/icons';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';

export default async function Navbar({ locale }: { locale: string }) {
  const t = await getTranslations('roles');

  const role = cookies().get('role')?.value;
  const userCookie = cookies().get('user')?.value;
  const user = userCookie ? JSON.parse(userCookie) : undefined;

  return (
    <nav className="col-span-12 grid grid-cols-6 gap-5 p-5">
      <div className="col-span-12 lg:col-span-1 flex items-center justify-center">
        <Image src="/babyblue.png" alt="Turuq.co" width={64} height={64} />
      </div>

      <div className="hidden px-3 col-span-3 lg:flex items-center justify-between gap-2 rounded-full "></div>
      {user && (
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
              <AvatarFallback className="capitalize">
                {user.name[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <h1 className="text-bold text-sm">{user.name}</h1>
              <h3 className="text-semibold text-xs opacity-50">{t(role)}</h3>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
