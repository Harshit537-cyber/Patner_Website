import { Outlet } from "react-router-dom";
import Navbar from "../../components/website/Navbar";
import Footer from "../../components/website/Footer";

const WebsiteLayout = () => (
  <>
    <Navbar />
    <Outlet />
    <Footer />
  </>
);

export default WebsiteLayout;
