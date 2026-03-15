import { Routes, Route } from "react-router-dom";
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

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<StudentLogin />} />
        <Route path="/register" element={<StudentRegister />} />
        <Route path="/employer/login" element={<EmpLogin />} />
        <Route path="/employer/register" element={<EmpRegister />} />
        <Route path="/employer/welcome" element={<EmpWelcome />} />
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
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["Employer"]} redirectTo="/employer/login" unauthorizedPath="/">
              <JobDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
      <AssistantChat userType="jobseeker" />
    </>
  );
}

export default App;
