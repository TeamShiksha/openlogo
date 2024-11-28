import {render, fireEvent, screen} from '@testing-library/react';
import CustomInput from './CustomInput';
import {describe, it, vi, expect} from 'vitest';

describe('CustomInput', () => {
	it('renders correctly', () => {
		render(
			<CustomInput
				type='text'
				label='Test Label'
				value=''
				name='testName'
				onChange={() => {}}
			/>,
		);

		expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
	});
});
