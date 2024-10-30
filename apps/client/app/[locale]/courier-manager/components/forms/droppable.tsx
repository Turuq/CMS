'use client';

import { useDropzone } from 'react-dropzone';

import { icons } from '@/components/icons/icons';
import { useState } from 'react';
import { formatBytes } from '@/utils/helpers/functions';
import { Button } from '@/components/ui/button';
import { Loader2Icon } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function Droppable({
  uploading,
  handleUpload,
  field,
}: {
  uploading: boolean;
  handleUpload: ({
    e,
    file,
    field,
  }: {
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>;
    file: File | null;
    field: 'nationalIdImage' | 'criminalRecordImage' | 'driverLicenseImage';
  }) => void;
  field: 'nationalIdImage' | 'criminalRecordImage' | 'driverLicenseImage';
}) {
  const t = useTranslations('forms.edit.staff');

  const [isOver, setIsOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.webp'],
    },
    onDrop: (files) => {
      setFile(files[0]);
      setIsOver(false);
    },
  });

  return (
    <div className="flex flex-col gap-2">
      <div
        {...getRootProps({ className: 'dropzone' })}
        onDragOver={() => setIsOver(true)}
        onDragLeave={() => setIsOver(false)}
        className={`w-full flex items-center justify-center rounded-xl bg-light_border dark:bg-muted h-20 border border-dashed ${isOver ? 'border-accent' : 'border-dark_border/20 dark:border-light_border/20'}`}
      >
        <input {...getInputProps()} />
        {isOver ? (
          <p className="text-center text-xs text-accent font-semibold">
            {t('feedback.dropHere')}
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            <div className="flex flex-col items-center justify-center gap-2">
              {icons.imageUpload}
              <p className="text-center flex gap-1 text-xs text-dark_text dark:text-light_text">
                <span>{t('feedback.dragNDrop')}</span>
                <span className="font-semibold text-accent cursor-pointer">
                  {t('feedback.chooseFile')}
                </span>{' '}
                <span>{t('feedback.toUpload')}</span>
              </p>
            </div>
          </div>
        )}
      </div>
      {file && (
        <div className="rounded-xl bg-light_border dark:bg-muted flex items-center justify-between gap-5 p-2 w-full">
          <div className="flex items-center gap-5 flex-1 w-full">
            <span className="text-accent">{icons.imageUpload}</span>
            <div className="flex flex-col gap-1">
              <p className="text-xs font-semibold">{file.name}</p>
              <div className="flex items-center gap-1">
                <p className="text-xs text-dark_border/80 dark:text-light_border/80">
                  {formatBytes(file.size)}
                </p>
                <p className="text-xs text-dark_border/80 dark:text-light_border/80">
                  •
                </p>
                <p className="text-xs uppercase text-dark_border/80 dark:text-light_border/80">
                  {file.type.split('/')[1]}
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end justify-end gap-2">
            <button
              className="hover:text-red-500"
              onClick={() => setFile(null)}
            >
              {icons.clear}
            </button>
            <Button
              variant={'default'}
              className="text-xs h-5 w-auto"
              disabled={uploading || !file}
              onClick={(e) => handleUpload({ e, file, field })}
            >
              {uploading ? (
                <Loader2Icon size={16} className="animate-spin" />
              ) : (
                t('buttons.uploadImage')
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
