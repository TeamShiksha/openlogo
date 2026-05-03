import { useEffect, useState } from "react";
import * as Icons from "lucide-react";
import LoadingSpinner from "../../common/loadingspinner/LoadingSpinner.jsx";
import { instance } from "../../../api/api_instance.js";
import styles from "./Catalog.module.css";

const seedLogos = [
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
const PAGE_SIZE = 8;

const Catalog = () => {
  const [logos, setLogos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    let isMounted = true;

    const fetchLogos = async () => {
      setLoading(true);
      setErrorMsg("");

      const results = await Promise.allSettled(
        seedLogos.map(async (logo) => {
          const response = await instance.get("/logo/demo-search", {
            params: { key: logo.name },
          });

          const matches = response.data?.data || [];
          const normalizedName = logo.name.toLowerCase();
          const exactMatch =
            matches.find(
              ({ companyName }) => companyName.toLowerCase() === normalizedName
            ) ||
            matches.find(({ companyName }) =>
              companyName.toLowerCase().includes(normalizedName)
            );

          return {
            ...logo,
            image: exactMatch?.image || "",
            name: exactMatch?.companyName || logo.name,
          };
        })
      );

      if (!isMounted) {
        return;
      }

      const fulfilledLogos = results
        .filter((result) => result.status === "fulfilled")
        .map((result) => result.value);

      setLogos(fulfilledLogos);
      if (fulfilledLogos.length === 0) {
        setErrorMsg("Unable to load logos right now.");
      }
      setLoading(false);
    };

    fetchLogos();

    return () => {
      isMounted = false;
    };
  }, []);

  const displayedLogos = (logos.length > 0 ? logos : seedLogos).slice(
    0,
    visibleCount
  );
  const hasMore =
    visibleCount < (logos.length > 0 ? logos.length : seedLogos.length);

  return (
    <div className={styles.catalog}>
      <div className={styles.header}>
        <div>
          <h2>Trending Assets</h2>
          <p>
            {loading
              ? "Loading verified brand marks"
              : `Showing ${displayedLogos.length} verified brand marks`}
          </p>
        </div>

        <div className={styles.filters}>
          {filters.map((item, index) => (
            <button
              key={item}
              type="button"
              className={`${styles.filterBtn} ${
                index === 0 ? styles.active : ""
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className={styles.status}>
          <LoadingSpinner color="var(--primary)" />
        </div>
      )}

      {!loading && errorMsg && (
        <div className={styles.status}>
          <p className={styles.errorText}>{errorMsg}</p>
        </div>
      )}

      <div className={styles.grid}>
        {displayedLogos.map((item, index) => {
          const IconComponent = Icons[item.icon];

          return (
            <div key={`${item.name}-${index}`} className={styles.card}>
              <div className={styles.logoBox}>
                {item.image ? (
                  <img
                    src={item.image}
                    alt={`${item.name} logo`}
                    className={styles.logoImage}
                    loading="lazy"
                  />
                ) : (
                  IconComponent && <IconComponent size={48} />
                )}
              </div>

              <div className={styles.meta}>
                <span className={styles.name}>{item.name}</span>
                <span className={styles.type}>{item.type}</span>
              </div>
            </div>
          );
        })}
      </div>

      {hasMore && (
        <div className={styles.loadMore}>
          <button
            type="button"
            onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
          >
            Load more logos <Icons.ChevronDown style={{ marginLeft: "6px" }} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Catalog;
