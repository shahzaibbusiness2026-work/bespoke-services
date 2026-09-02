'use client';

import dynamic from 'next/dynamic';
import { Toast } from '@/src/components/Toast';

const AdminDashboard = dynamic(
  () => import('@/src/components/AdminDashboard').then((mod) => mod.AdminDashboard),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-[#1a1c1b] flex items-center justify-center p-6 text-white">
        <div className="bg-[#242625] border border-[#383838] w-full max-w-md p-8 shadow-2xl flex flex-col items-center justify-center py-16 space-y-4">
          <div className="w-8 h-8 border-2 border-[#d7c7b3] border-t-transparent animate-spin" />
          <p className="text-body-xs text-[#d7c7b3] font-mono tracking-widest uppercase">
            Loading Atelier Portal...
          </p>
        </div>
      </div>
    ),
  }
);

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-[#faf9f7] text-[#1a1c1b]">
      <AdminDashboard />
      <Toast />
    </div>
  );
}
