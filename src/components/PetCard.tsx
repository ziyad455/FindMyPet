// Pet Card component for displaying pet information
// Used in dashboards and listings

import React from 'react';
import { Link } from 'react-router-dom';
import type { Pet } from '../types';
import { useLanguage } from '../context';

interface PetCardProps {
  pet: Pet;
  showActions?: boolean;
  onEdit?: (pet: Pet) => void;
  onDelete?: (pet: Pet) => void;
  onApprove?: (pet: Pet) => void;
  onReject?: (pet: Pet) => void;
  onDownloadQR?: (pet: Pet) => void;
  isAdmin?: boolean;
}

export const PetCard: React.FC<PetCardProps> = ({
  pet,
  showActions = true,
  onEdit,
  onDelete,
  onApprove,
  onReject,
  onDownloadQR,
  isAdmin = false
}) => {
  const { t, isRTL } = useLanguage();

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800'
  };

  const statusLabels = {
    pending: t('dashboard.status.pending'),
    approved: t('dashboard.status.approved'),
    rejected: t('dashboard.status.rejected')
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Pet Image */}
      <div className="aspect-video relative overflow-hidden bg-gray-100">
        {pet.photoUrl ? (
          <img
            src={pet.photoUrl}
            alt={pet.petName}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">
            🐾
          </div>
        )}
        
        {/* Status Badge */}
        <span
          className={`absolute top-2 ${isRTL ? 'left-2' : 'right-2'} px-2 py-1 rounded-full text-xs font-medium ${statusColors[pet.status]}`}
        >
          {statusLabels[pet.status]}
        </span>
      </div>

      {/* Pet Info */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          {pet.petName}
        </h3>
        <p className="text-sm text-gray-600 mb-2">
          {t('petPage.ownerInfo')}: {pet.ownerName}
        </p>
        <p className="text-sm text-gray-500 mb-3">
          📞 {pet.phone}
        </p>
        
        {pet.message && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-4">
            {pet.message}
          </p>
        )}

        {/* Actions */}
        {showActions && (
          <div className="flex flex-wrap gap-2 mt-4">
            {/* View Button */}
            <Link
              to={`/pet/${pet.id}`}
              className="px-3 py-1.5 text-sm font-medium text-primary-600 bg-primary-50 rounded-md hover:bg-primary-100 transition-colors"
            >
              {t('dashboard.viewPet')}
            </Link>

            {/* User Actions */}
            {!isAdmin && (
              <>
                {onEdit && (
                  <button
                    onClick={() => onEdit(pet)}
                    className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    {t('common.edit')}
                  </button>
                )}
              </>
            )}

            {/* Admin Actions */}
            {isAdmin && (
              <>
                {pet.status === 'pending' && (
                  <>
                    {onApprove && (
                      <button
                        onClick={() => onApprove(pet)}
                        className="px-3 py-1.5 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors"
                      >
                        {t('common.approve')}
                      </button>
                    )}
                    {onReject && (
                      <button
                        onClick={() => onReject(pet)}
                        className="px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
                      >
                        {t('common.reject')}
                      </button>
                    )}
                  </>
                )}

                {pet.status === 'approved' && onDownloadQR && (
                  <button
                    onClick={() => onDownloadQR(pet)}
                    className="px-3 py-1.5 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 transition-colors"
                  >
                    {t('dashboard.downloadQR')}
                  </button>
                )}

                {onDelete && (
                  <button
                    onClick={() => onDelete(pet)}
                    className="px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
                  >
                    {t('common.delete')}
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PetCard;
