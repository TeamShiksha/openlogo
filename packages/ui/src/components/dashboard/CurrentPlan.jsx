function CurrentPlan({subscriptionData}) {
	return (
		<div className='dashboard-content-item'>
			<div className='current-plan-header'>
				<h3 className='content-item-heading'>Plan</h3>
				<div
					className='active'
				>
					Active
				</div>
			</div>
			<h4 className='current-plan'>Hobby</h4>
			<p className='current-plan-tagline'>
				Empower your projects with essential tools, at no cost.
			</p>
				<button className='upgrade-button'>Upgrade</button>
		</div>
	);
}

export default CurrentPlan;
