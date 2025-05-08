// This Hook properly updates the loading states passed from RenderPortComponent
// This Hook accept the state setters and use them accordingly

import useFormRequest from '@/hooks/use-form-request';
import useServiceModalState from '@/hooks/useServiceModalState';
import useOrderStore from '@/store/useOrderStore';
import {characteristicMapping, findCharacteristicValue} from '@/utils/resource-helper';
import {determinePath, extractPortIdsAndNames, extractSlotIdsAndNames} from '@/utils/form-utils';
import {getLogger} from '@/utils/logger/logger';

const useResourceHandlers = (
	index, service, userName,
	{
		setAddCardRefreshFlag, setRenderedTable,
		setIsLoadingSlots, setIsLoadingCardValue,
		setIsLoadingPorts, setIsLoadingPortValue,
		setChassisRequestErrors, setSlotRequestErrors, setAddCardRequestErrors, setPortRequestErrors
	}
) => {
	const logger = getLogger('useResourceHandlers');
	const {handleInputChange} = useServiceModalState(index, service, userName);
	const {
		secondStep,
		setSelectedItem,
		setSlotOptions,
		setPortOptions,
		setVIPFlows,
		resetChassisRelatedData,
		resetSlotRelatedData,
		resetPortRelatedData,
		set
	} = useOrderStore();
	
	const {doRequest: doChassisDataRequest} = useFormRequest();
	const {doRequest: doSlotDataRequest} = useFormRequest();
	const {doRequest: doPortDataRequest} = useFormRequest();
	const {doRequest: doAddCardRequest} = useFormRequest();
	logger.info(`useResourceHandlers - Index: ${index}, userName: ${userName} `);
	
	const handleChassisChange = async (selectedChassis) => {
		logger.info(`handleChassisChange - selectedChassis : ${JSON.stringify(selectedChassis)} `);
		resetChassisRelatedData(index);
		setIsLoadingSlots(true);
		setSelectedItem('chassis', selectedChassis, index);
		handleInputChange('path', determinePath(selectedChassis));
		
		const selectedChassisInfo = secondStep.chassisOptions.find(
			(chassisItem) => chassisItem.publicIdentifier === selectedChassis || chassisItem.name === selectedChassis);
		logger.debug(`handleChassisChange - selectedChassisInfo: ${JSON.stringify(selectedChassisInfo)}`);
		
		if (selectedChassisInfo) {
			const url = `${process.env.NEXT_PUBLIC_DNA_HOST || ''}/api/dna/chassis/getChassisId?id=${selectedChassisInfo.id}`;
			await doChassisDataRequest({
				url,
				method: 'get',
				onSuccess: async (chassisResponse) => {
					logger.debug(`doChassisDataRequest - chassisResponse: ${JSON.stringify(chassisResponse)} `);
					const slotData = await extractSlotIdsAndNames(chassisResponse[0]);
					const slotOptions = slotData.map(({id, name, slotName}) => ({id, name, slotName}));
					setSlotOptions(index, slotOptions.length > 0 ? slotOptions : ['No Slots Available']);
				},
				onError: (error) => {
					setChassisRequestErrors(error);
					logger.error(`handleChassisChange - doChassisDataRequest Error: ${error.message}`);
				}
			});
		} else {
			setSlotOptions(index, []);
			logger.warn(`handleChassisChange - Chassis ${selectedChassis} not found!`);
			setChassisRequestErrors({message: `Chassis ${selectedChassis} not found!`});
		}
		setIsLoadingSlots(false);
		setRenderedTable(null);
	};
	
	const handleSlotChange = async (selectedSlot) => {
		logger.info(`handleSlotChange - Index: ${index}, selectedSlot: ${JSON.stringify(selectedSlot)} `);
		resetSlotRelatedData(index);
		setIsLoadingPorts(true);
		setIsLoadingCardValue(true);
		setSelectedItem('slot', selectedSlot, index);
		
		const selectedSlotInfo = service.slotOptions.find(
			(slotItem) => slotItem.name === selectedSlot || slotItem.publicIdentifier === selectedSlot);
		logger.debug(`handleSlotChange - selectedSlotInfo: ${JSON.stringify(selectedSlotInfo)}`);
		
		if (selectedSlotInfo) {
			setSelectedItem('slotId', selectedSlotInfo.id, index);
			setSelectedItem('slotName', selectedSlotInfo.slotName, index);
			const url = `${process.env.NEXT_PUBLIC_DNA_HOST || ''}/api/dna/slots/getSlot?id=${selectedSlotInfo.id}`;
			
			await doSlotDataRequest({
				url,
				method: 'get',
				onSuccess: async (slotResponse) => {
					logger.debug(`handleSlotChange - slotResponse : ${JSON.stringify(slotResponse[0])}`);
					const portList = extractPortIdsAndNames(slotResponse[0]);
					await extractAndSetCharacteristics('slot', slotResponse[0]);
					
					if (portList && portList.length > 0) {
						logger.debug(`handleSlotChange - portList: ${JSON.stringify(portList)}`);
						const formattedPortOptions = portList.map(({id, name}) => ({id, name}));
						setPortOptions(index, formattedPortOptions);
					} else {
						setPortOptions(index, ['No Ports Available']);
					}
				},
				onError: (error) => {
					setSlotRequestErrors(error);
					logger.error(`handleSlotChange - doSlotDataRequest Error: ${error.message}`);
				}
			});
		} else {
			setPortOptions(index, []);
			logger.warn(`handleSlotChange - Selected Slot ${selectedSlot} not found!`);
			setSlotRequestErrors({message: `Slot ${selectedSlot} not found!`});
		}
		setIsLoadingPorts(false);
		setIsLoadingCardValue(false);
		setRenderedTable(null);
	};
	
	const handlePortChange = async (selectedPort) => {
		logger.info(`handlePortChange - Index: ${index}, selectedPort: ${JSON.stringify(selectedPort)} `);
		resetPortRelatedData(index);
		setIsLoadingPortValue(true);
		setSelectedItem('port', selectedPort, index);
		
		const selectedPortInfo = service.portOptions.find(
			(portItem) => portItem.name === selectedPort || portItem.publicIdentifier === selectedPort);
		logger.debug(`handlePortChange - selectedPortInfo: ${JSON.stringify(selectedPortInfo)}`);
		
		if (selectedPortInfo) {
			setSelectedItem('portId', selectedPortInfo.id, index);
			const url = `${process.env.NEXT_PUBLIC_DNA_HOST || ''}/api/dna/ports/getPort?id=${selectedPortInfo.id}`;
			await doPortDataRequest({
				url,
				method: 'get',
				onSuccess: async (portResponse) => {
					logger.debug(`handlePortChange - selectedPortData: ${JSON.stringify(portResponse[0])}`);
					await extractAndSetCharacteristics('port', portResponse[0]);
					// await extractAndSetData('port', portResponse[0]);
					
					const vipFlows = portResponse[0].resourceRelationship
						.filter(rel => rel.resource['@referredType'] === 'VIP Flow')
						.map(rel => rel.resource);
					
					if (vipFlows && vipFlows.length > 0) {
						setVIPFlows(index, vipFlows);
						setRenderedTable('existingFlows');
					} else {
						setRenderedTable('newFlows');
						logger.warn(`No VIP Flows found for the selected port: ${selectedPortInfo.id}`);
					}
				},
				onError: (error) => {
					setPortRequestErrors(error);
					logger.error(`handlePortChange - doPortDataRequest Error: ${error.message}`);
				}
			});
		} else {
			logger.warn(`handlePortChange - Selected Port ${selectedPort} not found!`);
			setVIPFlows(index, []);
			setPortRequestErrors({message: `Port ${selectedPort} not found!`});
		}
		setIsLoadingPortValue(false);
	};
	
	
	const addNewCardRequest = async (slotId) => {
		const url = `${process.env.NEXT_PUBLIC_DNA_HOST || ''}/api/dna/slots/updateSlot`;
		logger.info(`addNewCardRequest - Index: ${index}, slotId: ${slotId}, url: ${url} `);
		if (!slotId) {
			logger.warn(`ServiceModal [addNewCardRequest] - slotId: ${slotId} was not found!`);
			return;
		}
		
		await doAddCardRequest({
			url: url,
			method: 'put',
			body: {
				'id': slotId,
				'projectNumber': 'To be confirmed',
				'defaultApp': 'aperi-app-natfw-1g',
				'pinoutDesign': 'D',
				'serviceType': '',
				'cardStatus': '701',
				'cardType': '101',
				'userId': userName || 'Portal User'
			},
			onSuccess: async (response) => {
				logger.debug(`addNewCardRequest - Response: ${JSON.stringify(response)}`);
				
				if (response.status === '200') {
					const currentSlotName = service.slot;
					logger.info(`addNewCardRequest - Calling handleSlotChange with slotName: ${currentSlotName}`);
					await handleSlotChange(currentSlotName);
					setAddCardRefreshFlag(true);
				}
			},
			onError: (error) => {
				setAddCardRequestErrors(error);
				logger.error(`handlePortChange - doPortDataRequest Error: ${error.message}`);
			}
		});
	};
	
	const extractAndSetCharacteristics = (type, resourceData) => {
		if (!resourceData) return;
		
		const {resourceCharacteristics = [], resourceLookup = [], resourceSpecification = []} = resourceData;
		const mapping = characteristicMapping[type];
		
		for (const [field, {source, property, name, description}] of Object.entries(mapping)) {
			const actualSource = resourceData[source] || [];
			const value = findCharacteristicValue(field, actualSource, property, source === 'resourceLookup', name, description);
			setSelectedItem(field, value, index);
			handleInputChange(field, value, index);
			logger.debug(`ServiceModal [extractAndSetData] - Type: ${type}, Index: ${index}, ${field}: ${value}`);
		}
	};
	
	const extractAndSetData = (type, selectedResource) => {
		if (!selectedResource) {
			logger.warn(`ServiceModal [extractAndSetData] - Type: ${type}, No selected-${type} found!`);
			return;
		}
		
		const {
			resourceCharacteristics = [],
			resourceLookup = [],
			resourceSpecification = []
		} = selectedResource || {};
		
		const setDataUsingMapping = (mapping) => {
			for (const [field, {source, property, name, description}] of Object.entries(mapping)) {
				const actualSource = selectedResource[source] || [];
				const value = findCharacteristicValue(field, actualSource, property, source === 'resourceLookup', name, description);
				setSelectedItem(field, value, index);
				handleInputChange(field, value);
				logger.debug(`ServiceModal [extractAndSetData] - Type: ${type}, Index: ${index}, ${field}: ${value}`);
			}
		};
		
		setDataUsingMapping(characteristicMapping[type]);
	};
	
	return {
		handleChassisChange,
		handleSlotChange,
		handlePortChange,
		addNewCardRequest
	};
};

export default useResourceHandlers;
