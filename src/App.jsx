import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { PartnerProvider } from "./context/PartnerContext";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PartnerProvider>

          <AppRoutes />
        </PartnerProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;