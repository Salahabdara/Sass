import { useEffect, useState } from 'react';
import { useAuth } from '@getmocha/users-service/react';
import { useNavigate } from 'react-router';
import { UserIcon, BriefcaseIcon, FileTextIcon, SettingsIcon, LogOutIcon, ShieldIcon } from 'lucide-react';
import Header from '@/react-app/components/Header';
import { JobType, TenderType } from '@/shared/types';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [userJobs, setUserJobs] = useState<JobType[]>([]);
  const [userTenders, setUserTenders] = useState<TenderType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    const fetchUserContent = async () => {
      try {
        const [jobsResponse, tendersResponse] = await Promise.all([
          fetch('/api/jobs'),
          fetch('/api/tenders')
        ]);

        const jobs = await jobsResponse.json();
        const tenders = await tendersResponse.json();

        // Filter by user (in a real app, this would be done on the backend)
        setUserJobs(jobs.filter((job: JobType & { created_by?: string }) => job.created_by === user.id));
        setUserTenders(tenders.filter((tender: TenderType & { created_by?: string }) => tender.created_by === user.id));
      } catch (error) {
        console.error('Error fetching user content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserContent();
  }, [user, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isAdmin = user?.email === "admin@example.com" || user?.email.endsWith("@getmocha.com");

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <div className="glassdoor-card p-6 text-center">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                {user.google_user_data.picture ? (
                  <img 
                    src={user.google_user_data.picture} 
                    alt={user.google_user_data.name || user.email}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <UserIcon className="h-10 w-10 text-white" />
                )}
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                {user.google_user_data.name || user.email}
              </h2>
              <p className="text-gray-600 mb-4">{user.email}</p>
              
              <div className="space-y-3">
                {isAdmin && (
                  <button
                    onClick={() => navigate('/admin')}
                    className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                  >
                    <ShieldIcon className="h-4 w-4 ml-2" />
                    لوحة التحكم
                  </button>
                )}
                <button className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors">
                  <SettingsIcon className="h-4 w-4 ml-2" />
                  الإعدادات
                </button>
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg text-red-700 bg-red-50 hover:bg-red-100 transition-colors"
                >
                  <LogOutIcon className="h-4 w-4 ml-2" />
                  تسجيل الخروج
                </button>
              </div>
            </div>
            
            <div className="glassdoor-card p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">إحصائياتي</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">الوظائف المنشورة</span>
                  <span className="font-semibold text-green-600">{userJobs.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">المناقصات المنشورة</span>
                  <span className="font-semibold text-blue-600">{userTenders.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">تاريخ الانضمام</span>
                  <span className="text-sm text-gray-500">
                    {new Date(user.created_at).toLocaleDateString('ar-SA')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
              </div>
            ) : (
              <div className="space-y-8">
                {/* My Jobs */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                      <BriefcaseIcon className="h-6 w-6 ml-2 text-green-600" />
                      وظائفي المنشورة
                    </h2>
                    <button
                      onClick={() => navigate('/add-job')}
                      className="px-4 py-2 text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 transition-colors"
                    >
                      أضف وظيفة جديدة
                    </button>
                  </div>
                  
                  {userJobs.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                      {userJobs.map((job) => (
                        <div key={job.id} className="glassdoor-card p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900 mb-2">{job.title}</h3>
                              <p className="text-gray-600 mb-2">{job.company}</p>
                              <p className="text-sm text-gray-500 line-clamp-2">{job.description}</p>
                            </div>
                            <div className="text-sm text-gray-400">
                              {job.created_at && new Date(job.created_at).toLocaleDateString('ar-SA')}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="glassdoor-card p-12 text-center">
                      <BriefcaseIcon className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">لا توجد وظائف منشورة</h3>
                      <p className="text-gray-600">ابدأ بنشر وظيفتك الأولى</p>
                    </div>
                  )}
                </div>

                {/* My Tenders */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                      <FileTextIcon className="h-6 w-6 ml-2 text-blue-600" />
                      مناقصاتي المنشورة
                    </h2>
                    <button
                      onClick={() => navigate('/add-tender')}
                      className="px-4 py-2 text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                    >
                      أضف مناقصة جديدة
                    </button>
                  </div>
                  
                  {userTenders.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                      {userTenders.map((tender) => (
                        <div key={tender.id} className="glassdoor-card p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900 mb-2">{tender.title}</h3>
                              <p className="text-gray-600 mb-2">{tender.organization}</p>
                              <p className="text-sm text-gray-500 line-clamp-2">{tender.description}</p>
                            </div>
                            <div className="text-sm text-gray-400">
                              {tender.created_at && new Date(tender.created_at).toLocaleDateString('ar-SA')}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="glassdoor-card p-12 text-center">
                      <FileTextIcon className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">لا توجد مناقصات منشورة</h3>
                      <p className="text-gray-600">ابدأ بنشر مناقصتك الأولى</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
