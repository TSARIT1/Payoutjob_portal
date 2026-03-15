import { Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import EmpLogin from "./employer/auth/Login";
import EmpRegister from "./employer/auth/Register";
import EmpWelcome from "./employer/auth/Welcome";
import StudentLogin from "./student/auth/Login";
import StudentRegister from "./student/auth/Register";
import UserProfile from "./student/pages/userProfile";
import AppliedJobs from "./student/pages/AppliedJobs";
import ProfileSetup from "./student/pages/ProfileSetup";
import JobPortal from "./pages/JobPortal";
import JobDashboard from "./employer/JobDashboard";
import Companies from "./pages/Companies";
import AITools from "./pages/AITools";
import SearchAppearances from "./student/pages/SearchAppearances";
import Blogs from "./student/pages/Blogs";
import AssistantChat from "./components/AssistantChat";
import ProtectedRoute from "./components/ProtectedRoute";
import Notifications from "./pages/Notifications";
import ContactUs from "./pages/ContactUs";
import CompanyWorkspace from "./pages/CompanyWorkspace";
import StudentTracker from "./student/pages/StudentTracker";
import EmployerTracker from "./employer/EmployerTracker";
import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import { useAuth } from "./contexts/AuthContext";

function App() {
  const { user } = useAuth();
  const location = useLocation();
  const assistantPersona = user?.role === "Employer" ? "recruiter" : "jobseeker";
  const showFloatingAssistant = !location.pathname.startsWith('/profile') && !location.pathname.startsWith('/dashboard');

  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<StudentLogin />} />
        <Route path="/register" element={<StudentRegister />} />
        <Route path="/employer/login" element={<EmpLogin />} />
        <Route path="/employer/register" element={<EmpRegister />} />
        <Route path="/employer/welcome" element={<EmpWelcome />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/profile/setup"
          element={
            <ProtectedRoute allowedRoles={["Student"]} redirectTo="/login" unauthorizedPath="/">
              <ProfileSetup />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={["Student"]} redirectTo="/login" unauthorizedPath="/">
              <UserProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/search-appearances"
          element={
            <ProtectedRoute allowedRoles={["Student"]} redirectTo="/login" unauthorizedPath="/">
              <SearchAppearances />
            </ProtectedRoute>
          }
        />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/company/:slug" element={<CompanyWorkspace />} />
        <Route
          path="/applied-jobs"
          element={
            <ProtectedRoute allowedRoles={["Student"]} redirectTo="/login" unauthorizedPath="/">
              <AppliedJobs />
            </ProtectedRoute>
          }
        />
        <Route path="/companies" element={<Companies />} />
        <Route path="/ai-tools" element={<AITools />} />
        <Route path="/job" element={<JobPortal />} />
        <Route path="/jobs" element={<JobPortal />} />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute allowedRoles={["Student"]} redirectTo="/login" unauthorizedPath="/">
              <Notifications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tracker/student"
          element={
            <ProtectedRoute allowedRoles={["Student"]} redirectTo="/login" unauthorizedPath="/">
              <StudentTracker />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tracker/employer"
          element={
            <ProtectedRoute allowedRoles={["Employer"]} redirectTo="/employer/login" unauthorizedPath="/">
              <EmployerTracker />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["Employer"]} redirectTo="/employer/login" unauthorizedPath="/">
              <JobDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["Admin"]} redirectTo="/admin/login" unauthorizedPath="/">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
      {showFloatingAssistant && <AssistantChat userType={assistantPersona} />}
    </>
  );
}

export default App;
