import ApiKeyForm from '../../components/dashboard/ApiKeyForm';
import CurrentPlan from '../../components/dashboard/CurrentPlan';
import Usage from '../../components/dashboard/Usage';
import './Dashboard.css';

function Dashboard() {

	return (
		<div className='dashboard-container' data-testid='testid-dashboard'>
			<div className='dashboard-content-container'>
				<section className='dashboard-content-section'>
					<Usage />
					<div className='generate-api'>
						<h1 className='content-item-heading'>Generate New API key</h1>
						<ApiKeyForm/>
					</div>
					<CurrentPlan />
				</section>
			</div>
		</div>
	);
}

export default Dashboard;
