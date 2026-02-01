// 404 Not Found Page

import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context';

export const NotFoundPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <div className="max-w-md mx-auto px-4 text-center">
        <span className="text-8xl mb-4 block">🐾</span>
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">
          {t('petPage.notFoundMessage')}
        </p>
        <Link
          to="/"
          className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
        >
          {t('header.home')}
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
