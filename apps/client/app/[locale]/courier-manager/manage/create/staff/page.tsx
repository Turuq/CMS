'use client';

import {
  createAssignmentOfficer,
  createHandoverOfficer,
} from '@/app/actions/staff-actions';
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
import { NewStaffSchema } from '@/utils/validation/staff';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'sonner';
import Droppable from '../../../components/forms/droppable';
import { useRouter } from 'next/navigation';

export default function CreateNewStaffMember({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = useTranslations('authentication');
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
    field: 'nationalIdImage' | 'criminalRecordImage';
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
          style: {
            backgroundColor: '#FEEFEE',
            color: '#D8000C',
          },
        });
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from('staff').getPublicUrl(data.path);

      form.setFieldValue(field, publicUrl);
      toast.success('Image Uploaded Successfully', {
        style: {
          backgroundColor: '#E6EFEC',
          color: '#4F8A10',
        },
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
      role: '',
      password: '',
      nationalIdImage: '',
      criminalRecordImage: '',
    },
    onSubmit: async ({ value }) => {
      setLoading(true);
      if (value.role === 'HANDOVER_OFFICER') {
        const r = await createHandoverOfficer({ value });
        if (r?.error) {
          setLoading(false);
          toast.error('Failed to Create Handover Officer', {
            style: {
              backgroundColor: '#FEEFEE',
              color: '#D8000C',
            },
          });
        }
        if (r?.data) {
          setLoading(false);
          toast.success('Handover Officer Created Successfully', {
            style: {
              backgroundColor: '#E6EFEC',
              color: '#4F8A10',
            },
          });
          router.replace(`${locale}/courier-manager/manage`);
        }
      } else if (value.role === 'ASSIGNMENT_OFFICER') {
        const r = await createAssignmentOfficer({ value });
        if (r?.error) {
          setLoading(false);
          toast.error('Failed to Create Assignment Officer', {
            style: {
              backgroundColor: '#FEEFEE',
              color: '#D8000C',
            },
          });
        }
        if (r?.data) {
          setLoading(false);
          toast.success('Assignment Officer Created Successfully', {
            style: {
              backgroundColor: '#E6EFEC',
              color: '#4F8A10',
            },
          });
          router.replace(`${locale}/courier-manager/manage`);
        }
      }
    },
    validatorAdapter: zodValidator(),
    validators: {
      onSubmit: NewStaffSchema,
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
            <h1 className="font-bold text-lg">{t('signup.staff.header')}</h1>
            <p className="font-semibold text-sm text-dark_border/80 dark:text-light_border/80">
              {t('signup.staff.description')}
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
                  onChange: NewStaffSchema.shape.name,
                }}
              >
                {(field) => (
                  <div className="flex flex-col gap-2 w-full">
                    <label htmlFor={field.name}>
                      {t('signup.fields.name')}
                    </label>
                    <Input
                      id={field.name}
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
              <form.Field
                name="username"
                validators={{
                  onChange: NewStaffSchema.shape.username,
                }}
              >
                {(field) => (
                  <div className="flex flex-col gap-2 w-full">
                    <label htmlFor={field.name}>
                      {t('signup.fields.username')}
                    </label>
                    <Input
                      id={field.name}
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
              <form.Field
                name="email"
                validators={{
                  onChange: NewStaffSchema.shape.email,
                }}
              >
                {(field) => (
                  <div className="col-span-2 flex flex-col gap-2 w-full">
                    <label htmlFor={field.name}>
                      {t('signup.fields.email')}
                    </label>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      required
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      type="email"
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
              <form.Field
                name="phone"
                validators={{
                  onChange: NewStaffSchema.shape.phone,
                }}
              >
                {(field) => (
                  <div className="col-span-2 lg:col-span-1 flex flex-col gap-2 w-full">
                    <label htmlFor={field.name}>
                      {t('signup.fields.phone')}
                    </label>
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
              <form.Field
                name="nationalId"
                validators={{
                  onChange: NewStaffSchema.shape.nationalId,
                }}
              >
                {(field) => (
                  <div className="col-span-2 lg:col-span-1 flex flex-col gap-2 w-full">
                    <label htmlFor={field.name}>
                      {t('signup.fields.nationalId')}
                    </label>
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
              <form.Field
                name="role"
                validators={{
                  onChange: NewStaffSchema.shape.role,
                }}
              >
                {(field) => (
                  <div className="flex flex-col gap-2 w-full">
                    <label htmlFor="role">
                      {t('signup.fields.role.label')}
                    </label>
                    <Select
                      key={'role'}
                      name={field.name}
                      required
                      value={field.state.value}
                      onValueChange={(value) => field.handleChange(value)}
                    >
                      <SelectTrigger className="w-full rounded-xl bg-light_border dark:bg-muted border-none ring-0 outline-none">
                        <SelectValue
                          placeholder={t('signup.placeholders.role')}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="HANDOVER_OFFICER">
                          {t('signup.fields.role.handover')}
                        </SelectItem>
                        <SelectItem value="ASSIGNMENT_OFFICER">
                          {t('signup.fields.role.assignment')}
                        </SelectItem>
                        <SelectItem value="COURIER_MANAGER">
                          {t('signup.fields.role.manager')}
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
              <form.Field
                name="password"
                validators={{
                  onChange: NewStaffSchema.shape.password,
                }}
              >
                {(field) => (
                  <div className="flex flex-col gap-2 w-full">
                    <label htmlFor={field.name}>
                      {t('signup.fields.password')}
                    </label>
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

              <div className="col-span-2 flex flex-col gap-2 w-full">
                <label htmlFor="nationalIdImage">
                  {t('signup.fields.nationalIdImage')}
                </label>
                <Droppable
                  field="nationalIdImage"
                  uploading={uploading}
                  handleUpload={uploadToSupabase}
                />
              </div>

              <div className="col-span-2 flex flex-col gap-2 w-full">
                <label htmlFor={'criminalRecordImage'}>
                  {t('signup.fields.criminalRecordImage')}
                </label>
                <Droppable
                  field="criminalRecordImage"
                  uploading={uploading}
                  handleUpload={uploadToSupabase}
                />
              </div>
              <Button
                disabled={loading || uploading}
                type="submit"
                className="w-full"
              >
                {loading ? (
                  <Loader2 size={16} className="text-inherit animate-spin" />
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
