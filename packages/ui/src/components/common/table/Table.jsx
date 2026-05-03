import PropTypes from "prop-types";
import styles from "./Table.module.css";

const Table = ({ headers, rows, emptyMessage, onDelete, isGuest }) => {
  const hasData = rows && rows?.length > 0;
  return (
    <div className={styles["table-container"]}>
      <table className={styles["table"]}>
        <thead>
          <tr>
            {headers?.map((head, index) => (
              <th key={`${head}-${index}`} className={styles["table-header"]}>
                {head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {hasData ? (
            rows.map((cells, index) => {
              const isArrayFormat = Array.isArray(cells);
              const cellsData = isArrayFormat ? cells : cells.cells;
              const rowClassName = isArrayFormat
                ? ""
                : cells.rowClassName || "";

              return (
                <tr key={`${cellsData[0]}-${index}`} className={rowClassName}>
                  {cellsData.map((cell, CIndex) => (
                    <td
                      key={`${cell}-${CIndex}`}
                      className={`${styles["table-cell"]} ${
                        CIndex === 0 ? styles["key-name"] : ""
                      }`}
                    >
                      {cell}
                    </td>
                  ))}
                  {onDelete && (
                    <td className={styles["table-cell"]}>
                      <button
                        className={styles["action-btn"]}
                        onClick={() => onDelete(index)}
                        disabled={isGuest}
                        aria-label="Delete key"
                      >
                        <svg
                          className={styles["delete-icon"]}
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          <line x1="10" y1="11" x2="10" y2="17"></line>
                          <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                      </button>
                    </td>
                  )}
                </tr>
              );
            })
          ) : (
            <tr>
              <td
                colSpan={headers?.length}
                className={styles["no-data"]}
                data-testid="empty-api-message"
              >
                {emptyMessage || "No data to display"}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

Table.propTypes = {
  headers: PropTypes.array.isRequired,
  rows: PropTypes.array.isRequired,
  emptyMessage: PropTypes.string,
  onDelete: PropTypes.func,
  isGuest: PropTypes.bool.isRequired,
};

export default Table;
