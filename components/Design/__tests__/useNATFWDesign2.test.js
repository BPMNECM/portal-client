// 'useNATFWDesign2.test.js' 'portal-client/components/Design/__tests__/useNATFWDesign2.test.js'
//  npm test components/Design/__tests__/useNATFWDesign2.test.js

import {act, renderHook} from '@testing-library/react';
import useNATFWDesign from '../UpdateNATFW';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

// Mock Axios
const mock = new MockAdapter(axios);

describe('useNATFWDesign Hook', () => {
	afterEach(() => {
		mock.reset();
	});
	
	it('should successfully fetch an order and update design', async () => {
		const orderId = '673d2a98005daf3c34c22ae6';
		
		// Mock successful API calls
		mock.onGet(`/api/orders/${orderId}`).reply(200, {projectNumber: 'FY25M27ENCOMPASSHUGMB10'});
		mock.onPost('/api/dna/projects/createProject').reply(200, {success: true});
		mock.onPut('/api/dna/slots/updateSlot').reply(200, {success: true});
		
		const {result} = renderHook(() => useNATFWDesign(orderId));
		
		await act(async () => {
			await result.current.updateNATFWDesign();
		});
		
		expect(result.current.designNotification).toHaveLength(3); // Fetch Order, Create Project, Update Slot
	});
	
	it('should log an error if an API call fails', async () => {
		const orderId = '673d2a98005daf3c34c22ae6';
		
		// Mock API failure
		mock.onGet(`/api/orders/${orderId}`).reply(500, '<html><body><pre>Error: Internal Server Error</pre></body></html>');
		
		const {result} = renderHook(() => useNATFWDesign(orderId));
		
		await act(async () => {
			await result.current.updateNATFWDesign();
		});
		
		expect(result.current.errorMessage).toHaveLength(1);
		expect(result.current.errorMessage[0]).toContain('Internal Server Error');
	});
});
