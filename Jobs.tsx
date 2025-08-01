import { useEffect, useState } from 'react';
import { SearchIcon, SlidersHorizontalIcon } from 'lucide-react';
import Header from '@/react-app/components/Header';
import JobCard from '@/react-app/components/JobCard';
import { JobType } from '@/shared/types';

export default function Jobs() {
  const [jobs, setJobs] = useState<JobType[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<JobType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJobType, setSelectedJobType] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('/api/jobs');
        const data = await response.json();
        setJobs(data);
        setFilteredJobs(data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    let filtered = jobs;

    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (job.location && job.location.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedJobType) {
      filtered = filtered.filter(job => job.job_type === selectedJobType);
    }

    if (selectedLocation) {
      filtered = filtered.filter(job => job.location && job.location.includes(selectedLocation));
    }

    setFilteredJobs(filtered);
  }, [jobs, searchTerm, selectedJobType, selectedLocation]);

  const jobTypes = [...new Set(jobs.map(job => job.job_type).filter(Boolean))];
  const locations = [...new Set(jobs.map(job => job.location).filter(Boolean))];

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">الوظائف</h1>
          <p className="text-lg text-gray-600">اكتشف {filteredJobs.length.toLocaleString()} فرصة وظيفية متميزة</p>
        </div>

        {/* Search and Filters */}
        <div className="glassdoor-card p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <SearchIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="البحث عن الوظائف أو الشركات"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-4 pr-12 py-3 text-base border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                />
              </div>
            </div>
            <div className="relative">
              <SlidersHorizontalIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <select
                value={selectedJobType}
                onChange={(e) => setSelectedJobType(e.target.value)}
                className="w-full pl-4 pr-10 py-3 text-base border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white transition-colors"
              >
                <option value="">جميع أنواع العمل</option>
                {jobTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative">
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full pl-4 pr-3 py-3 text-base border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white transition-colors"
              >
                <option value="">جميع المواقع</option>
                {locations.map((location) => (
                  <option key={location} value={location}>
                    {location}
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
              {filteredJobs.length.toLocaleString()} وظيفة
            </p>
            {(searchTerm || selectedJobType || selectedLocation) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedJobType('');
                  setSelectedLocation('');
                }}
                className="text-sm text-green-600 hover:text-green-700"
              >
                مسح الفلاتر
              </button>
            )}
          </div>
          <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-600">
            <span>ترتيب حسب:</span>
            <select className="border border-gray-300 rounded px-2 py-1 text-sm">
              <option>الأحدث</option>
              <option>الراتب</option>
              <option>الشركة</option>
              <option>الموقع</option>
            </select>
          </div>
        </div>

        {/* Jobs List */}
        {filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className="glassdoor-card p-12 text-center">
            <SearchIcon className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">لا توجد وظائف مطابقة</h3>
            <p className="text-gray-600 mb-6">جرب تعديل معايير البحث أو الفلاتر للعثور على المزيد من النتائج</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedJobType('');
                setSelectedLocation('');
              }}
              className="inline-flex items-center px-6 py-3 text-base font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 transition-colors"
            >
              عرض جميع الوظائف
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
