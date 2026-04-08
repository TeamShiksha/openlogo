import styles from "./Banner.module.css";
import { Search } from "lucide-react";
import { EXPLORE_BANNER as banner } from "../../../utils/Constants";

const Banner = () => {
  return (
    <div className={styles.banner}>
      <div className={styles.container}>
        <h1 className={styles.title}>
          {banner.title.main} <span>{banner.title.highlight}</span>
        </h1>

        <p className={styles.subtitle}>
          {banner.subtitle[0]}
          <br />
          {banner.subtitle[1]}
        </p>

        <div className={styles.searchBox}>
          <Search size={18} className={styles.icon} />
          <input type="text" placeholder={banner.search.placeholder} />
          <span className={styles.shortcut}>{banner.search.shortcut}</span>
        </div>
      </div>
    </div>
  );
};

export default Banner;
