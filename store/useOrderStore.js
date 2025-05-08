import {create} from 'zustand';
import {devtools} from 'zustand/middleware';
import {getLogger} from '@/utils/logger/logger';
// import create from "zustand"; // Removed duplicate import

const logger = getLogger('useOrderStore:');

const stepVariant = {
	1: 'firstStep',
	2: 'secondStep',
	3: 'reviewStep',
	4: 'submitStep'
};

// Define arrays for properties to reset
const sourceChassisProperties = [
	'sourceChassis',
	'sourcePath',
	'sourceSlot',
	'sourceSlotId',
	'sourceSlotName',
	'sourceCard',
	'sourceCardStatus',
	'sourceNewCardStatus',
	'sourceCardStatusDescription',
	'sourceNewCardStatusDescription',
	'sourceCardProjectNumber',
	'sourceNewCardProjectNumber',
	'sourceDefaultApp',
	'sourceNewDefaultApp',
	'sourceCardHandOff',
	'sourceNewCardHandOff',
	'sourceCardHandOffDescription',
	'sourceNewCardHandOffDescription',
	'sourcePinOut',
	'sourceNewPinOut',
	'sourcePinOutDescription',
	'sourceNewPinOutDescription',
	'sourcePort',
	'sourcePortId',
	'sourcePortStatus',
	'sourceNewPortStatus',
	'sourcePortStatusDescription',
	'sourceNewPortStatusDescription',
	'sourceEngineeringName',
	'sourceFriendlyName',
	'sourcePortNo',
	'sourcePortProjectNumber',
	'sourceNewPortProjectNumber',
	'sourceServiceUse',
	'sourceNewServiceUse',
	'sourceServiceUseDescription',
	'sourceNewServiceUseDescription',
	'sourceSlotOptions', // Array
	'sourcePortOptions' // Array
];

const farChassisProperties = [
	'farChassis',
	'farPath',
	'farSlot',
	'farSlotId',
	'farSlotName',
	'farCard',
	'farCardStatus',
	'farNewCardStatus',
	'farCardStatusDescription',
	'farNewCardStatusDescription',
	'farCardProjectNumber',
	'farNewCardProjectNumber',
	'farDefaultApp',
	'farNewDefaultApp',
	'farCardHandOff',
	'farNewCardHandOff',
	'farCardHandOffDescription',
	'farNewCardHandOffDescription',
	'farPinOut',
	'farNewPinOut',
	'farPinOutDescription',
	'farNewPinOutDescription',
	'farPort',
	'farPortId',
	'farPortStatus',
	'farNewPortStatus',
	'farPortStatusDescription',
	'farNewPortStatusDescription',
	'farEngineeringName',
	'farFriendlyName',
	'farPortNo',
	'farPortProjectNumber',
	'farNewPortProjectNumber',
	'farServiceUse',
	'farNewServiceUse',
	'farServiceUseDescription',
	'farNewServiceUseDescription',
	'farSlotOptions', // Array
	'farPortOptions' // Array
];

const sourceSlotProperties = [
	'sourceSlot',
	'sourceSlotId',
	'sourceSlotName',
	'sourceCard',
	'sourceCardStatus',
	'sourceNewCardStatus',
	'sourceCardStatusDescription',
	'sourceNewCardStatusDescription',
	'sourceCardProjectNumber',
	'sourceNewCardProjectNumber',
	'sourceDefaultApp',
	'sourceNewDefaultApp',
	'sourceCardHandOff',
	'sourceNewCardHandOff',
	'sourceCardHandOffDescription',
	'sourceNewCardHandOffDescription',
	'sourcePinOut',
	'sourceNewPinOut',
	'sourcePinOutDescription',
	'sourceNewPinOutDescription',
	'sourcePort',
	'sourcePortId',
	'sourcePortStatus',
	'sourceNewPortStatus',
	'sourcePortStatusDescription',
	'sourceNewPortStatusDescription',
	'sourceEngineeringName',
	'sourceFriendlyName',
	'sourcePortNo',
	'sourcePortProjectNumber',
	'sourceNewPortProjectNumber',
	'sourcePortOptions' // Array
];

