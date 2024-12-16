import { useState , useEffect} from "react";
import { headerItems } from "../../utils/constants";
import MobileHeaderMenu from "../MobileHeaderMenu/MobileHeaderMenu";
import styles from "./Header.module.css";
import Signup from "../../Pages/signup/Signup";

const Header = () => {
  const [showMenu, setShowMenu] = useState(false);

  const [signupModal , setSignupModal] = useState(false)

  useEffect(() => {
    if (signupModal) {
      document.body.classList.add(styles.activemodal);
    } else {
      document.body.classList.remove(styles.activemodal);
    }
  });

  const hamburgerIcon = {
    src: "hamburger.svg",
    alt: "Hamburger Icon",
  };

  const closeIcon = {
    src: "close-icon.svg",
    alt: "Close Icon",
  };

  const menuIcon = showMenu ? closeIcon : hamburgerIcon;

  const toggleMenu = () => {
    setShowMenu((prev) => !prev);
  };

const closeSignupModal = () => { setSignupModal(false)};

  return (
    <header className={styles["header-container"]}>
      <div className={styles["header-logo"]}>
        <img alt="Logo Icon" src="openlogo.svg" width={30} height={30} />
        <h4>Openlogo</h4>
      </div>
      <div className={styles["header-items"]}>
        {headerItems.map((item) => (
          <a key={item.name} className={styles["header-item"]} href={item.url}>
            {item.title}
          </a>
        ))}
      </div>
           <button onClick={() => setSignupModal(true)} className={styles["header-button"]}>Get started for free</button>
           {signupModal &&<Signup onClose={closeSignupModal} />}
      <button className={styles["header-hamburger"]} onClick={toggleMenu}>
        <img src={menuIcon.src} alt={menuIcon.alt} height={16} width={21.33} />
      </button>
      {showMenu ? <MobileHeaderMenu /> : null}
    </header>
  );
};

export default Header;
