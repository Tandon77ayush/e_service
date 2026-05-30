import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/staticPages.css";

const Contact = ({ setPage }) => {
  return (
    <>
      <Navbar setPage={setPage} />

      <div className="static-page">
        <h1>Contact Us</h1>
        <p>Content coming soon...</p>
      </div>

      <Footer setPage={setPage} />
    </>
  );
};

export default Contact;