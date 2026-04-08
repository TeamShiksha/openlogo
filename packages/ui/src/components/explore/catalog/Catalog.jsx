import styles from "./Catalog.module.css";
import * as Icons from "lucide-react";

const mockData = [
  { name: "Google", icon: "Chrome", type: "SVG" },
  { name: "Netflix", icon: "Film", type: "PNG" },
  { name: "Spotify", icon: "Music", type: "SVG" },
  { name: "YouTube", icon: "Play", type: "SVG" },
  { name: "Airbnb", icon: "Home", type: "SVG" },
  { name: "Tesla", icon: "Zap", type: "SVG" },
  { name: "Stripe", icon: "CreditCard", type: "SVG" },
  { name: "Slack", icon: "Layers", type: "PNG" },
  { name: "Figma", icon: "PenTool", type: "SVG" },
  { name: "Amazon", icon: "ShoppingCart", type: "SVG" },
];

const filters = ["Full Logo", "Icon", "Symbol", "Favicon"];

const Catalog = () => {
  return (
    <div className={styles.catalog}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h2>Trending Assets</h2>
          <p>Showing 2,480 verified brand marks</p>
        </div>

        <div className={styles.filters}>
          {filters.map((item, index) => (
            <button
              key={item}
              className={`${styles.filterBtn} ${
                index === 0 ? styles.active : ""
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className={styles.grid}>
        {mockData.map((item, index) => {
          const IconComponent = Icons[item.icon];

          return (
            <div key={index} className={styles.card}>
              <div className={styles.logoBox}>
                {IconComponent && <IconComponent size={48} />}
              </div>

              <div className={styles.meta}>
                <span className={styles.name}>{item.name}</span>
                <span className={styles.type}>{item.type}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Load More */}
      <div className={styles.loadMore}>
        <button>
          Load more logos <Icons.ChevronDown style={{ marginLeft: "6px" }} />
        </button>
      </div>
    </div>
  );
};

export default Catalog;
