// 'jest.setup.js' at the root of project - 'portal-client/jest.setup.js'

require('@testing-library/jest-dom');

const { mockOrderData1, mockOrderData2, mockOrderData3 } = require('@/manual-tests/mockOrderData.js');
const { mockPortData1, mockPortData2 } = require('@/manual-tests/mockPortData');

import { getLogger } from '@/utils/logger/logger';

const logger = getLogger('Jest-Set-Up');

jest.mock('@/hooks/use-request', () => ({
    __esModule: true,
    default: jest.fn((config = {}) => ({
        doRequest: jest.fn((params = {}) => {
            // Log the incoming params to help debug the mock
            console.log('doRequest called with :', config, params);
            
            
            if (!config.url) {
                logger.error(`doRequest mock error: 'url' is missing in config`);
                return Promise.reject(new Error(`Missing 'url' in config`));
            }
            
            // Mock different API responses based on the URL
            if (config.url.includes('/api/orders')) {
                if (config.url.includes('67104f800b7a1170bc389b1d')) return Promise.resolve(mockOrderData1);
                if (config.url.includes('67104f800b7a1170bc389b12')) return Promise.resolve(mockOrderData2);
                if (config.url.includes('67104f800b7a1170bc389b13')) return Promise.resolve(mockOrderData3);
                return Promise.reject(new Error('Order not found!'));
            }
            
            // Mock response for the 'getPortRequest' endpoint
            if (config.url.includes('/api/dna/ports/getPort')) {
                if (params.id === '801013') return Promise.resolve(mockPortData1);
                if (params.id === '800925') return Promise.resolve(mockPortData2);
                return Promise.reject(new Error('Port not found!'));
            }
            
            // Default response for other API requests
            return Promise.resolve({ success: true });
        }),
        errors: null
    }))
}));

module.exports = {
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js']
};
