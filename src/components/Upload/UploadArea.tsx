import React from 'react';
import { Image } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { clsx } from 'clsx';

interface UploadAreaProps {
  onImageSelect: (file: File) => void;
}

export function UploadArea({ onImageSelect }: UploadAreaProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles?.[0]) {
        onImageSelect(acceptedFiles[0]);
      }
    },
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxFiles: 1,
    multiple: false
  });

  return (
    <div
      {...getRootProps()}
      className={clsx(
        'relative cursor-pointer rounded-lg border-2 border-dashed',
        'p-8 text-center transition-all duration-300',
        isDragActive 
          ? 'border-brand-400 dark:border-brand-500 bg-brand-50 dark:bg-brand-800/50'
          : 'border-brand-200 dark:border-brand-700 hover:border-brand-300 dark:hover:border-brand-600 bg-white dark:bg-brand-800/30'
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center">
        <div className="p-3 rounded-full bg-brand-50 dark:bg-brand-800/50">
          <Image className="h-8 w-8 text-brand-500 dark:text-brand-400" />
        </div>
        <p className="mt-4 text-brand-700 dark:text-brand-300 font-medium">
          {isDragActive ? 'Drop your image here...' : 'Upload your meal photo'}
        </p>
        <p className="mt-2 text-sm text-brand-600 dark:text-brand-400">
          Drag & drop or click to select
        </p>
        <p className="mt-1 text-xs text-brand-500 dark:text-brand-500">
          Supports JPG, JPEG, PNG (max 5MB)
        </p>
      </div>
    </div>
  );
}