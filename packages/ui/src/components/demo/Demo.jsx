import { useState } from "react";
import { SVGS, BUTTON_TEXT } from "../../utils/Constants";
import styles from "./Demo.module.css";
import Button from "../common/button/Button.jsx";
import PropTypes from "prop-types";
import { instance } from "../../api/api_instance.js";

const Demo = ({ openAuthModal }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiResults, setApiResults] = useState([]);

  const handleSearch = async (searchEvent) => {
    searchEvent.preventDefault();

    if (searchTerm.length > 1) {
      setLoading(true);
      setShowResults(false);

      try {
        const response = await instance.get(
          `/logo/demo-search?domainKey=${searchTerm}`
        );
        const res = response.data;
        setApiResults(res.data.slice(0, 3));
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
        setShowResults(true);
      }
    }
  };

  const handleInputChange = (inputChangeEvent) => {
    const value = inputChangeEvent.target.value;
    setSearchTerm(value);
    if (!value) {
      setShowResults(false);
      setApiResults([]);
    }
  };

  return (
    <div data-testid="demo" id="demo" className={styles["demo-container"]}>
      <div className={styles.content}>
        <h1>See In Action</h1>
        <p>
          Powerful, self-serve product and growth analytics to help you convert,
          engage, and retain more.
        </p>
      </div>
      <div className={`${styles["search-box"]}`}>
        <div className={styles["search-content"]}>
          <form onSubmit={handleSearch}>
            <input
              name="search"
              type="text"
              value={searchTerm}
              onChange={handleInputChange}
              className={styles["search-box-input"]}
              placeholder="Search"
            />
            <button type="submit" className={styles["search-button"]}>
              <img src={SVGS.searchIcon} alt="Search" />
            </button>
          </form>

          {loading && (
            <div className={`${styles["result-container"]} ${styles["show"]}`}>
              <div
                data-testid="loading-dots"
                className={styles["loading-dots"]}
              >
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}

          {apiResults.length > 0 && showResults && (
            <div className={`${styles["result-container"]} ${styles["show"]}`}>
              {apiResults.map((company, index) => (
                <div
                  key={company.companyName}
                  className={`${styles["result-item"]} ${styles["show"]}`}
                  style={{ transitionDelay: `${index * 0.1}s` }}
                >
                  <img
                    src={company.image}
                    alt={`${company.companyName} Logo`}
                  />
                  <span>{company.companyName}</span>
                </div>
              ))}
            </div>
          )}

          {!loading && showResults && apiResults.length === 0 && (
            <div className={`${styles["result-container"]} ${styles["show"]}`}>
              <div className={styles["no-result"]}>
                <p>{`Your search “${searchTerm}” did not match any logo.`}</p>
                <Button onClick={openAuthModal} variant={"primary"}>
                  {BUTTON_TEXT.requestLogo}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      <img
        src={SVGS.curvedArrow}
        alt="curved-arrow"
        className={styles["curved-arrow"]}
      />
    </div>
  );
};

Demo.propTypes = {
  openAuthModal: PropTypes.func.isRequired,
};

export default Demo;
