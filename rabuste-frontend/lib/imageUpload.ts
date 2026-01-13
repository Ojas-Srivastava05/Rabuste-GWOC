// Image upload utility using Cloudinary or base64 conversion
export async function uploadImageToCloudinary(file: File): Promise<string> {
  // For now, convert to base64 and return data URL
  // In production, you'd upload to Cloudinary here
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        resolve(result);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

export async function uploadImageToServer(file: File): Promise<string> {
  // Alternative: Upload to your own server endpoint
  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await fetch('/api/upload-image', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();
    return data.url;
  } catch (error) {
    // Fallback to base64
    return uploadImageToCloudinary(file);
  }
}
