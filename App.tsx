import { BrowserRouter as Router, Routes, Route } from "react-router";
import { AuthProvider } from "@getmocha/users-service/react";
import HomePage from "@/react-app/pages/Home";
import Jobs from "@/react-app/pages/Jobs";
import Tenders from "@/react-app/pages/Tenders";
import JobDetail from "@/react-app/pages/JobDetail";
import TenderDetail from "@/react-app/pages/TenderDetail";
import AddJob from "@/react-app/pages/AddJob";
import AddTender from "@/react-app/pages/AddTender";
import AdminDashboard from "@/react-app/pages/AdminDashboard";
import AuthCallback from "@/react-app/pages/AuthCallback";
import Profile from "@/react-app/pages/Profile";
import ATSAnalysis from "@/react-app/pages/ATSAnalysis";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen" dir="rtl">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobDetail />} />
            <Route path="/tenders" element={<Tenders />} />
            <Route path="/tenders/:id" element={<TenderDetail />} />
            <Route path="/add-job" element={<AddJob />} />
            <Route path="/add-tender" element={<AddTender />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/ats/:jobId" element={<ATSAnalysis />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}
