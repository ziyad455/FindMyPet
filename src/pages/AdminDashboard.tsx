// Admin Dashboard Page
// Shows all submissions with approve/reject/delete actions

import React, { useState } from 'react';
import { useLanguage } from '../context';
import { useAllPets } from '../hooks';
import { PetCard, LoadingSpinner, Modal, QRCodeGenerator } from '../components';
import type { Pet, PetStatus } from '../types';

export const AdminDashboard: React.FC = () => {
  const { t } = useLanguage();
  const [statusFilter, setStatusFilter] = useState<PetStatus | undefined>(undefined);
  const { pets, loading, approvePet, rejectPet, deletePet } = useAllPets(statusFilter);
  
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Handle approve action
  const handleApprove = async (pet: Pet) => {
    if (!window.confirm(t('admin.approveConfirm'))) return;
    
    setIsProcessing(true);
    try {
      // Generate QR code URL (the actual QR will be generated client-side)
      const qrUrl = `${window.location.origin}/pet/${pet.id}`;
      await approvePet(pet.id, qrUrl);
    } catch (error) {
      console.error('Error approving pet:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle reject action
  const handleReject = async (pet: Pet) => {
    if (!window.confirm(t('admin.rejectConfirm'))) return;
    
    setIsProcessing(true);
    try {
      await rejectPet(pet.id);
    } catch (error) {
      console.error('Error rejecting pet:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle delete action
  const handleDelete = async (pet: Pet) => {
    if (!window.confirm(t('admin.deleteConfirm'))) return;
    
    setIsProcessing(true);
    try {
      await deletePet(pet.id);
    } catch (error) {
      console.error('Error deleting pet:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle QR code download
  const handleDownloadQR = (pet: Pet) => {
    setSelectedPet(pet);
    setIsQRModalOpen(true);
  };

  // Count pets by status
  const statusCounts = {
    all: pets.length,
    pending: pets.filter(p => p.status === 'pending').length,
    approved: pets.filter(p => p.status === 'approved').length,
    rejected: pets.filter(p => p.status === 'rejected').length
  };

  // Filter buttons
  const filterButtons: { label: string; value: PetStatus | undefined; count: number }[] = [
    { label: t('admin.allSubmissions'), value: undefined, count: statusCounts.all },
    { label: t('admin.pendingSubmissions'), value: 'pending', count: statusCounts.pending },
    { label: t('admin.approvedSubmissions'), value: 'approved', count: statusCounts.approved },
    { label: t('admin.rejectedSubmissions'), value: 'rejected', count: statusCounts.rejected }
  ];

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {t('admin.title')}
          </h1>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {filterButtons.map((btn) => (
            <button
              key={btn.label}
              onClick={() => setStatusFilter(btn.value)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                statusFilter === btn.value
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {btn.label} ({btn.count})
            </button>
          ))}
        </div>

        {/* Processing Overlay */}
        {isProcessing && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-40">
            <LoadingSpinner size="lg" />
          </div>
        )}

        {/* Empty State */}
        {pets.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <span className="text-6xl mb-4 block">📋</span>
            <h2 className="text-xl font-semibold text-gray-900">
              {t('admin.noSubmissions')}
            </h2>
          </div>
        ) : (
          /* Pet Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets.map((pet) => (
              <PetCard
                key={pet.id}
                pet={pet}
                isAdmin={true}
                onApprove={handleApprove}
                onReject={handleReject}
                onDelete={handleDelete}
                onDownloadQR={handleDownloadQR}
              />
            ))}
          </div>
        )}

        {/* QR Code Modal */}
        <Modal
          isOpen={isQRModalOpen}
          onClose={() => {
            setIsQRModalOpen(false);
            setSelectedPet(null);
          }}
          title={t('admin.generateQR')}
          size="md"
        >
          {selectedPet && (
            <div className="flex flex-col items-center py-4">
              <h3 className="text-lg font-semibold mb-4">{selectedPet.petName}</h3>
              <QRCodeGenerator
                petId={selectedPet.id}
                petName={selectedPet.petName}
                size={250}
                showDownload={true}
              />
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default AdminDashboard;
