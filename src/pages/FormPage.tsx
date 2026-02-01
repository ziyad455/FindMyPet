// Form Page component for submitting new pet
// Includes form with validation and thank you message

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context';
import { useUserPets } from '../hooks';
import { PetForm } from '../components';
import type { PetFormData } from '../types';

export const FormPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { createPet } = useUserPets();
  
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: PetFormData) => {
    setLoading(true);
    setError(null);

    try {
      await createPet(formData);
      setSubmitted(true);
    } catch (err) {
      console.error('Submission error:', err);
      setError(t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  // Show thank you message after successful submission
  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-lg mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            {/* Success Icon */}
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {t('thankYou.title')}
            </h1>
            <p className="text-gray-600 mb-8">
              {t('thankYou.message')}
            </p>

            {/* Next Steps */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8 text-start">
              <h2 className="font-semibold text-gray-900 mb-4">
                {t('thankYou.nextSteps.title')}
              </h2>
              <ol className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-medium">1</span>
                  {t('thankYou.nextSteps.step1')}
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-medium">2</span>
                  {t('thankYou.nextSteps.step2')}
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-medium">3</span>
                  {t('thankYou.nextSteps.step3')}
                </li>
              </ol>
            </div>

            {/* Contact Info */}
            <div className="border-t pt-6 mb-8">
              <h3 className="font-medium text-gray-900 mb-2">
                {t('thankYou.contact.title')}
              </h3>
              <p className="text-sm text-gray-600">
                {t('thankYou.contact.email')}
              </p>
            </div>

            {/* Dashboard Button */}
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full py-3 px-4 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
            >
              {t('thankYou.dashboardButton')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-lg mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            {t('form.title')}
          </h1>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6">
              {error}
            </div>
          )}

          <PetForm onSubmit={handleSubmit} isLoading={loading} />
        </div>
      </div>
    </div>
  );
};

export default FormPage;
