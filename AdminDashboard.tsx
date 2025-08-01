import { useEffect, useState } from 'react';
import { useAuth } from '@getmocha/users-service/react';
import { useNavigate } from 'react-router';
import { 
  BarChart3Icon, 
  BriefcaseIcon, 
  FileTextIcon, 
  TrendingUpIcon,
  ShieldCheckIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  ClockIcon
} from 'lucide-react';
import Header from '@/react-app/components/Header';
import { JobType, TenderType } from '@/shared/types';

interface AdminStats {
  totalJobs: number;
  totalTenders: number;
  activeJobs: number;
  activeTenders: number;
}

interface PendingJob extends JobType {
  created_by?: string;
}

interface PendingTender extends TenderType {
  created_by?: string;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [pendingJobs, setPendingJobs] = useState<PendingJob[]>([]);
  const [pendingTenders, setPendingTenders] = useState<PendingTender[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'pending-jobs' | 'pending-tenders'>('overview');

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    const isAdmin = user.email === "admin@example.com" || user.email.endsWith("@getmocha.com");
    
    if (!isAdmin) {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        const [statsResponse, pendingJobsResponse, pendingTendersResponse] = await Promise.all([
          fetch('/api/admin/stats'),
          fetch('/api/admin/pending-jobs'),
          fetch('/api/admin/pending-tenders')
        ]);
        
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData);
        }
        
        if (pendingJobsResponse.ok) {
          const jobsData = await pendingJobsResponse.json();
          setPendingJobs(jobsData);
        }
        
