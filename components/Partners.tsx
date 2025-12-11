'use client';

import React from 'react';
import Image from 'next/image';

interface Partner {
  id: number;
  name: string;
  logo: string;
  description?: string;
}

const Partners: React.FC = () => {
  const partners: Partner[] = [
    {
      id: 1,
      name: 'Jotun',
      logo: '/jotun.png',
      description: 'Premium Paint Solutions'
    },
    {
      id: 2,
      name: 'Sabk',
      logo: '/sabk.png',
      description: 'Building Materials'
    },
    {
      id: 3,
      name: 'RAF',
      logo: '/raf.png',
      description: 'Real Estate Development'
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Our Partners
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We work with trusted partners to deliver the best quality and service to our clients.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {partners.map((partner) => (
            <div
              key={partner.id}
              className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow duration-300"
            >
              <div className="mb-4">
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={120}
                  height={80}
                  className="mx-auto object-contain"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {partner.name}
              </h3>
              {partner.description && (
                <p className="text-gray-600">
                  {partner.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;
