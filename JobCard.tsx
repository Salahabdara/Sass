import { BriefcaseIcon, MapPinIcon, Building2Icon, ClockIcon, DollarSignIcon } from 'lucide-react';
import { Link } from 'react-router';
import { JobType } from '@/shared/types';

interface JobCardProps {
  job: JobType;
}

export default function JobCard({ job }: JobCardProps) {
  const isExpired = job.expires_at && new Date(job.expires_at) < new Date();

  return (
    <Link to={`/jobs/${job.id}`} className="block">
      <div className={`glassdoor-card p-6 transition-all duration-200 hover:shadow-lg ${isExpired ? 'opacity-60' : ''}`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <BriefcaseIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 hover:text-green-600 transition-colors">
                {job.title}
              </h3>
              <div className="flex items-center text-gray-600 text-sm mt-1">
                <Building2Icon className="h-4 w-4 ml-1" />
                {job.company}
              </div>
            </div>
          </div>
          {isExpired && (
            <span className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded-full">
              منتهية
            </span>
          )}
        </div>

        <p className="text-gray-700 text-sm line-clamp-2 mb-4">{job.description}</p>

        <div className="grid grid-cols-2 gap-4 mb-4">
          {job.location && (
            <div className="flex items-center text-gray-600 text-sm">
              <MapPinIcon className="h-4 w-4 ml-1 text-gray-400" />
              {job.location}
            </div>
          )}
          {job.job_type && (
            <div className="flex items-center text-gray-600 text-sm">
              <ClockIcon className="h-4 w-4 ml-1 text-gray-400" />
              {job.job_type}
            </div>
          )}
          {job.salary_range && (
            <div className="flex items-center text-gray-600 text-sm">
              <DollarSignIcon className="h-4 w-4 ml-1 text-gray-400" />
              {job.salary_range}
            </div>
          )}
          {job.created_at && (
            <div className="flex items-center text-gray-500 text-xs">
              <ClockIcon className="h-4 w-4 ml-1 text-gray-400" />
              {new Date(job.created_at).toLocaleDateString('ar-SA')}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            {job.job_type || 'دوام كامل'}
          </span>
          <span className="text-green-600 text-sm font-medium hover:text-green-700">
            عرض التفاصيل ←
          </span>
        </div>
      </div>
    </Link>
  );
}