const farSlotProperties = [
	'farSlot',
	'farSlotId',
	'farSlotName',
	'farCard',
	'farCardStatus',
	'farNewCardStatus',
	'farCardStatusDescription',
	'farNewCardStatusDescription',
	'farCardProjectNumber',
	'farNewCardProjectNumber',
	'farDefaultApp',
	'farNewDefaultApp',
	'farCardHandOff',
	'farNewCardHandOff',
	'farCardHandOffDescription',
	'farNewCardHandOffDescription',
	'farPinOut',
	'farNewPinOut',
	'farPinOutDescription',
	'farNewPinOutDescription',
	'farPort',
	'farPortId',
	'farPortStatus',
	'farNewPortStatus',
	'farPortStatusDescription',
	'farNewPortStatusDescription',
	'farEngineeringName',
	'farFriendlyName',
	'farPortNo',
	'farPortProjectNumber',
	'farNewPortProjectNumber',
	'farPortOptions' // Array
];

const sourcePortProperties = [
	'sourcePort',
	'sourcePortId',
	'sourcePortStatus',
	'sourceNewPortStatus',
	'sourcePortStatusDescription',
	'sourceNewPortStatusDescription',
	'sourceEngineeringName',
	'sourceFriendlyName',
	'sourcePortNo',
	'sourcePortProjectNumber',
	'sourceNewPortProjectNumber',
	'sourceServiceUse',
	'sourceNewServiceUse',
	'sourceServiceUseDescription',
	'sourceNewServiceUseDescription'
];

const farPortProperties = [
	'farPort',
	'farPortId',
	'farPortStatus',
	'farNewPortStatus',
	'farPortStatusDescription',
	'farNewPortStatusDescription',
	'farEngineeringName',
	'farFriendlyName',
	'farPortNo',
	'farPortProjectNumber',
	'farNewPortProjectNumber',
	'farServiceUse',
	'farNewServiceUse',
	'farServiceUseDescription',
	'farNewServiceUseDescription'
];

const resetProperties = (service, properties) => {
	const updatedService = {...service};
	properties.forEach((property) => {
		updatedService[property] = Array.isArray(updatedService[property])
			? [] : ''; // Reset arrays to [] and other types to ''
	});
	return updatedService;
};

