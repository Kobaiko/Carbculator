import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { clsx } from 'clsx';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
}

export function ImageUploader({ onImageSelect }: ImageUploaderProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onImageSelect(acceptedFiles[0]);
    }
  }, [onImageSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxFiles: 1
  });

  return (
    <div
      {...getRootProps()}
      className={clsx(
        'relative cursor-pointer rounded-xl border-2 border-dashed border-white/30',
        'p-8 text-center transition-all duration-300',
        'backdrop-blur-md bg-white/10 hover:bg-white/20',
        isDragActive && 'border-white/50 bg-white/20'
      )}
    >
      <input {...getInputProps()} />
      <Upload className="mx-auto h-12 w-12 text-white/70" />
      <p className="mt-4 text-white/90">
        {isDragActive
          ? 'Drop your image here...'
          : 'Drag & drop an image, or click to select'}
      </p>
      <p className="mt-2 text-sm text-white/70">
        Supports JPG, JPEG, PNG
      </p>
    </div>
  );
}