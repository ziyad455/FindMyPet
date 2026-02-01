// User Dashboard Page
// Modern design with animations and confirmation dialogs

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { useLanguage, useToast } from '../context';
import { useUserPets } from '../hooks';
import { PetCard, LoadingSpinner, Modal, PetForm, ConfirmDialog } from '../components';
import type { Pet, PetFormData } from '../types';

export const UserDashboard: React.FC = () => {
  const { t } = useLanguage();
  const { success, error: showError } = useToast();
  const { pets, loading, updatePet, deletePet } = useUserPets();
  
  const [editingPet, setEditingPet] = useState<Pet | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; pet: Pet | null }>({
    isOpen: false,
    pet: null
  });
  const [isDeleting, setIsDeleting] = useState(false);

  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Entrance animation
  useEffect(() => {
    if (!loading && headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }
      );
    }
  }, [loading]);

  useEffect(() => {
    if (!loading && gridRef.current && pets.length > 0) {
      gsap.fromTo(
        gridRef.current.children,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.1, ease: 'power3.out' }
      );
    }
  }, [loading, pets.length]);

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
      success(t('common.saved'));
    } catch (error) {
      console.error('Error updating pet:', error);
      showError(t('common.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (pet: Pet) => {
    setDeleteConfirm({ isOpen: true, pet });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm.pet) return;
    
    setIsDeleting(true);
    try {
      await deletePet(deleteConfirm.pet.id);
      success(t('common.deleted'));
    } catch (error) {
      console.error('Error deleting pet:', error);
      showError(t('common.error'));
    } finally {
      setIsDeleting(false);
      setDeleteConfirm({ isOpen: false, pet: null });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <LoadingSpinner size="lg" text={t('common.loading')} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-12">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-0 w-72 h-72 bg-primary-100 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-20 right-0 w-96 h-96 bg-primary-50 rounded-full blur-3xl opacity-40" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={headerRef} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {t('dashboard.title')}
            </h1>
            <p className="text-gray-600 mt-1">
              {t('dashboard.myPets')} 
              {pets.length > 0 && (
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-700">
                  {pets.length}
                </span>
              )}
            </p>
          </div>
          <Link
            to="/submit"
            className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30 hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {t('dashboard.addPet')}
          </Link>
        </div>

        {/* Empty State */}
        {pets.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-12 text-center border border-gray-100">
            <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-primary-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <span className="text-5xl">🐾</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {t('dashboard.noPets')}
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {t('landing.description')}
            </p>
            <Link
              to="/submit"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/25 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {t('dashboard.addPet')}
            </Link>
          </div>
        ) : (
          /* Pet Grid */
          <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets.map((pet) => (
              <PetCard
                key={pet.id}
                pet={pet}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
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

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          isOpen={deleteConfirm.isOpen}
          onClose={() => setDeleteConfirm({ isOpen: false, pet: null })}
          onConfirm={handleDeleteConfirm}
          title={t('admin.deleteTitle')}
          message={t('admin.deleteConfirm')}
          confirmText={t('common.delete')}
          cancelText={t('common.cancel')}
          variant="danger"
          isLoading={isDeleting}
        />
      </div>
    </div>
  );
};

export default UserDashboard;
