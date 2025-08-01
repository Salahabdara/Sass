import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useAuth } from '@getmocha/users-service/react';
import { 
  FileTextIcon, 
  Building2Icon, 
  ClockIcon, 
  DollarSignIcon,
  ArrowRightIcon,
  MailIcon,
  PhoneIcon,
  CalendarIcon,
  DownloadIcon,
  UploadIcon,
  ExternalLinkIcon
} from 'lucide-react';
import Header from '@/react-app/components/Header';
import { TenderType } from '@/shared/types';

export default function TenderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tender, setTender] = useState<TenderType | null>(null);
  const [similarTenders, setSimilarTenders] = useState<TenderType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [proposalData, setProposalData] = useState({
    company_name: '',
    contact_email: user?.email || '',
    contact_phone: '',
    proposal_file: null as File | null
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchTender = async () => {
      try {
        const response = await fetch(`/api/tenders/${id}`);
        if (response.ok) {
          const tenderData = await response.json();
          setTender(tenderData);
          
          // Fetch similar tenders
          const allTendersResponse = await fetch('/api/tenders');
          const allTenders = await allTendersResponse.json();
          const similar = allTenders
            .filter((t: TenderType) => t.id !== tenderData.id && t.category === tenderData.category)
            .slice(0, 3);
          setSimilarTenders(similar);
        }
      } catch (error) {
        console.error('Error fetching tender:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTender();
    }
  }, [id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProposalData(prev => ({ ...prev, proposal_file: e.target.files![0] }));
    }
  };

  const handleSubmitProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/');
      return;
    }

    setSubmitting(true);
    try {
      // In a real app, you would upload the file and get a URL
      const proposalUrl = proposalData.proposal_file ? 'uploaded-proposal-url' : '';
      
      const response = await fetch('/api/proposals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tender_id: id,
          company_name: proposalData.company_name,
          contact_email: proposalData.contact_email,
          contact_phone: proposalData.contact_phone,
          proposal_url: proposalUrl
        }),
      });

      if (response.ok) {
        alert('تم إرسال عرضك بنجاح! سيتم مراجعته وسنتواصل معك قريباً.');
        setShowProposalForm(false);
      } else {
        alert('حدث خطأ أثناء إرسال العرض. حاول مرة أخرى.');
      }
    } catch (error) {
      console.error('Error submitting proposal:', error);
      alert('حدث خطأ أثناء إرسال العرض. حاول مرة أخرى.');
    } finally {
      setSubmitting(false);
    }
  };

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

  if (!tender) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">المناقصة غير موجودة</h1>
          <button
            onClick={() => navigate('/tenders')}
            className="text-blue-600 hover:text-blue-700"
          >
            العودة للمناقصات
          </button>
        </div>
      </div>
    );
  }

  const isExpired = tender.submission_deadline && new Date(tender.submission_deadline) < new Date();
  const daysLeft = tender.submission_deadline 
    ? Math.ceil((new Date(tender.submission_deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Back Button */}
            <button
              onClick={() => navigate('/tenders')}
              className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
            >
              <ArrowRightIcon className="h-5 w-5 ml-2" />
              العودة للمناقصات
            </button>

            {/* Tender Header */}
            <div className="glassdoor-card p-8 mb-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4 space-x-reverse">
                  <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center">
                    <FileTextIcon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{tender.title}</h1>
                    <div className="flex items-center text-gray-600 text-lg">
                      <Building2Icon className="h-5 w-5 ml-2" />
                      {tender.organization}
                    </div>
                  </div>
                </div>
                {isExpired ? (
                  <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-medium">
                    منتهية
                  </span>
                ) : daysLeft !== null && daysLeft <= 7 && (
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                    {daysLeft} أيام متبقية
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {tender.reference_number && (
                  <div className="flex items-center text-gray-600">
                    <FileTextIcon className="h-5 w-5 ml-2 text-gray-400" />
                    <span>{tender.reference_number}</span>
                  </div>
                )}
                {tender.category && (
                  <div className="flex items-center text-gray-600">
                    <ClockIcon className="h-5 w-5 ml-2 text-gray-400" />
                    <span>{tender.category}</span>
                  </div>
                )}
                {tender.budget_range && (
                  <div className="flex items-center text-gray-600">
                    <DollarSignIcon className="h-5 w-5 ml-2 text-gray-400" />
                    <span>{tender.budget_range}</span>
                  </div>
                )}
                {tender.submission_deadline && (
                  <div className="flex items-center text-gray-600">
                    <CalendarIcon className="h-5 w-5 ml-2 text-gray-400" />
                    <span>{new Date(tender.submission_deadline).toLocaleDateString('ar-SA')}</span>
                  </div>
                )}
              </div>

              {!isExpired && (
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => user ? setShowProposalForm(true) : navigate('/')}
                    className="flex-1 flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <UploadIcon className="h-5 w-5 ml-2" />
                    {user ? 'قدم عرضك' : 'سجل الدخول للتقديم'}
                  </button>
                  {tender.tender_documents_url && (
                    <a
                      href={tender.tender_documents_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <DownloadIcon className="h-5 w-5 ml-2" />
                      تحميل الوثائق
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Tender Description */}
            <div className="glassdoor-card p-8 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">وصف المناقصة</h2>
              <div className="prose max-w-none text-gray-700">
                <p className="whitespace-pre-line">{tender.description}</p>
              </div>
            </div>

            {/* Requirements */}
            {tender.requirements && (
              <div className="glassdoor-card p-8 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">المتطلبات والشروط</h2>
                <div className="prose max-w-none text-gray-700">
                  <p className="whitespace-pre-line">{tender.requirements}</p>
                </div>
              </div>
            )}

            {/* Timeline */}
            <div className="glassdoor-card p-8 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">الجدول الزمني</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                  <div>
                    <p className="font-medium text-gray-900">نشر المناقصة</p>
                    <p className="text-sm text-gray-500">
                      {tender.created_at && new Date(tender.created_at).toLocaleDateString('ar-SA')}
                    </p>
                  </div>
                </div>
                {tender.submission_deadline && (
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div className={`w-3 h-3 rounded-full ${isExpired ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                    <div>
                      <p className="font-medium text-gray-900">آخر موعد لتسليم العروض</p>
                      <p className="text-sm text-gray-500">
                        {new Date(tender.submission_deadline).toLocaleDateString('ar-SA')}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Contact Information */}
            <div className="glassdoor-card p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">معلومات التواصل</h3>
              <div className="space-y-3">
                {tender.contact_email && (
                  <div className="flex items-center text-gray-600">
                    <MailIcon className="h-5 w-5 ml-2 text-gray-400" />
                    <a href={`mailto:${tender.contact_email}`} className="hover:text-blue-600">
                      {tender.contact_email}
                    </a>
                  </div>
                )}
                {tender.contact_phone && (
                  <div className="flex items-center text-gray-600">
                    <PhoneIcon className="h-5 w-5 ml-2 text-gray-400" />
                    <a href={`tel:${tender.contact_phone}`} className="hover:text-blue-600">
                      {tender.contact_phone}
                    </a>
                  </div>
                )}
                {tender.tender_documents_url && (
                  <div className="flex items-center text-gray-600">
                    <ExternalLinkIcon className="h-5 w-5 ml-2 text-gray-400" />
                    <a href={tender.tender_documents_url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                      وثائق المناقصة
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Key Details */}
            <div className="glassdoor-card p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">تفاصيل مهمة</h3>
              <div className="space-y-3">
                {tender.budget_range && (
                  <div>
                    <p className="text-sm text-gray-500">الميزانية المتوقعة</p>
                    <p className="font-medium text-gray-900">{tender.budget_range}</p>
                  </div>
                )}
                {tender.category && (
                  <div>
                    <p className="text-sm text-gray-500">الفئة</p>
                    <p className="font-medium text-gray-900">{tender.category}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500">حالة المناقصة</p>
                  <p className={`font-medium ${isExpired ? 'text-red-600' : 'text-green-600'}`}>
                    {isExpired ? 'منتهية' : 'نشطة'}
                  </p>
                </div>
              </div>
            </div>

            {/* Similar Tenders */}
            {similarTenders.length > 0 && (
              <div className="glassdoor-card p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">مناقصات مشابهة</h3>
                <div className="space-y-4">
                  {similarTenders.map((similarTender) => (
                    <div key={similarTender.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                      <h4 className="font-semibold text-gray-900 hover:text-blue-600">
                        <a href={`/tenders/${similarTender.id}`}>{similarTender.title}</a>
                      </h4>
                      <p className="text-sm text-gray-600">{similarTender.organization}</p>
                      {similarTender.budget_range && (
                        <p className="text-xs text-gray-500">{similarTender.budget_range}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Proposal Modal */}
      {showProposalForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">تقديم عرض للمناقصة</h2>
              <button
                onClick={() => setShowProposalForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitProposal} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اسم الشركة *
                </label>
                <input
                  type="text"
                  required
                  value={proposalData.company_name}
                  onChange={(e) => setProposalData(prev => ({...prev, company_name: e.target.value}))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    البريد الإلكتروني *
                  </label>
                  <input
                    type="email"
                    required
                    value={proposalData.contact_email}
                    onChange={(e) => setProposalData(prev => ({...prev, contact_email: e.target.value}))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رقم الهاتف
                  </label>
                  <input
                    type="tel"
                    value={proposalData.contact_phone}
                    onChange={(e) => setProposalData(prev => ({...prev, contact_phone: e.target.value}))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ملف العرض الفني والمالي *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <FileTextIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <div className="text-sm text-gray-600">
                    <label htmlFor="proposal-upload" className="cursor-pointer">
                      <span className="text-blue-600 font-medium">انقر لرفع ملف العرض</span>
                      <span> أو اسحب الملف هنا</span>
                    </label>
                    <input
                      id="proposal-upload"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    PDF, DOC, DOCX حتى 50MB
                  </p>
                  {proposalData.proposal_file && (
                    <p className="text-sm text-blue-600 mt-2">
                      تم اختيار: {proposalData.proposal_file.name}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-6">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white ml-2"></div>
                      جاري الإرسال...
                    </>
                  ) : (
                    'إرسال العرض'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowProposalForm(false)}
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
