import React, { Suspense } from 'react';
import SearchClient from '@/app/search/SearchClient';

export default function SearchPage() {
  return (
    <main className="pt-24">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-white">Search</h1>
      </div>

      <Suspense fallback={<div className="py-12 text-center text-gray-400">Loading search...</div>}>
        <SearchClient />
      </Suspense>
    </main>
  );
}


