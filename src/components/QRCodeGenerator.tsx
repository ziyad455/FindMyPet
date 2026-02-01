// QR Code component for generating and downloading QR codes
// Uses qrcode.react library

import React, { useRef, useCallback } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useLanguage } from '../context';

interface QRCodeGeneratorProps {
  petId: string;
  petName: string;
  size?: number;
  showDownload?: boolean;
}

export const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({
  petId,
  petName,
  size = 200,
  showDownload = true
}) => {
  const { t } = useLanguage();
  const qrRef = useRef<HTMLDivElement>(null);

  // Generate the URL for the QR code
  const qrUrl = `${window.location.origin}/pet/${petId}`;

  // Download QR code as PNG
  const downloadQRCode = useCallback(() => {
    if (!qrRef.current) return;

    const svg = qrRef.current.querySelector('svg');
    if (!svg) return;

    // Create canvas from SVG
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size with padding
    const padding = 20;
    canvas.width = size + padding * 2;
    canvas.height = size + padding * 2;

    // Fill white background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Convert SVG to data URL
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);

    // Create image and draw to canvas
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, padding, padding, size, size);
      URL.revokeObjectURL(svgUrl);

      // Download as PNG
      const link = document.createElement('a');
      link.download = `${petName}-QR-Code.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    img.src = svgUrl;
  }, [petName, size]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        ref={qrRef}
        className="bg-white p-4 rounded-lg shadow-md"
      >
        <QRCodeSVG
          value={qrUrl}
          size={size}
          level="H"
          includeMargin={true}
          bgColor="#ffffff"
          fgColor="#000000"
        />
      </div>

      {showDownload && (
        <button
          onClick={downloadQRCode}
          className="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          {t('common.download')}
        </button>
      )}

      <p className="text-sm text-gray-500 text-center max-w-xs">
        {qrUrl}
      </p>
    </div>
  );
};

export default QRCodeGenerator;
