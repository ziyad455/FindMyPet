// Pet Page component
// Public page accessible via QR code scan

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../context';
import { usePet } from '../hooks';
import { LoadingSpinner } from '../components';
import { formatMoroccanPhone } from '../utils/phoneFormatter';

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
                    {formatMoroccanPhone(pet.phone)}
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
                href={`https://api.whatsapp.com/send?phone=${pet.phone.replace(/[^0-9]/g, '')}&text=${encodeURIComponent(t('petPage.whatsappMessage', { petName: pet.petName }))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors text-lg"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
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
