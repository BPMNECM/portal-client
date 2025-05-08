import {useEffect, useState} from 'react';
import useOrderStore from '@/store/useOrderStore';
import {getLogger} from '@/utils/logger/logger';

const useServiceModalState = (index, service) => {
	const logger = getLogger('useServiceModalState');
	logger.info(`useServiceModalState - Index: ${index}, service: ${JSON.stringify(service)} `);
	
	const [isLoadingPortValue, setIsLoadingPortValue] = useState(false);
	const [renderedTable, setRenderedTable] = useState(null);
	
	const {
		secondStep,
		setSelectedItem,
		setVIPFlows,
		setDetailedVIPFlows,
		set
	} = useOrderStore();
	
	const handleInputChange = (field, value) => {
		logger.info(`useServiceModalState [handleInputChange] - Index: ${index}, Field: ${field}, Value: ${value}`);
		
		set((state) => ({
			secondStep: {
				...state.secondStep,
				services: state.secondStep.services.map((service, i) =>
					i === index ? {...service, [field]: value} : service
				)
			}
		}));
		
		setSelectedItem(field, value, index);
	};
	
	const handleGenerateFlow = () => {
		const totalFlows = Number(service.TxFlows) + Number(service.RxFlows);
		const engineeringName = service.port;
		logger.info(`handleGenerateFlow - totalFlows: ${totalFlows}, engineeringName: ${engineeringName} `);
		
		set((state) => {
			const updatedServices = state.secondStep.services.map((service, i) =>
				i === index ? {...service, totalFlows, engineeringName} : service
			);
			return {
				secondStep: {
					...state.secondStep,
					services: updatedServices
				}
			};
		});
		
		// setRenderedTable('newFlows');
		logger.info(`handleGenerateFlow - Index: ${index}, totalFlows: ${totalFlows}, engineeringName: ${engineeringName}`);
	};
	
	const setPortVIPFlows = (vipFlows) => {
		setVIPFlows(index, vipFlows);
		setRenderedTable('existingFlows');
	};
	
	const resetVIPFlows = () => {
		setDetailedVIPFlows(index, []);
		setVIPFlows(index, []);
		setRenderedTable(null);
	};
	
	useEffect(() => {
		// Ensure dynamic setting of `renderedTable` based on `service`
		if (service?.port) {
			// Conditionally set `renderedTable` based on `vipFlows`
			setRenderedTable(service.vipFlows.length > 0 ? 'existingFlows' : 'newFlows');
		} else {
			setRenderedTable(null); // Reset if port is not selected
		}
	}, [service]); // Dependency on `service` to dynamically update `renderedTable`
	
	return {
		handleInputChange,
		handleGenerateFlow,
		setPortVIPFlows,
		resetVIPFlows,
		isLoadingPortValue,
		setIsLoadingPortValue,
		renderedTable,
		setRenderedTable
	};
};

export default useServiceModalState;
