import React, {useEffect, useState} from 'react';
import {Badge, Divider, Group, Loader, Mark, Table, Text} from '@mantine/core';
import useOrderStore from '@/store/useOrderStore';
import useFormRequest from '@/hooks/use-form-request';
import Select from '@/components/Forms/Select';
import {determinePath, extractPortIdsAndNames, extractSENSlotIdsAndNames, isModel} from '@/utils/form-utils';
import {classNames, farActions} from '@/utils/common-utils';
import {getLogger} from '@/utils/logger/logger';
import {handOffOptions, PinOutOptions, serviceUseOptions} from '@/utils/lib/select-options';
import BtnFunction from '@/components/Forms/Button';
import DropdownUpdateBtn from '@/components/Forms/DropdownUpdateBtn';

const SENDataSection = ({
							index,
							service,
							userName,
							isLoadingChassis,
							isLoadingFARChassis,
							readonly,
							onAddServiceFn,
							onClose,
							onUpdateServiceFn
						}) => {
	const logger = getLogger('SENDataSection');
	const {
		secondStep,
		setSelectedItem,
		setSourceSlotOptions,
		setFARSlotOptions,
		setSourcePortOptions,
		setFARPortOptions,
		resetSourceChassisRelatedData,
		resetFarChassisRelatedData,
		resetSourceSlotRelatedData,
		resetFarSlotRelatedData,
		resetSourcePortRelatedData,
		resetFarPortRelatedData,
		set
	} = useOrderStore();
	logger.debug(`SENDataSection - Adding Service to the order at index: ${index}, userName: ${userName}, Service : ${JSON.stringify(service)}`);
	
	const [isAddServiceEnabled, setIsAddServiceEnabled] = useState(true);
	const [sourceAddCardRefreshFlag, setSourceAddCardRefreshFlag] = useState(false);
	const [farAddCardRefreshFlag, setFarAddCardRefreshFlag] = useState(false);
	
	const [isLoadingSourceSlots, setIsLoadingSourceSlots] = useState(false);
	const [isLoadingSourceCardValue, setIsLoadingSourceCardValue] = useState(false);
	const [isLoadingSourcePorts, setIsLoadingSourcePorts] = useState(false);
	const [isLoadingSourcePortValue, setIsLoadingSourcePortValue] = useState(false);
	
	const [isLoadingFarSlots, setIsLoadingFarSlots] = useState(false);
	const [isLoadingFarCardValue, setIsLoadingFarCardValue] = useState(false);
	const [isLoadingFarPorts, setIsLoadingFarPorts] = useState(false);
	const [isLoadingFarPortValue, setIsLoadingFarPortValue] = useState(false);
	
	const [sourceChassisError, setSourceChassisError] = useState(null);
	const [farChassisError, setFarChassisError] = useState(null);
	const [sourceSlotError, setSourceSlotError] = useState(null);
	const [farSlotError, setFarSlotError] = useState(null);
	const [sourcePortError, setSourcePortError] = useState(null);
	const [farPortError, setFarPortError] = useState(null);
	const [sourceAddCardError, setSourceAddCardError] = useState(null);
	const [farAddCardError, setFarAddCardError] = useState(null);
	
	const {doRequest: doChassisDataRequest, errors: chassisDataRequestErrors} = useFormRequest();
	const {doRequest: doSlotDataRequest, errors: slotDataRequestErrors} = useFormRequest();
	const {doRequest: doPortDataRequest, errors: portDataRequestErrors} = useFormRequest();
	const {doRequest: doAddCardRequest, errors: addCardRequestErrors} = useFormRequest();
	
	// Example Usage: handleSENInputChange('cardStatus', 'PLANNED', 'source');
	const handleSENInputChange = (field, value, side) => {
		const fieldKey = `${side}${field.charAt(0).toUpperCase()}${field.slice(1)}`;
		logger.info(`handleSENInputChange - Updating ${fieldKey} for ${side}, value: ${value}`);
		
		const descriptionFieldsMap = {
			newCardHandOff: {options: handOffOptions, descriptionField: 'newCardHandOffDescription'},
			newPinOut: {options: PinOutOptions, descriptionField: 'newPinOutDescription'},
			newHandOff: {options: handOffOptions, descriptionField: 'newHandOffDescription'},
			newServiceUse: {options: serviceUseOptions, descriptionField: 'newServiceUseDescription'}
		};
		
		const fieldMeta = descriptionFieldsMap[field];
		logger.info(`handleSENInputChange - fieldMeta ${fieldMeta} `);
		let updatedDescription = null;
		
		if (fieldMeta) {
			const matchedOption = fieldMeta.options.find((opt) => opt.value === value);
			updatedDescription = matchedOption ? matchedOption.description : null;
			logger.info(`handleSENInputChange - Updating description for ${fieldMeta.descriptionField} to: ${updatedDescription}`);
		}
		
		set((state) => {
			const updatedServices = state.secondStep.services.map((service, i) => {
				if (i === index) {
					const updatedService = {...service, [fieldKey]: value};
					if (fieldMeta && updatedDescription !== null) {
						const descriptionKey = `${side}${fieldMeta.descriptionField}`;
						updatedService[descriptionKey] = updatedDescription;
					}
					return updatedService;
				}
				return service;
			});
			
			return {
				secondStep: {
					...state.secondStep,
					services: updatedServices
				}
			};
		});
	};
	
	useEffect(() => {
		if (service) {
			logger.debug(`SENDataSection [useEffect] - Loaded Service: ${JSON.stringify(service)} at index: ${index}`);
			checkAddServiceButtonState();
		}
	}, [service, service.sourceChassis, service.farChassis]);
	
	useEffect(() => {
		if (sourceAddCardRefreshFlag) {
			setSourceAddCardRefreshFlag(false);
		}
	}, [sourceAddCardRefreshFlag]);
	
	useEffect(() => {
		if (farAddCardRefreshFlag) {
			setFarAddCardRefreshFlag(false);
		}
	}, [farAddCardRefreshFlag]);
	
	const checkAddServiceButtonState = () => {
		if (service.sourceCard !== 'Empty Slot') {
			if (service.sourceChassis && service.sourceSlot && service.sourcePortId
				// && service.farChassis && service.farSlot && service.farPort
			) {
				setIsAddServiceEnabled(true);
			} else {
				setIsAddServiceEnabled(false);
			}
		} else {
			setIsAddServiceEnabled(false);
		}
	};
	
	const extractAndSetSENData = (type, selectedResource, side, index) => {
		logger.info(`extractAndSetSENData - Index: ${index}, Type: ${type},
						Side: ${side}, selectedResource: ${JSON.stringify(selectedResource)} `);
		
		if (!selectedResource) {
			logger.warn(`extractAndSetSENData - No selected resource of type ${type} found on ${side} side!`);
			return;
		}
		
		// Mapping of resource properties to Zustand state property suffixes
		const characteristicMapping = {
			slot: {
				card: 'Card',
				cardProjectNumber: 'CardProjectNumber',
				administrativeState: 'AdministrativeState',
				operationalState: 'OperationalState',
				usageState: 'UsageState',
				resourceStatus: 'ResourceStatus',
				slotNo: 'SlotNo'
			},
			port: {
				port: 'Port',
				portId: 'PortId',
				portStatus: 'PortStatus',
				portStatusDescription: 'PortStatusDescription',
				engineeringName: 'EngineeringName',
				friendlyName: 'FriendlyName',
				portNo: 'PortNo',
				portProjectNumber: 'PortProjectNumber'
			}
		};
		
		const mapping = characteristicMapping[type];
		if (!mapping) {
			logger.error(`extractAndSetSENData - No mapping found for type: ${type} on ${side} side!`);
			return;
		}
		
		// Helper function to find values in `selectedResource`
		const findCharacteristicValue = (name, source) => {
			const characteristic = source.find((item) => item.name === name);
			return characteristic ? characteristic.value : undefined;
		};
		
		// Extract and assign data to Zustand state
		set((state) => {
			const updatedServices = state.secondStep.services.map((service, i) => {
				if (i === index) {
					const updatedService = {...service};
					
					for (const [resourceProp, zustandPropSuffix] of Object.entries(mapping)) {
						let extractedValue;
						
						if (resourceProp === 'card') {
							extractedValue = selectedResource.resourceSpecification.find(
								(spec) => spec.name === 'resourceCardTypeSpecification')?.model;
						} else if (resourceProp === 'cardProjectNumber') {
							extractedValue = findCharacteristicValue('projectNumber', selectedResource.resourceCharacteristics);
						} else if (resourceProp === 'slotNo') {
							extractedValue = findCharacteristicValue('slotNo', selectedResource.resourceCharacteristics);
						} else {
							// Extract values directly from `selectedResource` for other fields
							extractedValue = selectedResource[resourceProp];
						}
						
						const zustandKey = `${side}${zustandPropSuffix}`;
						updatedService[zustandKey] = extractedValue || 'N/A';
						logger.info(`extractAndSetSENData - Extracted ${resourceProp}: ${extractedValue}, Assigned to ${zustandKey}`);
					}
					
					return updatedService;
				}
				return service;
			});
			
			return {
				secondStep: {
					...state.secondStep,
					services: updatedServices
				}
			};
		});
	};
	
	const handleSENChassisChange = async (selectedChassis, side) => {
		logger.info(`handleSENChassisChange - Side: ${side}, Selected Chassis: ${selectedChassis}`);
		
		const chassisKey = `${side}Chassis`;
		const pathKey = `${side}Path`;
		const path = determinePath(selectedChassis);
		
		if (side === 'source') {
			resetSourceChassisRelatedData(index);
			setIsLoadingSourceSlots(true);
			setSourceChassisError(null);
		} else {
			resetFarChassisRelatedData(index);
			setIsLoadingFarSlots(true);
			setFarChassisError(null);
		}
		
		setSelectedItem(chassisKey, selectedChassis, index);
		setSelectedItem(pathKey, path, index);
		
		const chassisOptions = side === 'source' ? secondStep.chassisOptions : secondStep.farChassisOptions;
		const selectedChassisInfo = chassisOptions.find(
			(chassisItem) => chassisItem.publicIdentifier === selectedChassis || chassisItem.name === selectedChassis
		);
		
		let sourceSlotOptions = [];
		let farSlotOptions = [];
		const noSlotsMessage = [`No Slots available on ${side === 'source' ? 'Source' : 'Far'} Device`];
		
		if (selectedChassisInfo) {
			const chassisId = selectedChassisInfo.id;
			const url = `${process.env.NEXT_PUBLIC_DNA_HOST}/api/dna/chassis/getChassisId?id=${chassisId}`;
			
			try {
				await doChassisDataRequest({
					url,
					method: 'get',
					onSuccess: async (chassisResponse) => {
						const slotData = await extractSENSlotIdsAndNames(chassisResponse[0]);
						
						if (side === 'source') {
							sourceSlotOptions = slotData.map(({id, name, slotName}) => ({
								id,
								name,
								slotName
							}));
							setSourceSlotOptions(index, sourceSlotOptions.length > 0 ? sourceSlotOptions : noSlotsMessage);
						} else {
							farSlotOptions = slotData.map(({id, name, slotName}) => ({
								id,
								name,
								slotName
							}));
							setFARSlotOptions(index, farSlotOptions.length > 0 ? farSlotOptions : noSlotsMessage);
						}
					}
				});
			} catch (error) {
				logger.error(`handleSENChassisChange - Error fetching chassis data for ${side}: ${error.message}`);
				side === 'source' ? setSourceSlotOptions(index, noSlotsMessage) : setFARSlotOptions(index, noSlotsMessage);
				side === 'source' ? setSourceChassisError(error.message) : setFarChassisError(error.message);
			}
			
		} else {
			logger.warn(`handleSENChassisChange - ${side} Chassis ${selectedChassis} not found!`);
			side === 'source' ? setSourceSlotOptions(index, noSlotsMessage) : setFARSlotOptions(index, noSlotsMessage);
		}
		
		if (side === 'source') {
			setIsLoadingSourceSlots(false);
			setSourceChassisError(null);
		} else {
			setIsLoadingFarSlots(false);
			setFarChassisError(null);
		}
	};
	
	const handleSENSlotChange = async (selectedSlot, side) => {
		logger.info(`handleSENSlotChange - Side: ${side}, Selected Slot: ${selectedSlot}`);
		
		const slotKey = `${side}Slot`;
		const slotIdKey = `${side}SlotId`;
		const slotNameKey = `${side}SlotName`;
		const portOptionsKey = `${side}PortOptions`;
		
		if (side === 'source') {
			resetSourceSlotRelatedData(index);
			setIsLoadingSourcePorts(true);
			setIsLoadingSourceCardValue(true);
			setSourceSlotError(null);
		} else {
			resetFarSlotRelatedData(index);
			setIsLoadingFarPorts(true);
			setIsLoadingFarCardValue(true);
			setFarSlotError(null);
		}
		
		setSelectedItem(slotKey, selectedSlot, index);
		
		const slotOptions = side === 'source' ? service.sourceSlotOptions : service.farSlotOptions;
		const selectedSlotInfo = slotOptions.find(
			(slotItem) => slotItem.name === selectedSlot || slotItem.publicIdentifier === selectedSlot);
		const noPortOptions = [`No Ports available on the selected ${side === 'source' ? 'Source' : 'Far'} Slot`];
		
		if (selectedSlotInfo) {
			setSelectedItem(slotIdKey, selectedSlotInfo.id, index);
			setSelectedItem(slotNameKey, selectedSlotInfo.slotName, index);
			const url = `${process.env.NEXT_PUBLIC_DNA_HOST}/api/dna/slots/getSlot?id=${selectedSlotInfo.id}`;
			
			try {
				await doSlotDataRequest({
					url,
					method: 'get',
					onSuccess: async (slotResponse) => {
						const portData = await extractPortIdsAndNames(slotResponse[0]);
						logger.info(`handleSENSlotChange - portData: ${JSON.stringify(portData)}`);
						const portOptions = portData.map(({id, name}) => ({id, name}));
						
						// Extract the model from `resourceSlotNameSpecification`
						const selectedSlotDesc = slotResponse[0]?.resourceSpecification.find(
							(spec) => spec.name === 'resourceSlotNameSpecification'
						)?.description || 'Unknown';
						logger.info(`handleSENSlotChange - side: ${side}, slotKey: ${slotKey}, selectedSlotDesc: ${selectedSlotDesc}`);
						
						await extractAndSetSENData('slot', slotResponse[0], side, index);
						
						set((state) => {
							const updatedServices = [...state.secondStep.services];
							updatedServices[index][portOptionsKey] = portOptions;
							updatedServices[index][`${side}SlotDesc`] = selectedSlotDesc;
							
							return {
								secondStep: {
									...state.secondStep,
									services: updatedServices
								}
							};
						});
					}
				});
			} catch (error) {
				logger.error(`addNewSENCardRequest - Add Card API Error for ${side}: ${error.message}`);
				side === 'source' ? setSourceSlotError(error.message) : setFarSlotError(error.message);
			}
		} else {
			logger.warn(`handleSENSlotChange - Selected ${side} side Slot ${slotNameKey} is not available!`);
			side === 'source' ? setSourcePortOptions(index, noPortOptions) : setFARPortOptions(index, noPortOptions);
		}
		
		if (side === 'source') {
			setIsLoadingSourcePorts(false);
			setIsLoadingSourceCardValue(false);
			setSourceSlotError(null);
		} else {
			setIsLoadingFarPorts(false);
			setIsLoadingFarCardValue(false);
			setFarSlotError(null);
		}
	};
	
	const addNewSENCardRequest = async (slotId, side) => {
		const url = `${process.env.NEXT_PUBLIC_DNA_HOST || ''}/api/dna/slots/updateSlot`;
		
		if (!slotId) {
			logger.warn(`addNewSENCardRequest - ${side}Slot with id: ${slotId} is not found!`);
			return;
		}
		side === 'source' ? setSourceAddCardError(null) : setFarAddCardError(null);
		
		const slotDesc = service[`${side}SlotDesc`] || ''; // Retrieve slot model from Zustand state
		const isAperi = isModel(slotDesc, 'A1105');
		const isArista = isModel(slotDesc, '7020');
		const isCisco = isModel(slotDesc, '9300');
		
		let cardType;
		if (isAperi || isArista) {
			cardType = '582';
		} else if (isCisco) {
			cardType = '782';
		}
		logger.info(`addNewSENCardRequest - Side: ${side}, slotId: ${slotId}, url: ${url}, cardType: ${cardType}`);
		
		try {
			await doAddCardRequest({
				url: url,
				method: 'put',
				body: {
					'id': slotId,
					'projectNumber': 'To be confirmed',
					'defaultApp': '',
					'pinoutDesign': '',
					'serviceType': '',
					'cardStatus': '701',
					cardType: cardType,
					'userId': userName || 'Portal User'
				},
				onSuccess: async (response) => {
					logger.debug(`addNewSENCardRequest - Response: ${JSON.stringify(response)}`);
					
					if (response.status === '200') {
						const currentSlotName = service[`${side}Slot`];
						logger.info(`addNewSENCardRequest - Calling handleSENSlotChange on ${side} slotName: ${currentSlotName}`);
						
						await handleSENSlotChange(currentSlotName, side);
						side === 'source' ? setSourceAddCardRefreshFlag(true) : setFarAddCardRefreshFlag(true);
						side === 'source' ? setSourceAddCardError(null) : setFarAddCardError(null);
					}
				}
			});
		} catch (error) {
			logger.error(`addNewSENCardRequest - Add Card API Error for ${side}: ${error.message}`);
			side === 'source' ? setSourceAddCardError(error.message) : setFarAddCardError(error.message);
		}
		
	};
	
	const handleSENPortChange = async (selectedPort, side) => {
		const portKey = `${side}Port`;
		const portIdKey = `${side}PortId`;
		const portNameKey = `${side}PortName`;
		logger.info(`handleSENPortChange - portKey: ${portKey}, Selected Slot: ${JSON.stringify(selectedPort)}`);
		
		if (side === 'source') {
			resetSourcePortRelatedData(index);
			setIsLoadingSourcePortValue(true);
			setSourcePortError(null);
		} else {
			resetFarPortRelatedData(index);
			setIsLoadingFarPortValue(true);
			setFarPortError(null);
		}
		
		setSelectedItem(portKey, selectedPort, index);
		setSelectedItem(portNameKey, selectedPort, index);
		
		const portOptions = side === 'source' ? service.sourcePortOptions : service.farPortOptions;
		const selectedPortInfo = portOptions.find(
			(portItem) => portItem.name === selectedPort || portItem.publicIdentifier === selectedPort
		);
		
		logger.info(`handleSENPortChange - index ${index}, selectedPort ${selectedPort},
                   selectedPortInfo: ${JSON.stringify(selectedPortInfo)} `);
		
		if (selectedPortInfo) {
			setSelectedItem(portIdKey, selectedPortInfo.id, index);
			const url = `${process.env.NEXT_PUBLIC_DNA_HOST || ''}/api/dna/ports/getPort?id=${selectedPortInfo.id}`;
			
			try {
				await doPortDataRequest({
					url,
					method: 'get',
					onSuccess: async (portResponse) => {
						logger.info(`handleSENPortChange - selectedPortData: ${JSON.stringify(portResponse[0])}`);
						side === 'source' ? setSourcePortError(null) : setFarPortError(null);
					}
				});
			} catch (error) {
				logger.error(`handleSENPortChange - Port API Error for ${side}: ${error.message}`);
				side === 'source' ? setSourcePortError(error.message) : setFarPortError(error.message);
			}
		}
		
		if (side === 'source') {
			setIsLoadingSourcePortValue(false);
		} else {
			setIsLoadingFarPortValue(false);
		}
	};
	
	const renderCardTable = (side, service, isLoadingCardValue) => (
		<Table
			striped
			highlightOnHover
			withBorder
			withColumnBorders
			className="mt-4 mb-4 w-2/3"
		>
			<thead>
			<tr>
				<th style={{backgroundColor: '#ADD8E6'}}>Attribute</th>
				<th style={{backgroundColor: '#ADD8E6'}}>Current State</th>
				<th style={{backgroundColor: '#ADD8E6'}}>Update</th>
			</tr>
			</thead>
			<tbody>
			
			{/* Slot Number Row */}
			<tr>
				<td>
					<Text size="sm" fw={500} variant="gradient" gradient={{from: 'black', to: 'gray', deg: 80}}>
						Slot Number
					</Text>
				</td>
				<td>
					{isLoadingCardValue ? (
						<Loader color="blue" size="sm"/>
					) : (
						<Text size="sm" fw={400} variant="gradient" gradient={{from: 'indigo', to: 'indigo', deg: 90}}>
							{service[`${side}SlotNo`]}
						</Text>
					)}
				</td>
				<td>
					{/* No updates for slotNo */}
					<Text size="sm" fw={400} color="gray">Read-Only</Text>
				</td>
			</tr>
			<tr>
				<td>
					<Text size="sm" fw={500} variant="gradient" gradient={{from: 'black', to: 'gray', deg: 80}}>
						Slot Description
					</Text>
				</td>
				<td>
					{isLoadingCardValue ? (
						<Loader color="blue" size="sm"/>
					) : (
						<Text size="sm" fw={400} variant="gradient" gradient={{from: 'indigo', to: 'indigo', deg: 90}}>
							{service[`${side}SlotDesc`]}
						</Text>
					)}
				</td>
				<td>
					{/* No updates for slotNo */}
					<Text size="sm" fw={400} color="gray">Read-Only</Text>
				</td>
			</tr>
			<tr>
				<td>
					<Text size="sm" fw={500} variant="gradient" gradient={{from: 'black', to: 'gray', deg: 80}}>
						Card Type
					</Text>
				</td>
				<td>
					{isLoadingCardValue ? (
						<Loader color="blue" size="sm"/>
					) : (
						<Text size="sm" fw={400} variant="gradient" gradient={{from: 'indigo', to: 'indigo', deg: 90}}>
							{service[`${side}Card`]}
						</Text>
					)}
				</td>
				<td>
					{/* No updates for slotNo */}
					<Text size="sm" fw={400} color="gray">Read-Only</Text>
				</td>
			</tr>
			{/* Project Number Row */}
			<tr>
				<td>
					<Text size="sm" fw={500} variant="gradient" gradient={{from: 'black', to: 'gray', deg: 80}}>
						Project Number
					</Text>
				</td>
				<td>
					{isLoadingCardValue ? (
						<Loader color="blue" size="sm"/>
					) : (
						<Text size="sm" fw={400} variant="gradient" gradient={{from: 'indigo', to: 'indigo', deg: 90}}>
							{service[`${side}CardProjectNumber`]}
						</Text>
					)}
				</td>
				<td>
					<DropdownUpdateBtn
						label={`${side}Card Project Number`}
						placeholder="Select"
						index={index}
						disabled={true}
						options={[{
							value: service[`${side}CardProjectNumber`],
							description: service[`${side}CardProjectNumber`]
						}]}
						currentValue={service[`${side}CardProjectNumber`]}
					/>
				</td>
			</tr>
			
			{/* Administrative State Row */}
			<tr>
				<td>
					<Text size="sm" fw={500} variant="gradient" gradient={{from: 'black', to: 'gray', deg: 80}}>
						Administrative State
					</Text>
				</td>
				<td>
					{isLoadingCardValue ? (
						<Loader color="blue" size="sm"/>
					) : (
						<Text size="sm" fw={400} variant="gradient" gradient={{from: 'indigo', to: 'indigo', deg: 90}}>
							{service[`${side}AdministrativeState`]}
						</Text>
					)}
				</td>
				<td>
					{/* No updates for administrativeState */}
					<Text size="sm" fw={400} color="gray">Read-Only</Text>
				</td>
			</tr>
			
			{/* Operational State Row */}
			<tr>
				<td>
					<Text size="sm" fw={500} variant="gradient" gradient={{from: 'black', to: 'gray', deg: 80}}>
						Operational State
					</Text>
				</td>
				<td>
					{isLoadingCardValue ? (
						<Loader color="blue" size="sm"/>
					) : (
						<Text size="sm" fw={400} variant="gradient" gradient={{from: 'indigo', to: 'indigo', deg: 90}}>
							{service[`${side}OperationalState`]}
						</Text>
					)}
				</td>
				<td>
					{/* No updates for operationalState */}
					<Text size="sm" fw={400} color="gray">Read-Only</Text>
				</td>
			</tr>
			
			{/* Usage State Row */}
			<tr>
				<td>
					<Text size="sm" fw={500} variant="gradient" gradient={{from: 'black', to: 'gray', deg: 80}}>
						Usage State
					</Text>
				</td>
				<td>
					{isLoadingCardValue ? (
						<Loader color="blue" size="sm"/>
					) : (
						<Text size="sm" fw={400} variant="gradient" gradient={{from: 'indigo', to: 'indigo', deg: 90}}>
							{service[`${side}UsageState`]}
						</Text>
					)}
				</td>
				<td>
					{/* No updates for usageState */}
					<Text size="sm" fw={400} color="gray">Read-Only</Text>
				</td>
			</tr>
			
			{/* Resource Status Row */}
			<tr>
				<td>
					<Text size="sm" fw={500} variant="gradient" gradient={{from: 'black', to: 'gray', deg: 80}}>
						Resource Status
					</Text>
				</td>
				<td>
					{isLoadingCardValue ? (
						<Loader color="blue" size="sm"/>
					) : (
						<Text size="sm" fw={400} variant="gradient" gradient={{from: 'indigo', to: 'indigo', deg: 90}}>
							{service[`${side}ResourceStatus`]}
						</Text>
					)}
				</td>
				<td>
					{/* No updates for resourceStatus */}
					<Text size="sm" fw={400} color="gray">Read-Only</Text>
				</td>
			</tr>
			</tbody>
		</Table>
	);
	
	const renderPortTable = (side, service, isLoadingPortValue) => (
		<Table
			striped
			highlightOnHover
			withBorder
			withColumnBorders
			className="mt-4 mb-4 w-2/3"
		>
			<thead>
			<tr>
				<th style={{backgroundColor: '#ADD8E6'}}>Attribute</th>
				<th style={{backgroundColor: '#ADD8E6'}}>Current State</th>
				<th style={{backgroundColor: '#ADD8E6'}}>Update</th>
			</tr>
			</thead>
			<tbody>
			{/* Public Identifier Row */}
			<tr>
				<td>
					<Text size="sm" fw={500} variant="gradient" gradient={{from: 'black', to: 'gray', deg: 80}}>
						Public Identifier
					</Text>
				</td>
				<td>
					{isLoadingPortValue ? (
						<Loader color="blue" size="sm"/>
					) : (
						<Text size="sm" fw={400} variant="gradient" gradient={{from: 'indigo', to: 'indigo', deg: 90}}>
							{service[`${side}PublicIdentifier`]}
						</Text>
					)}
				</td>
				<td>
					<Text size="sm" fw={400} color="gray">Read-Only</Text>
				</td>
			</tr>
			
			{/* Administrative State Row */}
			<tr>
				<td>
					<Text size="sm" fw={500} variant="gradient" gradient={{from: 'black', to: 'gray', deg: 80}}>
						Administrative State
					</Text>
				</td>
				<td>
					{isLoadingPortValue ? (
						<Loader color="blue" size="sm"/>
					) : (
						<Text size="sm" fw={400} variant="gradient" gradient={{from: 'indigo', to: 'indigo', deg: 90}}>
							{service[`${side}AdministrativeState`]}
						</Text>
					)}
				</td>
				<td>
					<Text size="sm" fw={400} color="gray">Read-Only</Text>
				</td>
			</tr>
			
			{/* Operational State Row */}
			<tr>
				<td>
					<Text size="sm" fw={500} variant="gradient" gradient={{from: 'black', to: 'gray', deg: 80}}>
						Operational State
					</Text>
				</td>
				<td>
					{isLoadingPortValue ? (
						<Loader color="blue" size="sm"/>
					) : (
						<Text size="sm" fw={400} variant="gradient" gradient={{from: 'indigo', to: 'indigo', deg: 90}}>
							{service[`${side}OperationalState`]}
						</Text>
					)}
				</td>
				<td>
					<Text size="sm" fw={400} color="gray">Read-Only</Text>
				</td>
			</tr>
			
			{/* Usage State Row */}
			<tr>
				<td>
					<Text size="sm" fw={500} variant="gradient" gradient={{from: 'black', to: 'gray', deg: 80}}>
						Usage State
					</Text>
				</td>
				<td>
					{isLoadingPortValue ? (
						<Loader color="blue" size="sm"/>
					) : (
						<Text size="sm" fw={400} variant="gradient" gradient={{from: 'indigo', to: 'indigo', deg: 90}}>
							{service[`${side}UsageState`]}
						</Text>
					)}
				</td>
				<td>
					<Text size="sm" fw={400} color="gray">Read-Only</Text>
				</td>
			</tr>
			
			{/* Resource Status Row */}
			<tr>
				<td>
					<Text size="sm" fw={500} variant="gradient" gradient={{from: 'black', to: 'gray', deg: 80}}>
						Resource Status
					</Text>
				</td>
				<td>
					{isLoadingPortValue ? (
						<Loader color="blue" size="sm"/>
					) : (
						<Text size="sm" fw={400} variant="gradient" gradient={{from: 'indigo', to: 'indigo', deg: 90}}>
							{service[`${side}ResourceStatus`]}
						</Text>
					)}
				</td>
				<td>
					<Text size="sm" fw={400} color="gray">Read-Only</Text>
				</td>
			</tr>
			
			{/* Default App Row */}
			<tr>
				<td>
					<Text size="sm" fw={500} variant="gradient" gradient={{from: 'black', to: 'gray', deg: 80}}>
						Default App
					</Text>
				</td>
				<td>
					{isLoadingPortValue ? (
						<Loader color="blue" size="sm"/>
					) : (
						<Text size="sm" fw={400} variant="gradient" gradient={{from: 'indigo', to: 'indigo', deg: 90}}>
							{service[`${side}DefaultApp`]}
						</Text>
					)}
				</td>
				<td>
					<DropdownUpdateBtn
						label={`${side} Default App`}
						placeholder={`Select ${side} Default App`}
						options={[
							{value: 'Unassigned', description: 'Choose an option'},
							{value: 'Media Data', description: 'Media Data'},
							{value: 'SEN Data', description: 'SEN Data'}
						]}
						currentValue={service[`${side}DefaultApp`]}
						newValue={service[`${side}NewDefaultApp`]}
						onChange={(newValue) => handleSENInputChange(`NewDefaultApp`, newValue, side)}
						onUpdate={() => {
							// Handle the onUpdate logic if needed
						}}
						index={index}
					/>
				</td>
			</tr>
			
			{/* Interface Type Row */}
			<tr>
				<td>
					<Text size="sm" fw={500} variant="gradient" gradient={{from: 'black', to: 'gray', deg: 80}}>
						Interface Type
					</Text>
				</td>
				<td>
					{isLoadingPortValue ? (
						<Loader color="blue" size="sm"/>
					) : (
						<Text size="sm" fw={400} variant="gradient" gradient={{from: 'indigo', to: 'indigo', deg: 90}}>
							{service[`${side}InterfaceType`]}
						</Text>
					)}
				</td>
				<td>
					<DropdownUpdateBtn
						label={`${side} Interface Type`}
						placeholder={`Select ${side} Interface Type`}
						options={[
							{value: 'Unassigned', description: 'Choose an option'},
							{value: 'MIP', description: 'MIP'},
							{value: 'SEN', description: 'SEN'}
						]}
						currentValue={service[`${side}GMNInterfaceType`]}
						newValue={service[`${side}NewGMNInterfaceType`]}
						onChange={(newValue) => handleSENInputChange(`NewGMNInterfaceType`, newValue, side)}
						onUpdate={() => {
							// Handle the onUpdate logic if needed
						}}
						index={index}
					/>
				</td>
			</tr>
			
			<tr>
				<td>
					<Text size="sm" fw={500} variant="gradient" gradient={{from: 'black', to: 'gray', deg: 80}}>
						Service Use
					</Text>
				</td>
				<td>
					{isLoadingPortValue ? (
						<Loader color="blue" size="sm"/>
					) : (
						<Text size="sm" fw={400} variant="gradient" gradient={{from: 'indigo', to: 'indigo', deg: 90}}>
							{service[`${side}ServiceUse`]}
						</Text>
					)}
				</td>
				<td>
					<DropdownUpdateBtn
						label={`${side} Service Use`}
						placeholder={`Select ${side} Service Use`}
						options={[
							{value: 'Unassigned', description: 'Choose an option'},
							{value: 'P', description: 'Permanent'},
							{value: 'I', description: 'Itinerant'}
						]}
						currentValue={service[`${side}ServiceUse`]}
						newValue={service[`${side}NewServiceUse`]}
						onChange={(newValue) => handleSENInputChange(`NewServiceUse`, newValue, side)}
						onUpdate={() => {
							// Handle the onUpdate logic if needed
						}}
						index={index}
					/>
				</td>
			</tr>
			</tbody>
		</Table>
	);
	
	const renderSENDataSection = (service) => (
		<div
			className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-gray-300 shadow sm:grid sm:grid-cols-2 sm:gap-px sm:divide-y-0">
			{farActions.map((action, actionIdx) => {
				const dynamicProps =
					{
						chassisOptions: action.side === 'source' ? secondStep.chassisOptions : secondStep.farChassisOptions,
						slotOptions: action.side === 'source' ? service.sourceSlotOptions : service.farSlotOptions,
						portOptions: action.side === 'source' ? service.sourcePortOptions : service.farPortOptions,
						chassis: service[`${action.side}Chassis`],
						slot: service[`${action.side}Slot`],
						slotName: service[`${action.side}SlotName`],
						port: service[`${action.side}Port`],
						portName: service[`${action.side}PortName`],
						path: service[`${action.side}Path`],
						isLoadingCardValue: action.side === 'source' ? isLoadingSourceCardValue : isLoadingFarCardValue,
						isLoadingPorts: action.side === 'source' ? isLoadingSourcePorts : isLoadingFarPorts,
						isLoadingPortVale: action.side === 'source' ? isLoadingSourcePortValue : isLoadingFarPortValue
					};
				
				return (
					<div
						key={action.title}
						className={classNames(
							actionIdx === 0 ? 'rounded-tl-lg rounded-tr-lg sm:rounded-tr-none' : '',
							actionIdx === 1 ? 'sm:rounded-tr-lg' : '',
							'group relative bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500'
						)}
					>
						<h6 className="text-base font-semibold leading-4 text-gray-700 pb-2">{action.title}</h6>
						<Divider my="xs" size="xl" labelPosition="center"/>
						
						<div className="mt-4">
							<div className="grid grid-cols-2">
								<div className="col-span-1">
									<Select
										id={`${action.side}Chassis_${index}`}
										value={dynamicProps.chassis}
										label={`${action.side} Chassis`}
										onChange={(e) => handleSENChassisChange(e.target.value, action.side)}
										disabled={readonly}
										placeholder={`Select ${action.side} Chassis`}
									>
										<option value="" disabled>
											Select
										</option>
										{(isLoadingChassis || isLoadingFARChassis) ? (
											<option value="Loading" disabled>
												Loading...
											</option>
										) : (
											dynamicProps.chassisOptions.map((option, index) => (
												<option key={index} value={option.name}>
													{option.name}
												</option>
											))
										)}
									</Select>
								</div>
								<div className="mt-10 ml-6 flex items-center">
									<label htmlFor={`${action.side}Path_${index}`}
										   className="block text-sm text-gray-600 mr-4 w-48">
										{`belongs to path`}
									</label>
									<input
										type="text"
										id={`${action.side}Path_${index}`}
										placeholder={`Path for the selected Chassis on ${action.side} side`}
										value={dynamicProps.path}
										readOnly
										className="mt-1 block w-full py-2 px-4 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
									/>
								</div>
								<div className="col-span-1">
									{action.side === 'source' && sourceChassisError && (
										<div className="mt-4 text-red-500">
											Error with Source Chassis API: {sourceChassisError}
										</div>
									)}
									{action.side === 'far' && farChassisError && (
										<div className="mt-4 text-red-500">
											Error with Far Chassis API: {farChassisError}
										</div>
									)}
								</div>
							</div>
							
							<div className="grid grid-cols-2">
								<div className="col-span-1">
									<Select
										id={`${action.side}Slot_${index}`}
										value={dynamicProps.slot || ''}
										onChange={(e) => handleSENSlotChange(e.target.value, action.side)}
										placeholder={`Select ${action.side} Slot`}
										label={`${action.side} Slot`}
										disabled={readonly}
									>
										<option value="" disabled>
											Select
										</option>
										{(isLoadingSourceSlots || isLoadingFarSlots) ? (
											<option value="Loading" disabled>
												Loading...
											</option>
										) : (
											dynamicProps.slotOptions?.map((slot) => (
												<option key={slot.id} value={slot.name}>
													{slot.name}
												</option>
											))
										)}
									</Select>
								</div>
								<div className="mt-10 ml-6 flex items-center">
									<label htmlFor={`${action.side}SlotName_${index}`}
										   className="block text-sm text-gray-600 w-52">
										Public Identifier
									</label>
									<input
										id={`${action.side}SlotName_${index}`}
										type="text"
										label={`${action.side} Slot Name`}
										placeholder={`Public Identifier for selected Slot on ${action.side}`}
										value={dynamicProps.slotName}
										readOnly
										className="mt-2 block w-full py-2 px-4 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
									/>
								</div>
								<div className="col-span-1">
									{action.side === 'source' && sourceSlotError && (
										<div className="mt-4 text-red-500">
											Error with Source Slot API: {sourceSlotError}
										</div>
									)}
									{action.side === 'far' && farSlotError && (
										<div className="mt-4 text-red-500">
											Error with Far Slot API: {farSlotError}
										</div>
									)}
								</div>
							</div>
							
							<div className="grid grid-cols-3 gap-x-6">
								<div className="mt-6 col-span-1">
									<label
										htmlFor={`${action.side}Card_${index}`}
										className="block -mr-36 text-sm text-gray-600 w-full"
									>
										Card installed on this Slot
									</label>
									<input
										id={`${action.side}Card_${index}`}
										type="text"
										label={`${action.side} Card type`}
										placeholder={`Card type for selected Slot on ${action.side}`}
										value={service[`${action.side}Card`]}
										readOnly
										className="mt-4 mr-4 block w-full py-1 px-2 border border-gray-300 bg-white rounded-md
                       							   shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500
                       							   sm:text-sm"/>
								</div>
								
								<div className="mt-10 flex items-center">
									<BtnFunction
										type="button"
										className="mt-5"
										onClick={() => addNewSENCardRequest(service[`${action.side}SlotId`], action.side)}
										disabled={service[`${action.side}Card`] !== 'Empty Slot'}
									>
										Add Card
									</BtnFunction>
								</div>
								<div className="col-span-1">
									{action.side === 'source' && sourceAddCardError && (
										<div className="mt-4 text-red-500">
											Error with Source Add Card API: {sourceAddCardError}
										</div>
									)}
									{action.side === 'far' && farAddCardError && (
										<div className="mt-4 text-red-500">
											Error with Far Add Card API: {farAddCardError}
										</div>
									)}
								</div>
							</div>
							
							<div className="mt-8">
								<Badge size="lg" variant="light" radius="sm" color="blue">Current state of the selected
									Slot</Badge>
							</div>
							<div className="col-span-1">
								{renderCardTable(action.side, service, dynamicProps.isLoadingCardValue)}
							</div>
							<div className="grid grid-cols-3 gap-y-2">
								<div className="col-span-1">
									<Select
										id={`${action.side}Port_${index}`}
										value={dynamicProps.port || ''}
										onChange={(e) => handleSENPortChange(e.target.value, action.side)}
										placeholder={`Select ${action.side} Port`}
										label={`${action.side} Port`}
										disabled={readonly}
									>
										<option value="" disabled>
											Select
										</option>
										{dynamicProps.isLoadingPorts ? (
											<option value="Loading" disabled>
												Loading.....
											</option>
										) : (
											dynamicProps.portOptions?.map((port) => (
												<option key={port.id} value={port.name}>
													{port.name}
												</option>
											))
										)}
									</Select>
								</div>
								<div className="col-span-1">
									{action.side === 'source' && sourcePortError && (
										<div className="mt-4 text-red-500">
											Error with Source Port API: {sourcePortError}
										</div>
									)}
									{action.side === 'far' && farPortError && (
										<div className="mt-4 text-red-500">
											Error with Far Port API: {farPortError}
										</div>
									)}
								</div>
							</div>
							<div className="mt-8 pb-2">
								<Badge size="lg" variant="light" radius="sm" color="blue">
									Current state of the selected Port
								</Badge>
							</div>
							<div className="col-span-1">
								{renderPortTable(action.side, service, dynamicProps.isLoadingPortVale)}
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
	
	return (
		<div className="grid grid-cols-1 gap-x-2 gap-y-4 md:grid-cols-1">
			<div>
				<h4 className="text-sm font-semibold leading-7 text-indigo-900">
					{index + 1} - {service.workRequired}
				</h4>
				<p className="text-sm text-gray-600">
					Select the resources for your <Mark color="cyan">{service.workRequired}</Mark> service
				</p>
			</div>
			
			{renderSENDataSection(service)}
			
			<div className="flex justify-center pb-2">
				<Group position="right" mt="md">
					{!readonly && (
						<div className="mt-2 col-span-1">
							{onAddServiceFn && (
								<BtnFunction
									type="button"
									onClick={() => {
										logger.info(`SENDataSection [onAddServiceFn]: Index ${index} `);
										onAddServiceFn(service, index);
									}}
									disabled={!isAddServiceEnabled}
								>
									Add to Cart
								</BtnFunction>
							)}
							{onUpdateServiceFn && (
								<BtnFunction type="button"
											 onClick={() => {
												 logger.debug(`SENDataSection [onUpdateServiceFn]: Index ${index} `);
												 onUpdateServiceFn(index);
											 }}
											 disabled={!isAddServiceEnabled}
								>
									Update Service
								</BtnFunction>
							)}
						</div>
					)}
					<div className="mt-2 col-span-1">
						<BtnFunction type="button" onClick={onClose}>
							Close
						</BtnFunction>
					</div>
				</Group>
			</div>
		</div>
	);
};

export default SENDataSection;
