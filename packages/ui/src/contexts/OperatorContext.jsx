import PropTypes from "prop-types";
import { useState, useMemo, useCallback } from "react";
import { instance } from "../api/api_instance";
import { OperatorContext } from "./Contexts";
import { useToast } from "../hooks/useToast";

export function OperatorProvider({ children }) {
  const toast = useToast();
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  const fetchQueries = useCallback(
    async (isActive, currentPage, queriesPerPage) => {
      setLoading(true);
      try {
        const res = await instance.get("/api/common/pagination", {
          params: {
            type: "queries",
            page: currentPage,
            limit: queriesPerPage,
            active: isActive,
          },
        });
        const data = res.data;
        setQueries(data);
      } catch (err) {
        setError(err);
        toast.error(err);
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setQueries, setError, toast]
  );

  return (
    <OperatorContext.Provider
      value={useMemo(
        () => ({ queries, loading, error, fetchQueries }),
        [queries, loading, error, fetchQueries]
      )}
    >
      {children}
    </OperatorContext.Provider>
  );
}

OperatorProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
