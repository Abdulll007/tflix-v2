'use client';

import { Genre } from '@/types';
import { useState, useEffect } from 'react';

interface FiltersProps {
  genres: Genre[];
  value:{
    genre: string;
    sortBy: string;
    year: string;
  }
  onFilterChange: (filters: { genre: string; sortBy: string; year: string }) => void;
}

export default function Filters({value, genres, onFilterChange }: FiltersProps) {
  const [selectedGenre, setSelectedGenre] = useState(value.genre);
  const [selectedSort, setSelectedSort] = useState(value.sortBy);
  const [selectedYear, setSelectedYear] = useState(value.year);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  const sortOptions = [
    { value: 'popularity.desc', label: 'Popularity Descending' },
    { value: 'popularity.asc', label: 'Popularity Ascending' },
    { value: 'vote_average.desc', label: 'Rating Descending' },
    { value: 'vote_average.asc', label: 'Rating Ascending' },
    { value: 'release_date.desc', label: 'Release Date Descending' },
    { value: 'release_date.asc', label: 'Release Date Ascending' },
  ];

  useEffect(() => {
    onFilterChange({
      genre: selectedGenre,
      sortBy: selectedSort,
      year: selectedYear,
    });
  }, [selectedGenre, selectedSort, selectedYear, onFilterChange]);

  return (
    <div className="flex flex-wrap gap-4 mb-8">
      <select
        value={selectedGenre}
        onChange={(e) => setSelectedGenre(e.target.value)}
        className="bg-gray-900 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
      >
        <option value="">All Genres</option>
        {genres.map((genre) => (
          <option key={genre.id} value={genre.id}>
            {genre.name}
          </option>
        ))}
      </select>

      <select
        value={selectedSort}
        onChange={(e) => setSelectedSort(e.target.value)}
        className="bg-gray-900 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <select
        value={selectedYear}
        onChange={(e) => setSelectedYear(e.target.value)}
        className="bg-gray-900 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
      >
        <option value="">All Years</option>
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
}
