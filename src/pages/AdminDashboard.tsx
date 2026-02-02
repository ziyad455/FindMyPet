// Admin Dashboard Page
// Modern design with animations and confirmation dialogs

import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useLanguage, useToast } from '../context';
import { useAllPets } from '../hooks';
import { PetCard, LoadingSpinner, Modal, QRCodeGenerator, ConfirmDialog } from '../components';
import type { Pet, PetStatus } from '../types';

type ConfirmAction = 'approve' | 'reject' | 'delete';

interface ConfirmState {
  isOpen: boolean;
  pet: Pet | null;
  action: ConfirmAction | null;
}

export const AdminDashboard: React.FC = () => {
  const { t } = useLanguage();
  const { success, error: showError } = useToast();
  const [statusFilter, setStatusFilter] = useState<PetStatus | undefined>(undefined);
  const { pets, loading, approvePet, rejectPet, deletePet } = useAllPets(statusFilter);
  
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmState, setConfirmState] = useState<ConfirmState>({
    isOpen: false,
    pet: null,
    action: null
  });

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
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: 'power3.out' }
      );
    }
  }, [loading, pets.length]);

  const openConfirm = (pet: Pet, action: ConfirmAction) => {
    setConfirmState({ isOpen: true, pet, action });
  };

  const closeConfirm = () => {
    setConfirmState({ isOpen: false, pet: null, action: null });
  };

  const handleConfirm = async () => {
    if (!confirmState.pet || !confirmState.action) return;

    setIsProcessing(true);
    try {
      switch (confirmState.action) {
        case 'approve': {
          // Only store the pet ID path, not the full URL (URL is constructed dynamically)
          const qrPath = `/pet/${confirmState.pet.id}`;
          await approvePet(confirmState.pet.id, qrPath);
          success(t('admin.approved'));
          break;
        }
        case 'reject': {
          await rejectPet(confirmState.pet.id);
          success(t('admin.rejected'));
          break;
        }
        case 'delete': {
          await deletePet(confirmState.pet.id);
          success(t('common.deleted'));
          break;
        }
      }
    } catch (error) {
      console.error(`Error ${confirmState.action}ing pet:`, error);
      showError(t('common.error'));
    } finally {
      setIsProcessing(false);
      closeConfirm();
    }
  };

  const getConfirmConfig = () => {
    switch (confirmState.action) {
      case 'approve':
        return {
          title: t('admin.approveTitle'),
          message: t('admin.approveConfirm'),
          confirmText: t('common.approve'),
          variant: 'success' as const
        };
      case 'reject':
        return {
          title: t('admin.rejectTitle'),
          message: t('admin.rejectConfirm'),
          confirmText: t('common.reject'),
          variant: 'warning' as const
        };
      case 'delete':
      default:
        return {
          title: t('admin.deleteTitle'),
          message: t('admin.deleteConfirm'),
          confirmText: t('common.delete'),
          variant: 'danger' as const
        };
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

  // Filter buttons with icons and colors
  const filterButtons: { label: string; value: PetStatus | undefined; count: number; icon: string; color: string }[] = [
    { label: t('admin.allSubmissions'), value: undefined, count: statusCounts.all, icon: '📋', color: 'gray' },
    { label: t('admin.pendingSubmissions'), value: 'pending', count: statusCounts.pending, icon: '⏳', color: 'yellow' },
    { label: t('admin.approvedSubmissions'), value: 'approved', count: statusCounts.approved, icon: '✅', color: 'green' },
    { label: t('admin.rejectedSubmissions'), value: 'rejected', count: statusCounts.rejected, icon: '❌', color: 'red' }
  ];

  const getFilterButtonClasses = (value: PetStatus | undefined, color: string) => {
    const isActive = statusFilter === value;
    if (isActive) {
      const colorMap: Record<string, string> = {
        gray: 'bg-gray-800 text-white shadow-gray-800/25',
        yellow: 'bg-yellow-500 text-white shadow-yellow-500/25',
        green: 'bg-green-500 text-white shadow-green-500/25',
        red: 'bg-red-500 text-white shadow-red-500/25'
      };
      return `${colorMap[color]} shadow-lg`;
    }
    return 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <LoadingSpinner size="lg" text={t('common.loading')} />
      </div>
    );
  }

  const confirmConfig = getConfirmConfig();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-12">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-0 w-96 h-96 bg-primary-100 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-20 left-0 w-72 h-72 bg-primary-50 rounded-full blur-3xl opacity-40" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={headerRef} className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/25">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              {t('admin.title')}
            </h1>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-3 mb-10">
          {filterButtons.map((btn) => (
            <button
              key={btn.label}
              onClick={() => setStatusFilter(btn.value)}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center gap-2 ${getFilterButtonClasses(btn.value, btn.color)}`}
            >
              <span>{btn.icon}</span>
              <span>{btn.label}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                statusFilter === btn.value 
                  ? 'bg-white/20' 
                  : 'bg-gray-100'
              }`}>
                {btn.count}
              </span>
            </button>
          ))}
        </div>

        {/* Processing Overlay */}
        {isProcessing && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-40">
            <div className="bg-white rounded-2xl p-8 shadow-2xl">
              <LoadingSpinner size="lg" />
            </div>
          </div>
        )}

        {/* Empty State */}
        {pets.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-12 text-center border border-gray-100">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <span className="text-5xl">📋</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              {t('admin.noSubmissions')}
            </h2>
          </div>
        ) : (
          /* Pet Grid */
          <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets.map((pet) => (
              <PetCard
                key={pet.id}
                pet={pet}
                isAdmin={true}
                onApprove={(p) => openConfirm(p, 'approve')}
                onReject={(p) => openConfirm(p, 'reject')}
                onDelete={(p) => openConfirm(p, 'delete')}
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
          variant="success"
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

        {/* Confirmation Dialog */}
        <ConfirmDialog
          isOpen={confirmState.isOpen}
          onClose={closeConfirm}
          onConfirm={handleConfirm}
          title={confirmConfig.title}
          message={confirmConfig.message}
          confirmText={confirmConfig.confirmText}
          cancelText={t('common.cancel')}
          variant={confirmConfig.variant}
          isLoading={isProcessing}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
