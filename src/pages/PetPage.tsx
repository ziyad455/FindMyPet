// Pet Page component
// Public page accessible via QR code scan

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../context';
import { usePet } from '../hooks';
import { LoadingSpinner } from '../components';

export const PetPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const { pet, loading, error } = usePet(id);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text={t('common.loading')} />
      </div>
    );
  }

  // Pet not found or deleted
  if (error || !pet) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <div className="max-w-md mx-auto px-4 text-center">
          <span className="text-6xl mb-4 block">😿</span>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {t('petPage.notFound')}
          </h1>
          <p className="text-gray-600 mb-8">
            {t('petPage.notFoundMessage')}
          </p>
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
          >
            {t('common.back')}
          </Link>
        </div>
      </div>
    );
  }

  // Only show approved pets publicly
  if (pet.status !== 'approved') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <div className="max-w-md mx-auto px-4 text-center">
          <span className="text-6xl mb-4 block">🔒</span>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {t('petPage.notFound')}
          </h1>
          <p className="text-gray-600 mb-8">
            {t('petPage.notFoundMessage')}
          </p>
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
          >
            {t('common.back')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Pet Photo */}
          <div className="aspect-video relative bg-gray-100">
            {pet.photoUrl ? (
              <img
                src={pet.photoUrl}
                alt={pet.petName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-8xl">
                🐾
              </div>
            )}
          </div>

          {/* Pet Information */}
          <div className="p-6 sm:p-8">
            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              {pet.petName}
            </h1>

            {/* Owner Info Section */}
            <div className="bg-primary-50 rounded-lg p-6 mb-6">
              <h2 className="text-lg font-semibold text-primary-800 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {t('petPage.ownerInfo')}
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-gray-600">👤</span>
                  <span className="text-gray-900">{pet.ownerName}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-600">📞</span>
                  <a
                    href={`tel:${pet.phone}`}
                    className="text-primary-600 hover:text-primary-700 font-medium"
                    dir="ltr"
                  >
                    {pet.phone}
                  </a>
                </div>
              </div>
            </div>

            {/* Message/Description */}
            {pet.message && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                  {t('petPage.petInfo')}
                </h2>
                <p className="text-gray-700 bg-gray-50 rounded-lg p-4">
                  {pet.message}
                </p>
              </div>
            )}

            {/* Contact CTA */}
            <div className="border-t pt-6 mt-6">
              <a
                href={`tel:${pet.phone}`}
                className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors text-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {t('petPage.contact')}
              </a>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            ← {t('common.back')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PetPage;
