import { Link } from "react-router-dom";
import NavBar from "../components/NavBar";

function LandingPage() {
  return (
    <div>

      <NavBar />

      LandingPage
      <nav>
        <ul>
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/register">Register</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default LandingPage;
