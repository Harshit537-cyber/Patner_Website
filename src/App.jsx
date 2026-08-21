import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Auth from "./pages/Auth/Auth";
import Dashboard from "./pages/Dashboard/Dashboard";
import DashboardLayout from "./pages/Dashboard/DashboardLayout";
import CreateProfile from "./pages/Auth/CreateProfile";

import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";

import Home from "./pages/Website/Home";
import WebsiteLayout from "./pages/Website/WebsiteLayout";
import FAQ from "./components/website/FAQ";
import ContactSection from "./components/website/ContactSection";
import AboutSection from "./components/website/AboutSection";
import Consultations from "./pages/Dashboard/Consultations";
import Tickets from "./pages/Dashboard/Tickets";
import Earnings from "./pages/Dashboard/Earnings";
import Notifications from "./pages/Dashboard/Notifications";
import Messages from "./pages/Dashboard/Messages";
import KYC from "./pages/Dashboard/KYC";
import Wallet from "./pages/Dashboard/Wallet";
import Profile from "./pages/Dashboard/Profile";
import Settings from "./pages/Dashboard/Settings";
import LiveStreaming from "./pages/Dashboard/LiveStreaming";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* =========================================
            PUBLIC ROUTES
        ========================================= */}

        <Route element={<PublicRoute />}>
          {/* WEBSITE LAYOUT */}
          <Route element={<WebsiteLayout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contact" element={<ContactSection />} />
            <Route path="/about" element={<AboutSection />} />
          </Route>

          {/* AUTH */}
          <Route path="/login" element={<Auth />} />
        </Route>

        {/* =========================================
            PROTECTED ROUTES
        ========================================= */}

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route
              path="/dashboard/consultations"
              element={<Consultations />}
            />
            <Route path="/dashboard/messages" element={<Messages />} />
            <Route path="/dashboard/earnings" element={<Earnings />} />
            <Route path="/dashboard/wallet" element={<Wallet />} />
            <Route
              path="/dashboard/notifications"
              element={<Notifications />}
            />
            <Route path="/dashboard/kyc" element={<KYC />} />
            <Route path="/dashboard/tickets" element={<Tickets />} />
            <Route path="/dashboard/profile" element={<Profile />} />
            <Route path="/dashboard/settings" element={<Settings />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route
              path="/dashboard/live-streaming"
              element={<LiveStreaming />}
            />
          </Route>

          <Route path="/create-profile" element={<CreateProfile />} />
        </Route>

        {/* =========================================
            FALLBACK
        ========================================= */}

        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
