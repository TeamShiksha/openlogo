/**
 * Table Component
 *
 * Props:
 * - headers: Array of objects representing table headers.
 *   Each header object must have:
 *     - id (string): A unique identifier for the header.
 *     - label (string): The text to display in the header.
 *   Example:
 *   headers = [
  { id: "name", label: "Name" },
  { id: "age", label: "Age" },
];
 *
 * - rows: Array of objects representing table rows.
 *   Each row object must have:
 *     - id (string): A unique identifier for the row.
 *     - cells (array): An array of objects representing the cells in the row.
 *       Each cell object must have:
 *         - id (string): A unique identifier for the cell.
 *         - value (any): The content to display in the cell.
 *   Example:
 *   rows = [
  {
    id: "row1",
    cells: [
      { id: "cell1", value: "John" },
      { id: "cell2", value: 25 },
    ],
  },
  {
    id: "row2",
    cells: [
      { id: "cell5", value: "Jane" },
      { id: "cell6", value: 30 },
    ],
  },
];
 */

import classes from "./Table.module.css";

const Table = ({ headers, rows }) => {
  return (
    <table className={classes["custom-table"]}>
      <thead>
        <tr>
          {headers?.map(({ id, label }) => (
            <th key={id} className={classes["table-header"]}>
              {label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map(({ id, cells }) => (
          <tr key={id}>
            {cells.map(({ id, value }) => (
              <td key={id} className={classes["table-cell"]}>
                {value}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
