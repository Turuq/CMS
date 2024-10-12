'use client';

import { updateStaff } from '@/app/actions/staff-actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/lib/supabase/supabase';
import { ToastStyles } from '@/utils/styles';
import { EditStaff, EditStaffSchema } from '@/utils/validation/staff';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Loader2Icon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import Droppable from './droppable';

export default function EditStaffForm({
  locale,
  defaultValues,
}: {
  locale: string;
  defaultValues: EditStaff;
}) {
  const t = useTranslations('forms.edit.staff');

  const router = useRouter();

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
      const filePath = `staff/${form.getFieldValue('username')}/${field}.${fileExt}`;

      const { error: uploadError, data } = await supabase.storage
        .from('staff')
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
      } = supabase.storage.from('staff').getPublicUrl(data.path);

      form.setFieldValue(field, publicUrl);
      toast.success('Image Uploaded Successfully', {
        style: ToastStyles.success,
      });

      setUploading(false);
    }
  }

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      setLoading(true);
      updateStaff(defaultValues._id, value)
        .then(() => {
          toast.success('Staff Updated Successfully', {
            style: ToastStyles.success,
          });
          setLoading(false);
          router.replace(`/${locale}/courier-manager/manage`);
        })
        .catch((error) => {
          toast.error('Failed to Update Staff', {
            description: error.message,
            style: ToastStyles.error,
          });
          setLoading(false);
        });
    },
    validatorAdapter: zodValidator(),
    validators: {
      onSubmit: EditStaffSchema,
    },
  });
  return (
    <div className="flex items-center justify-center w-full">
      <div className="bg-light dark:bg-dark_border rounded-xl w-full lg:w-1/2 h-full p-2">
        <div className="w-full flex flex-col items-center justify-between gap-10 p-5">
          <Image
            src={'/babyblue.png'}
            alt="Turuq | CMS"
            width={80}
            height={80}
          />
          <div className="flex flex-col gap-1 items-center justify-center w-full">
            <h1 className="font-bold text-lg">
              {t('header', { name: defaultValues.name })}
            </h1>
            <p className="font-semibold text-sm text-dark_border/80 dark:text-light_border/80">
              {t('description', { name: defaultValues.name })}
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
              className="grid grid-cols-2 gap-5 my-5 w-full"
            >
              <form.Field
                name="name"
                validators={{
                  onChange: EditStaffSchema.shape.name,
                }}
              >
                {(field) => (
                  <div className="flex flex-col gap-2 w-full">
                    <label htmlFor={field.name}>{t('fields.name')}</label>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      required
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      className={`w-full rounded-xl bg-light_border dark:bg-muted border-none ring-0 outline-none ${field.state.value !== defaultValues[field.name] && 'ring-1 ring-amber-500 dark:ring-amber-300'}`}
                      placeholder={defaultValues[field.name]}
                    />
                    {field.state.meta.errors && (
                      <p className="text-xs italic font-semibold text-red-500">
                        {field.state.meta.errors.join(', ')}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>
              <form.Field
                name="username"
                validators={{
                  onChange: EditStaffSchema.shape.username,
                }}
              >
                {(field) => (
                  <div className="flex flex-col gap-2 w-full">
                    <label htmlFor={field.name}>{t('fields.username')}</label>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      required
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      className={`w-full rounded-xl bg-light_border dark:bg-muted border-none ring-0 outline-none ${field.state.value !== defaultValues[field.name] && 'ring-1 ring-amber-500 dark:ring-amber-300'}`}
                      placeholder={defaultValues[field.name]}
                    />
                    {field.state.meta.errors && (
                      <p className="text-xs italic font-semibold text-red-500">
                        {field.state.meta.errors.join(', ')}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>
              <form.Field
                name="email"
                validators={{
                  onChange: EditStaffSchema.shape.email,
                }}
              >
                {(field) => (
                  <div className="col-span-2 lg:col-span-1 flex flex-col gap-2 w-full">
                    <label htmlFor={field.name}>{t('fields.email')}</label>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      required
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      type="email"
                      className={`w-full rounded-xl bg-light_border dark:bg-muted border-none ring-0 outline-none ${field.state.value !== defaultValues[field.name] && 'ring-1 ring-amber-500 dark:ring-amber-300'}`}
                      placeholder={defaultValues[field.name]}
                    />
                    {field.state.meta.errors && (
                      <p className="text-xs italic font-semibold text-red-500">
                        {field.state.meta.errors.join(', ')}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>
              <form.Field
                name="phone"
                validators={{
                  onChange: EditStaffSchema.shape.phone,
                }}
              >
                {(field) => (
                  <div className="col-span-2 lg:col-span-1 flex flex-col gap-2 w-full">
                    <label htmlFor={field.name}>{t('fields.phone')}</label>
                    <Input
                      id={field.name}
                      type="tel"
                      name={field.name}
                      value={field.state.value}
                      required
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      minLength={11}
                      maxLength={11}
                      className={`w-full rounded-xl bg-light_border dark:bg-muted border-none ring-0 outline-none ${field.state.value !== defaultValues[field.name] && 'ring-1 ring-amber-500 dark:ring-amber-300'}`}
                      placeholder={defaultValues[field.name]}
                    />
                    {field.state.meta.errors && (
                      <p className="text-xs italic font-semibold text-red-500">
                        {field.state.meta.errors.join(', ')}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>
              <form.Field
                name="nationalId"
                validators={{
                  onChange: EditStaffSchema.shape.nationalId,
                }}
              >
                {(field) => (
                  <div className="col-span-2 lg:col-span-1 flex flex-col gap-2 w-full">
                    <label htmlFor={field.name}>{t('fields.nationalId')}</label>
                    <Input
                      id={field.name}
                      type="text"
                      name={field.name}
                      value={field.state.value}
                      required
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      minLength={14}
                      maxLength={14}
                      className={`w-full rounded-xl bg-light_border dark:bg-muted border-none ring-0 outline-none ${field.state.value !== defaultValues[field.name] && 'ring-1 ring-amber-500 dark:ring-amber-300'}`}
                      placeholder={defaultValues[field.name]}
                    />
                    {field.state.meta.errors && (
                      <p className="text-xs italic font-semibold text-red-500">
                        {field.state.meta.errors.join(', ')}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>
              <form.Field
                name="role"
                validators={{
                  onChange: EditStaffSchema.shape.role,
                }}
              >
                {(field) => (
                  <div className="col-span-2 lg:col-span-1 flex flex-col gap-2 w-full">
                    <label htmlFor="role">{t('fields.role.label')}</label>
                    <Select
                      key={'role'}
                      name={field.name}
                      required
                      value={field.state.value}
                      onValueChange={(value) => field.handleChange(value)}
                    >
                      <SelectTrigger
                        className={`w-full rounded-xl bg-light_border dark:bg-muted border-none ring-0 outline-none ${field.state.value !== defaultValues[field.name] && 'ring-1 ring-amber-500 dark:ring-amber-300'}`}
                      >
                        <SelectValue placeholder={defaultValues[field.name]} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="HANDOVER_OFFICER">
                          {t('fields.role.handover')}
                        </SelectItem>
                        <SelectItem value="ASSIGNMENT_OFFICER">
                          {t('fields.role.assignment')}
                        </SelectItem>
                        <SelectItem value="COURIER_MANAGER">
                          {t('fields.role.manager')}
                        </SelectItem>
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
              <div className="col-span-2 grid grid-cols-1 items-center gap-5">
                <div className="grid grid-cols-3 items-center gap-5">
                  <div className="col-span-3 lg:col-span-2 flex flex-col gap-2">
                    <label htmlFor="nationalIdImage">
                      {t('fields.nationalIdImage')}
                    </label>
                    <Droppable
                      uploading={uploading}
                      handleUpload={uploadToSupabase}
                      field="nationalIdImage"
                    />
                  </div>
                  <div
                    className={`col-span-3 lg:col-span-1 flex items-center justify-center bg-light_border dark:bg-muted rounded-xl w-full h-full min-h-32 p-2 ${defaultValues.nationalIdImage !== form.getFieldValue('nationalIdImage') && 'ring-1 ring-amber-500 dark:ring-amber-300'}`}
                  >
                    {form.getFieldValue('nationalIdImage') ? (
                      <Image
                        src={form.getFieldValue('nationalIdImage')}
                        alt="National ID"
                        width={160}
                        height={160}
                        className="rounded-xl object-cover"
                      />
                    ) : (
                      <p className="text-xs font-semibold text-amber-500 dark:text-amber-300">
                        No Image to Preview
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 items-center gap-5">
                  <div className="col-span-3 lg:col-span-2 flex flex-col gap-2">
                    <label htmlFor="nationalIdImage">
                      {t('fields.criminalRecordImage')}
                    </label>
                    <Droppable
                      uploading={uploading}
                      handleUpload={uploadToSupabase}
                      field="criminalRecordImage"
                    />
                  </div>
                  <div
                    className={`col-span-3 lg:col-span-1 flex items-center justify-center bg-light_border dark:bg-muted rounded-xl w-full h-full min-h-32 p-2 ${defaultValues.criminalRecordImage !== form.getFieldValue('criminalRecordImage') && 'ring-1 ring-amber-500 dark:ring-amber-300'}`}
                  >
                    {form.getFieldValue('criminalRecordImage') ? (
                      <Image
                        src={form.getFieldValue('criminalRecordImage')}
                        alt="Criminal Record"
                        width={160}
                        height={160}
                        className="rounded-xl object-cover"
                      />
                    ) : (
                      <p className="text-xs font-semibold text-amber-500 dark:text-amber-300">
                        No Image to Preview
                      </p>
                    )}
                  </div>
                </div>
              </div>
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
                  t('buttons.save')
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
