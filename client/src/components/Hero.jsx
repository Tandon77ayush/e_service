import "../styles/hero.css";
import AuthCard from "./AuthCard";

const Hero = () => {
  return (
    <section className="hero">

      <div className="hero-left">

        <h1>
          Trusted Home &
          <br />
          Service Help
          <br />
          <span>Platform in India</span>
        </h1>

        <p>
          Welcome to <strong>NeighborHAND</strong> — your one-stop platform
          for verified, reliable home and service professionals.
          Book, manage, and review services with ease!
        </p>

        <div className="hero-features">
          <p>✔ Background Verified Helpers</p>
          <p>✔ Quick Placement & Booking</p>
          <p>✔ Flexible Service Options</p>
          <p>✔ Dedicated Support Team</p>
        </div>

      </div>

      <div className="hero-right">
        <AuthCard />
      </div>

    </section>
  );
};

export default Hero;