// Pet Form component for creating and editing pets
// Modern design with smooth animations and file upload

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
  const [isDragging, setIsDragging] = useState(false);

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
    processFile(file);
  };

  // Process file (shared between input and drag-drop)
  const processFile = (file: File | null) => {
    setFormData(prev => ({ ...prev, photo: file }));
    clearFieldError('photo');

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

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0] || null;
    if (file && file.type.startsWith('image/')) {
      processFile(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const dataToValidate = {
      ...formData,
      photo: formData.photo || (initialData?.photoUrl ? new File([], 'existing') : null)
    };

    if (!validateForm(dataToValidate)) {
      return;
    }

    await onSubmit(formData);
  };

  const inputBaseClass = "w-full px-4 py-3 border-2 rounded-xl bg-gray-50 focus:bg-white focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all duration-200 text-gray-900 placeholder-gray-400";
  const labelClass = "block text-sm font-semibold text-gray-700 mb-2";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Owner Name */}
      <div>
        <label htmlFor="ownerName" className={labelClass}>
          {t('form.ownerName')} <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <input
            type="text"
            id="ownerName"
            name="ownerName"
            value={formData.ownerName}
            onChange={handleChange}
            placeholder={t('form.ownerNamePlaceholder')}
            className={`${inputBaseClass} pl-12 ${errors.ownerName ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : 'border-gray-200'}`}
            dir={isRTL ? 'rtl' : 'ltr'}
          />
        </div>
        {errors.ownerName && (
          <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errors.ownerName}
          </p>
        )}
      </div>

      {/* Pet Name */}
      <div>
        <label htmlFor="petName" className={labelClass}>
          {t('form.petName')} <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="text-lg">🐾</span>
          </div>
          <input
            type="text"
            id="petName"
            name="petName"
            value={formData.petName}
            onChange={handleChange}
            placeholder={t('form.petNamePlaceholder')}
            className={`${inputBaseClass} pl-12 ${errors.petName ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : 'border-gray-200'}`}
            dir={isRTL ? 'rtl' : 'ltr'}
          />
        </div>
        {errors.petName && (
          <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errors.petName}
          </p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className={labelClass}>
          {t('form.phone')} <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder={t('form.phonePlaceholder')}
            className={`${inputBaseClass} pl-12 ${errors.phone ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : 'border-gray-200'}`}
            dir="ltr"
          />
        </div>
        {errors.phone && (
          <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errors.phone}
          </p>
        )}
      </div>

      {/* Photo Upload */}
      <div>
        <label className={labelClass}>
          {t('form.photo')} {!initialData && <span className="text-red-500">*</span>}
        </label>

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 ${
            isDragging
              ? 'border-primary-500 bg-primary-50'
              : errors.photo
              ? 'border-red-300 bg-red-50'
              : 'border-gray-200 bg-gray-50 hover:border-primary-300 hover:bg-gray-100'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
          />

          {photoPreview ? (
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-xl shadow-md"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPhotoPreview(null);
                    setFormData(prev => ({ ...prev, photo: null }));
                  }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-md"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-sm text-gray-500">{t('form.photoHint')}</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">{t('form.photoPlaceholder')}</p>
                <p className="text-xs text-gray-500 mt-1">{t('form.photoHint')}</p>
              </div>
            </div>
          )}
        </div>

        {errors.photo && (
          <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errors.photo}
          </p>
        )}
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className={labelClass}>
          {t('form.message')}
          <span className="text-gray-400 font-normal ms-2">({t('common.optional')})</span>
        </label>
        <div className="relative">
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder={t('form.messagePlaceholder')}
            rows={4}
            maxLength={500}
            className={`${inputBaseClass} resize-none ${errors.message ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : 'border-gray-200'}`}
            dir={isRTL ? 'rtl' : 'ltr'}
          />
        </div>
        <div className="mt-2 flex justify-between items-center">
          <p className="text-xs text-gray-500">{t('form.messageHint')}</p>
          <p className={`text-xs ${formData.message.length > 450 ? 'text-amber-600' : 'text-gray-400'}`}>
            {formData.message.length}/500
          </p>
        </div>
        {errors.message && (
          <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errors.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-4 px-6 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold rounded-xl hover:from-primary-700 hover:to-primary-600 focus:ring-4 focus:ring-primary-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30"
      >
        {isLoading ? (
          <>
            <LoadingSpinner size="sm" />
            <span>{t('form.submitting')}</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            <span>{t('form.submitButton')}</span>
          </>
        )}
      </button>
    </form>
  );
};

export default PetForm;
