import Navbar from "../components/Navbar";
import Footer from "./Footer";

const Layout = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="flex flex-col justify-between body min-h-screen">
      <div className="flex flex-col">
        <Navbar />
        <div className="md:mx-10">{children ? children : <div></div>}</div>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
