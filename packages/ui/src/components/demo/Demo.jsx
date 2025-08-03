import { useContext, useEffect, useState, useMemo } from "react";
import { SVGS, BUTTON_TEXT, DEMO } from "../../utils/Constants.js";
import styles from "./Demo.module.css";
import Button from "../common/button/Button.jsx";
import PropTypes from "prop-types";
import { firstLetterCapitalString } from "../../utils/Helpers.js";
import { useApi } from "../../hooks/useApi.js";
import LogoRequestForm from "./LogoRequestForm.jsx";
import { AuthContext } from "../../contexts/Contexts.jsx";
import LoadingSpinner from "../common/loadingspinner/LoadingSpinner.jsx";

const Demo = ({ openAuthModal }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const { makeRequest, data, loading, errorMsg } = useApi({
    method: "GET",
    url: "/logo/demo-search",
    params: {
      domainKey: searchTerm,
    },
  });
  const showResults = searchTerm.length > 1;
  const apiResults = useMemo(() => {
    if (errorMsg || !data?.data || !showResults) {
      return [];
    }
    return data.data
      .filter(({ companyName }) =>
        companyName.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .slice(0, 3);
  }, [errorMsg, data, showResults, searchTerm]);
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (!loading && searchTerm.length > 1) {
        makeRequest();
      }
    }, 500);
    return () => clearTimeout(debounceTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  const handleInputChange = (inputChangeEvent) => {
    const value = inputChangeEvent.target.value;
    setSearchTerm(value);
  };

  const openModal = () => setIsRequestModalOpen(true);
  const closeModal = () => setIsRequestModalOpen(false);

  const handleRequestClick = () => {
    if (isAuthenticated) {
      openModal();
    } else {
      openAuthModal();
    }
  };

  return (
    <>
      <div data-testid="demo" id="demo" className={styles["demo-container"]}>
        <div className={styles.content}>
          <h1>{DEMO.heading}</h1>
          <p>{DEMO.summary}</p>
        </div>
        <div className={`${styles["search-box"]}`}>
          <div className={styles["search-content"]}>
            <form onSubmit={(e) => e.preventDefault()}>
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

            {showResults && (
              <div
                className={`${styles["result-container"]} ${styles["show"]}`}
              >
                {loading && (
                  <div className={styles.loading}>
                    <LoadingSpinner color="blue" />
                  </div>
                )}
                {!loading && apiResults.length === 0 ? (
                  <div className={styles["no-result"]}>
                    <p>
                      {"Your search “"}
                      <b className={styles["search-term"]}>{searchTerm}</b>
                      {"” did not match any logo."}
                    </p>
                    <Button onClick={handleRequestClick} variant={"primary"}>
                      {BUTTON_TEXT.requestLogo}
                    </Button>
                  </div>
                ) : (
                  <>
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
                        <span>
                          {firstLetterCapitalString(company.companyName)}
                        </span>
                      </div>
                    ))}
                  </>
                )}
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
      {isRequestModalOpen && <LogoRequestForm closeModal={closeModal} />}
    </>
  );
};

Demo.propTypes = {
  openAuthModal: PropTypes.func.isRequired,
};

export default Demo;