// Each service entry retains all required attributes
const initialService = {
	index: 0,
	// Location-related properties
	sourceCountry: '',
	sourceSite: '',
	sourceSiteDesc: '',
	farCountry: '',
	farSite: '',
	farSiteDesc: '',
	// Request-related properties
	resource: '',
	requestType: '',
	workRequired: '',
	// Chassis-related properties
	chassis: '',
	path: '',
	// source Chassis-related properties
	sourceChassis: '',
	sourcePath: '',
	// far Chassis-related properties
	farChassis: '',
	farPath: '',
	// Slot-related properties
	slot: '',
	slotId: '',
	slotName: '',
	// source Slot-related properties
	sourceSlot: '',
	sourceSlotId: '',
	sourceSlotName: '',
	// far Slot-related properties
	farSlot: '',
	farSlotId: '',
	farSlotName: '',
	// source resource states
	sourceAdministrativeState: '',
	sourceOperationalState: '',
	sourceUsageState: '',
	sourceResourceStatus: '',
	sourceSlotNo: '',
	sourceSlotDesc: '',
	sourcePortName: '',
	// far resource states
	farAdministrativeState: '',
	farOperationalState: '',
	farUsageState: '',
	farResourceStatus: '',
	farSlotNo: '',
	farSlotDesc: '',
	farPortName: '',
	// Card-related properties
	card: '',
	cardStatus: '',
	newCardStatus: '',
	cardStatusDescription: '',
	newCardStatusDescription: '',
	cardProjectNumber: '',
	cardNewProjectNumber: '',
	defaultApp: '',
	newDefaultApp: '',
	cardHandOff: '',
	newCardHandOff: '',
	cardHandOffDescription: '',
	newCardHandOffDescription: '',
	pinOut: '',
	newPinOut: '',
	pinOutDescription: '',
	newPinOutDescription: '',
	// Source Card-related properties
	sourceCard: '',
	sourceCardStatus: '',
	sourceNewCardStatus: '',
	sourceCardStatusDescription: '',
	sourceNewCardStatusDescription: '',
	sourceCardProjectNumber: '',
	sourceNewCardProjectNumber: '',
	sourceDefaultApp: '',
	sourceNewDefaultApp: '',
	sourceCardHandOff: '',
	sourceNewCardHandOff: '',
	sourceCardHandOffDescription: '',
	sourceNewCardHandOffDescription: '',
	sourcePinOut: '',
	sourceNewPinOut: '',
	sourcePinOutDescription: '',
	sourceNewPinOutDescription: '',
	// far Card-related properties
	farCard: '',
	farCardStatus: '',
	farNewCardStatus: '',
	farCardStatusDescription: '',
	farNewCardStatusDescription: '',
	farCardProjectNumber: '',
	farNewCardProjectNumber: '',
	farDefaultApp: '',
	farNewDefaultApp: '',
	farCardHandOff: '',
	farNewCardHandOff: '',
	farCardHandOffDescription: '',
	farNewCardHandOffDescription: '',
	farPinOut: '',
	farNewPinOut: '',
	farPinOutDescription: '',
	farNewPinOutDescription: '',
	// Port-related properties
	port: '',
	portId: '',
	portStatus: '',
	newPortStatus: '',
	portStatusDescription: '',
	newPortStatusDescription: '',
	engineeringName: '',
	friendlyName: '',
	portNo: '',
	portProjectNumber: '',
	portNewProjectNumber: '',
	portNewPortProjectNumber: '',
	serviceType: '',
	newServiceType: '',
	// source Port-related properties
	sourcePort: '',
	sourcePortId: '',
	sourcePortStatus: '',
	sourceNewPortStatus: '',
	sourcePortStatusDescription: '',
	sourceNewPortStatusDescription: '',
	sourceEngineeringName: '',
	sourceFriendlyName: '',
	sourcePortNo: '',
	sourcePortProjectNumber: '',
	sourceNewPortProjectNumber: '',
	sourceServiceType: '',
	sourceNewServiceType: '',
	// far Port-related properties
	farPort: '',
	farPortId: '',
	farPortStatus: '',
	farNewPortStatus: '',
	farPortStatusDescription: '',
	farNewPortStatusDescription: '',
	farEngineeringName: '',
	farFriendlyName: '',
	farPortNo: '',
	farPortProjectNumber: '',
	farNewPortProjectNumber: '',
	farServiceType: '',
	farNewServiceType: '',
	// Hand-off properties
	handOff: '',
	newHandOff: '',
	handOffDescription: '',
	newHandOffDescription: '',
	// Service use-related properties
	serviceUse: '',
	newServiceUse: '',
	serviceUseDescription: '',
	newServiceUseDescription: '',
	// source Service use-related properties
	sourceServiceUse: '',
	sourceNewServiceUse: '',
	sourceServiceUseDescription: '',
	sourceNewServiceUseDescription: '',
	// far Service use-related properties
	farServiceUse: '',
	farNewServiceUse: '',
	farServiceUseDescription: '',
	farNewServiceUseDescription: '',
	// GMN Interface-related properties
	gmnInterfaceType: '',
	newGMNInterfaceType: '',
	sourceGMNInterfaceType: '',
	sourceNewGMNInterfaceType: '',
	farGMNInterfaceType: '',
	farNewGMNInterfaceType: '',
	// VIP flows-related properties
	totalFlows: 0,
	TxFlows: 0,
	RxFlows: 0,
	vipBlock: 0,
	newVIPBlock: 0,
	phyInterfaceType: '',
	newPhyInterfaceType: '',
	physicalInterfaceType: '',    // 902, 903, 904,
	detailedVIPFlows: [],
	vipFlows: [],
	// Options for slots and ports
	slotOptions: [],
	portOptions: [],
	// source Options for slots and ports
	sourceSlotOptions: [],
	sourcePortOptions: [],
	// far Options for slots and ports
	farSlotOptions: [],
	farPortOptions: [],
	// SMOT specific properties
	smotSpecificField1: '',
	smotSpecificField2: '',
	// Add more SMOT specific fields as needed
	smotServiceOrderId: '',
	smotServiceType: '',
	smotDescription: ''
};

