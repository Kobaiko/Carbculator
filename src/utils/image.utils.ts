/**
 * Converts a File object to a base64 string with optimizations
 * @param file The File object to convert
 * @returns Promise that resolves with the base64 string
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    // Create a web worker for large files
    if (file.size > 1024 * 1024) { // 1MB
      const worker = new Worker(
        URL.createObjectURL(
          new Blob([`
            onmessage = function(e) {
              const file = e.data;
              const reader = new FileReader();
              reader.onload = function(event) {
                postMessage(event.target.result);
              };
              reader.onerror = function(error) {
                postMessage({ error: error.message });
              };
              reader.readAsDataURL(file);
            }
          `], { type: 'application/javascript' })
        )
      );

      worker.onmessage = (e) => {
        if (e.data.error) {
          reject(new Error(e.data.error));
        } else {
          resolve(e.data);
        }
        worker.terminate();
      };

      worker.onerror = () => {
        reject(new Error('Worker error'));
        worker.terminate();
      };

      worker.postMessage(file);
    } else {
      // Use regular FileReader for smaller files
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to convert file to base64'));
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    }
  });
}