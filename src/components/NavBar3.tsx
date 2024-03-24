import { FunctionComponent, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./NavBar3.module.css";

const NavBar3: FunctionComponent = () => {
  const navigate = useNavigate();

  const onLogingButtonContainerClick = useCallback(() => {
    navigate("/log-in");
  }, [navigate]);

  return (
    <header className={styles.navBar}>
      <div className={styles.nav} />
      <img
        className={styles.mainLogoHd1Icon}
        loading="lazy"
        alt=""
        src="/mainlogohd-1@2x.png"
      />
      <div className={styles.navBarInner}>
        <div className={styles.frameParent}>
          <div className={styles.meetTheTeamWrapper}>
            <div className={styles.meetTheTeam}>Meet the team</div>
          </div>
          <div className={styles.aboutUsWrapper}>
            <div className={styles.aboutUs}>About us</div>
          </div>
          <div className={styles.buttonHome}>
            <div className={styles.button}>
              <div className={styles.base}>
                <img
                  className={styles.maskedIcon}
                  alt=""
                  src="/masked-icon.svg"
                />
                <div className={styles.button1}>Home</div>
                <img
                  className={styles.maskedIcon1}
                  alt=""
                  src="/masked-icon1.svg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className={styles.logingButton}
        onClick={onLogingButtonContainerClick}
      >
        <img
          className={styles.logingButtonChild}
          alt=""
          src="/rectangle-16@2x.png"
        />
        <div className={styles.login}>Login</div>
      </div>
    </header>
  );
};

export default NavBar3;
