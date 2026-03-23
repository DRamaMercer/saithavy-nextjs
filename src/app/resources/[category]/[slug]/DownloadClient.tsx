/**
 * Download Client Component
 *
 * Client-side component for download functionality
 * with modal integration
 */

'use client';

import { useState } from 'react';
import { Resource } from '@/types/resources';
import { trackEvent } from '@/lib/analytics';
import ResourceDownloadModal from '@/components/ResourceDownloadModal';

interface DownloadClientProps {
  resource: Resource;
}

export default function DownloadClient({ resource }: DownloadClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [downloadStarted, setDownloadStarted] = useState(false);

  const handleDownloadClick = () => {
    // Track resource view
    trackEvent('resource_download_click', {
      resource_id: resource.id,
      resource_title: resource.title,
      resource_category: resource.category,
    });

    setIsModalOpen(true);
  };

  const handleDownload = async (format: 'pdf' | 'web' | 'print') => {
    // Track download event
    trackEvent('resource_download', {
      resource_id: resource.id,
      resource_title: resource.title,
      resource_category: resource.category,
      download_format: format,
    });

    setDownloadStarted(true);

    // Implement actual download logic
    switch (format) {
      case 'pdf':
        // Trigger PDF download
        await downloadPDF(resource);
        break;
      case 'web':
        // Navigate to web version or open in new tab
        window.open(`/resources/${resource.category}/${resource.slug}`, '_blank');
        break;
      case 'print':
        // Trigger print dialog
        window.print();
        break;
    }

    // Close modal after delay
    setTimeout(() => {
      setIsModalOpen(false);
      setDownloadStarted(false);
    }, 3000);
  };

  const downloadPDF = async (resource: Resource) => {
    try {
      // Call PDF generation API
      const response = await fetch('/api/pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resourceId: resource.id,
          title: resource.title,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      // Get blob and create download link
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${resource.slug}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('[DownloadClient] PDF download failed:', error);
      // Fallback: show error message
      alert('Failed to download PDF. Please try again.');
    }
  };

  return (
    <>
      <div className="mb-8 flex justify-center">
        <button
          onClick={handleDownloadClick}
          className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all transform hover:scale-105 shadow-lg"
        >
          Download Resource
        </button>
      </div>

      <ResourceDownloadModal
        resource={resource}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDownload={handleDownload}
      />
    </>
  );
}
