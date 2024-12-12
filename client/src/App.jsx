import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css'
import LoginSignup from './Components/LoginSignup/LoginSignup';
import EmailVerification from './Components/EmailVerification/EmailVerification';
import Dashboard from './Components/Dashboard/Dashboard.jsx';
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from './store/authStore';
import { useEffect } from 'react';

const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user.isVerified) {
    return <Navigate to='/' replace />
  }

  return children;
}

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to='/LoginSignup' replace />
  }

  if (!user.isVerified) {
    return <Navigate to='/verify-email' replace />
  }

  return children;
}

function App() {
  const { isCheckingAuth, checkAuth, isAuthenticated, user } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  console.log("isAuthenticated:", isAuthenticated);
  console.log("user", user)
  return (
    <div>
      {/**<LoginSignup*/}
      <Routes>
        <Route path='/' element={<ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>} />

        <Route path='/LoginSignup' element={
          <RedirectAuthenticatedUser>
            <LoginSignup />
          </RedirectAuthenticatedUser>
        } />
        <Route path='/verify-email' element={<EmailVerification />} />
        <Route path='/forgot-password' element={"forgot password"} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
