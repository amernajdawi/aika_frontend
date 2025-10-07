import { useState, useEffect } from 'react';
import { OnaceCategory, OnaceCategoriesResponse } from '../types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const useOnaceCategories = () => {
  const [categories, setCategories] = useState<OnaceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/onace/categories`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: OnaceCategoriesResponse = await response.json();
        setCategories(data.categories);
        setError(null);
      } catch (err) {
        console.error('Error fetching ÖNACE categories:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch categories');
        // Set default categories if API fails
        setCategories([
          { code: '0', name_german: 'Allgemein', name_english: 'General', description: 'Applies to all industries' },
          { code: 'A', name_german: 'Land- und Forstwirtschaft', name_english: 'Agriculture', description: 'Agriculture, Forestry, and Fishing' },
          { code: 'C', name_german: 'Herstellung von Waren', name_english: 'Manufacturing', description: 'Manufacturing' },
          { code: 'K', name_german: 'Finanz- und Versicherungsdienstleistungen', name_english: 'Financial Services', description: 'Financial and Insurance Services' },
          { code: 'F', name_german: 'Bau', name_english: 'Construction', description: 'Construction' },
          { code: 'G', name_german: 'Handel', name_english: 'Trade', description: 'Trade' },
          { code: 'H', name_german: 'Verkehr und Lagerei', name_english: 'Transport', description: 'Transport and Storage' },
          { code: 'I', name_german: 'Beherbergung und Gastronomie', name_english: 'Hospitality', description: 'Accommodation and Catering' },
          { code: 'L', name_german: 'Grundstücks- und Wohnungswesen', name_english: 'Real Estate', description: 'Real Estate Activities' },
          { code: 'D', name_german: 'Energieversorgung', name_english: 'Energy', description: 'Energy Supply' },
          { code: 'E', name_german: 'Wasserversorgung', name_english: 'Water/Waste', description: 'Water Supply and Waste Management' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const getCategoryByCode = (code: string): OnaceCategory | undefined => {
    return categories.find(cat => cat.code === code);
  };

  const getCategoryName = (code: string, language: 'german' | 'english' = 'english'): string => {
    const category = getCategoryByCode(code);
    if (!category) return code;
    return language === 'german' ? category.name_german : category.name_english;
  };

  return {
    categories,
    loading,
    error,
    getCategoryByCode,
    getCategoryName
  };
};
