import styles from "./admin/Admin.module.css";//mock css file //to be replaced with origin Operator.module.css file. 
function OperatorDashboard() {
  return (
     //no need to add 'container class' along with styles in classname as it has been included inside parent div in Dashboard.jsx
     //Admin classname for css should be replaced with operator classname
     //data-testid="testid-operator-dashboard" is required for test cases 
    <div className={styles["admin-page-container"]} data-testid="testid-operator-dashboard">
      <p>Operator Dashboard - content to be replaced with the original implementation.</p>
    </div>
  );
}

export default OperatorDashboard;
