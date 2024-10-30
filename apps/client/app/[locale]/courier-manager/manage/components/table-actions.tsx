import { MoreHorizontalIcon } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { courierManagerIcons } from '../../components/icons/courier-manager-icons';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from '@tanstack/react-form';
import { Input } from '@/components/ui/input';
import {
  activateCourier,
  deactivateCourier,
} from '@/app/actions/courier-actions';
import { toast } from 'sonner';
import { ToastStyles } from '@/utils/styles';
import { activateStaff, deactivateStaff } from '@/app/actions/staff-actions';

export default function TableActions({
  type,
  id,
  active,
  name,
}: {
  type: 'courier' | 'handover' | 'assignment';
  id: string;
  active: boolean;
  name: string;
}) {
  const t = useTranslations('courierManager.tabs.manage');
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm({
    defaultValues: {
      salary: 0,
      commissionPerOrder: 0,
      zone: '',
    },
    onSubmit: async ({ value }) => {
      const res = await activateCourier({
        id: id,
        ...value,
      });
      if (res) {
        toast.success('Courier activated successfully', {
          style: ToastStyles.success,
        });
      } else {
        toast.error('Failed to activate courier', { style: ToastStyles.error });
      }
    },
  });

  async function handleActivateStaff() {
    if (active) {
      // deactivate staff
      if (type === 'courier') {
        const res = await deactivateCourier({ id });
        if (res) {
          toast.success('Courier deactivated successfully', {
            style: ToastStyles.success,
          });
        } else {
          toast.error('Failed to deactivate courier', {
            style: ToastStyles.error,
          });
        }
      } else {
        const res = await deactivateStaff(id);
        if (res) {
          toast.success('Staff deactivated successfully', {
            style: ToastStyles.success,
          });
        } else {
          toast.error('Failed to deactivate staff', {
            style: ToastStyles.error,
          });
        }
      }
    } else {
      if (type === 'courier') {
        form.handleSubmit();
        // activate courier
      } else {
        const res = await activateStaff(id);
        if (res) {
          toast.success('Staff activated successfully', {
            style: ToastStyles.success,
          });
        } else {
          toast.error('Failed to activate staff', { style: ToastStyles.error });
        }
      }
    }
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Link href={`manage/edit/courier/${id}`} className="group">
                <div className="flex items-center">
                  {courierManagerIcons['editStaff']}
                  <p className="ml-2 font-semibold">{t('edit.title')}</p>{' '}
                </div>
              </Link>
            </DropdownMenuItem>
            <DialogTrigger asChild>
              <DropdownMenuItem>
                {!active ? (
                  <div className="flex items-center">
                    {courierManagerIcons['activateStaff']}
                    <p className="ml-2 font-semibold">
                      {t('activate.activate')}
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center">
                    {courierManagerIcons['deactivateStaff']}
                    <p className="ml-2 font-semibold">
                      {t('activate.deactivate')}
                    </p>
                  </div>
                )}
              </DropdownMenuItem>
            </DialogTrigger>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              <div className="flex items-center text-red-500/50 group-hover:text-red-500">
                {courierManagerIcons['deleteStaff']}
                <p className="ml-2 font-semibold">{t('delete.title')}</p>
              </div>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent className="bg-light dark:bg-dark_border rounded-xl">
        <DialogHeader>
          <DialogTitle>
            {active ? t('activate.deactivate') : t('activate.activate')}
          </DialogTitle>
          <DialogDescription>
            {active
              ? t('activate.aboutToDeactivate', { name })
              : t('activate.aboutToActivate', { name })}
          </DialogDescription>
        </DialogHeader>
        {type === 'courier' && !active && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="flex flex-col gap-5 my-5 w-full"
          >
            <form.Field name="salary" mode="value">
              {(field) => (
                <div className="flex flex-col gap-2 w-full">
                  <label htmlFor={field.name}>
                    {t('form.couriers.fields.salary')}
                  </label>
                  <Input
                    id={field.name}
                    type="number"
                    name={field.name}
                    value={field.state.value}
                    min={0}
                    required
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                    onBlur={field.handleBlur}
                    className="w-full rounded-xl bg-light_border dark:bg-muted border-none ring-0 outline-none"
                    placeholder={t('form.couriers.fields.salary')}
                  />
                </div>
              )}
            </form.Field>
            <form.Field name="commissionPerOrder" mode="value">
              {(field) => (
                <div className="flex flex-col gap-2 w-full">
                  <label htmlFor={field.name}>
                    {t('form.couriers.fields.commissionPerOrder')}
                  </label>
                  <Input
                    id={field.name}
                    type="number"
                    name={field.name}
                    value={field.state.value}
                    min={0}
                    required
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                    onBlur={field.handleBlur}
                    className="w-full rounded-xl bg-light_border dark:bg-muted border-none ring-0 outline-none"
                    placeholder={t('form.couriers.fields.commissionPerOrder')}
                  />
                </div>
              )}
            </form.Field>
            <form.Field name="zone" mode="value">
              {(field) => (
                <div className="flex flex-col gap-2 w-full">
                  <label htmlFor={field.name}>
                    {t('form.couriers.fields.zone')}
                  </label>
                  <Input
                    id={field.name}
                    type="text"
                    name={field.name}
                    value={field.state.value}
                    required
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    className="w-full rounded-xl bg-light_border dark:bg-muted border-none ring-0 outline-none"
                    placeholder={t('form.couriers.fields.zone')}
                  />
                </div>
              )}
            </form.Field>
          </form>
        )}
        <DialogFooter className="flex items-center gap-5">
          <Button variant={'destructive'} onClick={() => setOpen(false)}>
            {t('activate.cancel')}
          </Button>
          <Button variant={'default'} onClick={handleActivateStaff}>
            {t('activate.confirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