const useOrderStore = create(
	devtools(
		(set) => ({
			firstStep: {
				network: 'G',
				projectName: '',
				remarks: '',
				customerHandoverTargetDate: null,
				supportingDocs: [],
				// supportingExcels: [],
				orderType: '',
				customerName: 'TGL',
				cidn: '15768',
				aSiteName: 'Core',
				aEndAddress: 'Core',
				currentStageCode: 'DSAL',
				serviceType: 'HD',
				handoverDate: null
			},
			secondStep: {
				country: '',
				site: '',
				siteDesc: '',
				farCountry: '',
				farSite: '',
				farSiteDesc: '',
				services: [initialService],
				siteOptions: [],
				chassisOptions: [],
				farSiteOptions: [],
				farChassisOptions: []
			},
			// Existing state
			orderType: '',
			orderData: {},
			serviceData: {},
			resourceData: {},
			
			// SMOT specific state
			smotData: {},
			smotStep: {
				serviceOrderId: '',
				serviceType: '',
				description: '',
				priority: 'Medium',
				requestedCompletionDate: '',
				location: '',
				contactName: '',
				contactEmail: '',
				contactPhone: '',
				attachments: [],
				additionalNotes: '',
				serviceStatus: 'Draft',
				activationType: '',
				connectionType: ''
			},
			
			// Actions for SMOT
			setSmotStep: (data) => set({smotStep: {...data}}),
			updateSmotStep: (updates) =>
				set((state) => ({
					smotStep: {...state.smotStep, ...updates}
				})),
			
			addService: (newService) => {
				logger.debug(`useOrderStore [addService] - newService: ${JSON.stringify(newService)}`);
				
				set((state) => {
					logger.debug(`useOrderStore [addService] - Services length: ${state.secondStep.services.length}`);
					
					const services = state.secondStep.services;
					const defaultProperties = [
						'sourceCountry',
						'sourceSite',
						'sourceSiteDesc',
						'resource',
						'requestType',
						'workRequired',
						'newCardStatus',
						'newCardStatusDescription',
						'newDefaultApp'
					];
					
					const isDefaultService =
						services.length === 1 &&
						Object.keys(services[0]).every(
							(key) =>
								defaultProperties.includes(key) ||
								services[0][key] === '' ||
								services[0][key] === 0 ||
								services[0][key] === null ||
								(Array.isArray(services[0][key]) && services[0][key].length === 0)
						);
					logger.debug(
						`useOrderStore [addService] - isDefaultService: ${isDefaultService}, length: ${services.length}`
					);
					
					// If the first item is the default, replace it; otherwise, add the new service
					const updatedServices = isDefaultService
						? [newService] // Replace default service
						: [...services, newService]; // Append the new service
					
					const newServiceIndex = isDefaultService ? 0 : updatedServices.length - 1;
					
					return {
						secondStep: {
							...state.secondStep,
							services: updatedServices
						},
						newServiceIndex // Return the index for modal control
					};
				});
			},
			
			removeService: (index) => {
				logger.debug(`useOrderStore [removeService] - Index: ${index} `);
				
				set((state) => ({
					secondStep: {
						...state.secondStep,
						services: state.secondStep.services.filter((_, i) => i !== index)
					}
				}));
			},
			
			updateService: (index, updatedService) => {
				logger.debug(
					`useOrderStore [updateService] - Index: ${index}, updatedService: ${JSON.stringify(updatedService)}`
				);
				
				set((state) => ({
					secondStep: {
						...state.secondStep,
						services: state.secondStep.services.map((service, i) =>
							i === index ? {...service, ...updatedService} : service
						)
					}
				}));
			},
			
			setSelectedCountry: (country) => {
				logger.debug(`useOrderStore [setSelectedCountry] - country: ${country} `);
				
				set((state) => ({
					secondStep: {
						...state.secondStep,
						country
					}
				}));
			},
			
			setSelectedFARCountry: (farCountry) => {
				logger.debug(`useOrderStore [setSelectedFARCountry] - farCountry: ${farCountry} `);
				
				set((state) => ({
					secondStep: {
						...state.secondStep,
						farCountry: farCountry
					}
				}));
			},
			
			setSourceCountry: (serviceIndex, country) => {
				logger.debug(`useOrderStore [setSelectedSite] - serviceIndex: ${serviceIndex}, country: ${country} `);
				
				set((state) => {
					const services = [...state.secondStep.services];
					services[serviceIndex] = {...services[serviceIndex], sourceCountry: country};
					return {
						secondStep: {
							...state.secondStep,
							services
						}
					};
				});
			},
			
			setSelectedSite: (site) => {
				logger.debug(`useOrderStore [setSelectedSite] - site: ${site}`);
				
				set((state) => ({
					secondStep: {
						...state.secondStep,
						site
					}
				}));
			},
			
			setSelectedFARSite: (farSite) => {
				logger.debug(`useOrderStore [setSelectedFARSite] - farSite: ${farSite}`);
				
				set((state) => ({
					secondStep: {
						...state.secondStep,
						farSite: farSite
					}
				}));
			},
			
			setSiteOptions: (options) => {
				logger.debug(`useOrderStore [setSiteOptions] - Options: ${JSON.stringify(options)}`);
				
				set((state) => {
					return {
						secondStep: {
							...state.secondStep,
							siteOptions: options
						}
					};
				});
			},
			
			setFARSiteOptions: (options) => {
				logger.debug(`useOrderStore [setFARSiteOptions] - Options: ${JSON.stringify(options)}`);
				
				set((state) => ({
					secondStep: {
						...state.secondStep,
						farSiteOptions: options
					}
				}));
			},
			
			setChassisOptions: (options) => {
				logger.debug(`useOrderStore [setChassisOptions] - Options: ${JSON.stringify(options)}`);
				
				set((state) => ({
					secondStep: {
						...state.secondStep,
						chassisOptions: options
					}
				}));
			},
			
			setSourceChassisOptions: (options) => {
				logger.debug(`useOrderStore [setSourceChassisOptions] - Options: ${JSON.stringify(options)}`);
				
				set((state) => ({
					secondStep: {
						...state.secondStep,
						sourceChassisOptions: options
					}
				}));
			},
			
			setFARChassisOptions: (options) => {
				logger.debug(`useOrderStore [setFARChassisOptions] - Options: ${JSON.stringify(options)}`);
				
				set((state) => ({
					secondStep: {
						...state.secondStep,
						farChassisOptions: options
					}
				}));
			},
			
			setSlotOptions: (index, options) => {
				logger.debug(`useOrderStore [setSlotOptions] - Index: ${index}, Options: ${JSON.stringify(options)}`);
				
				set((state) => {
					const services = [...state.secondStep.services];
					services[index] = {...services[index], slotOptions: options};
					return {
						secondStep: {
							...state.secondStep,
							services
						}
					};
				});
			},
			
			setSourceSlotOptions: (index, options) => {
				logger.debug(`useOrderStore [setSourceSlotOptions] - Index: ${index}, Options: ${JSON.stringify(options)}`);
				
				set((state) => {
					const services = [...state.secondStep.services];
					services[index] = {...services[index], sourceSlotOptions: options};
					
					return {
						secondStep: {
							...state.secondStep,
							services
						}
					};
				});
			},
			
			setFARSlotOptions: (index, options) => {
				logger.debug(`useOrderStore [setFARSlotOptions] - Index: ${index}, Options: ${JSON.stringify(options)}`);
				
				set((state) => {
					const services = [...state.secondStep.services];
					services[index] = {...services[index], farSlotOptions: options};
					
					return {
						secondStep: {
							...state.secondStep,
							services
						}
					};
				});
			},
			
			setPortOptions: (index, options) => {
				logger.debug(`useOrderStore [setPortOptions] - Index: ${index}, Options: ${JSON.stringify(options)} `);
				
				set((state) => {
					const services = [...state.secondStep.services];
					services[index] = {...services[index], portOptions: options};
					return {
						secondStep: {
							...state.secondStep,
							services
						}
					};
				});
			},
			
			setSourcePortOptions: (index, options) => {
				logger.debug(`useOrderStore [setSourcePortOptions] - Index: ${index}, Options: ${JSON.stringify(options)} `);
				
				set((state) => {
					const services = [...state.secondStep.services];
					services[index] = {...services[index], sourcePortOptions: options};
					return {
						secondStep: {
							...state.secondStep,
							services
						}
					};
				});
			},
			
			setFARPortOptions: (index, options) => {
				logger.debug(`useOrderStore [setFARPortOptions] - Index: ${index}, Options: ${JSON.stringify(options)} `);
				
				set((state) => {
					const services = [...state.secondStep.services];
					services[index] = {...services[index], farPortOptions: options};
					return {
						secondStep: {
							...state.secondStep,
							services
						}
					};
				});
			},
			
			// Sets source-related properties for a specific service
			setSourceProperties: (index, properties) => {
				set((state) => {
					const services = [...state.secondStep.services];
					services[index] = {...services[index], ...properties};
					return {
						secondStep: {
							...state.secondStep,
							services
						}
					};
				});
			},
			
			// Sets far-related properties for a specific service
			setFarProperties: (index, properties) => {
				set((state) => {
					const services = [...state.secondStep.services];
					services[index] = {...services[index], ...properties};
					return {
						secondStep: {
							...state.secondStep,
							services
						}
					};
				});
			},
			
			// Resets source and far properties for a specific service
			resetSourceAndFarProperties: (index) => {
				set((state) => ({
					secondStep: {
						...state.secondStep,
						services: state.secondStep.services.map((service, i) =>
							i === index
								? {
									...service,
									sourceCountry: '',
									sourceSite: '',
									sourceSiteDesc: '',
									sourceChassis: '',
									sourcePath: '',
									sourceSlot: '',
									sourceSlotId: '',
									sourceSlotName: '',
									sourcePort: '',
									sourcePortId: '',
									sourcePortStatus: '',
									sourceNewPortStatus: '',
									farCountry: '',
									farSite: '',
									farSiteDesc: '',
									farChassis: '',
									farPath: '',
									farSlot: '',
									farSlotId: '',
									farSlotName: '',
									farPort: '',
									farPortId: '',
									farPortStatus: '',
									farNewPortStatus: ''
								}
								: service
						)
					}
				}));
			},
			
			// End of changes for FAR and Source
			
			setSelectedItem: (key, selectedValue, rowIndex) => {
				logger.debug(
					`useOrderStore [setSelectedItem] - key: ${key}, selectedValue: ${selectedValue}, rowIndex: ${rowIndex} `
				);
				
				set((state) => {
					const services = [...state.secondStep.services];
					services[rowIndex] = {...services[rowIndex], [key]: selectedValue};
					return {
						secondStep: {
							...state.secondStep,
							services
						}
					};
				});
			},
			
			createNewServiceTemplate: (selectedResource, requestType, selectedService, selectedDevice, secondStep) => {
				logger.info(`useOrderStore [createNewServiceTemplate] -
								selectedResource: ${selectedResource},
                                requestType: ${requestType},
                                selectedService: ${selectedService},
                                selectedDevice: ${selectedDevice}
                                workRequired: ${selectedService} on ${selectedDevice}`);
				
				const baseTemplate = {
					...initialService,
					sourceCountry: secondStep.country,
					sourceSite: secondStep.site,
					sourceSiteDesc: secondStep.siteDesc,
					farCountry: secondStep.farCountry,
					farSite: secondStep.farSite,
					farSiteDesc: secondStep.farSiteDesc,
					resource: selectedResource,
					requestType: requestType,
					workRequired: selectedService,
					newCardStatus: '701',
					newCardStatusDescription: 'Planned'
				};
				
				if (selectedResource === 'Port') {
					return {
						...baseTemplate,
						newPortStatus: 'PLANNED',
						newPortStatusDescription: 'Planned',
						newServiceType: selectedService
					};
				} else if (selectedResource === 'Card') {
					return {
						...baseTemplate,
						newDefaultApp: selectedService
					};
				}
			},
			
			// Existing actions
			setOrderType: (orderType) => set({orderType}),
			setOrderData: (orderData) => set({orderData}),
			setServiceData: (serviceData) => set({serviceData}),
			setResourceData: (resourceData) => set({resourceData}),
			
			// SMOT specific actions
			setSmotData: (smotData) => set({smotData}),
			
			transformedData: {}, // Set initial state to an empty object
			setTransformedData: (data) => set({transformedData: data}),
			
			csvToJsonData: {},
			setCsvToJsonData: (data) => set({csvToJsonData: data}),
			
			serviceOrderId: null,
			setServiceOrderId: (serviceOrderId) => set({serviceOrderId}),
			
			newServiceIndex: null,
			setNewServiceIndex: (index) => set({newServiceIndex: index}),
			
			orderId: null,
			setOrderId: (orderId) => set({orderId}),
			
			// Reset action
			resetStore: () =>
				set({
					orderType: '',
					orderData: {},
					serviceData: {},
					resourceData: {},
					smotData: {}
				}),
			
			set: set,
			
			setData: ({step, data}) =>
				set((state) => ({
					...state,
					[stepVariant[step]]: data
				})),
			
			setVIPFlows: (serviceIndex, vipFlows) => {
				logger.debug(
					`useOrderStore [setVIPFlows] - serviceIndex: ${serviceIndex}, vipFlows: ${JSON.stringify(vipFlows)}`
				);
				
				set((state) => {
					const services = [...state.secondStep.services];
					const service = {...services[serviceIndex]};
					
					// Update only the vipFlows property for the selected service,  Ensure vipFlows is an array
					service.vipFlows = Array.isArray(vipFlows) ? vipFlows : [];
					services[serviceIndex] = service;
					
					return {
						secondStep: {
							...state.secondStep,
							services
						}
					};
				});
			},
			
			setDetailedVIPFlows: (serviceIndex, detailedVIPFlows) => {
				logger.debug(
					`useOrderStore [setDetailedVIPFlows] - serviceIndex: ${serviceIndex}, detailedVIPFlows: ${JSON.stringify(detailedVIPFlows)}`
				);
				
				set((state) => {
					const services = [...state.secondStep.services];
					const service = {...services[serviceIndex]};
					
					// Ensure detailedVIPFlows is an array before setting it
					service.detailedVIPFlows = Array.isArray(detailedVIPFlows) ? detailedVIPFlows : [];
					services[serviceIndex] = service;
					
					return {
						secondStep: {
							...state.secondStep,
							services
						}
					};
				});
			},
			
			setVIPAndDetailedFlows: (serviceIndex, vipFlows, detailedVIPFlows) => {
				logger.debug(
					`useOrderStore [setVIPAndDetailedFlows] - serviceIndex: ${serviceIndex}, vipFlows: ${JSON.stringify(vipFlows)}, detailedVIPFlows: ${JSON.stringify(detailedVIPFlows)}`
				);
				
				set((state) => {
					const services = [...state.secondStep.services];
					const service = {...services[serviceIndex]};
					
					service.vipFlows = Array.isArray(vipFlows) ? vipFlows : [];
					service.detailedVIPFlows = Array.isArray(detailedVIPFlows) ? detailedVIPFlows : [];
					services[serviceIndex] = service;
					
					return {
						secondStep: {
							...state.secondStep,
							services
						}
					};
				});
			},
			
			resetService: (index) => {
				logger.debug(`useOrderStore [resetService] - Index: ${index} `);
				
				set((state) => {
					const services = [...state.secondStep.services];
					services[index] = {...initialService};
					return {
						secondStep: {
							...state.secondStep,
							services
						}
					};
				});
			},
			
			resetCart: () => {
				logger.debug(`useOrderStore [resetCart]: Resetting services array to empty`);
				
				set((state) => {
					return {
						secondStep: {
							...state.secondStep,
							services: [] // Reset services to an empty array
						}
					};
				});
			},
			
			initializeService: (index) => {
				logger.debug(`useOrderStore [initializeService] - Index: ${index} `);
				
				set((state) => {
					const newService = {
						...initialService,
						sourceCountry: state.secondStep.country,
						sourceSite: state.secondStep.site,
						sourceSiteDesc: state.secondStep.siteDesc,
						farCountry: state.secondStep.farCountry,
						farSite: state.secondStep.farSite,
						farSiteDesc: state.secondStep.farSiteDesc
					};
					
					const services = [...state.secondStep.services];
					services[index] = newService;
					return {
						secondStep: {
							...state.secondStep,
							services
						}
					};
				});
			},
			
			resetChassisRelatedData: (index) => {
				logger.debug(`ServiceModal [resetChassisRelatedData] - Index: ${index}`);
				
				set((state) => ({
					secondStep: {
						...state.secondStep,
						services: state.secondStep.services.map((service, i) =>
							i === index
								? {
									...service,
									chassis: '',
									path: '',
									slot: '',
									slotId: '',
									slotName: '',
									card: '',
									cardStatus: '',
									newCardStatus: '701',
									cardStatusDescription: '',
									newCardStatusDescription: 'Planned',
									cardProjectNumber: '',
									cardNewProjectNumber: '',
									defaultApp: '',
									// newDefaultApp: selectedService,
									cardHandOff: '',
									newCardHandOff: '',
									cardHandOffDescription: '',
									newCardHandOffDescription: '',
									pinOut: '',
									newPinOut: '',
									pinOutDescription: '',
									newPinOutDescription: '',
									port: '',
									portId: '',
									portStatus: '',
									newPortStatus: 'PLANNED', // '562',
									portStatusDescription: '',
									newPortStatusDescription: 'Planned',
									engineeringName: '',
									friendlyName: '',
									portNo: '',
									portProjectNumber: '',
									portNewProjectNumber: '',
									portNewPortProjectNumber: '',
									totalFlows: 0,
									TxFlows: 0,
									RxFlows: 0,
									vipBlock: 0,
									newVIPBlock: 0,
									serviceType: '',
									// newServiceType: selectedService,
									handOff: '',
									newHandOff: '',
									handOffDescription: '',
									newHandOffDescription: '',
									serviceUse: '',
									newServiceUse: '',
									serviceUseDescription: '',
									newServiceUseDescription: '',
									gmnInterfaceType: '',
									newGMNInterfaceType: '',
									phyInterfaceType: '',
									newPhyInterfaceType: '',
									physicalInterfaceType: '',
									slotOptions: [],
									portOptions: [],
									vipFlows: [],
									detailedVIPFlows: []
								}
								: service
						)
					}
				}));
			},
			
			resetSlotRelatedData: (index) => {
				set((state) => ({
					secondStep: {
						...state.secondStep,
						services: state.secondStep.services.map((service, i) =>
							i === index
								? {
									...service,
									slot: '',
									slotId: '',
									slotName: '',
									card: '',
									cardStatus: '',
									newCardStatus: '701',
									cardStatusDescription: '',
									newCardStatusDescription: 'Planned',
									cardProjectNumber: '',
									cardNewProjectNumber: '',
									defaultApp: '',
									// newDefaultApp: '',
									cardHandOff: '',
									newCardHandOff: '',
									cardHandOffDescription: '',
									newCardHandOffDescription: '',
									pinOut: '',
									newPinOut: '',
									pinOutDescription: '',
									newPinOutDescription: '',
									port: '',
									portId: '',
									portStatus: '',
									newPortStatus: 'PLANNED', // '562',
									portStatusDescription: '',
									newPortStatusDescription: 'Planned',
									engineeringName: '',
									friendlyName: '',
									portNo: '',
									portProjectNumber: '',
									portNewProjectNumber: '',
									portNewPortProjectNumber: '',
									totalFlows: 0,
									TxFlows: 0,
									RxFlows: 0,
									vipBlock: 0,
									newVIPBlock: 0,
									serviceType: '',
									// newServiceType: selectedService,
									handOff: '',
									newHandOff: '',
									handOffDescription: '',
									newHandOffDescription: '',
									serviceUse: '',
									newServiceUse: '',
									serviceUseDescription: '',
									newServiceUseDescription: '',
									gmnInterfaceType: '',
									newGMNInterfaceType: '',
									phyInterfaceType: '',
									newPhyInterfaceType: '',
									physicalInterfaceType: '',
									portOptions: [],
									vipFlows: [],
									detailedVIPFlows: []
								}
								: service
						)
					}
				}));
			},
			
			resetPortRelatedData: (index) => {
				logger.debug(`resetPortRelatedData - Index: ${index}`);
				
				set((state) => ({
					secondStep: {
						...state.secondStep,
						services: state.secondStep.services.map((service, i) =>
							i === index
								? {
									...service,
									port: '',
									portId: '',
									portStatus: '',
									newPortStatus: 'PLANNED', // '562',
									portStatusDescription: '',
									newPortStatusDescription: 'Planned',
									engineeringName: '',
									friendlyName: '',
									portNo: '',
									portProjectNumber: '',
									portNewProjectNumber: '',
									portNewPortProjectNumber: '',
									totalFlows: 0,
									TxFlows: 0,
									RxFlows: 0,
									vipBlock: 0,
									newVIPBlock: 0,
									serviceType: '',
									// newServiceType: selectedService,
									handOff: '',
									newHandOff: '',
									handOffDescription: '',
									newHandOffDescription: '',
									serviceUse: '',
									newServiceUse: '',
									serviceUseDescription: '',
									newServiceUseDescription: '',
									gmnInterfaceType: '',
									newGMNInterfaceType: '',
									phyInterfaceType: '',
									newPhyInterfaceType: '',
									physicalInterfaceType: '',
									vipFlows: [], // Clear VIP flows
									detailedVIPFlows: [] // Clear detailed VIP flows as well
								}
								: service
						)
					}
				}));
			},
			
			resetSourceChassisRelatedData: (index) => {
				logger.debug(`resetSourceChassisRelatedData - Index: ${index}`);
				
				set((state) => ({
					secondStep: {
						...state.secondStep,
						services: state.secondStep.services.map((service, i) =>
							i === index ? resetProperties(service, sourceChassisProperties) : service
						)
					}
				}));
			},
			
			resetFarChassisRelatedData: (index) => {
				logger.debug(`resetFarChassisRelatedData - Index: ${index}`);
				
				set((state) => ({
					secondStep: {
						...state.secondStep,
						services: state.secondStep.services.map((service, i) =>
							i === index ? resetProperties(service, farChassisProperties) : service
						)
					}
				}));
			},
			
			resetSourceSlotRelatedData: (index) => {
				logger.debug(`resetSourceSlotRelatedData - Index: ${index}`);
				
				set((state) => ({
					secondStep: {
						...state.secondStep,
						services: state.secondStep.services.map((service, i) =>
							i === index ? resetProperties(service, sourceSlotProperties) : service
						)
					}
				}));
			},
			
			resetFarSlotRelatedData: (index) => {
				logger.debug(`resetFarSlotRelatedData - Index: ${index}`);
				
				set((state) => ({
					secondStep: {
						...state.secondStep,
						services: state.secondStep.services.map((service, i) =>
							i === index ? resetProperties(service, farSlotProperties) : service
						)
					}
				}));
			},
			
			resetSourcePortRelatedData: (index) => {
				logger.debug(`resetSourcePortRelatedData - Index: ${index}`);
				
				set((state) => ({
					secondStep: {
						...state.secondStep,
						services: state.secondStep.services.map((service, i) =>
							i === index ? resetProperties(service, sourcePortProperties) : service
						)
					}
				}));
			},
			
			resetFarPortRelatedData: (index) => {
				logger.debug(`resetFarPortRelatedData - Index: ${index}`);
				
				set((state) => ({
					secondStep: {
						...state.secondStep,
						services: state.secondStep.services.map((service, i) =>
							i === index ? resetProperties(service, farPortProperties) : service
						)
					}
				}));
			}
		})
	)
);

export default useOrderStore;
