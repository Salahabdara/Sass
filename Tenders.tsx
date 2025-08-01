import { useEffect, useState } from 'react';
import { SearchIcon, SlidersHorizontalIcon } from 'lucide-react';
import Header from '@/react-app/components/Header';
import TenderCard from '@/react-app/components/TenderCard';
import { TenderType } from '@/shared/types';

export default function Tenders() {
  const [tenders, setTenders] = useState<TenderType[]>([]);
  const [filteredTenders, setFilteredTenders] = useState<TenderType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    const fetchTenders = async () => {
      try {
        const response = await fetch('/api/tenders');
        const data = await response.json();
        setTenders(data);
        setFilteredTenders(data);
      } catch (error) {
        console.error('Error fetching tenders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTenders();
  }, []);

  useEffect(() => {
    let filtered = tenders;

    if (searchTerm) {
      filtered = filtered.filter(tender =>
        tender.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tender.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tender.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(tender => tender.category === selectedCategory);
    }

    setFilteredTenders(filtered);
  }, [tenders, searchTerm, selectedCategory]);

  const categories = [...new Set(tenders.map(tender => tender.category).filter(Boolean))];

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">المناقصات</h1>
          <p className="text-lg text-gray-600">اكتشف {filteredTenders.length.toLocaleString()} مناقصة وفرصة تجارية</p>
        </div>

        {/* Search and Filters */}
        <div className="glassdoor-card p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <SearchIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="البحث عن المناقصات أو المؤسسات"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-4 pr-12 py-3 text-base border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
            <div className="relative">
              <SlidersHorizontalIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-4 pr-10 py-3 text-base border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors"
              >
                <option value="">جميع الفئات</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4 space-x-reverse">
            <p className="text-lg font-medium text-gray-900">
              {filteredTenders.length.toLocaleString()} مناقصة
            </p>
            {(searchTerm || selectedCategory) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('');
                }}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                مسح الفلاتر
              </button>
            )}
          </div>
          <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-600">
            <span>ترتيب حسب:</span>
            <select className="border border-gray-300 rounded px-2 py-1 text-sm">
              <option>الأحدث</option>
              <option>آخر موعد تسليم</option>
              <option>القيمة</option>
            </select>
          </div>
        </div>

        {/* Tenders List */}
        {filteredTenders.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredTenders.map((tender) => (
              <TenderCard key={tender.id} tender={tender} />
            ))}
          </div>
        ) : (
          <div className="glassdoor-card p-12 text-center">
            <SearchIcon className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">لا توجد مناقصات مطابقة</h3>
            <p className="text-gray-600 mb-6">جرب تعديل معايير البحث أو الفلاتر للعثور على المزيد من النتائج</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
              }}
              className="inline-flex items-center px-6 py-3 text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              عرض جميع المناقصات
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
