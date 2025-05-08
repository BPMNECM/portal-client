import dynamic from 'next/dynamic';
import React, {useEffect, useState} from 'react';
import {Accordion, Badge, Button, Divider, Group, Loader, Mark, Stack, Table, Text} from '@mantine/core';
import useOrderStore from '@/store/useOrderStore';
import useFormRequest from '@/hooks/use-form-request';
import Select from '@/components/Forms/Select';
import DropdownUpdateBtn from '@/components/Forms/DropdownUpdateBtn';
import BtnFunction from '@/components/Forms/Button';
import {determinePath, extractNATFWSlotIdsAndNames, extractPortIdsAndNames} from '@/utils/form-utils';
import {characteristicMapping, findCharacteristicValue} from '@/utils/resource-helper';
import {getLogger} from '@/utils/logger/logger';
import {IconPlus} from '@tabler/icons-react';
import AddVIPFlowsTable from '@/components/Tables/AddVIPFlowsTable';
import {
	CardStatusOptions,
	handOffOptions,
	PhysicalInterfaceTypeOptions,
	PinOutOptions,
	PortStatusOptions,
	RxOptions,
	serviceUseOptions,
	TxOptions,
	vipBlockOptions,
	VirtualInterfaceTypeOptions
} from '@/utils/lib/select-options';

const ExistingVIPFlowsTable = dynamic(() => import('@/components/Tables/ExistingVIPFlowsTable'), {ssr: false});

