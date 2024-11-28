import './CustomInput.css';

function CustomInput({
	type,
	label,
	value,
	name,
	onChange,
	error,
	className,
	...rest
}) {
	return (
		<div className='custom-input-group'>
			<input
				type={type}
				id={label}
				name={name}
				value={value}
				onChange={onChange}
				required
				className={`custom-input ${className}`}
				{...rest}
			/>
			<label className='custom-input-label' htmlFor={label}>
				{label}
			</label>
			{error && <p className='custom-input-error'>{error}</p>}
		</div>
	);
}

export default CustomInput;
