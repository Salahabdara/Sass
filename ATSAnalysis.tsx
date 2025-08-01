import { useEffect, useState } from 'react';
import { useAuth } from '@getmocha/users-service/react';
import { useNavigate, useParams } from 'react-router';
import { 
  BrainIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  StarIcon,
  TrendingUpIcon,
  ArrowRightIcon,
  UserIcon,
  FileTextIcon,
  TargetIcon
} from 'lucide-react';
import Header from '@/react-app/components/Header';

interface Application {
  id: number;
  job_id: number;
  applicant_name: string;
  applicant_email: string;
  applicant_phone?: string;
  resume_url?: string;
  cover_letter?: string;
  ai_match_score: number;
  ai_analysis: string;
  status: string;
  created_at: string;
  job_title?: string;
  company?: string;
}

export default function ATSAnalysis() {
  const { jobId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'score' | 'date'>('score');

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

    const fetchApplications = async () => {
      try {
        const response = await fetch(`/api/admin/applications/${jobId}`);
        if (response.ok) {
          const data = await response.json();
          setApplications(data);
        }
      } catch (error) {
        console.error('Error fetching applications:', error);
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchApplications();
    }
  }, [jobId, user, navigate]);

  const sortedApplications = [...applications].sort((a, b) => {
    if (sortBy === 'score') {
      return b.ai_match_score - a.ai_match_score;
    }
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircleIcon className="h-5 w-5" />;
    if (score >= 60) return <StarIcon className="h-5 w-5" />;
    return <XCircleIcon className="h-5 w-5" />;
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
        {/* Back Button */}
        <button
          onClick={() => navigate('/admin')}
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowRightIcon className="h-5 w-5 ml-2" />
          العودة للوحة التحكم
        </button>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <BrainIcon className="h-8 w-8 ml-3 text-purple-600" />
              تحليل ATS - مطابقة السير الذاتية
            </h1>
            {applications.length > 0 && (
              <p className="text-gray-600 mt-2">
                {applications[0].job_title} - {applications[0].company}
              </p>
            )}
          </div>
          
          <div className="flex items-center space-x-3 space-x-reverse">
            <span className="text-sm text-gray-600">ترتيب حسب:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'score' | 'date')}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="score">نقاط المطابقة</option>
              <option value="date">تاريخ التقديم</option>
            </select>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="glassdoor-card p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-100">
                <UserIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">إجمالي المتقدمين</p>
                <p className="text-3xl font-bold text-gray-900">{applications.length}</p>
              </div>
            </div>
          </div>

          <div className="glassdoor-card p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-100">
                <CheckCircleIcon className="h-8 w-8 text-green-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">مطابقة عالية (80%+)</p>
                <p className="text-3xl font-bold text-gray-900">
                  {applications.filter(app => app.ai_match_score >= 80).length}
                </p>
              </div>
            </div>
          </div>

          <div className="glassdoor-card p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-yellow-100">
                <StarIcon className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">مطابقة متوسطة (60-79%)</p>
                <p className="text-3xl font-bold text-gray-900">
                  {applications.filter(app => app.ai_match_score >= 60 && app.ai_match_score < 80).length}
                </p>
              </div>
            </div>
          </div>

          <div className="glassdoor-card p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-purple-100">
                <TrendingUpIcon className="h-8 w-8 text-purple-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">متوسط المطابقة</p>
                <p className="text-3xl font-bold text-gray-900">
                  {applications.length > 0 
                    ? Math.round(applications.reduce((sum, app) => sum + app.ai_match_score, 0) / applications.length)
                    : 0}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Applications List */}
        {sortedApplications.length > 0 ? (
          <div className="space-y-6">
            {sortedApplications.map((application) => (
              <div key={application.id} className="glassdoor-card p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-4 space-x-reverse">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <UserIcon className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{application.applicant_name}</h3>
                      <p className="text-gray-600">{application.applicant_email}</p>
                      {application.applicant_phone && (
                        <p className="text-sm text-gray-500">{application.applicant_phone}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div className={`flex items-center px-4 py-2 rounded-full font-bold ${getScoreColor(application.ai_match_score)}`}>
                      {getScoreIcon(application.ai_match_score)}
                      <span className="mr-2">{application.ai_match_score}%</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(application.created_at).toLocaleDateString('ar-SA')}
                    </div>
                  </div>
                </div>

                {/* AI Analysis */}
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6 mb-6">
                  <div className="flex items-center mb-3">
                    <BrainIcon className="h-5 w-5 text-purple-600 ml-2" />
                    <h4 className="font-semibold text-gray-900">تحليل الذكاء الاصطناعي</h4>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{application.ai_analysis}</p>
                </div>

                {/* Cover Letter */}
                {application.cover_letter && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
                    <div className="flex items-center mb-3">
                      <FileTextIcon className="h-5 w-5 text-gray-600 ml-2" />
                      <h4 className="font-semibold text-gray-900">خطاب التغطية</h4>
                    </div>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">{application.cover_letter}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    {application.resume_url && (
                      <a
                        href={application.resume_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
                      >
                        <FileTextIcon className="h-4 w-4 ml-1" />
                        عرض السيرة الذاتية
                      </a>
                    )}
                    <a
                      href={`mailto:${application.applicant_email}`}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-green-700 bg-green-50 hover:bg-green-100 transition-colors"
                    >
                      التواصل مع المتقدم
                    </a>
                  </div>

                  <div className="flex items-center space-x-2 space-x-reverse">
                    <button className="px-4 py-2 text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 transition-colors">
                      قبول
                    </button>
                    <button className="px-4 py-2 text-sm font-medium rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors">
                      رفض
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glassdoor-card p-12 text-center">
            <TargetIcon className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">لا توجد طلبات تقديم بعد</h3>
            <p className="text-gray-600">لم يتقدم أحد لهذه الوظيفة بعد</p>
          </div>
        )}
      </div>
    </div>
  );
}
