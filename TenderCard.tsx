import { FileTextIcon, Building2Icon, CalendarIcon, DollarSignIcon } from 'lucide-react';
import { Link } from 'react-router';
import { TenderType } from '@/shared/types';

interface TenderCardProps {
  tender: TenderType;
}

export default function TenderCard({ tender }: TenderCardProps) {
  const isExpired = tender.submission_deadline && new Date(tender.submission_deadline) < new Date();
  const daysLeft = tender.submission_deadline 
    ? Math.ceil((new Date(tender.submission_deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <Link to={`/tenders/${tender.id}`} className="block">
      <div className={`glassdoor-card p-6 transition-all duration-200 hover:shadow-lg ${isExpired ? 'opacity-60' : ''}`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <FileTextIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                {tender.title}
              </h3>
              <div className="flex items-center text-gray-600 text-sm mt-1">
                <Building2Icon className="h-4 w-4 ml-1" />
                {tender.organization}
              </div>
            </div>
          </div>
          {isExpired ? (
            <span className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded-full">
              منتهية
            </span>
          ) : daysLeft !== null && daysLeft <= 7 && (
            <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">
              {daysLeft} أيام متبقية
            </span>
          )}
        </div>

        <p className="text-gray-700 text-sm line-clamp-2 mb-4">{tender.description}</p>

        <div className="grid grid-cols-2 gap-4 mb-4">
          {tender.reference_number && (
            <div className="flex items-center text-gray-600 text-sm">
              <FileTextIcon className="h-4 w-4 ml-1 text-gray-400" />
              {tender.reference_number}
            </div>
          )}
          {tender.category && (
            <div className="flex items-center text-gray-600 text-sm">
              <span className="w-2 h-2 bg-blue-500 rounded-full ml-2"></span>
              {tender.category}
            </div>
          )}
          {tender.budget_range && (
            <div className="flex items-center text-gray-600 text-sm">
              <DollarSignIcon className="h-4 w-4 ml-1 text-gray-400" />
              {tender.budget_range}
            </div>
          )}
          {tender.submission_deadline && (
            <div className="flex items-center text-gray-600 text-sm">
              <CalendarIcon className="h-4 w-4 ml-1 text-gray-400" />
              {new Date(tender.submission_deadline).toLocaleDateString('ar-SA')}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-2 space-x-reverse">
            {tender.category && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {tender.category}
              </span>
            )}
            {tender.created_at && (
              <span className="text-gray-500 text-xs">
                {new Date(tender.created_at).toLocaleDateString('ar-SA')}
              </span>
            )}
          </div>
          <span className="text-blue-600 text-sm font-medium hover:text-blue-700">
            عرض التفاصيل ←
          </span>
        </div>
      </div>
    </Link>
  );
}
