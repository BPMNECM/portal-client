// 'useNATFWDesign2.integration.test.js' 'portal-client/components/Design/__tests__/useNATFWDesign2.integration.test.js'
// npm test components/Design/__tests__/useNATFWDesign2.integration.test.js

import React from 'react';
import useNATFWDesign from '../UpdateNATFW';
import {render, screen, waitFor} from '@testing-library/react';
import mockOrderData1 from '../../../manual-tests/mockOrderData1.js';
import mockOrderData2 from '../../../manual-tests/mockOrderData2.js';
import mockOrderData3 from '../../../manual-tests/mockOrderData3.js';

const testOrders = [
	{orderId: '67104f800b7a1170bc389b1d', data: mockOrderData1},
	{orderId: '67104f800b7a1170bc389b12', data: mockOrderData2},
	{orderId: '67104f800b7a1170bc389b13', data: mockOrderData3}
];

const TestComponent = ({orderId, data}) => {
	const {updateNATFWDesign, notificationMessage, errorMessage} = useNATFWDesign(orderId);
	
	React.useEffect(() => {
		updateNATFWDesign(data);
	}, [data]);
	
	return (
		<div>
			{notificationMessage && <span data-testid="notification">{notificationMessage}</span>}
			{errorMessage && <span data-testid="error">{errorMessage}</span>}
		</div>
	);
};

describe('useNATFWDesign Integration Tests', () => {
	testOrders.forEach(({orderId, data}, index) => {
		it(`should handle order ${index + 1} with status ${data.status}`, async () => {
			render(<TestComponent orderId={orderId} data={data}/>);
			
			await waitFor(() => {
				expect(screen.getByTestId('notification')).toBeInTheDocument();
			});
			
			// Additional assertions
			expect(screen.queryByTestId('error')).not.toBeInTheDocument();
		});
	});
});
