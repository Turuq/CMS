'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { signInSchema } from '@/utils/validation/auth';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { signInAction } from '../actions/auth-actions';
import { toast } from 'sonner';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { icons } from '@/components/icons/icons';

export default function Home({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = useTranslations('authentication');
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // sign-in form
  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      setLoading(true);
      const res = await signInAction(value, locale);
      if (res?.error) {
        setLoading(false);
        toast.error('Failed to Sign In', {
          style: {
            backgroundColor: '#FEEFEE',
            color: '#D8000C',
          },
        });
      }
      setLoading(false);
    },
    validatorAdapter: zodValidator(),
    validators: {
      onChange: signInSchema,
    },
  });

  return (
    <div className="flex flex-col items-center justify-center gap-20">
      {/* Custom Auth */}
      <div className="bg-light dark:bg-muted rounded-xl w-full h-[60svh] p-2 shadow-md dark:shadow-light_border/10 shadow-dark_border/30">
        <div className="w-full flex flex-col items-center justify-between gap-10 p-5">
          <Image
            src={'/babyblue.png'}
            alt="Turuq | CMS"
            width={80}
            height={80}
          />
          <div className="flex flex-col gap-1 items-center justify-center w-full">
            <h1 className="font-bold text-lg">{t('login.header')}</h1>
            <p className="font-semibold text-sm text-dark_border/80 dark:text-light_border/80">
              {t('login.description')}
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
              className="flex flex-col gap-5 my-5 w-full"
            >
              <form.Field name="email" mode="value">
                {(field) => (
                  <div className="flex flex-col gap-2 w-full">
                    <label htmlFor={field.name}>
                      {t('login.fields.email')}
                    </label>
                    <Input
                      id={field.name}
                      type="text"
                      name={field.name}
                      value={field.state.value}
                      required
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      className="w-full rounded-xl bg-light_border dark:bg-dark_border border-none ring-0 outline-none"
                      placeholder={t('login.placeholders.email')}
                    />
                  </div>
                )}
              </form.Field>
              <form.Field name="password" mode="value">
                {(field) => (
                  <div className="flex flex-col gap-2 w-full">
                    <label htmlFor={field.name}>
                      {t('login.fields.password')}
                    </label>
                    <div className="flex items-center justify-between pt-0 gap-1 w-full rounded-xl bg-light_border dark:bg-dark_border">
                      <Input
                        id={field.name}
                        type={showPassword ? 'text' : 'password'}
                        name={field.name}
                        value={field.state.value}
                        required
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        className="bg-transparent rounded-l-xl border-none ring-0 outline-none"
                        placeholder={t('login.placeholders.password')}
                      />
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
                  </div>
                )}
              </form.Field>
              <Button type="submit" className="w-full">
                {loading ? (
                  <Loader2 size={16} className="text-inherit animate-spin" />
                ) : (
                  t('login.buttons.login')
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
      <Separator />
    </div>
  );
}
