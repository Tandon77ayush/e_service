import "../styles/footer.css";

const Footer = ({ setPage }) => {
  return (
    <footer className="footer">

      <div className="footer-top">

        <div className="footer-brand">
          <h2 className="footer-logo">NeighborHand</h2>
          <p className="footer-tagline">
            Your trusted platform for verified home and service professionals across India.
          </p>
        </div>

        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li onClick={() => setPage("home")}>Home</li>
            <li onClick={() => setPage("about")}>About</li>
            <li onClick={() => setPage("contact")}>Contact</li>
          </ul>
        </div>

        <div className="footer-contact">
          <h4>Get in Touch</h4>
          <p>support@neighborhand.in</p>
          <p>+91 98765 43210</p>
          <p>Mon – Sat, 9am – 6pm</p>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} NeighborHand. All rights reserved.</p>
      </div>

    </footer>
  );
};

export default Footer;