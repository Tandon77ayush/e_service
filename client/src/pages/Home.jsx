import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Footer from "../components/Footer";

const Home = ({ setPage }) => {
  return (
    <>
      <Navbar setPage={setPage} />
      <Hero />
      <Footer setPage={setPage} />
    </>
  );
};

export default Home;