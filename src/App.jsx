import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { PartnerProvider } from "./context/PartnerContext";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PartnerProvider>
          <div
            id="firebase-recaptcha-container"
            style={{
              width: "100%",
              minHeight: "78px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          />

          <AppRoutes />
        </PartnerProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;