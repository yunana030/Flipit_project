import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-wrapper">
        <div className="footer-inner">

          <div className="footer-logo">
          <img 
            src="/images/메인로고1.png" 
            alt="FlipIt Footer Logo"
            className="footer-logo-img"
          />
        </div>

          <p className="footer-text">
            Made With: <br /> yuna
          </p>

          <p className="footer-text">
            Thanks for playing!
            <br />
            Have fun Flipping cards
          </p>

          <p className="footer-text">
            2025 Card Flip Game
            <br />
            All rights reserved
          </p>

        </div>

        
      </div>
    </footer>
  );
};

export default Footer;
