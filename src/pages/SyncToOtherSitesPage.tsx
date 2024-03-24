import { FunctionComponent } from "react";
import NavBar3 from "../components/NavBar3";
import FrameComponent from "../components/FrameComponent";
import styles from "./SyncToOtherSitesPage.module.css";

const SyncToOtherSitesPage: FunctionComponent = () => {
  return (
    <div className={styles.syncToOtherSitesPage}>
      <main className={styles.navBarParent}>
        <NavBar3 />
        <section className={styles.frameWrapper}>
          <FrameComponent />
        </section>
      </main>
      <footer className={styles.footer}>
        <div className={styles.footerBox} />
        <div className={styles.allRightsReserved}>
          ©2024 All rights reserved to EduSync Team
        </div>
      </footer>
    </div>
  );
};

export default SyncToOtherSitesPage;
