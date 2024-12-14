import React, { useState } from 'react';
import { Camera } from 'lucide-react';
import { Button } from '../UI/Button';
import { UploadArea } from './UploadArea';
import { CameraCapture } from './CameraCapture';
import { validateImageFile } from '../../utils/file.utils';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  className?: string;
}

export function ImageUploader({ onImageSelect, className }: ImageUploaderProps) {
  const [showCamera, setShowCamera] = useState(false);

  const handleImageSelect = async (file: File) => {
    try {
      validateImageFile(file);
      onImageSelect(file);
    } catch (error) {
      console.error('Image validation error:', error);
      alert(error instanceof Error ? error.message : 'Failed to process image');
    }
  };

  return (
    <div className={className}>
      {/* Desktop View - Only Upload Area */}
      <div className="hidden lg:block">
        <UploadArea onImageSelect={handleImageSelect} />
      </div>

      {/* Mobile View - Camera Button First, then Upload Area */}
      <div className="lg:hidden space-y-4">
        <div className="space-y-2">
          <Button
            onClick={() => setShowCamera(true)}
            variant="secondary"
            fullWidth
            className="flex items-center justify-center gap-2"
          >
            <Camera className="h-5 w-5" />
            Take a Photo
          </Button>
          <p className="text-xs text-center text-brand-600 dark:text-brand-400">
            For best results, take the photo from about 1 foot (30 cm) away from your plate
          </p>
        </div>

        <UploadArea onImageSelect={handleImageSelect} />
      </div>

      {showCamera && (
        <CameraCapture
          onCapture={handleImageSelect}
          onClose={() => setShowCamera(false)}
        />
      )}
    </div>
  );
}