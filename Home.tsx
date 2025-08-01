import { useState, useEffect } from 'react';
import { SearchIcon, BriefcaseIcon, FileTextIcon, TrendingUpIcon, UsersIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import Header from '@/react-app/components/Header';
import JobCard from '@/react-app/components/JobCard';
import TenderCard from '@/react-app/components/TenderCard';
import { JobType, TenderType } from '@/shared/types';

export default function HomePage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [recentJobs, setRecentJobs] = useState<JobType[]>([]);
  const [recentTenders, setRecentTenders] = useState<TenderType[]>([]);
  const [stats, setStats] = useState({ jobs: 0, tenders: 0, companies: 0, users: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsResponse, tendersResponse] = await Promise.all([
          fetch('/api/jobs'),
          fetch('/api/tenders')
        ]);

        const jobs = await jobsResponse.json();
        const tenders = await tendersResponse.json();

        setRecentJobs(jobs.slice(0, 6));
        setRecentTenders(tenders.slice(0, 6));
        
        // Calculate basic stats
        const uniqueCompanies = new Set(jobs.map((job: JobType) => job.company)).size;
        setStats({
          jobs: jobs.length,
          tenders: tenders.length,
          companies: uniqueCompanies,
          users: 150 // Mock data
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/jobs?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 via-green-500 to-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              وظائف برو
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-green-100 max-w-3xl mx-auto">
              منصة الوظائف والمناقصات الذكية مع نظام ATS متقدم لمطابقة السير الذاتية باستخدام الذكاء الاصطناعي
            </p>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
              <div className="flex bg-white rounded-2xl shadow-2xl overflow-hidden">
                <input
                  type="text"
                  placeholder="ابحث عن الوظائف أو المناقصات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 px-6 py-4 text-gray-900 text-lg placeholder-gray-500 border-none outline-none"
                />
                <button
                  type="submit"
                  className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center"
                >
                  <SearchIcon className="h-5 w-5 ml-2" />
                  بحث
                </button>
              </div>
            </form>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/jobs"
                className="inline-flex items-center px-8 py-3 bg-white text-green-600 font-semibold rounded-xl hover:bg-green-50 transition-all duration-200 shadow-lg"
              >
                <BriefcaseIcon className="h-5 w-5 ml-2" />
                تصفح الوظائف
              </Link>
              <Link
                to="/tenders"
                className="inline-flex items-center px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-green-600 transition-all duration-200"
              >
                <FileTextIcon className="h-5 w-5 ml-2" />
                تصفح المناقصات
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <BriefcaseIcon className="h-8 w-8 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900">{stats.jobs.toLocaleString()}</div>
              <div className="text-gray-600">وظيفة نشطة</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FileTextIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900">{stats.tenders.toLocaleString()}</div>
              <div className="text-gray-600">مناقصة نشطة</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <TrendingUpIcon className="h-8 w-8 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900">{stats.companies.toLocaleString()}</div>
              <div className="text-gray-600">شركة موثقة</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <UsersIcon className="h-8 w-8 text-orange-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900">{stats.users.toLocaleString()}</div>
              <div className="text-gray-600">مستخدم مسجل</div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Jobs */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">أحدث الوظائف</h2>
            <Link
              to="/jobs"
              className="inline-flex items-center text-green-600 hover:text-green-700 font-medium"
            >
              عرض جميع الوظائف
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
          </div>
          
          {recentJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BriefcaseIcon className="mx-auto h-16 w-16 text-gray-300 mb-4" />
              <p className="text-gray-500">لا توجد وظائف متاحة حالياً</p>
            </div>
          )}
        </div>
      </section>

      {/* Recent Tenders */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">أحدث المناقصات</h2>
            <Link
              to="/tenders"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              عرض جميع المناقصات
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
          </div>
          
          {recentTenders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentTenders.map((tender) => (
                <TenderCard key={tender.id} tender={tender} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileTextIcon className="mx-auto h-16 w-16 text-gray-300 mb-4" />
              <p className="text-gray-500">لا توجد مناقصات متاحة حالياً</p>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            هل تبحث عن موظفين مؤهلين؟
          </h2>
          <p className="text-xl text-green-100 mb-8">
            انشر وظيفتك اليوم واكتشف أفضل المواهب في المملكة
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/add-job"
              className="inline-flex items-center px-8 py-4 bg-white text-green-600 font-semibold rounded-xl hover:bg-green-50 transition-all duration-200 shadow-lg"
            >
              <BriefcaseIcon className="h-5 w-5 ml-2" />
              نشر وظيفة جديدة
            </Link>
            <Link
              to="/add-tender"
              className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-green-600 transition-all duration-200"
            >
              <FileTextIcon className="h-5 w-5 ml-2" />
              نشر مناقصة جديدة
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-3 space-x-reverse mb-4">
                <div className="bg-green-500 p-2 rounded-lg">
                  <BriefcaseIcon className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">وظائف برو</span>
              </div>
              <p className="text-gray-400 max-w-md">
                منصتك الذكية للعثور على أفضل الوظائف والمناقصات مع نظام ATS متقدم لمطابقة السير الذاتية
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">روابط سريعة</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/jobs" className="hover:text-white transition-colors">الوظائف</Link></li>
                <li><Link to="/tenders" className="hover:text-white transition-colors">المناقصات</Link></li>
                <li><Link to="/add-job" className="hover:text-white transition-colors">نشر وظيفة</Link></li>
                <li><Link to="/add-tender" className="hover:text-white transition-colors">نشر مناقصة</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">الدعم</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">مركز المساعدة</a></li>
                <li><a href="#" className="hover:text-white transition-colors">اتصل بنا</a></li>
                <li><a href="#" className="hover:text-white transition-colors">شروط الاستخدام</a></li>
                <li><a href="#" className="hover:text-white transition-colors">سياسة الخصوصية</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 وظائف برو. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
