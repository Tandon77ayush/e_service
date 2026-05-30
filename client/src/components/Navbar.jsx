import "../styles/navbar.css";

const Navbar = ({ setPage }) => {
  return (
    <nav className="navbar">
      <div className="logo">
        NeighborHand
      </div>

      <ul className="nav-links">
        <li onClick={() => setPage("home")}>About</li>
        <li onClick={() => setPage("contact")}>Contact</li>
      </ul>
    </nav>
  );
};

export default Navbar;