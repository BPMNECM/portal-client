import {create} from 'zustand';
import {devtools, persist} from 'zustand/middleware';
import {getLogger} from '@/utils/logger/logger';
// import create from "zustand"; // Removed duplicate import

const logger = getLogger('useFormStore:');

const stepVariant = {
	1: 'firstStep',
	2: 'secondStep',
	3: 'reviewStep',
	4: 'submitStep'
};

const initialService = {
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
	slot: '',
	slotId: '',
	slotName: '',
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
	totalFlows: 0,
	TxFlows: 0,
	RxFlows: 0,
	vipBlock: '',
	newVIPBlock: '',
	serviceType: '',
	newServiceType: '',
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
	vipFlows: [],
	detailedVIPFlows: [],
	slotOptions: [],
	portOptions: [],
	farSlotOptions: [],
	farPortOptions: []
};

const useFormStore = create(
	devtools(
		persist(
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
				
				addService: (newService) => {
					logger.debug(`useFormStore [addService] - newService: ${JSON.stringify(newService)}`);
					
					set((state) => {
						const services =
							state.secondStep.services.length === 1 &&
							Object.values(state.secondStep.services[0]).every(
								(val) =>
									val === '' || val === 0 || val === null || (Array.isArray(val) && val.length === 0)
							)
								? [newService] // Replace the initial default service
								: [...state.secondStep.services, newService]; // Add to the existing services
						
						return {
							secondStep: {
								...state.secondStep,
								services
							}
						};
					});
				},
				
				removeService: (index) => {
					logger.debug(`useFormStore [removeService] - Index: ${index} `);
					
					set((state) => ({
						secondStep: {
							...state.secondStep,
							services: state.secondStep.services.filter((_, i) => i !== index)
						}
					}));
				},
				
				updateService: (index, updatedService) => {
					logger.debug(`useFormStore [updateService] - Index: ${index}, updatedService: ${JSON.stringify(updatedService)}`);
					
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
					logger.debug(`useFormStore [setSelectedCountry] - country: ${country} `);
					
					set((state) => ({
						secondStep: {
							...state.secondStep,
							country
						}
					}));
				},
				
				setSelectedFARCountry: (farCountry) => {
					logger.debug(`useFormStore [setSelectedFARCountry] - farCountry: ${farCountry} `);
					
					set((state) => ({
						secondStep: {
							...state.secondStep,
							farCountry: farCountry
						}
					}));
				},
				
				setSourceCountry: (serviceIndex, country) => {
					logger.debug(`useFormStore [setSelectedSite] - serviceIndex: ${serviceIndex}, country: ${country} `);
					
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
					logger.debug(`useFormStore [setSelectedSite] - site: ${site}`);
					
					set((state) => ({
						secondStep: {
							...state.secondStep,
							site
						}
					}));
				},
				
				setSelectedFARSite: (farSite) => {
					logger.debug(`useFormStore [setSelectedFARSite] - farSite: ${farSite}`);
					
					set((state) => ({
						secondStep: {
							...state.secondStep,
							farSite: farSite
						}
					}));
				},
				
				setSiteOptions: (options) => {
					logger.debug(`useFormStore [setSiteOptions] - Options: ${JSON.stringify(options)}`);
					
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
					logger.debug(`useFormStore [setFARSiteOptions] - Options: ${JSON.stringify(options)}`);
					
					set((state) => ({
						secondStep: {
							...state.secondStep,
							farSiteOptions: options
						}
					}));
				},
				
				setChassisOptions: (options) => {
					logger.debug(`useFormStore [setChassisOptions] - Options: ${JSON.stringify(options)}`);
					
					set((state) => ({
						secondStep: {
							...state.secondStep,
							chassisOptions: options
						}
					}));
				},
				
				setSourceChassisOptions: (options) => {
					logger.debug(`useFormStore [setSourceChassisOptions] - Options: ${JSON.stringify(options)}`);
					
					set((state) => ({
						secondStep: {
							...state.secondStep,
							sourceChassisOptions: options
						}
					}));
				},
				
				setFARChassisOptions: (options) => {
					logger.debug(`useFormStore [setFARChassisOptions] - Options: ${JSON.stringify(options)}`);
					
					set((state) => ({
						secondStep: {
							...state.secondStep,
							farChassisOptions: options
						}
					}));
				},
				
				setSlotOptions: (index, options) => {
					logger.debug(`useFormStore [setSlotOptions] - Index: ${index}, Options: ${JSON.stringify(options)}`);
					
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
					logger.debug(`useFormStore [setSourceSlotOptions] - Index: ${index}, Options: ${JSON.stringify(options)}`);
					
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
					logger.debug(`useFormStore [setFARSlotOptions] - Index: ${index}, Options: ${JSON.stringify(options)}`);
					
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
					logger.debug(`useFormStore [setPortOptions] - Index: ${index}, Options: ${JSON.stringify(options)} `);
					
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
					logger.debug(`useFormStore [setSourcePortOptions] - Index: ${index}, Options: ${JSON.stringify(options)} `);
					
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
					logger.debug(`useFormStore [setFARPortOptions] - Index: ${index}, Options: ${JSON.stringify(options)} `);
					
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
										newSourcePortStatus: '',
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
										newFarPortStatus: ''
									}
									: service
							)
						}
					}));
				},
				
				
				// End of changes for FAR and Source
				
				setSelectedItem: (key, selectedValue, rowIndex) => {
					logger.debug(`useFormStore [setSelectedItem] - key: ${key}, selectedValue: ${selectedValue}, rowIndex: ${rowIndex} `);
					
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
				
				createNewServiceTemplate: (selectedResource, action, selectedService, secondStep) => {
					logger.debug(`useFormStore [createNewServiceTemplate] - selectedResource: ${selectedResource},
                                action/requestType: ${action}, selectedService/workRequired: ${selectedService} `);
					
					
					const baseTemplate = {
						...initialService,
						sourceCountry: secondStep.country,
						sourceSite: secondStep.site,
						sourceSiteDesc: secondStep.siteDesc,
						farCountry: secondStep.farCountry,
						farSite: secondStep.farSite,
						farSiteDesc: secondStep.farSiteDesc,
						resource: selectedResource,
						requestType: action,
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
				
				set: set,
				
				setData: ({step, data}) =>
					set((state) => ({
						...state,
						[stepVariant[step]]: data
					})),
				
				setVIPFlows: (serviceIndex, vipFlows) => {
					logger.debug(`useFormStore [setVIPFlows] - serviceIndex: ${serviceIndex}, vipFlows: ${JSON.stringify(vipFlows)}`);
					
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
					logger.debug(`useFormStore [setDetailedVIPFlows] - serviceIndex: ${serviceIndex}, detailedVIPFlows: ${JSON.stringify(detailedVIPFlows)}`);
					
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
					logger.debug(`useFormStore [setVIPAndDetailedFlows] - serviceIndex: ${serviceIndex}, vipFlows: ${JSON.stringify(vipFlows)}, detailedVIPFlows: ${JSON.stringify(detailedVIPFlows)}`);
					
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
					logger.debug(`useFormStore [resetService] - Index: ${index} `);
					
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
					logger.debug(`useFormStore [resetCart]: Resetting services array to empty`);
					
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
					logger.debug(`useFormStore [initializeService] - Index: ${index} `);
					
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
					logger.debug(`ServiceModal [resetChassisRelatedData] - Index: ${(index)}`);
					
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
										newPortStatus: 'PLANNED',  // '562',
										portStatusDescription: '',
										newPortStatusDescription: 'Planned',
										engineeringName: '',
										friendlyName: '',
										portNo: '',
										portProjectNumber: '',
										portNewProjectNumber: '',
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
										newPortStatus: 'PLANNED',  // '562',
										portStatusDescription: '',
										newPortStatusDescription: 'Planned',
										engineeringName: '',
										friendlyName: '',
										portNo: '',
										portProjectNumber: '',
										portNewProjectNumber: '',
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
										newPortStatus: 'PLANNED',  // '562',
										portStatusDescription: '',
										newPortStatusDescription: 'Planned',
										engineeringName: '',
										friendlyName: '',
										portNo: '',
										portProjectNumber: '',
										portNewProjectNumber: '',
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
										vipFlows: [],  // Clear VIP flows
										detailedVIPFlows: []  // Clear detailed VIP flows as well
									}
									: service
							)
						}
					}));
				}
				
			}),
			{
				name: 'order-form-store', // Key in storage
				storage: {
					getItem: (name) => JSON.parse(localStorage.getItem(name)),
					setItem: (name, value) => localStorage.setItem(name, JSON.stringify(value)),
					removeItem: (name) => localStorage.removeItem(name)
				}
			}
		),
		{name: 'FormStore'} // Devtools name
	)
);

export default useFormStore;
