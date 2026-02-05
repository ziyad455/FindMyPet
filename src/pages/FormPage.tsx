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

  const handleCloseModal = () => {
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

      <Modal
        isOpen={showSuccessModal}
        onClose={handleCloseModal}
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

          <p className="text-gray-600 mb-8 px-4">
            {t('thankYou.message')}
          </p>

          {/* Primary Action: WhatsApp */}
          <a
            href="https://wa.me/212752521255"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-4 px-6 bg-[#25D366] hover:bg-[#22c35e] text-white font-bold rounded-xl shadow-lg shadow-green-500/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-3 mb-4 group"
          >
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            <span>{t('footer.contactWhatsApp')}</span>
          </a>

          {/* Secondary Action: Email */}
          <a
            href="mailto:supp0rtfindmypet@gmail.com"
            className="w-full py-3.5 px-4 bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 mb-8"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span>{t('footer.contact')}</span>
          </a>

          {/* Close hint */}
          <p className="text-xs text-gray-400">
            {t('common.cancel')} or click outside to return to dashboard
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default FormPage;
