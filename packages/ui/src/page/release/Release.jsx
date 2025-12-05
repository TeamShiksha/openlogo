import ChangeLog from "./ChangeLog";
import { RELEASE_PAGE } from "../../utils/Constants";
import styles from "./Release.module.css";
function Release() {
  const { introduction } = RELEASE_PAGE;
  return (
    <section
      className="container"
      style={{ marginTop: "1rem", marginBottom: "3rem" }}
    >
      {/* introduction */}
      <div>
        <h2>{introduction.heading}</h2>
        <p className={styles["description"]}>{introduction.description}</p>
        <ul>
          {introduction.features.map((feature, index) => (
            <li key={index}>
              <span className={styles["dot"]}></span>
              <div>
                <span className={styles["list-heading"]}>
                  {feature.heading}:{" "}
                </span>
                <span className={styles["list-description"]}>
                  {feature.desc}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* changelog */}
      <ChangeLog />
    </section>
  );
}

export default Release;
