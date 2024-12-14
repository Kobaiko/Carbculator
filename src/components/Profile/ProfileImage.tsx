import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Camera } from 'lucide-react';
import { clsx } from 'clsx';
import { fileToBase64 } from '../../utils/image.utils';

interface ProfileImageProps {
  currentImage?: string;
  onImageUpdate: (imageData: string) => void;
}

export function ProfileImage({ currentImage, onImageUpdate }: ProfileImageProps) {
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const base64Image = await fileToBase64(acceptedFiles[0]);
      onImageUpdate(base64Image);
    }
  }, [onImageUpdate]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxFiles: 1
  });

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        {...getRootProps()}
        className={clsx(
          'relative w-32 h-32 rounded-full overflow-hidden cursor-pointer',
          'border-2 border-dashed transition-colors',
          isDragActive
            ? 'border-brand-400 dark:border-brand-500'
            : 'border-brand-200 dark:border-brand-700'
        )}
      >
        <input {...getInputProps()} />
        {currentImage ? (
          <img
            src={currentImage}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-brand-50 dark:bg-brand-800/50">
            <Camera className="h-8 w-8 text-brand-500 dark:text-brand-400" />
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity">
          <span className="text-white text-sm">Change Photo</span>
        </div>
      </div>
      <p className="text-sm text-brand-600 dark:text-brand-400">
        Click or drag to update profile photo
      </p>
    </div>
  );
}