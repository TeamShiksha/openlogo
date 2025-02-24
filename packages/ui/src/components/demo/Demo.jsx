import { useState } from "react";
import { SVGS, COMPANIES } from "../../utils/Constants";
import styles from "./Demo.module.css";

const Demo = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);

  const handleSearch = (searchEvent) => {
    searchEvent.preventDefault();
    setShowResults(searchTerm.length > 0);
  };

  const handleInputChange = (inputChangeEvent) => {
    const value = inputChangeEvent.target.value;
    setSearchTerm(value);
    if (!value) {
      setShowResults(false);
    }
  };

  const filteredCompanies = COMPANIES.filter((company) =>
    company.name.toLowerCase().startsWith(searchTerm.toLowerCase())
  );

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
          {!!filteredCompanies.length && showResults && (
            <div className={`${styles["result-container"]}`}>
              {filteredCompanies.map((company, index) => (
                <div
                  key={company.id}
                  className={`${styles["result-item"]}`}
                  style={{ transitionDelay: `${index * 0.1}s` }}
                >
                  <img src={company.logo} alt={`${company.name} Logo`} />
                  <span>{company.name}</span>
                </div>
              ))}
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

export default Demo;
