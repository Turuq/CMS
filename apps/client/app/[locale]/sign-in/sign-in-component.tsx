'use client';

import { icons } from '@/components/icons/icons';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import * as Clerk from '@clerk/elements/common';
import * as SignIn from '@clerk/elements/sign-in';
import { Loader2Icon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useState } from 'react';

export default function SignInPage() {
  const t = useTranslations('authentication');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <SignIn.Root>
      <Clerk.Loading>
        {(isGlobalLoading) => (
          <>
            <Card className="bg-light dark:bg-muted rounded-xl w-full lg:w-1/3 min-h-[60svh] h-auto p-2 shadow-md dark:shadow-light_border/10 shadow-dark_border/30">
              <SignIn.Step name="start">
                <CardHeader className="w-full flex flex-col items-center justify-between gap-10 p-5">
                  <Image
                    src={'/babyblue.png'}
                    alt="Turuq | CMS"
                    width={80}
                    height={80}
                  />
                  <div className="flex flex-col gap-1 items-center justify-center w-full">
                    <CardTitle className="font-bold text-lg">
                      {t('login.header')}
                    </CardTitle>
                    <CardDescription className="font-semibold text-sm text-dark_border/80 dark:text-light_border/80">
                      {t('login.description')}
                    </CardDescription>
                  </div>
                </CardHeader>

                <Clerk.GlobalError className="block text-sm text-red-400" />
                <div className="flex flex-col gap-1 items-center justify-center w-full px-5">
                  <div className="flex flex-col gap-5 my-5 w-full">
                    <Clerk.Field name="identifier" className="space-y-2">
                      <Clerk.Label asChild>
                        <Label
                          htmlFor="email"
                          className="text-sm font-medium text-inherit"
                        >
                          {t('login.fields.email')}
                        </Label>
                      </Clerk.Label>
                      <Clerk.Input
                        type="email"
                        required
                        asChild
                        className="w-full rounded-md bg-white px-3.5 py-2 text-sm outline-none ring-1 ring-inset ring-zinc-300 hover:ring-zinc-400 focus:ring-[1.5px] focus:ring-zinc-950 data-[invalid]:ring-red-400"
                      >
                        <Input
                          id={'email'}
                          name={'email'}
                          className="w-full rounded-xl bg-light_border dark:bg-dark_border border-none ring-0 outline-none"
                          placeholder={t('login.placeholders.email')}
                        />
                      </Clerk.Input>
                      <Clerk.FieldError className="block text-sm text-red-400" />
                    </Clerk.Field>
                    <Clerk.Field name="password" className="space-y-2">
                      <Clerk.Label asChild>
                        <Label
                          htmlFor="password"
                          className="text-sm font-medium text-inherit"
                        >
                          {t('login.fields.password')}
                        </Label>
                      </Clerk.Label>
                      <div className="flex items-center justify-between pt-0 gap-1 w-full rounded-xl bg-light_border dark:bg-dark_border">
                        <Clerk.Input
                          type={showPassword ? 'text' : 'password'}
                          required
                          asChild
                        >
                          <Input
                            id={'password'}
                            name={'password'}
                            className="w-full rounded-xl bg-light_border dark:bg-dark_border border-none ring-0 outline-none"
                            placeholder={t('login.placeholders.password')}
                          />
                        </Clerk.Input>
                        <div className="bg-dark_border/10 dark:bg-light_border/10 hover:text-accent flex items-center justify-center rounded-r-xl size-10">
                          <button
                            autoFocus={false}
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setShowPassword(!showPassword);
                            }}
                            className="text-inherit"
                          >
                            {showPassword ? icons.eyeOpen : icons.eyeClosed}
                          </button>
                        </div>
                      </div>
                      <Clerk.FieldError className="block text-sm text-red-400" />
                    </Clerk.Field>
                  </div>
                  <SignIn.Action submit asChild>
                    <Button className="w-full" disabled={isGlobalLoading}>
                      <Clerk.Loading>
                        {(isLoading) => {
                          return isLoading ? (
                            <Loader2Icon className="size-4 animate-spin" />
                          ) : (
                            t('login.buttons.login')
                          );
                        }}
                      </Clerk.Loading>
                    </Button>
                  </SignIn.Action>
                </div>
              </SignIn.Step>
            </Card>
          </>
        )}
      </Clerk.Loading>
    </SignIn.Root>
  );
}
