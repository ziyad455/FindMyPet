// Pet Form component for creating and editing pets
// Includes validation and file upload

import React, { useState, useRef } from 'react';
import type { PetFormData, FormErrors, Pet } from '../types';
import { useLanguage } from '../context';
import { useFormValidation } from '../hooks';
import LoadingSpinner from './LoadingSpinner';

interface PetFormProps {
  initialData?: Pet;
  onSubmit: (data: PetFormData) => Promise<void>;
  isLoading?: boolean;
}

export const PetForm: React.FC<PetFormProps> = ({
  initialData,
  onSubmit,
  isLoading = false
}) => {
  const { t, isRTL } = useLanguage();
  const { errors, validateForm, clearFieldError } = useFormValidation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<PetFormData>({
    ownerName: initialData?.ownerName || '',
    petName: initialData?.petName || '',
    phone: initialData?.phone || '',
    photo: null,
    message: initialData?.message || ''
  });

  const [photoPreview, setPhotoPreview] = useState<string | null>(
    initialData?.photoUrl || null
  );

  // Handle text input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    clearFieldError(name as keyof FormErrors);
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, photo: file }));
    clearFieldError('photo');

    // Create preview
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPhotoPreview(initialData?.photoUrl || null);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // For edit mode, photo is optional if already exists
    const dataToValidate = {
      ...formData,
      photo: formData.photo || (initialData?.photoUrl ? new File([], 'existing') : null)
    };

    if (!validateForm(dataToValidate)) {
      return;
    }

    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Owner Name */}
      <div>
        <label
          htmlFor="ownerName"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {t('form.ownerName')} <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="ownerName"
          name="ownerName"
          value={formData.ownerName}
          onChange={handleChange}
          placeholder={t('form.ownerNamePlaceholder')}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
            errors.ownerName ? 'border-red-500' : 'border-gray-300'
          }`}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
        {errors.ownerName && (
          <p className="mt-1 text-sm text-red-500">{errors.ownerName}</p>
        )}
      </div>

      {/* Pet Name */}
      <div>
        <label
          htmlFor="petName"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {t('form.petName')} <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="petName"
          name="petName"
          value={formData.petName}
          onChange={handleChange}
          placeholder={t('form.petNamePlaceholder')}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
            errors.petName ? 'border-red-500' : 'border-gray-300'
          }`}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
        {errors.petName && (
          <p className="mt-1 text-sm text-red-500">{errors.petName}</p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {t('form.phone')} <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder={t('form.phonePlaceholder')}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
            errors.phone ? 'border-red-500' : 'border-gray-300'
          }`}
          dir="ltr"
        />
        {errors.phone && (
          <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
        )}
      </div>

      {/* Photo */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t('form.photo')} {!initialData && <span className="text-red-500">*</span>}
        </label>
        
        {/* Photo Preview */}
        {photoPreview && (
          <div className="mb-3">
            <img
              src={photoPreview}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-lg border"
            />
          </div>
        )}

        <div className="flex items-center gap-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {t('form.photoPlaceholder')}
          </button>
          <span className="text-sm text-gray-500">
            {formData.photo?.name || t('form.photoHint')}
          </span>
        </div>
        {errors.photo && (
          <p className="mt-1 text-sm text-red-500">{errors.photo}</p>
        )}
      </div>

      {/* Message */}
      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {t('form.message')}
          <span className="text-gray-400 ms-1">({t('common.optional')})</span>
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder={t('form.messagePlaceholder')}
          rows={4}
          maxLength={500}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-none ${
            errors.message ? 'border-red-500' : 'border-gray-300'
          }`}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
        <p className="mt-1 text-sm text-gray-500">
          {formData.message.length}/500 - {t('form.messageHint')}
        </p>
        {errors.message && (
          <p className="mt-1 text-sm text-red-500">{errors.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 px-4 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <LoadingSpinner size="sm" />
            {t('form.submitting')}
          </>
        ) : (
          t('form.submitButton')
        )}
      </button>
    </form>
  );
};

export default PetForm;
