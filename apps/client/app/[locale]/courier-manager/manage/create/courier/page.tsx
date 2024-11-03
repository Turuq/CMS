'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/lib/supabase/supabase';
import { ToastStyles } from '@/utils/styles';
import { useForm } from '@tanstack/react-form';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'sonner';
import Droppable from '../../../components/forms/droppable';
import { Label } from '@/components/ui/label';
import { Loader2Icon } from 'lucide-react';
import { createNewCourier } from '@/app/actions/courier-actions';

export default function CreateNewCourier() {
  const t = useTranslations('authentication');

  const [uploading, setUploading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  async function uploadToSupabase({
    e,
    file,
    field,
  }: {
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>;
    file: File | null;
    field: 'nationalIdImage' | 'criminalRecordImage' | 'driverLicenseImage';
  }) {
    e.preventDefault();
    if (file) {
      setUploading(true);

      const fileExt = file.name.split('.').pop();
      const filePath = `courier/${form.getFieldValue('username')}/${field}.${fileExt}`;

      const { error: uploadError, data } = await supabase.storage
        .from('courier')
        .upload(filePath, file);

      if (uploadError) {
        setUploading(false);
        toast.error('Failed to Upload Image', {
          style: ToastStyles.error,
        });
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from('courier').getPublicUrl(data.path);

      form.setFieldValue(field, publicUrl);
      toast.success('Image Uploaded Successfully', {
        style: ToastStyles.success,
      });

      setUploading(false);
    }
  }

  const form = useForm({
    defaultValues: {
      name: '',
      username: '',
      email: '',
      phone: '',
      nationalId: '',
      outSourced: false,
      password: '',
      nationalIdImage: '',
      driverLicenseImage: '',
      criminalRecordImage: '',
    },
    onSubmit: async ({ value }) => {
      setLoading(true);
      const res = await createNewCourier({ courier: value });
      if (res) {
        setLoading(false);
        toast.success('Courier Created Successfully', {
          style: ToastStyles.success,
        });
      } else {
        setLoading(false);
        toast.error('Failed to Create Courier', {
          style: ToastStyles.error,
        });
      }
    },
  });
  return (
    <div className="flex items-center justify-center">
      <div className="bg-light dark:bg-dark_border rounded-xl w-1/2 h-full p-2 shadow-md dark:shadow-light_border/10 shadow-dark_border/30">
        <div className="w-full flex flex-col items-center justify-between gap-10 p-5">
          <Image
            src={'/babyblue.png'}
            alt="Turuq | CMS"
            width={80}
            height={80}
          />
          <div className="flex flex-col gap-1 items-center justify-center w-full">
            <h1 className="font-bold text-lg">{t('signup.courier.header')}</h1>
            <p className="font-semibold text-sm text-dark_border/80 dark:text-light_border/80">
              {t('signup.courier.description')}
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
              className="grid grid-cols-2 gap-5 my-5 w-full"
            >
              <form.Field name="name" mode="value">
                {(field) => (
                  <div className="flex flex-col col-span-2 lg:col-span-1 gap-2 w-full">
                    <Label htmlFor="name">{t('signup.fields.name')}</Label>
                    <Input
                      id={field.name}
                      type="text"
                      name={field.name}
                      value={field.state.value}
                      required
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      className="w-full rounded-xl bg-light_border dark:bg-muted border-none ring-0 outline-none"
                      placeholder={t('signup.placeholders.name')}
                    />
                    {field.state.meta.errors && (
                      <p className="text-xs italic font-semibold text-red-500">
                        {field.state.meta.errors.join(', ')}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>
              <form.Field name="username" mode="value">
                {(field) => (
                  <div className="flex flex-col col-span-2 lg:col-span-1 gap-2 w-full">
                    <Label htmlFor="username">
                      {t('signup.fields.username')}
                    </Label>
                    <Input
                      id={field.name}
                      type="text"
                      name={field.name}
                      value={field.state.value}
                      required
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      className="w-full rounded-xl bg-light_border dark:bg-muted border-none ring-0 outline-none"
                      placeholder={t('signup.placeholders.username')}
                    />
                    {field.state.meta.errors && (
                      <p className="text-xs italic font-semibold text-red-500">
                        {field.state.meta.errors.join(', ')}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>
              <form.Field name="email" mode="value">
                {(field) => (
                  <div className="flex flex-col col-span-2 gap-2 w-full">
                    <Label htmlFor="email">{t('signup.fields.email')}</Label>
                    <Input
                      id={field.name}
                      type="email"
                      name={field.name}
                      value={field.state.value}
                      required
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      className="w-full rounded-xl bg-light_border dark:bg-muted border-none ring-0 outline-none"
                      placeholder={t('signup.placeholders.email')}
                    />
                    {field.state.meta.errors && (
                      <p className="text-xs italic font-semibold text-red-500">
                        {field.state.meta.errors.join(', ')}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>
              <form.Field name="phone" mode="value">
                {(field) => (
                  <div className="flex flex-col col-span-2 lg:col-span-1 gap-2 w-full">
                    <Label htmlFor="phone">{t('signup.fields.phone')}</Label>
                    <Input
                      id={field.name}
                      type="tel"
                      minLength={11}
                      maxLength={11}
                      name={field.name}
                      value={field.state.value}
                      required
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      className="w-full rounded-xl bg-light_border dark:bg-muted border-none ring-0 outline-none"
                      placeholder={t('signup.placeholders.phone')}
                    />
                    {field.state.meta.errors && (
                      <p className="text-xs italic font-semibold text-red-500">
                        {field.state.meta.errors.join(', ')}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>
              <form.Field name="nationalId" mode="value">
                {(field) => (
                  <div className="flex flex-col col-span-2 lg:col-span-1 gap-2 w-full">
                    <Label htmlFor="nationalId">
                      {t('signup.fields.nationalId')}
                    </Label>
                    <Input
                      id={field.name}
                      type="text"
                      minLength={14}
                      maxLength={14}
                      name={field.name}
                      value={field.state.value}
                      required
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      className="w-full rounded-xl bg-light_border dark:bg-muted border-none ring-0 outline-none"
                      placeholder={t('signup.placeholders.nationalId')}
                    />
                    {field.state.meta.errors && (
                      <p className="text-xs italic font-semibold text-red-500">
                        {field.state.meta.errors.join(', ')}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>
              <form.Field name="password" mode="value">
                {(field) => (
                  <div className="flex flex-col col-span-2 lg:col-span-1 gap-2 w-full">
                    <Label htmlFor="password">
                      {t('signup.fields.password')}
                    </Label>
                    <Input
                      id={field.name}
                      type="password"
                      name={field.name}
                      value={field.state.value}
                      required
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      className="w-full rounded-xl bg-light_border dark:bg-muted border-none ring-0 outline-none"
                      placeholder={t('signup.placeholders.password')}
                    />
                    {field.state.meta.errors && (
                      <p className="text-xs italic font-semibold text-red-500">
                        {field.state.meta.errors.join(', ')}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>
              <form.Field name="outSourced" mode="value">
                {(field) => (
                  <div className="flex flex-col col-span-2 lg:col-span-1 gap-2 w-full">
                    <Label htmlFor="outSourced">
                      {t('signup.fields.type.label')}
                    </Label>
                    <Select
                      name={field.name}
                      value={`${field.state.value}`}
                      required
                      onValueChange={(value) =>
                        value === 'true'
                          ? field.setValue(() => true)
                          : field.setValue(() => false)
                      }
                    >
                      <SelectTrigger className="w-full rounded-xl bg-light_border dark:bg-muted border-none ring-0 outline-none">
                        <SelectValue
                          placeholder={t('signup.fields.type.label')}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value={'true'}>
                            {t('signup.fields.type.outsourced')}
                          </SelectItem>
                          <SelectItem value={'false'}>
                            {t('signup.fields.type.internal')}
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {field.state.meta.errors && (
                      <p className="text-xs italic font-semibold text-red-500">
                        {field.state.meta.errors.join(', ')}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>
              <form.Field name="nationalIdImage">
                {(field) => (
                  <div className="col-span-2 flex flex-col gap-2 w-full">
                    <Label htmlFor={field.name}>
                      {t('signup.fields.nationalIdImage')}
                    </Label>
                    <Droppable
                      field="nationalIdImage"
                      uploading={uploading}
                      handleUpload={uploadToSupabase}
                    />
                    {!field.state.value &&
                      field.state.meta.errors.length > 0 && (
                        <p className="text-xs italic font-semibold text-red-500">
                          {t('signup.validations.criminalRecordImageRequired')}
                        </p>
                      )}
                  </div>
                )}
              </form.Field>
              <form.Field name="criminalRecordImage">
                {(field) => (
                  <div className="col-span-2 flex flex-col gap-2 w-full">
                    <Label htmlFor={'criminalRecordImage'}>
                      {t('signup.fields.criminalRecordImage')}
                    </Label>
                    <Droppable
                      field="criminalRecordImage"
                      uploading={uploading}
                      handleUpload={uploadToSupabase}
                    />
                    {!field.state.value &&
                      field.state.meta.errors.length > 0 && (
                        <p className="text-xs italic font-semibold text-red-500">
                          {t('signup.validations.criminalRecordImageRequired')}
                        </p>
                      )}
                  </div>
                )}
              </form.Field>
              <form.Field name="driverLicenseImage">
                {(field) => (
                  <div className="col-span-2 flex flex-col gap-2 w-full">
                    <Label htmlFor={'driverLicenseImage'}>
                      {t('signup.fields.driverLicenseImage')}
                    </Label>
                    <Droppable
                      field="driverLicenseImage"
                      uploading={uploading}
                      handleUpload={uploadToSupabase}
                    />
                    {!field.state.value &&
                      field.state.meta.errors.length > 0 && (
                        <p className="text-xs italic font-semibold text-red-500">
                          {t('signup.validations.criminalRecordImageRequired')}
                        </p>
                      )}
                  </div>
                )}
              </form.Field>
              <Button
                disabled={loading || uploading}
                type="submit"
                className="w-full"
              >
                {loading ? (
                  <Loader2Icon
                    size={16}
                    className="text-inherit animate-spin"
                  />
                ) : (
                  t('signup.buttons.signup')
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
