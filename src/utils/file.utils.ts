/**
 * Validates file size and type for image uploads
 */
export function validateImageFile(file: File) {
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

  if (file.size > MAX_SIZE) {
    throw new Error('File size too large. Please select an image under 5MB.');
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Invalid file type. Please select a JPG or PNG image.');
  }

  return true;
}

/**
 * Converts a File to base64 string
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
    
    reader.readAsDataURL(file);
  });
}