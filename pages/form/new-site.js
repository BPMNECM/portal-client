import {ChevronDownIcon} from '@heroicons/react/16/solid';
import React, {Fragment, useEffect, useState} from 'react';
import {Notification, rem, Space} from '@mantine/core';
import Wizard from '@/components/Forms/Wizard';
import {useRouter} from 'next/router';
import {FormProvider, useForm} from 'react-hook-form';
import {notifications, showNotification} from '@mantine/notifications';
import useOrderStore from '@/store/useOrderStore';
import SignInPrompt from '@/pages/misc/not-signed';
import {getLogger} from '@/utils/logger/logger';
import {countriesData} from '@/shared/data/countries-data';
import useFormRequest from '@/hooks/use-form-request';
import {IconCheck, IconX} from '@tabler/icons-react';
import {filterOptionsByDevice} from '@/utils/resource-helper';
import {yupResolver} from '@hookform/resolvers/yup';
import {secondStepSchema} from '@/utils/lib/yup';
import {isFormDataModified} from '@/utils/form-utils';

const logger = getLogger('NewSiteDetails');

const NewSiteDetails = ({countries, currentUser, error}) => {
	logger.info(`NewSiteDetails - Adding Services to the Order by User: ${currentUser?.name}`);
	if (!currentUser) return <SignInPrompt/>;
	
	const router = useRouter();
	const {
		secondStep,
		addService,
		set,
		setData,
		setSelectedCountry,
		setSelectedFARCountry,
		setSelectedSite,
		setSelectedFARSite,
		setSiteOptions,
		setFARSiteOptions,
		setChassisOptions,
		setFARChassisOptions,
		removeService,
		createNewServiceTemplate,
		setSelectedItem,
		resetService,
		resetCart,
		newServiceIndex,
		setNewServiceIndex
	} = useOrderStore();
	const xIcon = <IconX style={{width: rem(20), height: rem(20)}}/>;
	
	const [countryOptions, setCountryOptions] = useState(countries || []);
	const [isLoadingCountry, setIsLoadingCountry] = useState(!countries);
	// const [selectedCountry, setSelectedCountry] = useState('');
	// const [countries, setCountries] = useState([]);
	const [country, setCountry] = useState(secondStep.country || '');
	
	const [isLoadingSites, setIsLoadingSites] = useState(false);
	const [siteCode, setSiteCode] = useState('');
	const [siteName, setSiteName] = useState('');
	
	
	const [friendlyName, setFriendlyName] = useState('');
	const [address, setAddress] = useState({street: '', city: '', postcode: ''});
	
	const {doRequest: doSitesRequest, errors: sitesRequestErrors} = useFormRequest();
	const {doRequest: doArchitectureRequest, errors: architectureRequestErrors} = useFormRequest();
	const {doRequest: doCountriesRequest, errors: countriesRequestErrors} = useFormRequest();
	
	const [newServiceButtonDisabled, setNewServiceButtonDisabled] = useState(true);
	const [architectureTypes, setArchitectureTypes] = useState([]);
	const [loading, setLoading] = useState(true);
	
	useEffect(() => {
		if (process.env.NEXT_PUBLIC_isLocal === 'true') {
			countries = countriesData;
			setCountryOptions(countries);
			setIsLoadingCountry(false);
		} else if (!countries || countries.length === 0 || error) {
			showNotification({
				title: 'Error',
				message: 'Failed to fetch the list of Countries from Inventory',
				color: 'red'
			});
		}
	}, [countries, error]);
	
	useEffect(() => {
		if (secondStep.country) {
			setCountry(secondStep.country);
		}
		if (secondStep.site) {
			setSiteCode(secondStep.site);
		}
		setNewServiceButtonDisabled(!(secondStep.country && secondStep.site));
	}, [secondStep.country, secondStep.site]);
	
	const handleDeviceChange = (event) => {
		const device = event.target.value;
		setSelectedDevice(device);
		const filteredServices = filterOptionsByDevice(device);
		setFilteredPortServices(filteredServices);
	};
	
	const handleResourceChange = (event) => {
		const resource = event.target.value;
		setSelectedResource(resource);
		
		if (resource === 'Card') {
			setSelectedPortService('');
		} else if (resource === 'Port') {
			setSelectedCardService('');
		}
		resetFarFields();
		setFarFieldsDisabled(true);
		setShowFARSelectionWarning(false);
	};
	
	const handleServiceChange = (event) => {
		const service = event.target.value;
		
		if (selectedResource === 'Card') {
			setSelectedCardService(service);
			resetFarFields();
		} else if (selectedResource === 'Port') {
			setSelectedPortService(service);
			if (service === 'SEN Data' || service === 'Media Data') {
				setFarFieldsDisabled(false);
				setShowFARSelectionWarning(true);
				openFarFocus();
			} else {
				resetFarFields();
				closeFarFocus();
			}
		}
	};
	
	useEffect(() => {
		if (newServiceIndex !== null) {
			setSelectedServiceIndex(newServiceIndex);
			setIsOpen(true);
			logger.debug(`SecondStep [useEffect] - Opening modal for service at index: ${newServiceIndex}`);
			setNewServiceIndex(null); // Reset newServiceIndex after opening modal
		}
	}, [newServiceIndex, setNewServiceIndex]);
	
	const handleNewServiceClick = (event) => {
		event.preventDefault();
		
		if ((selectedResource === 'Card' && !selectedCardService) ||
			(selectedResource === 'Port' && !selectedPortService)) {
			notifications.show({
				title: 'Attention!',
				message: 'Please select a Service from the Catalog before proceeding.',
				color: 'red',
				withCloseButton: true,
				autoClose: 5000,
				icon: <IconX size="1.1rem"/>
			});
			return;
		}
		
		if (showFARSelectionWarning && (!farCountry || !farSiteCode)) {
			logger.debug('Show alert if FAR fields are not selected');
			return;
		}
		
		if (selectedResource === 'Port' &&
			(selectedPortService === 'SEN Data' || selectedPortService === 'Media Data')
		) {
			logger.info('selectedPortService: ' + selectedPortService);
			
			if (!farCountry || !farSiteCode) {
				logger.debug('Show alert if FAR fields are not selected');
				notifications.show({
					title: 'Attention!',
					message: 'Please select FAR location details to add this service.',
					color: 'red',
					withCloseButton: true,
					autoClose: 5000,
					icon: <IconX size="1.1rem"/>
				});
				return;
			}
		}
		
		// Initialize the service
		const newService = createNewServiceTemplate(
			selectedResource,
			selectedResource === 'Card' ? 'newServiceToCard' : 'newServiceToPort',
			selectedResource === 'Card' ? selectedCardService : selectedPortService,
			selectedDevice,
			secondStep
		);
		
		// Get current service count to determine new index
		const newIndex = secondStep.services.length; // Auto-increment index
		newService.index = newIndex; // Assign the new index
		newService.requestType = selectedResource === 'Port' ? selectedPortService : selectedCardService;
		addService(newService);
		logger.debug(`SecondStep [handleNewServiceClick] - newServiceIndex: ${newServiceIndex}, selectedResource: ${selectedResource}`);
	};
	
	const handleCloseModal = (index) => {
		logger.debug(`SecondStep [handleCloseModal] - Index: ${index}, currentIndex: ${currentIndex}, selectedServiceIndex: ${selectedServiceIndex} `);
		setSelectedCardService('');
		setSelectedPortService('');
		removeService(index);
		setIsOpen(false);
		
		if (currentIndex > 0) {
			setCurrentIndex(currentIndex - 1);
		}
		
		setSelectedServiceIndex(null);
		logger.debug(`SecondStep [handleCloseModal] - currentIndex: ${currentIndex}, selectedServiceIndex: ${selectedServiceIndex}`);
	};
	
	const handleAddService = (service, index) => {
		logger.debug(`SecondStep [handleAddService] - Index: ${index}, currentIndex: ${currentIndex}, Service: ${service} `);
		setIsOpen(false);
	};
	
	const handleCountryChange = async (selectedCountry, field) => {
		logger.debug(`SecondStep [handleCountryChange] - selectedCountry:  ${selectedCountry}, field: ${field}`);
		
		if (field === 'country') {
			setCountry(selectedCountry);
			setSelectedCountry(selectedCountry);
			setSiteCode('');
			setSiteDescription('');
			setSelectedResource('');
			setSelectedCardService('');
			setSelectedPortService('');
			resetFarFields();
			setNewServiceButtonDisabled(true);
			setSiteOptions([]);
			setChassisOptions([]);
			setIsLoadingSites(true);
			
			set((state) => ({
				...state,
				secondStep: {
					...state.secondStep,
					country: selectedCountry,
					siteOptions: [],
					site: '',
					siteDesc: '',
					chassisOptions: []
					// services: []
				}
			}));
			
			if (selectedCountry && selectedCountry !== '') {
				const url = `${process.env.NEXT_PUBLIC_DNA_HOST || ''}/api/dna/sites/getSites?country=${selectedCountry}&network=GMN`;
				logger.debug(`handleCountryChange - selectedCountry: ${secondStep.country}, doSitesRequest url:  ${url}`);
				
				await doSitesRequest({
					url: url,
					method: 'get',
					body: {},
					onSuccess: (sites) => {
						logger.debug(`API Success - Sites fetched: ${JSON.stringify(sites)}`);
						setSiteOptions(sites.length > 0 ? sites : []);
						setIsLoadingSites(false);
					},
					onError: (error) => {
						logger.error(`API Error - Failed to fetch sites: ${JSON.stringify(error)}`);
						setIsLoadingSites(false);
					}
				});
			}
			
		} else if (field === 'farCountry') {
			setFarCountry(selectedCountry);
			setSelectedFARCountry(selectedCountry);
			setFarSiteCode('');
			setFarSiteDescription('');
			setFARSiteOptions([]);
			setFARChassisOptions([]);
			setIsLoadingFARSites(true);
			
			set((state) => ({
				...state,
				secondStep: {
					...state.secondStep,
					farCountry: selectedCountry,
					farSiteOptions: [],
					farSite: '',
					farSiteDesc: '',
					farChassisOptions: []
					// services: []
				}
			}));
			
			if (selectedCountry && selectedCountry !== '') {
				const url = `${process.env.NEXT_PUBLIC_DNA_HOST || ''}/api/dna/sites/getSites?country=${selectedCountry}&network=GMN`;
				logger.debug(`handleCountryChange - selectedCountry: ${secondStep.farCountry}, doSitesRequest url:  ${url}`);
				
				await doSitesRequest({
					url: url,
					method: 'get',
					body: {},
					onSuccess: (farSites) => {
						logger.debug(`API Success - FAR Sites fetched: ${JSON.stringify(farSites)}`);
						setFARSiteOptions(farSites.length > 0 ? farSites : []);
						setIsLoadingFARSites(false);
					}
				});
			}
		}
		
	};
	
	const handleSiteChange = async (selectedSite, siteType) => {
		logger.debug(`SecondStep [handleSiteChange] - selectedSite: ${JSON.stringify(selectedSite)}, siteType: ${siteType}`);
		
		if (siteType === 'site') {
			setSiteCode(selectedSite);
			setSelectedSite(selectedSite);
			setChassisOptions([]);
			setIsLoadingChassis(true);
			
			set((state) => ({
				...state,
				secondStep: {
					...state.secondStep,
					site: selectedSite,
					siteDesc: secondStep.siteOptions.find((opt) => opt.code === selectedSite)?.description || '',
					chassisOptions: []
					// services: []
				}
			}));
			
			if (selectedSite && selectedSite !== '') {
				const url = `${process.env.NEXT_PUBLIC_DNA_HOST || ''}/api/dna/chassis/getChassis?siteCode=${selectedSite}`;
				logger.debug(`SecondStep [handleSiteChange] - Site: ${secondStep.site}, selectedSite: ${selectedSite}, url: ${url} `);
				
				await doChassisRequest({
					url: url,
					method: 'get',
					body: {},
					onSuccess: (chassis) => {
						logger.debug(`API Success - Chassis fetched: ${JSON.stringify(chassis)}`);
						setChassisOptions(chassis.length > 0 ? chassis : []);
						setIsLoadingChassis(false);
					}
				});
			}
			
		} else if (siteType === 'farSite') {
			setSelectedFARSite(selectedSite);
			setFarSiteCode(selectedSite);
			setFARChassisOptions([]);
			setIsLoadingFARChassis(true);
			
			set((state) => ({
				...state,
				secondStep: {
					...state.secondStep,
					farSite: selectedSite,
					farSiteDesc: secondStep.farSiteOptions.find((opt) => opt.code === selectedSite)?.description || '',
					farChassisOptions: []
					// services: []
				}
			}));
			
			if (selectedSite && selectedSite !== '') {
				const url = `${process.env.NEXT_PUBLIC_DNA_HOST || ''}/api/dna/chassis/getChassis?siteCode=${selectedSite}`;
				logger.debug(`SecondStep [handleSiteChange] - Site: ${secondStep.farSite}, selectedSite: ${selectedSite}, url: ${url} `);
				
				await doChassisRequest({
					url: url,
					method: 'get',
					body: {},
					onSuccess: (farChassis) => {
						logger.debug(`API Success - FAR Chassis fetched: ${JSON.stringify(farChassis)}`);
						setFARChassisOptions(farChassis.length > 0 ? farChassis : []);
						setIsLoadingFARChassis(false);
					}
				});
			}
		}
		
	};
	
	const methods = useForm({
		mode: 'onSubmit',
		resolver: yupResolver(secondStepSchema),
		defaultValues: {
			country: secondStep.country,
			site: secondStep.site,
			siteDesc: secondStep.siteDesc,
			farCountry: secondStep.farCountry,
			farSite: secondStep.farSite,
			farSiteDesc: secondStep.farSiteDesc,
			services: secondStep.services.map((service) => ({
				...service,
				sourceCountry: service.sourceCountry,
				sourceSite: service.sourceSite,
				sourceSiteDesc: service.sourceSiteDesc,
				farCountry: service.farCountry,
				farSite: service.farSite,
				farSiteDesc: service.farSiteDesc,
				resource: service.resource,
				requestType: service.requestType,
				workRequired: service.workRequired,
				chassis: service.chassis,
				path: service.path,
				slot: service.slot,
				slotId: service.slotId,
				slotName: service.slotName,
				card: service.card,
				cardStatus: service.cardStatus,
				newCardStatus: service.newCardStatus,
				cardStatusDescription: service.cardStatusDescription,
				newCardStatusDescription: service.newCardStatusDescription,
				cardProjectNumber: service.cardProjectNumber,
				cardNewProjectNumber: service.cardNewProjectNumber,
				defaultApp: service.defaultApp,
				newDefaultApp: service.newDefaultApp,
				cardHandOff: service.cardHandOff,
				newCardHandOff: service.newCardHandOff,
				cardHandOffDescription: service.cardHandOffDescription,
				newCardHandOffDescription: service.newCardHandOffDescription,
				pinOut: service.pinOut,
				newPinOut: service.newPinOut,
				pinOutDescription: service.pinOutDescription,
				newPinOutDescription: service.newPinOutDescription,
				port: service.port,
				portId: service.portId,
				portStatus: service.portStatus,
				newPortStatus: service.newPortStatus,
				portStatusDescription: service.portStatusDescription,
				newPortStatusDescription: service.newPortStatusDescription,
				engineeringName: service.engineeringName,
				friendlyName: service.friendlyName,
				portNo: service.portNo,
				portProjectNumber: service.portProjectNumber,
				portNewProjectNumber: service.portNewProjectNumber,
				totalFlows: service.totalFlows,
				TxFlows: service.TxFlows,
				RxFlows: service.RxFlows,
				vipBlock: service.vipBlock,
				newVIPBlock: service.newVIPBlock,
				serviceType: service.serviceType,
				newServiceType: service.newServiceType,
				handOff: service.handOff,
				newHandOff: service.newHandOff,
				handOffDescription: service.handOffDescription,
				newHandOffDescription: service.newHandOffDescription,
				serviceUse: service.serviceUse,
				newServiceUse: service.newServiceUse,
				serviceUseDescription: service.serviceUseDescription,
				newServiceUseDescription: service.newServiceUseDescription,
				gmnInterfaceType: service.gmnInterfaceType,
				newGMNInterfaceType: service.newGMNInterfaceType,
				phyInterfaceType: service.phyInterfaceType,
				newPhyInterfaceType: service.newPhyInterfaceType,
				physicalInterfaceType: service.physicalInterfaceType,
				vipFlows: service.vipFlows
			}))
		}
	});
	
	const {handleSubmit, formState: {errors, isValid, isSubmitting, isDirty}} = methods;
	
	const onSubmit = async (data, event) => {
		event.preventDefault();
		logger.info(`SecondStep [onSubmit] - data: ${JSON.stringify(data)} `);
		
		const methodData = methods.getValues();
		
		logger.info(`SecondStep [onSubmit] -
						Number of services added: ${methodData.services.length},
						Form Errors: ${JSON.stringify(errors)},
						isValid: ${isValid}`);
		
		
		logger.info(`SecondStep [onSubmit] - data: ${JSON.stringify(data)} `);
		logger.info(`SecondStep [onSubmit] - methodData: ${JSON.stringify(methodData)} `);
		
		if (methodData.services.length === 0) {
			showNotification({
				icon: <IconX/>,
				color: 'red',
				title: 'Bummer!',
				message: 'No services added to the order. Please add at least one Service to proceed!',
				position: 'top-center',
				withCloseButton: true
			});
			return;
		} else if (!isValid) {
			showNotification({
				icon: <IconX/>,
				color: 'red',
				title: 'Invalid Service',
				message: 'Please check if at least one service has all required fields!',
				position: 'top-center',
				withCloseButton: true
			});
			return;
		}
		
		showNotification({
			icon: <IconCheck/>,
			color: 'blue',
			title: 'All good!',
			message: 'Your services were successfully added to the order!',
			position: 'top-center',
			withCloseButton: true
		});
		
		
		// Use `setData` from Zustand with dynamic step handling
		setData({
			step: 2,
			data: {
				...secondStep,
				country: secondStep.country,
				site: secondStep.site,
				siteDesc: secondStep.siteDesc,
				farCountry: secondStep.farCountry,
				farSite: secondStep.farSite,
				farSiteDesc: secondStep.farSiteDesc,
				services: secondStep.services.map((service, index) => ({
					...service,
					sourceCountry: service.sourceCountry,
					sourceSite: service.sourceSite,
					sourceSiteDesc: service.sourceSiteDesc,
					farCountry: service.farCountry,
					farSite: service.farSite,
					farSiteDesc: service.farSiteDesc,
					resource: service.resource,
					requestType: service.requestType,
					workRequired: service.workRequired,
					chassis: service.chassis,
					path: service.path,
					slot: service.slot,
					slotId: service.slotId,
					slotName: service.slotName,
					card: service.card,
					cardStatus: service.cardStatus,
					newCardStatus: service.newCardStatus,
					cardStatusDescription: service.cardStatusDescription,
					newCardStatusDescription: service.newCardStatusDescription,
					cardProjectNumber: service.cardProjectNumber,
					cardNewProjectNumber: service.cardNewProjectNumber,
					defaultApp: service.defaultApp,
					newDefaultApp: service.newDefaultApp,
					cardHandOff: service.cardHandOff,
					newCardHandOff: service.newCardHandOff,
					cardHandOffDescription: service.cardHandOffDescription,
					newCardHandOffDescription: service.newCardHandOffDescription,
					pinOut: service.pinOut,
					newPinOut: service.newPinOut,
					pinOutDescription: service.pinOutDescription,
					newPinOutDescription: service.newPinOutDescription,
					port: service.port,
					portId: service.portId,
					portStatus: service.portStatus,
					newPortStatus: service.newPortStatus,
					portStatusDescription: service.portStatusDescription,
					newPortStatusDescription: service.newPortStatusDescription,
					engineeringName: service.engineeringName,
					friendlyName: service.friendlyName,
					portNo: service.portNo,
					portProjectNumber: service.portProjectNumber,
					portNewProjectNumber: service.portNewProjectNumber,
					totalFlows: service.totalFlows,
					TxFlows: service.TxFlows,
					RxFlows: service.RxFlows,
					vipBlock: service.vipBlock,
					newVIPBlock: service.newVIPBlock,
					serviceType: service.serviceType,
					newServiceType: service.newServiceType,
					handOff: service.handOff,
					newHandOff: service.newHandOff,
					handOffDescription: service.handOffDescription,
					newHandOffDescription: service.newHandOffDescription,
					serviceUse: service.serviceUse,
					newServiceUse: service.newServiceUse,
					serviceUseDescription: service.serviceUseDescription,
					newServiceUseDescription: service.newServiceUseDescription,
					gmnInterfaceType: service.gmnInterfaceType,
					newGMNInterfaceType: service.newGMNInterfaceType,
					phyInterfaceType: service.phyInterfaceType,
					newPhyInterfaceType: service.newPhyInterfaceType,
					physicalInterfaceType: service.physicalInterfaceType,
					vipFlows: service.vipFlows
				}))
			}
		});
		
		await router.push('/form/review-step');
	};
	
	const onPrevious = () => {
		logger.debug('SecondStep [onPrevious] - When Back button is clicked, then go to previous page..');
		
		const isDataUpdated = isDirty;
		if (isDataUpdated) {
			showNotification({
				title: 'Changes Detected',
				withCloseButton: true,
				position: 'top-center',
				message: 'You have unsaved changes. Consider saving before going back.',
				color: 'blue'
			});
		}
		
		const isModified = isFormDataModified(secondStep, secondStep);
		if (isModified) {
			// Update Zustand store with modified data
			setData({step: 2, data: secondStep});
			// Submit data to API if needed
			// submitFormData(secondStep);
		}
		showNotification({
			title: 'Back',
			withCloseButton: true,
			position: 'top-center',
			message: 'You have navigated back!',
			color: 'blue'
		});
		router.back();
	};
	
	const onCancel = () => {
		logger.debug('SecondStep [onCancel] - When Cancel button is clicked, then go to Dashboard page..');
		showNotification({
			title: 'Unsaved Changes',
			message: 'Save your data before leaving. Continue to cancel or Save & go to the dashboard.',
			color: 'orange',
			withCloseButton: true,
			position: 'top-center',
			autoClose: false,
			actions: [
				{
					label: 'Continue to cancel',
					onClick: () => router.push('/')
				},
				{
					label: 'Save & go',
					onClick: () => {
						// Logic for saving the data
						showNotification({
							title: 'Data Saved',
							withCloseButton: true,
							position: 'top-center',
							message: 'Your data has been saved successfully.',
							color: 'blue'
						});
						router.push('/');
					}
				}
			]
		});
	};
	
	const onSave = () => {
		logger.debug('SecondStep [onSave] - When Save button is clicked, then save changes to the orders database..');
		// Logic for saving the serviceOrder data into database using api '/api/service-orders' and then go back
		// saveData();
		showNotification({
			title: 'Success',
			withCloseButton: true,
			position: 'top-center',
			message: 'Order details have been saved successfully!',
			color: 'blue'
		});
		// Redirect or other logic after save
	};
	
	return (
		<div className="px-24 -mb-8">
			<Fragment>
				{(!Array.isArray(countries) || countries.length === 0) && error && (
					<Fragment>
						<Space h="xl"/>
						<Notification
							icon={xIcon}
							withBorder
							withCloseButton={true}
							radius="md"
							color="red"
							title="Failed to fetch the list of Countries from DNA!"
						>
							{JSON.stringify(error?.message)}
						</Notification>
					</Fragment>
				)}
				
				<Wizard activeStep={1}/>
				<FormProvider {...methods}>
					<form onSubmit={handleSubmit((data, event) => onSubmit(data, event))}>
						<div className="space-y-12">
							<div
								className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
							</div>
							
							<div
								className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
								
								<div>
									<h2 className="text-base font-semibold text-gray-700">Location
										Details</h2>
									<p className="mt-1 text-sm leading-6 text-gray-600">Select the Country and
										Site code.</p>
								</div>
								
								<div
									className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
									<div className="sm:col-span-4">
										<label htmlFor="country"
											   className="block text-sm font-medium leading-6 text-gray-900">
											Country
										</label>
										<div className="mt-2">
											<select
												id="country"
												placeholder="Select Country"
												value={country}
												onChange={(e) => handleCountryChange(e.target.value, 'country')}
												className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
											>
												<option value="" disabled>Select Country</option>
												{isLoadingCountry ? (
													<option value="Loading" disabled>Loading.....</option>
												) : (
													countryOptions.map((option) => (
														<option key={option.id}
																value={option.value}>{option.description}</option>
													))
												)}
											</select>
										</div>
									</div>
									
									<div className="sm:col-span-4">
										<label htmlFor="site-code"
											   className="block text-sm font-medium leading-6 text-gray-900">
											Site Code
										</label>
										<div className="mt-2">
											<input
												id="siteCode"
												type="text"
												value={secondStep.siteCode}
												placeholder="Site Code"
												className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
											/>
										</div>
									</div>
									
									<div className="sm:col-span-4">
										<label htmlFor="site-name"
											   className="block text-sm font-medium leading-6 text-gray-900">
											Site Name
										</label>
										<div className="mt-2">
											<input
												id="siteName"
												type="text"
												value={secondStep.siteName}
												placeholder="Site Name"
												className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
											/>
										</div>
									</div>
									
									<div className="sm:col-span-4">
										<label htmlFor="site-friendly-name"
											   className="block text-sm font-medium leading-6 text-gray-900">
											Site Friendly Name
										</label>
										<div className="mt-2">
											<input
												id="siteFriendlyName"
												type="text"
												value={secondStep.siteFriendlyName}
												placeholder="Site Friendly Name"
												className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
											/>
										</div>
									</div>
									
									<div className="sm:col-span-4">
										<label htmlFor="country"
											   className="block text-sm font-medium leading-6 text-gray-900">
											Architecture type
										</label>
										<div className="mt-2">
											<select
												id="country"
												placeholder="Select Country"
												value={country}
												onChange={(e) => handleCountryChange(e.target.value, 'country')}
												className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
											>
												<option value="" disabled>Select Country</option>
												{isLoadingCountry ? (
													<option value="Loading" disabled>Loading.....</option>
												) : (
													countryOptions.map((option) => (
														<option key={option.id}
																value={option.value}>{option.description}</option>
													))
												)}
											</select>
										</div>
									</div>
								
								
								</div>
							</div>
							
							<div
								className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
								<div>
									<h2 className="text-base/7 font-semibold text-gray-900">Personal Information</h2>
									<p className="mt-1 text-sm/6 text-gray-600">Use a permanent address where you can
										receive
										mail.</p>
								</div>
								
								<div
									className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
									<div className="sm:col-span-3">
										<label htmlFor="first-name"
											   className="block text-sm/6 font-medium text-gray-900">
											First name
										</label>
										<div className="mt-2">
											<input
												id="first-name"
												name="first-name"
												type="text"
												autoComplete="given-name"
												className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
											/>
										</div>
									</div>
									
									<div className="sm:col-span-3">
										<label htmlFor="last-name"
											   className="block text-sm/6 font-medium text-gray-900">
											Last name
										</label>
										<div className="mt-2">
											<input
												id="last-name"
												name="last-name"
												type="text"
												autoComplete="family-name"
												className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
											/>
										</div>
									</div>
									
									<div className="sm:col-span-4">
										<label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
											Email address
										</label>
										<div className="mt-2">
											<input
												id="email"
												name="email"
												type="email"
												autoComplete="email"
												className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
											/>
										</div>
									</div>
									
									<div className="sm:col-span-3">
										<label htmlFor="country" className="block text-sm/6 font-medium text-gray-900">
											Country
										</label>
										<div className="mt-2 grid grid-cols-1">
											<select
												id="country"
												name="country"
												autoComplete="country-name"
												className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
											>
												<option>United States</option>
												<option>Canada</option>
												<option>Mexico</option>
											</select>
											<ChevronDownIcon
												aria-hidden="true"
												className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
											/>
										</div>
									</div>
									
									<div className="col-span-full">
										<label htmlFor="street-address"
											   className="block text-sm/6 font-medium text-gray-900">
											Street address
										</label>
										<div className="mt-2">
											<input
												id="street-address"
												name="street-address"
												type="text"
												autoComplete="street-address"
												className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
											/>
										</div>
									</div>
									
									<div className="sm:col-span-2 sm:col-start-1">
										<label htmlFor="city" className="block text-sm/6 font-medium text-gray-900">
											City
										</label>
										<div className="mt-2">
											<input
												id="city"
												name="city"
												type="text"
												autoComplete="address-level2"
												className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
											/>
										</div>
									</div>
									
									<div className="sm:col-span-2">
										<label htmlFor="region" className="block text-sm/6 font-medium text-gray-900">
											State / Province
										</label>
										<div className="mt-2">
											<input
												id="region"
												name="region"
												type="text"
												autoComplete="address-level1"
												className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
											/>
										</div>
									</div>
									
									<div className="sm:col-span-2">
										<label htmlFor="postal-code"
											   className="block text-sm/6 font-medium text-gray-900">
											ZIP / Postal code
										</label>
										<div className="mt-2">
											<input
												id="postal-code"
												name="postal-code"
												type="text"
												autoComplete="postal-code"
												className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
											/>
										</div>
									</div>
								</div>
							</div>
							
							<div
								className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
								<div>
									<h2 className="text-base/7 font-semibold text-gray-900">Notifications</h2>
									<p className="mt-1 text-sm/6 text-gray-600">
										We'll always let you know about important changes, but you pick what else you
										want
										to hear
										about.
									</p>
								</div>
								
								<div className="max-w-2xl space-y-10 md:col-span-2">
									<fieldset>
										<legend className="text-sm/6 font-semibold text-gray-900">By email</legend>
										<div className="mt-6 space-y-6">
											<div className="flex gap-3">
												<div className="flex h-6 shrink-0 items-center">
													<div className="group grid size-4 grid-cols-1">
														<input
															defaultChecked
															id="comments"
															name="comments"
															type="checkbox"
															aria-describedby="comments-description"
															className="col-start-1 row-start-1 appearance-none rounded border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
														/>
														<svg
															fill="none"
															viewBox="0 0 14 14"
															className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-[:disabled]:stroke-gray-950/25"
														>
															<path
																d="M3 8L6 11L11 3.5"
																strokeWidth={2}
																strokeLinecap="round"
																strokeLinejoin="round"
																className="opacity-0 group-has-[:checked]:opacity-100"
															/>
															<path
																d="M3 7H11"
																strokeWidth={2}
																strokeLinecap="round"
																strokeLinejoin="round"
																className="opacity-0 group-has-[:indeterminate]:opacity-100"
															/>
														</svg>
													</div>
												</div>
												<div className="text-sm/6">
													<label htmlFor="comments" className="font-medium text-gray-900">
														Comments
													</label>
													<p id="comments-description" className="text-gray-500">
														Get notified when someones posts a comment on a posting.
													</p>
												</div>
											</div>
											<div className="flex gap-3">
												<div className="flex h-6 shrink-0 items-center">
													<div className="group grid size-4 grid-cols-1">
														<input
															id="candidates"
															name="candidates"
															type="checkbox"
															aria-describedby="candidates-description"
															className="col-start-1 row-start-1 appearance-none rounded border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
														/>
														<svg
															fill="none"
															viewBox="0 0 14 14"
															className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-[:disabled]:stroke-gray-950/25"
														>
															<path
																d="M3 8L6 11L11 3.5"
																strokeWidth={2}
																strokeLinecap="round"
																strokeLinejoin="round"
																className="opacity-0 group-has-[:checked]:opacity-100"
															/>
															<path
																d="M3 7H11"
																strokeWidth={2}
																strokeLinecap="round"
																strokeLinejoin="round"
																className="opacity-0 group-has-[:indeterminate]:opacity-100"
															/>
														</svg>
													</div>
												</div>
												<div className="text-sm/6">
													<label htmlFor="candidates" className="font-medium text-gray-900">
														Candidates
													</label>
													<p id="candidates-description" className="text-gray-500">
														Get notified when a candidate applies for a job.
													</p>
												</div>
											</div>
											<div className="flex gap-3">
												<div className="flex h-6 shrink-0 items-center">
													<div className="group grid size-4 grid-cols-1">
														<input
															id="offers"
															name="offers"
															type="checkbox"
															aria-describedby="offers-description"
															className="col-start-1 row-start-1 appearance-none rounded border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
														/>
														<svg
															fill="none"
															viewBox="0 0 14 14"
															className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-[:disabled]:stroke-gray-950/25"
														>
															<path
																d="M3 8L6 11L11 3.5"
																strokeWidth={2}
																strokeLinecap="round"
																strokeLinejoin="round"
																className="opacity-0 group-has-[:checked]:opacity-100"
															/>
															<path
																d="M3 7H11"
																strokeWidth={2}
																strokeLinecap="round"
																strokeLinejoin="round"
																className="opacity-0 group-has-[:indeterminate]:opacity-100"
															/>
														</svg>
													</div>
												</div>
												<div className="text-sm/6">
													<label htmlFor="offers" className="font-medium text-gray-900">
														Offers
													</label>
													<p id="offers-description" className="text-gray-500">
														Get notified when a candidate accepts or rejects an offer.
													</p>
												</div>
											</div>
										</div>
									</fieldset>
									
									<fieldset>
										<legend className="text-sm/6 font-semibold text-gray-900">Push notifications
										</legend>
										<p className="mt-1 text-sm/6 text-gray-600">These are delivered via SMS to your
											mobile
											phone.</p>
										<div className="mt-6 space-y-6">
											<div className="flex items-center gap-x-3">
												<input
													defaultChecked
													id="push-everything"
													name="push-notifications"
													type="radio"
													className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden [&:not(:checked)]:before:hidden"
												/>
												<label htmlFor="push-everything"
													   className="block text-sm/6 font-medium text-gray-900">
													Everything
												</label>
											</div>
											<div className="flex items-center gap-x-3">
												<input
													id="push-email"
													name="push-notifications"
													type="radio"
													className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden [&:not(:checked)]:before:hidden"
												/>
												<label htmlFor="push-email"
													   className="block text-sm/6 font-medium text-gray-900">
													Same as email
												</label>
											</div>
											<div className="flex items-center gap-x-3">
												<input
													id="push-nothing"
													name="push-notifications"
													type="radio"
													className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden [&:not(:checked)]:before:hidden"
												/>
												<label htmlFor="push-nothing"
													   className="block text-sm/6 font-medium text-gray-900">
													No push notifications
												</label>
											</div>
										</div>
									</fieldset>
								</div>
							</div>
						</div>
						
						<div className="mt-6 flex items-center justify-end gap-x-6">
							<button type="button" className="text-sm/6 font-semibold text-gray-900">
								Cancel
							</button>
							<button
								type="submit"
								className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
							>
								Save
							</button>
						</div>
					</form>
				</FormProvider>
			</Fragment>
		</div>
	);
};

NewSiteDetails.getInitialProps = async (context, client, currentUser) => {
	logger.debug(`NewSiteDetails [getInitialProps] - currentUser : ${currentUser?.name}, local? : ${process.env.NEXT_PUBLIC_isLocal} `);
	
	if (process.env.NEXT_PUBLIC_isLocal === 'false') {
		try {
			const {data} = await client.get('/api/dna/countries/getCountries');
			return {countries: data, currentUser};
		} catch (error) {
			logger.error(`NewSiteDetails [getInitialProps] - Error fetching the list of countries for GMN :  ${error.response?.status} - ${error.message} `);
			return {error};
		}
	}
};

export default NewSiteDetails;
