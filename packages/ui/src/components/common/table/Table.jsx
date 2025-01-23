import PropTypes from "prop-types";

import styles from "./Table.module.css";

const Table = (props) => {
  const { headers, rows, className, style, customStyles } = props;

  return (
    <table className={`${styles.table} ${className || ""}`} style={style}>
      <thead>
        <tr>
          {headers?.map((header, index) => (
            <th
              key={index}
              className={`${styles.tableHeader} ${customStyles?.header || ""}`}
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex} className={`${customStyles?.row || ""}`}>
            {row.map((cell, cellIndex) => (
              <td
                key={cellIndex}
                className={`${styles.tableCell} ${customStyles?.cell || ""}`}
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

Table.propTypes = {
  headers: PropTypes.arrayOf(PropTypes.string).isRequired,
  rows: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.node)).isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
  customStyles: PropTypes.shape({
    header: PropTypes.string,
    row: PropTypes.string,
    cell: PropTypes.cell,
  }),
};

Table.defaultProps = {
  headers: [],
  rows: [],
  className: "",
  style: {},
  customStyles: {},
};

export default Table;
