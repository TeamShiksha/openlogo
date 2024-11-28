import CustomInput from '../common/input/CustomInput';

function ApiKeyForm() {
	return (
		<section className='dashboard-content-section'>
			<form
				className='api-key-container'
				noValidate
			>
			<p className='dashboard-reset-date'>Generate a new API key to use in your projects.</p>
				<CustomInput
					type='text'
					name='apikey'
					label='Add the description'
				/>
				<button type='submit'>
					Generate Key
				</button>
			</form>
		</section>
	);
}

export default ApiKeyForm;
