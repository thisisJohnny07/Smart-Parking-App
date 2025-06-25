import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RequireSuperAdmin from './components/RequireSuperAdmin'
import Home from './pages/user/home.jsx';
import SignIn from './pages/user/signIn.jsx';
import SignUp from './pages/user/signUp.jsx';
import BookParking from './pages/user/bookParking.jsx';
import AdminSignIN from './pages/admin/signIn.jsx';
import Dashboard from './pages/admin/dashboard.jsx';
import Sidebar from './pages/admin/sidebar.jsx';
import AddEditLocation from './pages/admin/addEditLocation.jsx';
import Reservations from './pages/user/reservations.jsx';
import PaymentCallback from './pages/user/paymentCallback.jsx';
import Profile from './pages/user/profile.jsx';
import Location from './pages/user/locations.jsx';
import Pricing from './pages/user/pricing.jsx';

function App() {
  return (
    <Router>
      <Routes>
        {/* User routes */}
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/book-parking" element={<BookParking />} />
        <Route path="/reservations" element={<Reservations />} />
        <Route path="/payment-callback" element={<PaymentCallback />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/locations" element={<Location />} />
        <Route path="/pricing" element={<Pricing />} />

        {/* Admin routes */}
        <Route path="/admin/sign-in" element={<AdminSignIN />} />
        <Route
          path="/admin/dashboard"
          element={
            <RequireSuperAdmin>
              <Dashboard />
            </RequireSuperAdmin>
          }
        />
        <Route
          path="/admin/home"
          element={
            <RequireSuperAdmin>
              <Sidebar />
            </RequireSuperAdmin>
          }
        />
        <Route
          path="/manage-parking/add"
          element={
            <RequireSuperAdmin>
              <AddEditLocation />
            </RequireSuperAdmin>
          }
        />
        <Route
          path="/manage-parking/edit/:id"
          element={
            <RequireSuperAdmin>
              <AddEditLocation />
            </RequireSuperAdmin>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;