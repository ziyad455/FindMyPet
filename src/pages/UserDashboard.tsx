// User Dashboard Page
// Shows user's pet submissions with edit capability

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context';
import { useUserPets } from '../hooks';
import { PetCard, LoadingSpinner, Modal, PetForm } from '../components';
import type { Pet, PetFormData } from '../types';

export const UserDashboard: React.FC = () => {
  const { t } = useLanguage();
  const { pets, loading, updatePet, deletePet } = useUserPets();
  
  const [editingPet, setEditingPet] = useState<Pet | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEdit = (pet: Pet) => {
    setEditingPet(pet);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (formData: PetFormData) => {
    if (!editingPet) return;

    setIsSubmitting(true);
    try {
      await updatePet(
        editingPet.id,
        {
          ownerName: formData.ownerName,
          petName: formData.petName,
          phone: formData.phone,
          message: formData.message
        },
        formData.photo,
        editingPet.photoUrl
      );
      setIsEditModalOpen(false);
      setEditingPet(null);
    } catch (error) {
      console.error('Error updating pet:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (pet: Pet) => {
    if (window.confirm(t('admin.deleteConfirm'))) {
      try {
        await deletePet(pet.id);
      } catch (error) {
        console.error('Error deleting pet:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text={t('common.loading')} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {t('dashboard.title')}
            </h1>
            <p className="text-gray-600 mt-1">
              {t('dashboard.myPets')}
            </p>
          </div>
          <Link
            to="/submit"
            className="px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {t('dashboard.addPet')}
          </Link>
        </div>

        {/* Empty State */}
        {pets.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <span className="text-6xl mb-4 block">🐾</span>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {t('dashboard.noPets')}
            </h2>
            <p className="text-gray-600 mb-6">
              {t('landing.description')}
            </p>
            <Link
              to="/submit"
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
            >
              {t('dashboard.addPet')}
            </Link>
          </div>
        ) : (
          /* Pet Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets.map((pet) => (
              <PetCard
                key={pet.id}
                pet={pet}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {/* Edit Modal */}
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingPet(null);
          }}
          title={t('common.edit')}
          size="lg"
        >
          {editingPet && (
            <PetForm
              initialData={editingPet}
              onSubmit={handleEditSubmit}
              isLoading={isSubmitting}
            />
          )}
        </Modal>
      </div>
    </div>
  );
};

export default UserDashboard;
