import { BriefcaseIcon, FileTextIcon, PlusIcon, UserIcon, LogInIcon } from 'lucide-react';
import { Link, useLocation } from 'react-router';
import { useAuth } from '@getmocha/users-service/react';

export default function Header() {
  const location = useLocation();
  const { user, redirectToLogin } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 space-x-reverse hover:opacity-80 transition-opacity">
              <div className="bg-green-500 p-2 rounded-lg">
                <BriefcaseIcon className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">وظائف برو</span>
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8 space-x-reverse">
            <Link
              to="/"
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                location.pathname === '/' 
                  ? 'text-green-600 border-b-2 border-green-600' 
                  : 'text-gray-700 hover:text-green-600'
              }`}
            >
              الرئيسية
            </Link>
            <Link
              to="/jobs"
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                location.pathname.startsWith('/jobs') 
                  ? 'text-green-600 border-b-2 border-green-600' 
                  : 'text-gray-700 hover:text-green-600'
              }`}
            >
              الوظائف
            </Link>
            <Link
              to="/tenders"
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                location.pathname.startsWith('/tenders') 
                  ? 'text-green-600 border-b-2 border-green-600' 
                  : 'text-gray-700 hover:text-green-600'
              }`}
            >
              المناقصات
            </Link>
          </nav>

          <div className="flex items-center space-x-3 space-x-reverse">
            {user ? (
              <>
                <Link
                  to="/add-job"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-green-700 bg-green-50 hover:bg-green-100 transition-colors border border-green-200"
                >
                  <PlusIcon className="h-4 w-4 ml-2" />
                  أضف وظيفة
                </Link>
                <Link
                  to="/add-tender"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 transition-colors"
                >
                  <FileTextIcon className="h-4 w-4 ml-2" />
                  أضف مناقصة
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 space-x-reverse px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  {user.google_user_data.picture ? (
                    <img 
                      src={user.google_user_data.picture} 
                      alt={user.google_user_data.name || user.email}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <UserIcon className="h-5 w-5" />
                  )}
                  <span className="hidden md:block">
                    {user.google_user_data.name || user.email}
                  </span>
                </Link>
              </>
            ) : (
              <button
                onClick={redirectToLogin}
                className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 transition-colors"
              >
                <LogInIcon className="h-4 w-4 ml-2" />
                تسجيل الدخول
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
