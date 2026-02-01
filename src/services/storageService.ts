// Storage service for Cloudinary operations
// Handles image upload and deletion

// Cloudinary configuration
const CLOUDINARY_CLOUD_NAME = 'dx6xo0d01';
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'findmypet_unsigned';

/**
 * Upload pet photo to Cloudinary
 * @param userId - User ID for organizing files
 * @param file - Image file to upload
 * @returns Secure URL of uploaded file
 */
export const uploadPetPhoto = async (
  userId: string,
  file: File
): Promise<string> => {
  // Create form data for Cloudinary upload
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  formData.append('folder', `findmypet/${userId}`);
  
  // Upload to Cloudinary
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData
    }
  );
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to upload image to Cloudinary');
  }
  
  const data = await response.json();
  
  // Return the secure URL
  return data.secure_url;
};

/**
 * Delete pet photo from Cloudinary
 * Note: Deletion requires signed requests, so we just log it
 * For production, implement a backend endpoint for secure deletion
 * @param photoUrl - Full URL of the photo to delete
 */
export const deletePetPhoto = async (photoUrl: string): Promise<void> => {
  try {
    // Cloudinary deletion requires signed requests (backend)
    // For now, we just log the deletion request
    // In production, call a backend API that handles secure deletion
    console.log('Photo deletion requested for:', photoUrl);
    
    // Note: Photos will remain in Cloudinary but won't be referenced
    // Implement backend cleanup or Cloudinary's auto-delete feature for production
  } catch (error) {
    console.error('Error deleting photo:', error);
  }
};

/**
 * Validate image file before upload
 * @param file - File to validate
 * @returns Object with isValid flag and optional error message
 */
export const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
  // Check file size (max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  if (file.size > maxSize) {
    return { isValid: false, error: 'File size must be less than 5MB' };
  }
  
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'File must be JPG, PNG, or WebP' };
  }
  
  return { isValid: true };
};
