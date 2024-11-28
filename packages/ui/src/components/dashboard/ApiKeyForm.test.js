import {render, fireEvent, screen, waitFor} from '@testing-library/react';
import {vi} from 'vitest';
import ApiKeyForm from './ApiKeyForm';
describe('ApiKeyForm', () => {
	it('renders correctly', () => {
		render(
			<ApiKeyForm/>,
		);
		expect(
			screen.getByLabelText('Add the description'),
		).toBeInTheDocument();
		expect(screen.getByText('Generate Key')).toBeInTheDocument();
	});
});
