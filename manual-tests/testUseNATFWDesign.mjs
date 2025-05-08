// manual-tests/testUseNATFWDesign.mjs

import useNATFWDesign from '../components/Design/UpdateNATFW.js';
import mockOrderData from './mockOrderData.js';
import mockPortData from './mockPortData.js';

const { mockOrderData1, mockOrderData2, mockOrderData3 } = mockOrderData;

// Mock port data to simulate the 'getPortRequest' API response
const { mockPortData1, mockPortData2 } = mockPortData;

// Array of different mock orders to test
const testOrders = [
    { orderId: '67104f800b7a1170bc389b1d', data: mockOrderData1 },
    { orderId: '67104f800b7a1170bc389b12', data: mockOrderData2 },
    { orderId: '67104f800b7a1170bc389b13', data: mockOrderData3 }
];

async function testUpdateNATFWDesign(orderId, mockData) {
    const { updateNATFWDesign, notificationMessage, errorMessage } = useNATFWDesign(orderId);
    
    try {
        console.log(`Testing with Order ID: ${orderId}`);
        
        // Simulate updating the NATFW design
        await updateNATFWDesign(mockData);  // Passing the mock data for testing
        
        // Log the results to verify
        console.log(`Notification for ${orderId}:`, notificationMessage);
        if (errorMessage) {
            console.error(`Error for ${orderId}:`, errorMessage);
        }
    } catch (error) {
        console.error(`Exception for ${orderId}:`, error);
    }
}

// Run tests for each mock order
testOrders.forEach(async (order) => {
    await testUpdateNATFWDesign(order.orderId, order.data);
});
