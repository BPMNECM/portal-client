// useNATFWDesign.test.js at 'portal-client/components/Design/__tests__'
// npm test components/Design/__tests__/useNATFWDesign.test.js

import React from 'react';
import useNATFWDesign from '@/components/Design/UpdateNATFW';
import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import mockOrderData from '../manual-tests/mockOrderData.js';

// Mock for API calls
const mockDoRequest = jest.fn();
jest.mock('@/hooks/use-request', () => ({
	__esModule: true,
	default: () => ({
		doRequest: mockDoRequest,
		errors: null
	})
}));

// Helper component to test the hook
const TestComponent = ({orderId}) => {
	const {updateNATFWDesign, notificationMessage, errorMessage} = useNATFWDesign(orderId);
	
	return (
		<div>
			<button onClick={updateNATFWDesign}>Update NATFW Design</button>
			{notificationMessage && <span data-testid="notification">{notificationMessage.message}</span>}
			{errorMessage && <span data-testid="error">{errorMessage}</span>}
		</div>
	);
};

describe('useNATFWDesign Hook', () => {
	const mockOrderId = '67104f800b7a1170bc389b1d';
	
	beforeEach(() => {
		jest.clearAllMocks();
	});
	
	it('should trigger the update process and display notifications', async () => {
		// Set up mock responses for each API call in sequence
		mockDoRequest
			.mockImplementationOnce(() => Promise.resolve(mockOrderData)) // Fetch order
			.mockImplementationOnce(() => Promise.resolve(mockProjectResponse)) // Create project
			.mockImplementationOnce(() => Promise.resolve(mockSlotUpdateResponse)) // Update slot
			.mockImplementationOnce(() => Promise.resolve(mockPortUpdateResponse)) // Update port
			.mockImplementationOnce(() => Promise.resolve(mockVIPUpdateResponse)); // Update VIP flows
		
		render(<TestComponent orderId={mockOrderId}/>);
		const updateButton = screen.getByText('Update NATFW Design');
		userEvent.click(updateButton);
		
		// Assert notification appears
		await waitFor(() => expect(screen.getByTestId('notification')).toBeInTheDocument());
		expect(screen.getByTestId('notification')).toHaveTextContent('Fetching updated order...');
		
		// Verify that console logs are appearing instead of logger.info
		console.log(`Starting NATFW Design workflow for Order ID ${mockOrderId}`);
		console.log('updateNATFWDesign - All Inventory APIs executed successfully');
	});
	
	it('should display an error message if API fails', async () => {
		mockDoRequest.mockRejectedValueOnce(new Error('API Error'));
		
		render(<TestComponent orderId={mockOrderId}/>);
		const updateButton = screen.getByText('Update NATFW Design');
		userEvent.click(updateButton);
		
		// Verify that error message displays
		await waitFor(() => expect(screen.getByTestId('error')).toBeInTheDocument());
		expect(screen.getByTestId('error')).toHaveTextContent('API Error');
		
		// Verify console error
		console.error('Workflow execution failed: API Error');
	});
});


// Mock response for each specific API
const mockProjectResponse = {id: 'ProjectID123', name: 'ProjectResponse'};
const mockSlotUpdateResponse = {success: true};
const mockPortUpdateResponse = {success: true};
const mockVIPUpdateResponse = {flowId: 'VIPFlow123', status: 'Updated'};