const ServiceModal = ({
						  index,
						  service,
						  userName,
						  isLoadingChassis,
						  readonly,
						  onAddServiceFn,
						  onClose,
						  onUpdateServiceFn
					  }) => {
	const logger = getLogger('ServiceModal');
	const {
		secondStep,
		setSelectedItem,
		setSlotOptions,
		setPortOptions,
		setVIPFlows,
		resetChassisRelatedData,
		resetSlotRelatedData,
		resetPortRelatedData,
		set,
		setDetailedVIPFlows,
		services,
		removeService
	} = useOrderStore();
	logger.debug(`ServiceModal - Adding Service to the order at index: ${index}, userName: ${userName}, Service : ${JSON.stringify(service)}`);
	
	const isPortService = service.resource === 'Port';
	const isCardService = service.resource === 'Card';
	const [renderedTable, setRenderedTable] = useState(null);
	const [isAddServiceEnabled, setIsAddServiceEnabled] = useState(true);
	const [addCardRefreshFlag, setAddCardRefreshFlag] = useState(false);
	
	const [isLoadingSlots, setIsLoadingSlots] = useState(false);
	const [isLoadingCardValue, setIsLoadingCardValue] = useState(false);
	const [isLoadingPorts, setIsLoadingPorts] = useState(false);
	const [isLoadingPortValue, setIsLoadingPortValue] = useState(false);
	
	const {doRequest: doChassisDataRequest, errors: chassisDataRequestErrors} = useFormRequest();
	const {doRequest: doSlotDataRequest, errors: slotDataRequestErrors} = useFormRequest();
	const {doRequest: doPortDataRequest, errors: portDataRequestErrors} = useFormRequest();
	const {doRequest: doAddCardRequest, errors: addCardRequestErrors} = useFormRequest();
	
	const [TxFlows, setTxFlows] = useState(0);
	const [RxFlows, setRxFlows] = useState(0);
	const [triggerFlowGeneration, setTriggerFlowGeneration] = useState(false);
	
	const handleGenerateFlow = () => {
		const totalFlows = TxFlows + RxFlows;
		const engineeringName = service.port;
		logger.info(`handleGenerateFlows - Index: ${index}, totalFlows : ${totalFlows} for port: ${engineeringName} `);
		
		handleInputChange('TxFlows', TxFlows);
		handleInputChange('RxFlows', RxFlows);
		handleInputChange('totalFlows', totalFlows);
		handleInputChange('engineeringName', engineeringName);
		
		if (service.vipFlows.length > 0) {
			setRenderedTable('existingFlows');
		} else {
			setRenderedTable('newFlows');
		}
	};
	
	const handleSelectChange = (type, value) => {
		const numericValue = parseInt(value, 10) || 0;
		logger.debug(`handleSelectChange - type: ${type}, numericValue: ${numericValue}`);
		if (type === 'TxFlows') {
			setTxFlows(numericValue);
		} else if (type === 'RxFlows') {
			setRxFlows(numericValue);
		}
	};
	
	const handleGenerateFlowsClick = () => {
		logger.debug(`ServiceModal - handleGenerateFlowsClick`);
		handleGenerateFlow();
		setTriggerFlowGeneration(true);
	};
	
	const resetFlowCounts = () => {
		logger.info(`ServiceModal - resetFlowCounts`);
		setTxFlows(0);
		setRxFlows(0);
		setTriggerFlowGeneration(false); // Reset trigger after generation
	};
	
	const handleInputChange = (field, value) => {
		let updatedValue;
		const flowFields = ['TxFlows', 'RxFlows', 'totalFlows'];
		const integerFields = ['vipBlock', 'newVIPBlock'];
		const noValueFields = ['newPhyInterfaceType', 'physicalInterfaceType'];
		
		logger.info(`handleInputChange - index: ${index}, field: ${field}, value: ${value}`);
		
		if (flowFields.includes(field)) {
			const numericValue = parseInt(value, 10) || 0;
			updatedValue = secondStep.services[index][field] + numericValue;
			logger.info(`handleInputChange - Flow fields update for ${field}, new value: ${updatedValue}`);
		} else if (integerFields.includes(field)) {
			updatedValue = parseInt(value, 10) || 0;
			logger.info(`handleInputChange - Integer fields update for ${field}, new value: ${updatedValue}`);
		} else if (noValueFields.includes(field)) {
			const matchedOption = PhysicalInterfaceTypeOptions.find((option) => option.label === value);
			
			if (matchedOption) {
				const newValues = {
					newPhyInterfaceType: value, // Value passed to the function
					physicalInterfaceType: matchedOption.id // ID matching the label
				};
				
				logger.info(`handleInputChange - NoValue field ${field} matched option: ${JSON.stringify(newValues)}`);
				
				// Update Zustand state with both values
				set((state) => {
					const newServices = state.secondStep.services.map((service, i) => {
						if (i === index) {
							return {
								...service,
								...newValues
							};
						}
						return service;
					});
					
					return {
						secondStep: {
							...state.secondStep,
							services: newServices
						}
					};
				});
				
				return; // Exit function after handling noValueFields
			} else {
				logger.warn(`handleInputChange - No matching label found in options for field: ${field}`);
			}
		} else {
			updatedValue = value;
			logger.info(`handleInputChange - Default update for ${field}, new value: ${updatedValue}`);
		}
		
		const descriptionFieldsMap = {
			newCardHandOff: {options: handOffOptions, descriptionField: 'newCardHandOffDescription'},
			newPinOut: {options: PinOutOptions, descriptionField: 'newPinOutDescription'},
			newHandOff: {options: handOffOptions, descriptionField: 'newHandOffDescription'},
			newServiceUse: {options: serviceUseOptions, descriptionField: 'newServiceUseDescription'}
		};
		
		// Determine if the field has a corresponding description to update
		const fieldMeta = descriptionFieldsMap[field];
		let updatedDescription = null;
		
		if (fieldMeta) {
			const matchedOption = fieldMeta.options.find((opt) => opt.value === value);
			updatedDescription = matchedOption ? matchedOption.description : null;
			logger.info(`handleInputChange - Updating description for ${fieldMeta.descriptionField} to: ${updatedDescription}`);
		}
		
		set((state) => {
			const newServices = state.secondStep.services.map((service, i) => {
				if (i === index) {
					const updatedService = {...service, [field]: updatedValue};
					if (fieldMeta && updatedDescription !== null) {
						updatedService[fieldMeta.descriptionField] = updatedDescription;
					}
					return updatedService;
				}
				return service;
			});
			
			return {
				secondStep: {
					...state.secondStep,
					services: newServices
				}
			};
		});
	};
	
	useEffect(() => {
		if (service) {
			logger.debug(`ServiceModal [useEffect] - Loaded Service: ${JSON.stringify(service)} at index: ${index}`);
			checkAddServiceButtonState();
		}
	}, [service, service.chassis, service.slot, service.card, service.port]);
	
	useEffect(() => {
		if (addCardRefreshFlag) {
			setAddCardRefreshFlag(false);
		}
	}, [addCardRefreshFlag]);
	
	const checkAddServiceButtonState = () => {
		if (service.card !== 'Empty Slot') {
			if (isCardService && service.chassis && service.slot) {
				setIsAddServiceEnabled(true);
			} else if (isPortService && service.chassis && service.slot && service.port) {
				setIsAddServiceEnabled(true);
			} else {
				setIsAddServiceEnabled(false);
			}
		} else {
			setIsAddServiceEnabled(false);
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
	
	const handleChassisChange = async (selectedChassis) => {
		logger.debug(`handleChassisChange - Selected Chassis: ${selectedChassis}`);
		
		resetChassisRelatedData(index);
		setIsLoadingSlots(true);
		setSelectedItem('chassis', selectedChassis, index);
		handleInputChange('path', determinePath(selectedChassis));
		
		const selectedChassisInfo = secondStep.chassisOptions.find(
			(chassisItem) => chassisItem.publicIdentifier === selectedChassis || chassisItem.name === selectedChassis);
		
		if (selectedChassisInfo) {
			const selectedChassisId = selectedChassisInfo.id;
			const url = `${process.env.NEXT_PUBLIC_DNA_HOST || ''}/api/dna/chassis/getChassisId?id=${selectedChassisId}`;
			
			await doChassisDataRequest({
				url: url,
				method: 'get',
				onSuccess: async (chassisResponse) => {
					const slotData = await extractNATFWSlotIdsAndNames(chassisResponse[0]);
					const slotOptions = slotData.map(({id, name, slotName}) => ({
						id,
						name,
						slotName
					}));
					setSlotOptions(index, slotOptions.length > 0 ? slotOptions : 'No Slots Available');
				}
			});
		} else {
			logger.warn(`handleChassisChange - Chassis ${selectedChassis} not found!`);
			setSlotOptions(index, 'No Slots Available');
		}
		setIsLoadingSlots(false);
		setRenderedTable(null);
	};
	
	const addNewCardRequest = async (slotId) => {
		const url = `${process.env.NEXT_PUBLIC_DNA_HOST || ''}/api/dna/slots/updateSlot`;
		
		if (!slotId) {
			logger.warn(`ServiceModal [addNewCardRequest] - slotId is not found!`);
			return;
		}
		logger.debug(`ServiceModal [addNewCardRequest] - url : ${url}, slotId: ${slotId} `);
		
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
				logger.debug(`ServiceModal [addNewCardRequest] - Response: ${JSON.stringify(response)}`);
				
				if (response.status === '200') {
					const currentSlotName = service.slot;
					logger.debug(`ServiceModal [addNewCardRequest] - Calling handleSlotChange with slotName: ${currentSlotName}`);
					
					await handleSlotChange(currentSlotName);
					setAddCardRefreshFlag(true);
				}
			}
		});
	};
	
	const handleSlotChange = async (selectedSlot) => {
		logger.debug(`ServiceModal [handleSlotChange] - selectedSlot : ${selectedSlot}`);
		
		resetSlotRelatedData(index);
		setIsLoadingPorts(true);
		setIsLoadingCardValue(true);
		setSelectedItem('slot', selectedSlot, index);
		
		const selectedSlotInfo = service.slotOptions.find(
			(slotItem) => slotItem.name === selectedSlot || slotItem.publicIdentifier === selectedSlot);
		const noPortOptions = ['No Ports matching the criteria is available for this Slot'];
		
		if (selectedSlotInfo) {
			setSelectedItem('slotId', selectedSlotInfo.id, index);
			setSelectedItem('slotName', selectedSlotInfo.slotName, index);
			const url = `${process.env.NEXT_PUBLIC_DNA_HOST || ''}/api/dna/slots/getSlot?id=${selectedSlotInfo.id}`;
			
			await doSlotDataRequest({
				url: url,
				method: 'get',
				onSuccess: async (slotResponse) => { // Async or sync - performance to be determined
					const portList = extractPortIdsAndNames(slotResponse[0]);
					await extractAndSetData('slot', slotResponse[0]);
					
					if (portList && portList.length > 0) {
						logger.debug(`handleSlotChange - portList: ${JSON.stringify(portList)}`);
						const formattedPortOptions = portList.map(({id, name}) => ({id, name}));
						setPortOptions(index, formattedPortOptions);
					} else {
						setPortOptions(index, noPortOptions);
					}
				}
			});
		} else {
			logger.warn(`handleSlotChange - Selected Slot ${selectedSlotInfo.slotName} is not available!`);
			setPortOptions(index, noPortOptions);
		}
		setIsLoadingPorts(false);
		setIsLoadingCardValue(false);
		setRenderedTable(null);
	};
	
	const handlePortChange = async (selectedPort) => {
		resetPortRelatedData(index);
		setIsLoadingPortValue(true);
		setSelectedItem('port', selectedPort, index);
		
		const selectedPortInfo = service.portOptions.find(
			(portItem) => portItem.name === selectedPort || portItem.publicIdentifier === selectedPort
		);
		
		logger.debug(`handlePortChange - index ${index}, selectedPort ${selectedPort},
                    isLoadingPorts ${isLoadingPorts}, selectedPortInfo: ${JSON.stringify(selectedPortInfo)} `);
		
		if (selectedPortInfo) {
			setSelectedItem('portId', selectedPortInfo.id, index);
			const url = `${process.env.NEXT_PUBLIC_DNA_HOST || ''}/api/dna/ports/getPort?id=${selectedPortInfo.id}`;
			
			await doPortDataRequest({
				url,
				method: 'get',
				onSuccess: async (portResponse) => {
					logger.debug(`handlePortChange - selectedPortData: ${JSON.stringify(portResponse[0])}`);
					await extractAndSetData('port', portResponse[0]);
					
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
				}
			});
		}
		setIsLoadingPortValue(false);
	};
	
	const renderNATFWComponent = (service) => {
		return (isPortService && service.workRequired === 'VIP (NATFW)' && service.port);
	};
	
	const renderSection = (service) => (
		<div className="shadow-sm ring-1 ring-gray-900/30 sm:rounded-xl md:col-span-4">
			<div className="px-4 py-6 sm:p-8">
				<div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-1">
					
					<div className="grid grid-cols-3 gap-x-6">
						<div className="col-span-1">
							<Select
								id={`chassis_${index}`}
								value={service.chassis}
								label="Chassis"
								onChange={(e) => handleChassisChange(e.target.value)}
								disabled={readonly}
								placeholder="Select chassis"
							>
								<option value="" disabled>
									Select
								</option>
								{isLoadingChassis ? (
									<option value="Loading" disabled>
										Loading.....
									</option>
								) : (
									secondStep.chassisOptions.map((option, index) => (
										<option key={index} value={option.name}>
											{option.name}
										</option>
									))
								)}
							</Select>
						</div>
						<div className="mt-10 flex items-center">
							<label htmlFor={`path_${index}`} className="block text-sm text-gray-600 mr-4 w-48">
								Belongs to path
							</label>
							<input
								type="text"
								id={`path_${index}`}
								placeholder="Path for the selected Chassis"
								value={service.path}
								readOnly
								className="mt-1 block w-full py-1 px-3 border border-gray-300 bg-white rounded-md
                                     shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500
                                     sm:text-sm"
							/>
						</div>
						<div className="col-span-1">
							{chassisDataRequestErrors && chassisDataRequestErrors.message && (
								<div className="mt-4 text-red-500">
									Error with Chassis API: {chassisDataRequestErrors.message}
									{chassisDataRequestErrors.errors && (
										<ul>
											{chassisDataRequestErrors.errors.map((error, index) => (
												<li key={index}>{error}</li>
											))}
										</ul>
									)}
								</div>
							)}
						</div>
					</div>
					
					<div className="grid grid-cols-3 gap-x-6">
						<div className="mt-1 col-span-1">
							<Select
								id={`slot_${index}`}
								value={service.slot}
								label="Slot"
								onChange={(e) => handleSlotChange(e.target.value)}
								disabled={readonly}
								placeholder={'Select slot'}
							>
								<option value="" disabled>
									Select
								</option>
								{isLoadingSlots ? (
									<option value="Loading" disabled>
										Loading.....
									</option>
								) : (
									service.slotOptions && service.slotOptions.length > 0 && service.slotOptions.map((slot) => {
										const slotName = slot?.name || slot?.publicIdentifier || 'Unnamed Slot';
										return (
											<option key={slot.id} value={slotName}>
												{slotName}
											</option>
										);
									})
								)}
							</Select>
						</div>
						<div className="mt-10 flex items-center">
							<label htmlFor={`slotName_${index}`} className="block text-sm text-gray-600 w-52">
								Public Identifier
							</label>
							<input
								id={`slotName_${index}`}
								type="text"
								label="Slot Name"
								placeholder="Public Identifier for selected Slot"
								value={service.slot && service.slotOptions.find((opt) => opt.name === service.slot)?.slotName}
								readOnly
								className="mt-3 block w-full py-1 px-3 border border-gray-300 bg-white rounded-md
                                shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500
                                sm:text-sm"
							/>
						</div>
						<div className="col-span-1">
							{slotDataRequestErrors && slotDataRequestErrors.message && (
								<div className="mt-4 text-red-500">
									Error with Slot API: {slotDataRequestErrors.message}
								</div>
							)}
						</div>
					</div>
					
					<div className="grid grid-cols-3 gap-x-6">
						<div className="mt-6 col-span-1">
							<label
								htmlFor={`card_${index}`}
								className="block -mr-36 text-sm text-gray-600 w-full">
								Card installed on this Slot
							</label>
							<input
								id={`card_${index}`}
								type="text"
								label="Card Type"
								placeholder="Card type for selected Slot"
								value={service.card}
								readOnly
								className="mt-4 mr-4 block w-full py-1 px-2 border border-gray-300 bg-white rounded-md
                                          shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500
                                          sm:text-sm"
							/>
						</div>
						<div className="mt-10 flex items-center">
							<BtnFunction
								type="button"
								className="mt-5"
								onClick={() => addNewCardRequest(service.slotId)}
								disabled={service.card !== 'Empty Slot'}
							>
								Add Card
							</BtnFunction>
						</div>
						<div className="col-span-1">
							{addCardRequestErrors && addCardRequestErrors.message && (
								<div className="mt-4 text-red-500">
									Error with Add Card API: {addCardRequestErrors.message}
								</div>
							)}
						</div>
					</div>
					
					<div className="mt-8">
						<Badge size="lg" variant="light" radius="sm" color="blue">Current state of the selected
							Slot</Badge>
					</div>
					
					<Table
						striped
						highlightOnHover
						withBorder
						withColumnBorders
						// withRowBorders
						className={'mt-4 mb-4 w-2/3'}
					>
						<thead>
						<tr>
							<th style={{backgroundColor: '#ADD8E6'}}>Attribute</th>
							<th style={{backgroundColor: '#ADD8E6'}}>Current state</th>
							<th style={{backgroundColor: '#ADD8E6'}}>Update</th>
						</tr>
						</thead>
						<tbody>
						<tr>
							<td>
								<Text
									size="sm"
									fw={500}
									variant="gradient"
									gradient={{from: 'black', to: 'gray', deg: 80}}
								>Project Number</Text>
							</td>
							<td>
								{isLoadingCardValue ? (
									<Loader color="blue" size="sm"/>
								) : (
									<Text
										size="sm"
										fw={400}
										variant="gradient"
										gradient={{from: 'indigo', to: 'indigo', deg: 90}}>
										{service.cardProjectNumber}
									</Text>
								)}
							</td>
							<td>
								<DropdownUpdateBtn
									label="Card Project Number"
									placeholder="Select"
									index={index}
									disabled={true}
									options={[
										{
											'value': service.cardProjectNumber,
											'description': service.cardProjectNumber
										}
									]}
									currentValue={service.cardProjectNumber}
								/>
							</td>
						</tr>
						<tr>
							<td>
								<Text
									size="sm"
									fw={500}
									variant="gradient"
									gradient={{from: 'black', to: 'gray', deg: 80}}>Card status</Text>
							</td>
							<td>
								{isLoadingCardValue ? (
									<Loader color="blue" size="sm"/>
								) : (
									<Text
										size="sm"
										fw={400}
										variant="gradient"
										gradient={{from: 'indigo', to: 'indigo', deg: 90}}>
										{service.cardStatusDescription}
									</Text>
								)}
							</td>
							<td>
								<DropdownUpdateBtn
									label="Card Status"
									placeholder="CardStatus"
									disabled={isPortService}
									options={CardStatusOptions}
									currentValue={service.cardStatus}
									newValue={service.newCardStatus}
									onChange={(selectedValue) => handleInputChange('newCardStatus', selectedValue)}
									onUpdate={() => {
										// Handle the onUpdate logic if needed
									}}
									index={index}
								/>
							</td>
						</tr>
						<tr>
							<td>
								<Text
									size="sm"
									fw={500}
									variant="gradient"
									gradient={{from: 'black', to: 'gray', deg: 80}}>Default App</Text>
							</td>
							<td>
								{isLoadingCardValue ? (
									<Loader color="blue" size="sm"/>
								) : (
									<Text
										size="sm"
										fw={400}
										variant="gradient"
										gradient={{from: 'indigo', to: 'indigo', deg: 90}}>
										{service.defaultApp}
									</Text>
								)}
							</td>
							<td>
								<DropdownUpdateBtn
									label="Default App"
									placeholder="defaultApp"
									disabled={isPortService}
									options={[
										{
											'value': service.newDefaultApp,
											'description': service.newDefaultApp
										}
									]}
									currentValue={service.defaultApp}
									newValue={service.newDefaultApp}
									onChange={(selectedValue) => handleInputChange('newDefaultApp', selectedValue)}
									onUpdate={() => {
										// Handle the onUpdate logic if needed
									}}
									index={index}
								/>
							</td>
						</tr>
						<tr>
							<td>
								<Text
									size="sm"
									fw={500}
									variant="gradient"
									gradient={{from: 'black', to: 'gray', deg: 80}}>Hand Off</Text>
							</td>
							<td>
								{isLoadingCardValue ? (
									<Loader color="blue" size="sm"/>
								) : (
									<Text
										size="sm"
										fw={400}
										variant="gradient"
										gradient={{from: 'indigo', to: 'indigo', deg: 90}}>
										{service.cardHandOffDescription}
									</Text>
								)}
							</td>
							<td>
								<DropdownUpdateBtn
									label="Hand Off"
									placeholder="HandOff"
									disabled={isPortService}
									options={handOffOptions}
									currentValue={service.cardHandOff}
									newValue={service.newCardHandOff}
									onChange={(selectedValue) => handleInputChange('newCardHandOff', selectedValue)}
									onUpdate={() => {
										// Handle the onUpdate logic if needed
									}}
									index={index}
								/>
							</td>
						</tr>
						<tr>
							<td>
								<Text
									size="sm"
									fw={500}
									variant="gradient"
									gradient={{from: 'black', to: 'gray', deg: 80}}>PinOut design</Text>
							</td>
							<td>
								{isLoadingCardValue ? (
									<Loader color="blue" size="sm"/>
								) : (
									<Text
										size="sm"
										fw={400}
										variant="gradient"
										gradient={{from: 'indigo', to: 'indigo', deg: 90}}>
										{service.pinOutDescription}
									</Text>
								)}
							</td>
							<td>
								<DropdownUpdateBtn
									label="PinOut design"
									placeholder="PinOut Design"
									disabled={isPortService}
									options={PinOutOptions}
									currentValue={service.pinOut}
									newValue={service.newPinOut}
									onChange={(selectedValue) => handleInputChange('newPinOut', selectedValue)}
									onUpdate={() => {
										// Handle the onUpdate logic if needed
									}}
									index={index}
								/>
							</td>
						</tr>
						</tbody>
					</Table>
					
					{isPortService && (
						<div>
							<div className="grid grid-cols-3 gap-y-2">
								<div className="col-span-1">
									<Select
										id={`port_${index}`}
										value={service.port}
										label="Port"
										onChange={(e) => handlePortChange(e.target.value)}
										disabled={readonly}
										placeholder={'Select port'}
									>
										<option value="" disabled>
											Select
										</option>
										{isLoadingPorts ? (
											<option value="Loading" disabled>
												Loading.....
											</option>
										) : (
											// Ensure portOptions is an array and map over it
											(Array.isArray(service.portOptions) && service.portOptions.length > 0 ? service.portOptions.map((port) => {
													const portName = port.name || port.publicIdentifier || 'Unnamed Port';
													return (
														<option key={port.id} value={portName}>
															{portName}
														</option>
													);
												})
												: (
													<option value="NoPorts" disabled>
														No Ports Available
													</option>
												))
										)}
									</Select>
								</div>
								<div className="mt-8 mr-6 ml-6 flex items-center">
									<label
										htmlFor={`engineeringName_${index}`}
										className="mt-2 block text-sm text-gray-600 w-72">
										Engineering Name
									</label>
									<input
										type="text"
										id={`engineeringName_${index}`}
										placeholder="Engineering Name for the selected port"
										value={service.engineeringName}
										readOnly
										className="mt-2 block w-full py-2 px-4 border border-gray-300 bg-white rounded-md
                                     shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500
                                     sm:text-sm"
									/>
								</div>
								<div className="col-span-1">
									{portDataRequestErrors && portDataRequestErrors.message && (
										<div className="mt-4 text-red-500">
											Error with Port API: {portDataRequestErrors.message}
										</div>
									)}
								</div>
							</div>
							
							<div className="mt-8 pb-2">
								<Badge size="lg" variant="light" radius="sm" color="blue"> Current state of the
									selected
									Port</Badge>
							</div>
							
							<Table
								striped
								highlightOnHover
								withBorder
								withColumnBorders
								// withRowBorders
								className={'mt-4 mb-4 w-2/3'}
							>
								<thead>
								<tr>
									<th style={{backgroundColor: '#ADD8E6'}}>Attribute</th>
									<th style={{backgroundColor: '#ADD8E6'}}>Current state</th>
									<th style={{backgroundColor: '#ADD8E6'}}>Update</th>
								</tr>
								</thead>
								<tbody>
								<tr>
									<td>
										<Text
											size="sm"
											fw={500}
											variant="gradient"
											gradient={{from: 'black', to: 'gray', deg: 80}}>Friendly Name</Text>
									</td>
									<td>
										{isLoadingPortValue ? (
											<Loader color="blue" size="sm"/>
										) : (
											<Text
												size="sm"
												fw={400}
												variant="gradient"
												gradient={{from: 'indigo', to: 'indigo', deg: 90}}>
												{service.friendlyName}
											</Text>
										)}
									</td>
									<td>
										<Text
											size="sm"
											fw={400}
											variant="gradient"
											gradient={{from: 'cyan', to: 'green', deg: 90}}>
											{service.friendlyName}
										</Text>
									</td>
								</tr>
								<tr>
									<td>
										<Text
											size="sm"
											fw={500}
											variant="gradient"
											gradient={{from: 'black', to: 'gray', deg: 80}}>Project Number</Text>
									</td>
									<td>
										{isLoadingPortValue ? (
											<Loader color="blue" size="sm"/>
										) : (
											<Text
												size="sm"
												fw={400}
												variant="gradient"
												gradient={{from: 'indigo', to: 'indigo', deg: 90}}>
												{service.portProjectNumber}
											</Text>
										)}
									</td>
									<td>
										<Text
											size="sm"
											fw={400}
											variant="gradient"
											gradient={{from: 'cyan', to: 'green', deg: 90}}>
											{service.portProjectNumber}
										</Text>
									</td>
								</tr>
								<tr>
									<td>
										<Text
											size="sm"
											fw={500}
											variant="gradient"
											gradient={{from: 'black', to: 'gray', deg: 80}}>Port Number</Text>
									</td>
									<td>
										{isLoadingPortValue ? (
											<Loader color="blue" size="sm"/>
										) : (
											<Text
												size="sm"
												fw={400}
												variant="gradient"
												gradient={{from: 'indigo', to: 'indigo', deg: 90}}>
												{service.portNo}
											</Text>
										)}
									</td>
									<td>
										<Text
											size="sm"
											fw={400}
											variant="gradient"
											gradient={{from: 'cyan', to: 'green', deg: 90}}>
											{service.portNo}
										</Text>
									</td>
								</tr>
								<tr>
									<td>
										<Text
											size="sm"
											fw={500}
											variant="gradient"
											gradient={{from: 'black', to: 'gray', deg: 80}}>Physical Interface
											Type</Text>
									</td>
									<td>
										{isLoadingPortValue ? (
											<Loader color="blue" size="sm"/>
										) : (
											<Text
												size="sm"
												fw={400}
												variant="gradient"
												gradient={{from: 'indigo', to: 'indigo', deg: 90}}>
												{service.phyInterfaceType}
											</Text>
										)}
									</td>
									<td>
										<Text
											size="sm"
											fw={400}
											variant="gradient"
											gradient={{from: 'cyan', to: 'green', deg: 90}}>
											{service.newPhyInterfaceType}
										</Text>
									</td>
								</tr>
								<tr>
									<td>
										<Text
											size="sm"
											fw={500}
											variant="gradient"
											gradient={{from: 'black', to: 'gray', deg: 80}}>VIP Block</Text>
									</td>
									<td>
										{isLoadingPortValue ? (
											<Loader color="blue" size="sm"/>
										) : (
											<Text
												size="sm"
												fw={400}
												variant="gradient"
												gradient={{from: 'indigo', to: 'indigo', deg: 90}}>
												{service.vipBlock}
											</Text>
										)}
									</td>
									<td>
										<Text
											size="sm"
											fw={400}
											variant="gradient"
											gradient={{from: 'cyan', to: 'green', deg: 90}}>
											{service.newVIPBlock}
										</Text>
									</td>
								</tr>
								<tr>
									<td>
										<Text
											size="sm"
											fw={500}
											variant="gradient"
											gradient={{from: 'black', to: 'gray', deg: 80}}>Service type</Text>
									</td>
									<td>
										{isLoadingPortValue ? (
											<Loader color="blue" size="sm"/>
										) : (
											<Text
												size="sm"
												fw={400}
												variant="gradient"
												gradient={{from: 'indigo', to: 'indigo', deg: 90}}>
												{service.serviceType}
											</Text>
										)}
									</td>
									<td>
										<DropdownUpdateBtn
											index={index}
											label="Service type"
											placeholder="Select"
											options={[
												{
													'value': service.newServiceType,
													'description': service.newServiceType
												}
											]}
											currentValue={service.serviceType}
											newValue={service.newServiceType}
											onChange={(selectedValue) => handleInputChange('newServiceType', selectedValue)}
											disabled={isPortService || readonly}
											onUpdate={() => {
												// Handle the onUpdate logic if needed
											}}
										/>
									</td>
								</tr>
								<tr>
									<td>
										<Text
											size="sm"
											fw={500}
											variant="gradient"
											gradient={{from: 'black', to: 'gray', deg: 80}}>Port status</Text>
									</td>
									<td>
										{isLoadingPortValue ? (
											<Loader color="blue" size="sm"/>
										) : (
											<Text
												size="sm"
												fw={400}
												variant="gradient"
												gradient={{from: 'indigo', to: 'indigo', deg: 90}}>
												{service.portStatusDescription}
											</Text>
										)}
									</td>
									<td>
										<DropdownUpdateBtn
											index={index}
											label="Port Status"
											placeholder="PortStatus"
											options={PortStatusOptions}
											// options={[
											// 	{
											// 		'value': service.newPortStatus,
											// 		'description': service.newPortStatusDescription
											// 	}
											// ]}
											currentValue={service.portStatus}
											newValue={service.newPortStatus}
											onChange={(selectedValue) => handleInputChange('newPortStatus', selectedValue)}
											// disabled={isPortService || readonly}
											onUpdate={() => {
												// Handle the onUpdate logic if needed
											}}
										/>
									</td>
								</tr>
								<tr>
									<td>
										<Text
											size="sm"
											fw={500}
											variant="gradient"
											gradient={{from: 'black', to: 'gray', deg: 80}}>Hand Off</Text>
									</td>
									<td>
										{isLoadingPortValue ? (
											<Loader color="blue" size="sm"/>
										) : (
											<Text
												size="sm"
												fw={400}
												variant="gradient"
												gradient={{from: 'indigo', to: 'indigo', deg: 90}}>
												{service.handOffDescription}
											</Text>
										)}
									</td>
									<td>
										<DropdownUpdateBtn
											index={index}
											label="Hand-Off"
											placeholder="Select"
											options={handOffOptions}
											currentValue={service.handOff}
											newValue={service.newHandOff}
											onChange={(selectedValue) => handleInputChange('newHandOff', selectedValue)}
											onUpdate={() => {
												// Handle the onUpdate logic if needed
											}}
											disabled={readonly}
										/>
									</td>
								</tr>
								<tr>
									<td>
										<Text
											size="sm"
											fw={500}
											variant="gradient"
											gradient={{from: 'black', to: 'gray', deg: 80}}>Service Usage</Text>
									</td>
									<td>
										{isLoadingPortValue ? (
											<Loader color="blue" size="sm"/>
										) : (
											<Text
												size="sm"
												fw={400}
												variant="gradient"
												gradient={{from: 'indigo', to: 'indigo', deg: 90}}>
												{service.serviceUseDescription}
											</Text>
										)}
									</td>
									<td>
										<DropdownUpdateBtn
											index={index}
											label="Service Usage"
											placeholder="Select"
											options={serviceUseOptions}
											currentValue={service.serviceUse}
											newValue={service.newServiceUse}
											onChange={(selectedValue) => handleInputChange('newServiceUse', selectedValue)}
											onUpdate={() => {
												// Handle the onUpdate logic if needed
											}}
											disabled={readonly}
										/>
									</td>
								</tr>
								<tr>
									<td>
										<Text
											size="sm"
											fw={500}
											variant="gradient"
											gradient={{from: 'black', to: 'gray', deg: 80}}>Virtual Interface
											Type</Text>
									</td>
									<td>
										{isLoadingPortValue ? (
											<Loader color="blue" size="sm"/>
										) : (
											<Text
												size="sm"
												fw={400}
												variant="gradient"
												gradient={{from: 'indigo', to: 'indigo', deg: 90}}>
												{service.gmnInterfaceType}
											</Text>
										)}
									</td>
									<td>
										<DropdownUpdateBtn
											index={index}
											label="Virtual Interface Type"
											placeholder="Select"
											disabled={readonly}
											options={VirtualInterfaceTypeOptions}
											currentValue={service.gmnInterfaceType}
											newValue={service.newGMNInterfaceType}
											onChange={(selectedValue) => handleInputChange('newGMNInterfaceType', selectedValue)}
											onUpdate={() => {
												// Handle the onUpdate logic if needed
											}}
										/>
									</td>
								</tr>
								</tbody>
							</Table>
							
							
							{renderNATFWComponent(secondStep.services[index]) && (
								<div className="mt-10">
									<div className="grid grid-cols-1">
										<Accordion
											defaultValue="addNewFlows"
											initialState={[]}
											variant="separated"
											chevronPosition="left"
											chevron={<IconPlus size="1rem"/>}
											sx={{
												borderRadius: '2px',
												padding: '1px'
											}}
											styles={{
												chevron: {
													'&[data-rotate]': {
														transform: 'rotate(45deg)'
													}
												},
												item: {
													// marginLeft: '1px', // Add space between accordion items
													backgroundColor: '#f5f5f5' // Apply background color to accordion
																			   // items
												}
											}}
										>
											<Accordion.Item
												value="addNewFlows"
												sx={{
													borderRadius: '8px',
													backgroundColor: '#e3f2fd'
												}}
											>
												<Accordion.Control
													sx={{
														color: '#1e88e5', // Custom color for the control
														fontWeight: 700,   // Bold text
														padding: '2px 16px' // Add padding to the control
													}}
												>
													Add New Video IP (NATFW) Flows
												</Accordion.Control>
												<Accordion.Panel
													sx={{
														padding: '16px', // Add padding inside the panel
														backgroundColor: '#ffffff' // Different background for the panel
													}}
												>
													<Group position="left" spacing="xl" grow>
														<Select
															id={`phyInterfaceType_${index}`}
															value={service.newPhyInterfaceType}
															label="Physical Interface Type"
															onChange={(e) => handleInputChange('newPhyInterfaceType', e.target.value)}
														>
															{PhysicalInterfaceTypeOptions.map((option) => (
																<option key={option.value} value={option.value}>
																	{option.label}
																</option>
															))}
														</Select>
														<Select
															id={`VIPBlock_${index}`}
															value={service.newVIPBlock}
															label="VIP Block"
															onChange={(e) => handleInputChange('newVIPBlock', e.target.value)}
														>
															{vipBlockOptions.map((option) => (
																<option key={option.value} value={option.value}>
																	{option.label}
																</option>
															))}
														</Select>
														<Select
															id={`TxFlows_${index}`}
															value={TxFlows}
															label="Tx Flows"
															onChange={(e) => handleSelectChange('TxFlows', e.target.value)}
															// value={service.TxFlows}
															// onChange={(e) => handleInputChange('TxFlows',
															// e.target.value)}
														>
															{TxOptions.map((option) => (
																<option key={option.value} value={option.value}>
																	{option.label}
																</option>
															))}
														</Select>
														<Select
															id={`RxFlows_${index}`}
															value={RxFlows}
															label="Rx Flows"
															onChange={(e) => handleSelectChange('RxFlows', e.target.value)}
															// value={service.RxFlows}
															// onChange={(e) => handleInputChange('RxFlows',
															// e.target.value)}
														>
															{RxOptions.map((option) => (
																<option key={option.value} value={option.value}>
																	{option.label}
																</option>
															))}
														</Select>
														<div style={{marginTop: '40px'}}>
															<Button
																leftIcon={<IconPlus/>}
																onClick={handleGenerateFlowsClick}>
																Generate Flows
															</Button>
														</div>
													</Group>
												</Accordion.Panel>
											</Accordion.Item>
										</Accordion>
									</div>
									<div className="mt-10">
										<Stack>
											<Divider/>
											<div style={{width: '100%', overflowX: 'auto'}}>
												
												{/*{(renderedTable === 'newFlows' || service.totalFlows > 0) && (*/}
												{(service.vipFlows?.length === 0) && (
													<AddVIPFlowsTable
														index={index}
														engineeringName={service.engineeringName}
														friendlyName={service.friendlyName}
														TxFlows={TxFlows}
														RxFlows={RxFlows}
														triggerFlowGeneration={triggerFlowGeneration}
														onFlowsGenerated={resetFlowCounts}
														// TxFlows={Number(service.TxFlows)}
														// RxFlows={Number(service.RxFlows)}
														// resetFlowCounts={resetFlowCounts}
													/>
												)}
												
												{/*{(renderedTable === 'existingFlows' || service.vipFlows.length > 0) && (*/}
												{(service.vipFlows.length > 0) && (
													<ExistingVIPFlowsTable
														serviceIndex={index}
														engineeringName={service.engineeringName}
														friendlyName={service.friendlyName}
														TxFlows={TxFlows}
														RxFlows={RxFlows}
														triggerFlowGeneration={triggerFlowGeneration}
														onFlowsGenerated={resetFlowCounts}
													/>
												)}
											
											</div>
										</Stack>
									</div>
								</div>
							)}
						</div>
					)}
				</div>
			</div>
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
			
			{renderSection(service)}
			
			<div className="flex justify-center pb-2">
				<Group position="right" mt="md">
					{!readonly && (
						<div className="mt-2 col-span-1">
							{onAddServiceFn && (
								<BtnFunction
									type="button"
									onClick={() => {
										logger.info(`ServiceModal [onAddServiceFn]: Index ${index} `);
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
												 logger.debug(`ServiceModal [onUpdateServiceFn]: Index ${index} `);
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

export default ServiceModal;