import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/user/home.jsx';
import SignIn from './pages/user/signIn.jsx';
import SignUp from './pages/user/signUp.jsx';
import BookParking from './pages/user/bookParking.jsx';
import AdminSignIN from './pages/admin/signIn.jsx';
import Dashboard from './pages/admin/dashboard.jsx';
import Sidebar from './pages/admin/sidebar.jsx'; 

function App() {
  return (
    <Router>
      <Routes>
        {/* User routes */}
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/book-parking" element={<BookParking />} />

        {/* Admin routes */}
        <Route path="/admin/sign-in" element={<AdminSignIN />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/home" element={<Sidebar />} />
      </Routes>
    </Router>
  );
}

export default App;