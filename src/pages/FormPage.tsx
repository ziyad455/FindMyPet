// Form Page component for submitting new pet
// Modern design with success modal

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { useLanguage, useToast } from '../context';
import { useUserPets } from '../hooks';
import { PetForm, Modal } from '../components';
import type { PetFormData } from '../types';

export const FormPage: React.FC = () => {
  const { t } = useLanguage();
  const { error: showError } = useToast();
  const navigate = useNavigate();
  const { createPet } = useUserPets();
  
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formRef = useRef<HTMLDivElement>(null);

  // Entrance animation
  useEffect(() => {
    if (formRef.current) {
      gsap.fromTo(
        formRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
      );
    }
  }, []);

  const handleSubmit = async (formData: PetFormData) => {
    setLoading(true);
    setError(null);

    try {
      await createPet(formData);
      setShowSuccessModal(true);
    } catch (err) {
      console.error('Submission error:', err);
      setError(t('common.error'));
      showError(t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  const handleGoToDashboard = () => {
    setShowSuccessModal(false);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-12">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-100 rounded-full blur-3xl opacity-40" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-primary-50 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="relative max-w-lg mx-auto px-4">
        <div ref={formRef} className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8 sm:p-10 border border-gray-100">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-500/25">
              <span className="text-3xl">🐾</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              {t('form.title')}
            </h1>
            <p className="text-gray-600 mt-2 text-sm">
              {t('landing.description')}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              {error}
            </div>
          )}

          <PetForm onSubmit={handleSubmit} isLoading={loading} />
        </div>
      </div>

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={handleGoToDashboard}
        title={t('thankYou.title')}
        variant="success"
        size="md"
      >
        <div className="text-center">
          {/* Success animation/icon */}
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/25">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <p className="text-gray-600 mb-8">
            {t('thankYou.message')}
          </p>

          {/* Next Steps */}
          <div className="bg-gray-50 rounded-2xl p-6 mb-6 text-start">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              {t('thankYou.nextSteps.title')}
            </h2>
            <ol className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">1</span>
                <span>{t('thankYou.nextSteps.step1')}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">2</span>
                <span>{t('thankYou.nextSteps.step2')}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">3</span>
                <span>{t('thankYou.nextSteps.step3')}</span>
              </li>
            </ol>
          </div>

          {/* Contact Info */}
          <div className="border-t border-gray-100 pt-6 mb-6">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>{t('thankYou.contact.title')} {t('thankYou.contact.email')}</span>
            </div>
          </div>

          {/* Dashboard Button */}
          <button
            onClick={handleGoToDashboard}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/25 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <span>{t('thankYou.dashboardButton')}</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default FormPage;
