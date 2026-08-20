import { BrowserRouter, Routes , Route } from "react-router-dom";

import Auth from './pages/Auth/Auth'
import Dashboard from "./pages/Dashboard/Dashboard";
import CreateProfile from "./pages/Auth/CreateProfile";

function App() {
  return (
    <BrowserRouter>
  <Routes>
    <Route path='/' element={<Auth/>}/>
    <Route path='/dashboard' element={<Dashboard/>}/>
    <Route path='/create-profile' element={<CreateProfile/>}/>
  </Routes>
    </BrowserRouter>
  );
}

export default App;