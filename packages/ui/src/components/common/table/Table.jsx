import PropTypes from "prop-types";
import Button from "../button/Button";
import styles from "./Table.module.css";
import { BUTTON_TEXT } from "../../../utils/Constants";

const Table = ({ headers, rows, emptyMessage, onDelete, isGuest }) => {
  const hasData = rows && rows?.length > 0;
  return (
    <div className={styles["table-container"]}>
      <table className={styles["custom-table"]}>
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
            rows.map((cells, index) => (
              <tr key={`${cells[index]}-${index}`}>
                {cells.map((cell, CIndex) => (
                  <td
                    key={`${cell}-${CIndex}`}
                    className={styles["table-cell"]}
                  >
                    {cell}
                  </td>
                ))}
                {onDelete && (
                  <td className={styles["table-cell"]}>
                    <Button
                      variant="danger"
                      className={styles["delete-btn"]}
                      onClick={() => onDelete(index)}
                      disabled={isGuest}
                    >
                      {BUTTON_TEXT.delete}
                    </Button>
                  </td>
                )}
              </tr>
            ))
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
