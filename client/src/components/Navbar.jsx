/****************************************************************/
/* Provides site-wide navigation. Brings together React Router, */
/* shared components, and individual page components.           */
/****************************************************************/

// NavLink component allows tracking which page is currently active.
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { House, UserRound, FolderKanban, GraduationCap, BriefcaseBusiness,
         Mail, ShieldCheck, LogIn, LogOut, } from "lucide-react";

function Navbar() {
  // Access authentication information from AuthContext.
  const { user, isAuthenticated, isAdmin } = useAuth();

  // Allows navigation after signing out.
  const navigate = useNavigate();

  // Remove authentication information and return to Home.
  function handleSignOut() {
    navigate("/signout", { replace: true });
  }

  return (
    <nav>
      <div>
        <NavLink to="/">
            <img src="/images/logo.png" alt="JD Technologies logo" />
        </NavLink>
      </div>

      <div>
        <NavLink to="/" end><House size={17} strokeWidth={1.8} />Home</NavLink>
        <NavLink to="/about"><UserRound size={17} strokeWidth={1.8} />About</NavLink>
        <NavLink to="/projects"><FolderKanban size={17} strokeWidth={1.8} />Projects</NavLink>
        <NavLink to="/education"><GraduationCap size={17} strokeWidth={1.8} />Education</NavLink>
        <NavLink to="/services"><BriefcaseBusiness size={17} strokeWidth={1.8} />Services</NavLink>
        <NavLink to="/contact"><Mail size={17} strokeWidth={1.8} />Contact</NavLink>

        {/* Display administrator navigation only for admins. */}
        {isAdmin && (
          <NavLink to="/admin"><ShieldCheck size={17} strokeWidth={1.8} />Admin</NavLink>
        )}

        {/* Display different controls depending on login state. */}
        {isAuthenticated ? (
          <>
            <button
              type="button"
              className="nav-signout"
              onClick={handleSignOut}
            >
              <span className="nav-username">{user.name}</span>
              <span className="nav-signout-label">
                Sign Out
                <LogOut size={17} strokeWidth={1.8} />
              </span>
            </button>
          </>
        ) : (
          <>
            {/* Combined authentication navigation link. */}
            <NavLink to="/signin" className="nav-auth-button">
              <LogIn size={17} strokeWidth={1.8} />
              <span>Access / Register</span>
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
}

// Exports so it can be imported and used by other files
export default Navbar;