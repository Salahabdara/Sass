import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useAuth } from '@getmocha/users-service/react';
import { 
  BriefcaseIcon, 
  MapPinIcon, 
  Building2Icon, 
  ClockIcon, 
  DollarSignIcon,
  ArrowRightIcon,
  MailIcon,
  PhoneIcon,
  CalendarIcon,
  UploadIcon,
  FileTextIcon
} from 'lucide-react';
import Header from '@/react-app/components/Header';
import { JobType } from '@/shared/types';

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState<JobType | null>(null);
  const [similarJobs, setSimilarJobs] = useState<JobType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationData, setApplicationData] = useState({
    applicant_name: user?.google_user_data.name || '',
    applicant_email: user?.email || '',
    applicant_phone: '',
    cover_letter: '',
    resume_file: null as File | null
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await fetch(`/api/jobs/${id}`);
        if (response.ok) {
          const jobData = await response.json();
          setJob(jobData);
          
          // Fetch similar jobs
          const allJobsResponse = await fetch('/api/jobs');
          const allJobs = await allJobsResponse.json();
          const similar = allJobs
            .filter((j: JobType) => j.id !== jobData.id && j.company === jobData.company)
            .slice(0, 3);
          setSimilarJobs(similar);
        }
      } catch (error) {
        console.error('Error fetching job:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchJob();
    }
  }, [id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setApplicationData(prev => ({ ...prev, resume_file: e.target.files![0] }));
    }
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/');
      return;
    }

    setSubmitting(true);
    try {
      // In a real app, you would upload the file and get a URL
      const resumeUrl = applicationData.resume_file ? 'uploaded-resume-url' : '';
      
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          job_id: id,
          applicant_name: applicationData.applicant_name,
          applicant_email: applicationData.applicant_email,
          applicant_phone: applicationData.applicant_phone,
          cover_letter: applicationData.cover_letter,
          resume_url: resumeUrl
        }),
      });

      if (response.ok) {
        alert('تم إرسال طلبك بنجاح! سيتم مراجعته وسنتواصل معك قريباً.');
        setShowApplicationForm(false);
      } else {
        alert('حدث خطأ أثناء إرسال الطلب. حاول مرة أخرى.');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('حدث خطأ أثناء إرسال الطلب. حاول مرة أخرى.');
    } finally {
      setSubmitting(false);
    }
  };

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

  if (!job) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">الوظيفة غير موجودة</h1>
          <button
            onClick={() => navigate('/jobs')}
            className="text-green-600 hover:text-green-700"
          >
            العودة للوظائف
          </button>
        </div>
      </div>
    );
  }

  const isExpired = job.expires_at && new Date(job.expires_at) < new Date();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Back Button */}
            <button
              onClick={() => navigate('/jobs')}
              className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
            >
              <ArrowRightIcon className="h-5 w-5 ml-2" />
              العودة للوظائف
            </button>

            {/* Job Header */}
            <div className="glassdoor-card p-8 mb-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4 space-x-reverse">
                  <div className="w-16 h-16 bg-green-500 rounded-xl flex items-center justify-center">
                    <BriefcaseIcon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
                    <div className="flex items-center text-gray-600 text-lg">
                      <Building2Icon className="h-5 w-5 ml-2" />
                      {job.company}
                    </div>
                  </div>
                </div>
                {isExpired && (
                  <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-medium">
                    منتهية
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {job.location && (
                  <div className="flex items-center text-gray-600">
                    <MapPinIcon className="h-5 w-5 ml-2 text-gray-400" />
                    <span>{job.location}</span>
                  </div>
                )}
                {job.job_type && (
                  <div className="flex items-center text-gray-600">
                    <ClockIcon className="h-5 w-5 ml-2 text-gray-400" />
                    <span>{job.job_type}</span>
                  </div>
                )}
                {job.salary_range && (
                  <div className="flex items-center text-gray-600">
                    <DollarSignIcon className="h-5 w-5 ml-2 text-gray-400" />
                    <span>{job.salary_range}</span>
                  </div>
                )}
                {job.created_at && (
                  <div className="flex items-center text-gray-600">
                    <CalendarIcon className="h-5 w-5 ml-2 text-gray-400" />
                    <span>{new Date(job.created_at).toLocaleDateString('ar-SA')}</span>
                  </div>
                )}
              </div>

              {!isExpired && (
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => user ? setShowApplicationForm(true) : navigate('/')}
                    className="flex-1 flex items-center justify-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <UploadIcon className="h-5 w-5 ml-2" />
                    {user ? 'قدم الآن' : 'سجل الدخول للتقديم'}
                  </button>
                  <button className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors">
                    حفظ الوظيفة
                  </button>
                </div>
              )}
            </div>

            {/* Job Description */}
            <div className="glassdoor-card p-8 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">وصف الوظيفة</h2>
              <div className="prose max-w-none text-gray-700">
                <p className="whitespace-pre-line">{job.description}</p>
              </div>
            </div>

            {/* Requirements */}
            {job.requirements && (
              <div className="glassdoor-card p-8 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">المتطلبات والمؤهلات</h2>
                <div className="prose max-w-none text-gray-700">
                  <p className="whitespace-pre-line">{job.requirements}</p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Contact Information */}
            <div className="glassdoor-card p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">معلومات التواصل</h3>
              <div className="space-y-3">
                {job.contact_email && (
                  <div className="flex items-center text-gray-600">
                    <MailIcon className="h-5 w-5 ml-2 text-gray-400" />
                    <a href={`mailto:${job.contact_email}`} className="hover:text-green-600">
                      {job.contact_email}
                    </a>
                  </div>
                )}
                {job.contact_phone && (
                  <div className="flex items-center text-gray-600">
                    <PhoneIcon className="h-5 w-5 ml-2 text-gray-400" />
                    <a href={`tel:${job.contact_phone}`} className="hover:text-green-600">
                      {job.contact_phone}
                    </a>
                  </div>
                )}
                {job.expires_at && (
                  <div className="flex items-center text-gray-600">
                    <CalendarIcon className="h-5 w-5 ml-2 text-gray-400" />
                    <span>ينتهي في {new Date(job.expires_at).toLocaleDateString('ar-SA')}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Similar Jobs */}
            {similarJobs.length > 0 && (
              <div className="glassdoor-card p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">وظائف مشابهة</h3>
                <div className="space-y-4">
                  {similarJobs.map((similarJob) => (
                    <div key={similarJob.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                      <h4 className="font-semibold text-gray-900 hover:text-green-600">
                        <a href={`/jobs/${similarJob.id}`}>{similarJob.title}</a>
                      </h4>
                      <p className="text-sm text-gray-600">{similarJob.company}</p>
                      {similarJob.location && (
                        <p className="text-xs text-gray-500">{similarJob.location}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {showApplicationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">التقدم للوظيفة</h2>
              <button
                onClick={() => setShowApplicationForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitApplication} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الاسم الكامل *
                  </label>
                  <input
                    type="text"
                    required
                    value={applicationData.applicant_name}
                    onChange={(e) => setApplicationData(prev => ({...prev, applicant_name: e.target.value}))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    البريد الإلكتروني *
                  </label>
                  <input
                    type="email"
                    required
                    value={applicationData.applicant_email}
                    onChange={(e) => setApplicationData(prev => ({...prev, applicant_email: e.target.value}))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رقم الهاتف
                </label>
                <input
                  type="tel"
                  value={applicationData.applicant_phone}
                  onChange={(e) => setApplicationData(prev => ({...prev, applicant_phone: e.target.value}))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  السيرة الذاتية *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <FileTextIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <div className="text-sm text-gray-600">
                    <label htmlFor="resume-upload" className="cursor-pointer">
                      <span className="text-green-600 font-medium">انقر لرفع السيرة الذاتية</span>
                      <span> أو اسحب الملف هنا</span>
                    </label>
                    <input
                      id="resume-upload"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    PDF, DOC, DOCX حتى 10MB
                  </p>
                  {applicationData.resume_file && (
                    <p className="text-sm text-green-600 mt-2">
                      تم اختيار: {applicationData.resume_file.name}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  خطاب التغطية
                </label>
                <textarea
                  rows={4}
                  value={applicationData.cover_letter}
                  onChange={(e) => setApplicationData(prev => ({...prev, cover_letter: e.target.value}))}
                  placeholder="اكتب رسالة قصيرة توضح سبب اهتمامك بهذه الوظيفة..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-6">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 flex items-center justify-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white ml-2"></div>
                      جاري الإرسال...
                    </>
                  ) : (
                    'إرسال الطلب'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowApplicationForm(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
