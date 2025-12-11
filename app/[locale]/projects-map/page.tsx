import ProjectsMapPage from "@/components/ProjectsMapPage";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'خريطة المشاريع العقارية | راف العقارية',
  description: 'استكشف مشاريعنا العقارية المتميزة في جدة على الخريطة التفاعلية. اكتشف المواقع والمشاريع السكنية والتجارية بسهولة.',
  keywords: ['خريطة المشاريع', 'عقارات جدة', 'مشاريع سكنية', 'مشاريع تجارية', 'راف العقارية'],
  openGraph: {
    title: 'خريطة المشاريع العقارية | راف العقارية',
    description: 'استكشف مشاريعنا العقارية المتميزة في جدة على الخريطة التفاعلية',
    type: 'website',
  },
};

export default function ProjectsMapPageWrapper() {
  return <ProjectsMapPage />;
}
