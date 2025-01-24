import classes from "./Table.module.css";

const Table = ({ headers, rows, emptyMessage }) => {
  const hasData = rows && rows?.length > 0;

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
        {hasData ? (
          rows.map(({ id, cells }) => (
            <tr key={id}>
              {cells.map(({ id, value }) => (
                <td key={id} className={classes["table-cell"]}>
                  {value}
                </td>
              ))}
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
  );
};

export default Table;
