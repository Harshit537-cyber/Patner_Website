import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Auth from "./pages/Auth/Auth";
import Dashboard from "./pages/Dashboard/Dashboard";
import CreateProfile from "./pages/Auth/CreateProfile";

import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";

import Home from "./pages/Website/Home";
import WebsiteLayout from "./pages/Website/WebsiteLayout";

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

            <Route path="/home" element={<Home />}/>

          </Route>

          {/* AUTH */}
          <Route path="/login" element={<Auth />}/>

        </Route>


        {/* =========================================
            PROTECTED ROUTES
        ========================================= */}

        <Route element={<ProtectedRoute />}>

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/create-profile"
            element={<CreateProfile />}
          />

        </Route>


        {/* =========================================
            FALLBACK
        ========================================= */}

        <Route
          path="*"
          element={<Navigate to="/home" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;