import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <div>
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
