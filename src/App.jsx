import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { PartnerProvider } from "./context/PartnerContext";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PartnerProvider>
          {/* Top spacing remove karne ke liye container ko hide kar diya gaya hai */}
          <div
            id="firebase-recaptcha-container"
            style={{
              display: "none",
              height: "0px",
              width: "0px",
              overflow: "hidden",
            }}
          />

          <AppRoutes />
        </PartnerProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;