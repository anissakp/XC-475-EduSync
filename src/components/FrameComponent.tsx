import { FunctionComponent, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./FrameComponent.module.css";

const FrameComponent: FunctionComponent = () => {
  const navigate = useNavigate();

  const onBlackboardButtonClick = useCallback(() => {
    navigate("/");
  }, [navigate]);

  return (
    <div className={styles.movingBlobParent}>
      <img className={styles.movingBlobIcon} alt="" src="/moving-blob.svg" />
      <div className={styles.syncToWrapper}>
        <h2 className={styles.syncTo}>Sync To:</h2>
      </div>
      <div className={styles.wrapperVectorParent}>
        <div className={styles.wrapperVector}>
          <img className={styles.vectorIcon} alt="" src="/vector.svg" />
        </div>
        <div className={styles.wrapperVector1}>
          <img className={styles.vectorIcon1} alt="" src="/vector-11.svg" />
        </div>
        <button
          className={styles.blackboardButton}
          onClick={onBlackboardButtonClick}
        >
          <div className={styles.blackboardRectangle} />
          <img className={styles.image2Icon} alt="" src="/image-2@2x.png" />
          <div className={styles.blackboardWrapper}>
            <div className={styles.blackboard}>Blackboard</div>
          </div>
        </button>
      </div>
      <div className={styles.piazzaButton}>
        <div className={styles.piazzaRectangle} />
        <img
          className={styles.image3Icon}
          loading="lazy"
          alt=""
          src="/image-3@2x.png"
        />
        <div className={styles.piazzaWrapper}>
          <div className={styles.piazza}>Piazza</div>
        </div>
      </div>
      <button className={styles.gradescopeButton}>
        <div className={styles.gradescopeRectangle} />
        <img className={styles.image4Icon} alt="" src="/image-4@2x.png" />
        <div className={styles.gradescopeWrapper}>
          <div className={styles.gradescope}>Gradescope</div>
        </div>
      </button>
    </div>
  );
};

export default FrameComponent;
