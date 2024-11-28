import PieGraph from './PieGraph';

function Usage({usedCalls, totalCalls}) {
	const percentage = (usedCalls / totalCalls) * 100;

	return (
		<div className='dashboard-content-item'>
			<h6 className='content-item-heading'>Usage</h6>
			<div className='usage-body-container'>
				<div className='circular-chart'>
					<PieGraph percentage="21" colour='#4F46E5' fill='#E6E6FA' />
				</div>
				<div className='usage-statistics'>
					<div className='data-heading'>Calls</div>
					<div className='data'>105</div>
					<div className='data-heading'>Limit</div>
					<div className='data'>500</div>
				</div>
			</div>
			<div className='dashboard-reset-date'>Resets 1st of every month.</div>
		</div>
	);
}

export default Usage;
