export const fetchFlowDetails = async (flowId) => {
    try {
        const response = await fetch(`/api/flows/${flowId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch flow details');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching flow details:', error);
        throw error;
    }
};