        if (pendingTendersResponse.ok) {
          const tendersData = await pendingTendersResponse.json();
          setPendingTenders(tendersData);
        }
      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate]);

  const handleApproveJob = async (jobId: number) => {
    try {
      const response = await fetch(`/api/admin/approve-job/${jobId}`, {
        method: 'POST',
      });
      
      if (response.ok) {
        setPendingJobs(prev => prev.filter(job => job.id !== jobId));
        if (stats) {
          setStats(prev => prev ? { ...prev, activeJobs: prev.activeJobs + 1 } : null);
        }
        alert('تم الموافقة على الوظيفة بنجاح');
      }
    } catch (error) {
      console.error('Error approving job:', error);
      alert('حدث خطأ أثناء الموافقة على الوظيفة');
    }
  };

  const handleRejectJob = async (jobId: number) => {
    if (!confirm('هل أنت متأكد من رفض هذه الوظيفة؟')) return;
    
    try {
      const response = await fetch(`/api/admin/reject-job/${jobId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setPendingJobs(prev => prev.filter(job => job.id !== jobId));
        alert('تم رفض الوظيفة');
      }
    } catch (error) {
      console.error('Error rejecting job:', error);
      alert('حدث خطأ أثناء رفض الوظيفة');
    }
  };

  const handleApproveTender = async (tenderId: number) => {
    try {
      const response = await fetch(`/api/admin/approve-tender/${tenderId}`, {
        method: 'POST',
      });
      
      if (response.ok) {
        setPendingTenders(prev => prev.filter(tender => tender.id !== tenderId));
        if (stats) {
          setStats(prev => prev ? { ...prev, activeTenders: prev.activeTenders + 1 } : null);
        }
        alert('تم الموافقة على المناقصة بنجاح');
      }
    } catch (error) {
      console.error('Error approving tender:', error);
      alert('حدث خطأ أثناء الموافقة على المناقصة');
    }
  };

  const handleRejectTender = async (tenderId: number) => {
    if (!confirm('هل أنت متأكد من رفض هذه المناقصة؟')) return;
    
    try {
      const response = await fetch(`/api/admin/reject-tender/${tenderId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setPendingTenders(prev => prev.filter(tender => tender.id !== tenderId));
        alert('تم رفض المناقصة');
      }
    } catch (error) {
      console.error('Error rejecting tender:', error);
      alert('حدث خطأ أثناء رفض المناقصة');
    }
  };

  if (!user || loading) {
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <ShieldCheckIcon className="h-8 w-8 ml-3 text-blue-600" />
              لوحة تحكم المدير
            </h1>
            <p className="text-gray-600 mt-2">مرحباً {user.google_user_data.name || user.email}</p>
          </div>
          
          {/* Notification Badges */}
          <div className="flex items-center space-x-4 space-x-reverse">
            {pendingJobs.length > 0 && (
              <div className="flex items-center bg-yellow-100 text-yellow-800 px-3 py-2 rounded-lg">
                <ClockIcon className="h-4 w-4 ml-1" />
                {pendingJobs.length} وظيفة قيد المراجعة
              </div>
            )}
            {pendingTenders.length > 0 && (
              <div className="flex items-center bg-blue-100 text-blue-800 px-3 py-2 rounded-lg">
                <ClockIcon className="h-4 w-4 ml-1" />
                {pendingTenders.length} مناقصة قيد المراجعة
              </div>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 space-x-reverse bg-gray-100 p-1 rounded-lg mb-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'overview'
                ? 'bg-white text-gray-900 shadow'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            نظرة عامة
          </button>
          <button
            onClick={() => setActiveTab('pending-jobs')}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors relative ${
              activeTab === 'pending-jobs'
                ? 'bg-white text-gray-900 shadow'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            الوظائف قيد المراجعة
            {pendingJobs.length > 0 && (
              <span className="absolute -top-1 -left-1 bg-yellow-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {pendingJobs.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('pending-tenders')}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors relative ${
              activeTab === 'pending-tenders'
                ? 'bg-white text-gray-900 shadow'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            المناقصات قيد المراجعة
            {pendingTenders.length > 0 && (
              <span className="absolute -top-1 -left-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {pendingTenders.length}
              </span>
            )}
          </button>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'overview' && (
          <>
            {/* Stats Cards */}
            {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="glassdoor-card p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-green-100">
                  <BriefcaseIcon className="h-8 w-8 text-green-600" />
                </div>
                <div className="mr-4">
                  <p className="text-sm font-medium text-gray-600">إجمالي الوظائف</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalJobs}</p>
                </div>
              </div>
            </div>

            <div className="glassdoor-card p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-blue-100">
                  <FileTextIcon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="mr-4">
                  <p className="text-sm font-medium text-gray-600">إجمالي المناقصات</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalTenders}</p>
                </div>
              </div>
            </div>

            <div className="glassdoor-card p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-yellow-100">
                  <TrendingUpIcon className="h-8 w-8 text-yellow-600" />
                </div>
                <div className="mr-4">
                  <p className="text-sm font-medium text-gray-600">الوظائف النشطة</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.activeJobs}</p>
                </div>
              </div>
            </div>

            <div className="glassdoor-card p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-purple-100">
                  <BarChart3Icon className="h-8 w-8 text-purple-600" />
                </div>
                <div className="mr-4">
                  <p className="text-sm font-medium text-gray-600">المناقصات النشطة</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.activeTenders}</p>
                </div>
              </div>
            </div>
          </div>
            )}

            {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="glassdoor-card p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <BriefcaseIcon className="h-6 w-6 ml-2 text-green-600" />
              إدارة الوظائف
            </h2>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/jobs')}
                className="w-full text-right px-4 py-3 text-sm font-medium rounded-lg text-gray-700 bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                عرض جميع الوظائف
              </button>
              <button
                onClick={() => navigate('/add-job')}
                className="w-full text-right px-4 py-3 text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 transition-colors"
              >
                إضافة وظيفة جديدة
              </button>
            </div>
          </div>

          <div className="glassdoor-card p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <FileTextIcon className="h-6 w-6 ml-2 text-blue-600" />
              إدارة المناقصات
            </h2>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/tenders')}
                className="w-full text-right px-4 py-3 text-sm font-medium rounded-lg text-gray-700 bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                عرض جميع المناقصات
              </button>
              <button
                onClick={() => navigate('/add-tender')}
                className="w-full text-right px-4 py-3 text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                إضافة مناقصة جديدة
              </button>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glassdoor-card p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <BarChart3Icon className="h-6 w-6 ml-2 text-gray-600" />
            النشاط الأخير
          </h2>
          <div className="space-y-4">
            <div className="flex items-center p-4 bg-green-50 rounded-lg">
              <div className="p-2 bg-green-100 rounded-full ml-3">
                <BriefcaseIcon className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">تم إضافة وظيفة جديدة</p>
                <p className="text-xs text-gray-500">منذ 5 دقائق</p>
              </div>
            </div>
            
            <div className="flex items-center p-4 bg-blue-50 rounded-lg">
              <div className="p-2 bg-blue-100 rounded-full ml-3">
                <FileTextIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">تم إضافة مناقصة جديدة</p>
                <p className="text-xs text-gray-500">منذ 15 دقيقة</p>
              </div>
            </div>

            <div className="flex items-center p-4 bg-yellow-50 rounded-lg">
              <div className="p-2 bg-yellow-100 rounded-full ml-3">
                <AlertTriangleIcon className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">تحديث في نظام الإشعارات</p>
                <p className="text-xs text-gray-500">منذ ساعة</p>
              </div>
            </div>
          </div>
            </div>
            
            {/* Recent Activity */}
            <div className="glassdoor-card p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <BarChart3Icon className="h-6 w-6 ml-2 text-gray-600" />
                النشاط الأخير
              </h2>
              <div className="space-y-4">
                <div className="flex items-center p-4 bg-green-50 rounded-lg">
                  <div className="p-2 bg-green-100 rounded-full ml-3">
                    <BriefcaseIcon className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">تم إضافة وظيفة جديدة</p>
                    <p className="text-xs text-gray-500">منذ 5 دقائق</p>
                  </div>
                </div>
                
                <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                  <div className="p-2 bg-blue-100 rounded-full ml-3">
                    <FileTextIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">تم إضافة مناقصة جديدة</p>
                    <p className="text-xs text-gray-500">منذ 15 دقيقة</p>
                  </div>
                </div>

                <div className="flex items-center p-4 bg-yellow-50 rounded-lg">
                  <div className="p-2 bg-yellow-100 rounded-full ml-3">
                    <AlertTriangleIcon className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">تحديث في نظام الإشعارات</p>
                    <p className="text-xs text-gray-500">منذ ساعة</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Pending Jobs Tab */}
        {activeTab === 'pending-jobs' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">الوظائف قيد المراجعة</h2>
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                {pendingJobs.length} وظيفة
              </span>
            </div>
            
            {pendingJobs.length > 0 ? (
              <div className="space-y-4">
                {pendingJobs.map((job) => (
                  <div key={job.id} className="glassdoor-card p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{job.title}</h3>
                        <p className="text-gray-600 mb-2">{job.company}</p>
                        <p className="text-sm text-gray-500 line-clamp-2 mb-4">{job.description}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                          {job.location && (
                            <div>الموقع: {job.location}</div>
                          )}
                          {job.job_type && (
                            <div>النوع: {job.job_type}</div>
                          )}
                          {job.salary_range && (
                            <div>الراتب: {job.salary_range}</div>
                          )}
                          {job.created_at && (
                            <div>تاريخ النشر: {new Date(job.created_at).toLocaleDateString('ar-SA')}</div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <button
                          onClick={() => window.open(`/jobs/${job.id}`, '_blank')}
                          className="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                        >
                          <EyeIcon className="h-4 w-4 ml-1" />
                          عرض
                        </button>
                        <button
                          onClick={() => handleApproveJob(job.id!)}
                          className="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 transition-colors"
                        >
                          <CheckCircleIcon className="h-4 w-4 ml-1" />
                          موافقة
                        </button>
                        <button
                          onClick={() => handleRejectJob(job.id!)}
                          className="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors"
                        >
                          <XCircleIcon className="h-4 w-4 ml-1" />
                          رفض
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="glassdoor-card p-12 text-center">
                <BriefcaseIcon className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">لا توجد وظائف قيد المراجعة</h3>
                <p className="text-gray-600">جميع الوظائف تم مراجعتها والموافقة عليها</p>
              </div>
            )}
          </div>
        )}

        {/* Pending Tenders Tab */}
        {activeTab === 'pending-tenders' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">المناقصات قيد المراجعة</h2>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {pendingTenders.length} مناقصة
              </span>
            </div>
            
            {pendingTenders.length > 0 ? (
              <div className="space-y-4">
                {pendingTenders.map((tender) => (
                  <div key={tender.id} className="glassdoor-card p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{tender.title}</h3>
                        <p className="text-gray-600 mb-2">{tender.organization}</p>
                        <p className="text-sm text-gray-500 line-clamp-2 mb-4">{tender.description}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                          {tender.reference_number && (
                            <div>المرجع: {tender.reference_number}</div>
                          )}
                          {tender.category && (
                            <div>الفئة: {tender.category}</div>
                          )}
                          {tender.budget_range && (
                            <div>الميزانية: {tender.budget_range}</div>
                          )}
                          {tender.submission_deadline && (
                            <div>آخر موعد: {new Date(tender.submission_deadline).toLocaleDateString('ar-SA')}</div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <button
                          onClick={() => window.open(`/tenders/${tender.id}`, '_blank')}
                          className="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                        >
                          <EyeIcon className="h-4 w-4 ml-1" />
                          عرض
                        </button>
                        <button
                          onClick={() => handleApproveTender(tender.id!)}
                          className="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 transition-colors"
                        >
                          <CheckCircleIcon className="h-4 w-4 ml-1" />
                          موافقة
                        </button>
                        <button
                          onClick={() => handleRejectTender(tender.id!)}
                          className="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors"
                        >
                          <XCircleIcon className="h-4 w-4 ml-1" />
                          رفض
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="glassdoor-card p-12 text-center">
                <FileTextIcon className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">لا توجد مناقصات قيد المراجعة</h3>
                <p className="text-gray-600">جميع المناقصات تم مراجعتها والموافقة عليها</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
