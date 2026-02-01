// Form validation hook for pet submission
// Validates all form fields according to specification

import { useState, useCallback } from 'react';
import type { PetFormData, FormErrors } from '../types';
import { useLanguage } from './useLanguage';
import { validateImageFile } from '../services/storageService';

// Phone regex pattern (international format) - defined outside component
const PHONE_REGEX = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/;

export const useFormValidation = () => {
  const { t } = useLanguage();
  const [errors, setErrors] = useState<FormErrors>({});

  // Validate single field
  const validateField = useCallback((
    name: keyof PetFormData,
    value: string | File | null
  ): string | undefined => {
    switch (name) {
      case 'ownerName':
        if (!value || (typeof value === 'string' && !value.trim())) {
          return t('form.validation.ownerNameRequired');
        }
        if (typeof value === 'string' && value.trim().length < 2) {
          return t('form.validation.ownerNameMin');
        }
        break;

      case 'petName':
        if (!value || (typeof value === 'string' && !value.trim())) {
          return t('form.validation.petNameRequired');
        }
        if (typeof value === 'string' && value.trim().length < 2) {
          return t('form.validation.petNameMin');
        }
        break;

      case 'phone':
        if (!value || (typeof value === 'string' && !value.trim())) {
          return t('form.validation.phoneRequired');
        }
        if (typeof value === 'string' && !PHONE_REGEX.test(value)) {
          return t('form.validation.phoneInvalid');
        }
        break;

      case 'photo':
        if (!value) {
          return t('form.validation.photoRequired');
        }
        if (value instanceof File) {
          const validation = validateImageFile(value);
          if (!validation.isValid) {
            if (validation.error?.includes('size')) {
              return t('form.validation.photoSize');
            }
            return t('form.validation.photoFormat');
          }
        }
        break;

      case 'message':
        if (typeof value === 'string' && value.length > 500) {
          return t('form.validation.messageMax');
        }
        break;
    }
    return undefined;
  }, [t]);

  // Validate entire form
  const validateForm = useCallback((formData: PetFormData): boolean => {
    const newErrors: FormErrors = {};

    // Validate all fields
    const ownerNameError = validateField('ownerName', formData.ownerName);
    if (ownerNameError) newErrors.ownerName = ownerNameError;

    const petNameError = validateField('petName', formData.petName);
    if (petNameError) newErrors.petName = petNameError;

    const phoneError = validateField('phone', formData.phone);
    if (phoneError) newErrors.phone = phoneError;

    const photoError = validateField('photo', formData.photo);
    if (photoError) newErrors.photo = photoError;

    const messageError = validateField('message', formData.message);
    if (messageError) newErrors.message = messageError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [validateField]);

  // Clear all errors
  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  // Clear single field error
  const clearFieldError = useCallback((field: keyof FormErrors) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  return {
    errors,
    validateField,
    validateForm,
    clearErrors,
    clearFieldError,
    setErrors
  };
};
