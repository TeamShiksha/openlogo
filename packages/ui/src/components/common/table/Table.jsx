import PropTypes from "prop-types";
import classes from "./Table.module.css";

const Table = ({ headers, rows, emptyMessage, onDelete }) => {
  const hasData = rows && rows?.length > 0;

  return (
    <div className={classes["table-container"]}>
      <table className={classes["custom-table"]}>
        <thead>
          <tr>
            {headers?.map((head, index) => (
              <th key={`${head}-${index}`} className={classes["table-header"]}>
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
                    className={classes["table-cell"]}
                  >
                    {cell}
                  </td>
                ))}
                {onDelete && (
                  <td className={classes["table-cell"]}>
                    <button
                      onClick={() => onDelete(cells[index])}
                      className={classes["delete-btn"]}
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={headers?.length} className={classes["no-data"]}>
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
  headers: PropTypes.array,
  rows: PropTypes.array,
  emptyMessage: PropTypes.string,
  onDelete: PropTypes.func,
};

export default Table;
