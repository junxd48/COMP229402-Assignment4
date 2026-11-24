/***********************************************/
/* Landing page. Contains welcome text,        */
/* primary call-to-action, and innovation.png. */
/***********************************************/

// Link component allows navigation between pages w/o reloading the entire website.
import { Link } from "react-router-dom";

// Function represents the content displayed on the Home page.
function Home() {
  return (
    // Main section. The classes are used to apply the styles from CSS.
    <section className="hero">
      <div className="hero-content">
        <p className="intro">WELCOME TO MY SOFTWARE DEVELOPMENT PORTFOLIO</p>
        <h1>
          Building Technology Solutions
          <br />
          with Purpose
        </h1>
        <p className="hero-description">
          I am an IT and software professional with experience in
          infrastructure, networking, systems support, and application
          development.
        </p>
        <Link to="/about" className="primary-button">
          Learn More About Me
        </Link>
      </div>
      <div className="hero-image-container">
        <img
          //src="/images/innovation.png"  //replaced for optimization
          src="/images/innovation.webp"
          alt="Technology and innovation illustration"
          className="hero-image"
          width={285}
          height={275}
        />
      </div>
    </section>
  );
}


// Exports so it can be imported and used by other files
export default Home;