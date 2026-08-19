import { Routes, Route } from "react-router-dom";

import WebsiteLayout from "../pages/Website/WebsiteLayout";
import Home from "../pages/Website/Home";
import About from "../pages/Website/About";
import EarningsInfo from "../pages/Website/Earnings";
import FAQ from "../pages/Website/FAQ";
import Contact from "../pages/Website/Contact";

import PublicRoute from "./PublicRoute";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import VerifyOTP from "../pages/Auth/VerifyOTP";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import ResetPassword from "../pages/Auth/ResetPassword";

import ProtectedRoute from "./ProtectedRoute";
import PersonalDetails from "../pages/Onboarding/PersonalDetails";
import ProfessionalDetails from "../pages/Onboarding/ProfessionalDetails";
import OnboardingKYC from "../pages/Onboarding/KYC";
import Documents from "../pages/Onboarding/Documents";
import BankDetails from "../pages/Onboarding/BankDetails";
import ApplicationStatus from "../pages/Onboarding/ApplicationStatus";
import RegistrationSuccess from "../pages/Onboarding/RegistrationSuccess";

import DashboardLayout from "../pages/Dashboard/DashboardLayout";
import Dashboard from "../pages/Dashboard/Dashboard";
import DashboardKYC from "../pages/Dashboard/KYC";
import Consultations from "../pages/Dashboard/Consultations";
import ConsultationDetails from "../pages/Dashboard/ConsultationDetails";
import Calendar from "../pages/Dashboard/Calendar";
import Customers from "../pages/Dashboard/Customers";
import CustomerDetails from "../pages/Dashboard/CustomerDetails";
import Earnings from "../pages/Dashboard/Earnings";
import Wallet from "../pages/Dashboard/Wallet";
import Reviews from "../pages/Dashboard/Reviews";
import Messages from "../pages/Dashboard/Messages";
import Notifications from "../pages/Dashboard/Notifications";
import Profile from "../pages/Dashboard/Profile";
import Settings from "../pages/Dashboard/Settings";
import Auth from "../pages/Auth/Auth";

import Tickets from "../pages/Dashboard/Tickets";
import TicketDetails from "../pages/Dashboard/TicketDetails";

const NotFound = () => (
  <div
    style={{
      minHeight: "60vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      padding: 40,
    }}
  >
    <h1 style={{ fontSize: "2rem" }}>Page not found</h1>
    <p style={{ color: "var(--color-muted)" }}>
      The page you're looking for doesn't exist.
    </p>
  </div>
);

const AppRoutes = () => (
  <Routes>
    <Route element={<WebsiteLayout />}>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/earnings" element={<EarningsInfo />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/contact" element={<Contact />} />
    </Route>

    <Route element={<PublicRoute />}>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Auth />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
    </Route>

    <Route element={<ProtectedRoute />}>
      <Route
        path="/onboarding/personal-details"
        element={<PersonalDetails />}
      />

      <Route
        path="/onboarding/professional-details"
        element={<ProfessionalDetails />}
      />

      <Route
        path="/onboarding/kyc"
        element={<OnboardingKYC />}
      />

      <Route
        path="/onboarding/documents"
        element={<Documents />}
      />

      <Route
        path="/onboarding/bank-details"
        element={<BankDetails />}
      />

      <Route
        path="/onboarding/application-status"
        element={<ApplicationStatus />}
      />

      <Route
        path="/onboarding/success"
        element={<RegistrationSuccess />}
      />

      <Route
        path="/dashboard"
        element={<DashboardLayout />}
      >
        <Route index element={<Dashboard />} />

        <Route path="kyc" element={<DashboardKYC />} />

        <Route path="consultations" element={<Consultations />} />

        <Route
          path="consultations/:id"
          element={<ConsultationDetails />}
        />

        <Route path="calendar" element={<Calendar />} />

        <Route path="customers" element={<Customers />} />

        <Route
          path="customers/:id"
          element={<CustomerDetails />}
        />

        <Route path="earnings" element={<Earnings />} />

        <Route path="wallet" element={<Wallet />} />

        <Route path="reviews" element={<Reviews />} />

        <Route path="messages" element={<Messages />} />

        <Route
          path="notifications"
          element={<Notifications />}
        />

        <Route path="tickets" element={<Tickets />} />

        <Route
          path="tickets/:ticketId"
          element={<TicketDetails />}
        />

        <Route path="profile" element={<Profile />} />

        <Route path="settings" element={<Settings />} />
      </Route>
    </Route>

    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;