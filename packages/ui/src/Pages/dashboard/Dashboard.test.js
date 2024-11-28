import React from 'react';
import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import {describe, expect, it, vi} from 'vitest';
import Dashboard from './Dashboard';

describe('Dashboard Component', () => {
	const fetchUserData = vi.fn();
	const renderDashboard = () => {
		render(
				<Dashboard />
		);
	};

	it('renders Dashboard with all its components', () => {
		renderDashboard();
		const dashboardContainer = screen.getByTestId('testid-dashboard');
		expect(dashboardContainer).toBeInTheDocument();
		const currentPlanComponent = screen.getByText('Plan');
		expect(currentPlanComponent).toBeInTheDocument();
		const usageComponent = screen.getByText('Usage');
		expect(usageComponent).toBeInTheDocument();
		const apiKeyFormComponent = screen.getByText('Generate Key');
		expect(apiKeyFormComponent).toBeInTheDocument();
	});
});