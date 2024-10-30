import { SignedIn, SignedOut } from '@clerk/nextjs';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { icons } from '../icons/icons';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { api } from '@/app/actions/api';
import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';

export default async function Navbar({ locale }: { locale: string }) {
  const t = await getTranslations('roles');

  const { userId } = await auth();

  let user;

  if (userId) {
    const res = await api.auth.me.$post({ json: { userId } });
    user = await res.json();
  }

  return (
    <nav className="flex items-center justify-between gap-5 p-5">
      <div className="flex items-center justify-center">
        <Image src="/babyblue.png" alt="Turuq.co" width={64} height={64} />
      </div>
      <SignedIn>
        <div className="flex items-center justify-center gap-2">
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
                {user?.name[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <h1 className="text-bold text-sm">{user?.name}</h1>
              <h3 className="text-semibold text-xs opacity-50">
                {t(user?.role)}
              </h3>
            </div>
          </div>
        </div>
      </SignedIn>
      <SignedOut>
        <Link
          href="/sign-in"
          className="border border-accent/50 bg-transparent hover:bg-accent hover:text-accent-foreground h-8 px-4 py-2 rounded-xl text-xs font-semibold w-40 inline-flex items-center justify-center whitespace-nowrap ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        >
          Login
        </Link>
      </SignedOut>
    </nav>
  );
}
