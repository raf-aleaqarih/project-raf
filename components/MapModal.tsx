'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, ExternalLink } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
  location: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

const MapModal = ({ isOpen, onClose, location, coordinates }: MapModalProps) => {
  const t = useTranslations('unitDetails');
  
  const getMapUrl = () => {
    const searchParams = new URLSearchParams();
    if (coordinates) {
      searchParams.append('q', `${coordinates.latitude},${coordinates.longitude}`);
    } else {
      searchParams.append('q', location);
    }
    return `https://www.google.com/maps/search/?api=1&${searchParams.toString()}`;
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/70" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <div className="relative">
                  <Dialog.Title className="text-2xl font-bold text-[#540f6b] mb-4">
                    {t('mapTitle')}
                  </Dialog.Title>
                  
                  <button
                    onClick={onClose}
                    className="absolute right-0 top-0 p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>

                  <div className="mt-4 space-y-4">
                    <p className="text-gray-600">{location}</p>
                    
                    <a
                      href={getMapUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-[#540f6b] text-white rounded-xl hover:bg-[#540f6b]/90 transition-colors group"
                    >
                      <ExternalLink className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span>{t('viewOnMap')}</span>
                    </a>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default MapModal;
