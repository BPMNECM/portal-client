'use client';

import {Fragment, useEffect, useState} from 'react';
import {FormProvider, useForm} from 'react-hook-form';
import {useRouter} from 'next/router';
import dynamic from 'next/dynamic';
import {useDisclosure} from '@mantine/hooks';
import useFormRequest from '@/hooks/use-form-request';
import useOrderStore from '@/store/useOrderStore';
import {notifications, showNotification} from '@mantine/notifications';
import {yupResolver} from '@hookform/resolvers/yup';
import {secondStepSchema} from '@/utils/lib/yup';
import Wizard from '@/components/Forms/Wizard';
import BtnFunction from '@/components/Forms/Button';
import {IconAlertCircle, IconCheck, IconX} from '@tabler/icons-react';
import {getRequestTypeTitle, isFormDataModified} from '@/utils/form-utils';
import {cardServicesOptions, portServicesOptions} from '@/utils/lib/select-options';
import {countriesData} from '@/shared/data/countries-data';
import ServiceModal from '@/components/Modals/ServiceModal';
import SignInPrompt from '@/pages/misc/not-signed';
import {getLogger} from '@/utils/logger/logger';
import {
	Alert,
	Code,
	FocusTrap,
	Group,
	Modal,
	Notification,
	rem,
	ScrollArea,
	Space,
	Text,
	Transition
} from '@mantine/core';
import SENDataSection from '@/components/Modals/SENDataSection';
import {filterOptionsByDevice} from '@/utils/resource-helper';

const logger = getLogger('SecondStep');

const NewServicesTable = dynamic(() => import('@/components/Cart/NewServices'), {
	ssr: false,
	loading: () => <div>Loading Services...</div>
});

const SecondStep = ({countries, currentUser, error}) => {
	const xIcon = <IconX style={{width: rem(20), height: rem(20)}}/>;
	logger.debug(`SecondStep - Adding Services to the Order by User: ${currentUser?.name}`);
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
	
	if (!currentUser) {
		return <SignInPrompt/>;
	}
	
	const [farFocusActive, {open: openFarFocus, close: closeFarFocus}] = useDisclosure(false);
	const [countryOptions, setCountryOptions] = useState(countries || []);
	
	const [isLoadingCountry, setIsLoadingCountry] = useState(!countries);
	const [isLoadingSites, setIsLoadingSites] = useState(false);
	const [isLoadingChassis, setIsLoadingChassis] = useState(false);
	
	const [isLoadingFARCountry, setIsLoadingFARCountry] = useState(!countries);
	const [isLoadingFARSites, setIsLoadingFARSites] = useState(false);
	const [isLoadingFARChassis, setIsLoadingFARChassis] = useState(false); // Prop - serviceModal
	
	const [country, setCountry] = useState(secondStep.country || '');
	const [siteCode, setSiteCode] = useState(secondStep.site || '');
	const [siteDescription, setSiteDescription] = useState(secondStep.siteDesc || ''); // Not used
	
	const [farCountry, setFarCountry] = useState(secondStep.farCountry || '');
	const [farSiteCode, setFarSiteCode] = useState(secondStep.farSite || '');
	const [farSiteDescription, setFarSiteDescription] = useState(secondStep.farSiteDesc || ''); // Not used
	
	const [farFieldsDisabled, setFarFieldsDisabled] = useState(true);
	const [showFARSelectionWarning, setShowFARSelectionWarning] = useState(false);
	
	const [newServiceButtonDisabled, setNewServiceButtonDisabled] = useState(true);
	const [selectedDevice, setSelectedDevice] = useState('');
	const [filteredPortServices, setFilteredPortServices] = useState(portServicesOptions);
	const [selectedResource, setSelectedResource] = useState('');
	const [selectedCardService, setSelectedCardService] = useState('');
	const [selectedPortService, setSelectedPortService] = useState('');
	
	const [currentIndex, setCurrentIndex] = useState(0);
	const [selectedServiceIndex, setSelectedServiceIndex] = useState(0);
	const [isOpen, setIsOpen] = useState(false);
	
	const {doRequest: doSitesRequest, errors: sitesRequestErrors} = useFormRequest();
	const {doRequest: doChassisRequest, errors: chassisRequestErrors} = useFormRequest();
	
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
	
	useEffect(() => {
		if (selectedResource === 'Port' && (selectedPortService === 'SEN Data' || selectedPortService === 'Media Data')) {
			openFarFocus();
			setFarFieldsDisabled(false);
		} else {
			closeFarFocus();
			setFarFieldsDisabled(true);
		}
		return undefined; // Explicitly indicate no return value
	}, [selectedResource, selectedPortService]);
	
	const resetFarFields = () => {
		setIsLoadingFARCountry(false);
		setIsLoadingFARSites(false);
		setIsLoadingFARChassis(false);
		setFarCountry('');
		setFarSiteCode('');
		setFarSiteDescription('');
		setFarFieldsDisabled(true);
		setShowFARSelectionWarning(false);
		set((state) => ({
			...state,
			secondStep: {
				...state.secondStep,
				farCountry: '',
				farSiteOptions: [],
				farSite: '',
				farSiteDesc: '',
				farChassisOptions: []
				// services: []
			}
		}));
	};
	
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
		
		if (
			(selectedResource === 'Card' && !selectedCardService) ||
			(selectedResource === 'Port' && !selectedPortService)
		) {
			notifications.show({
				withCloseButton: true,
				autoClose: 5000,
				title: 'Attention!',
				message: 'Please select a Service from the Catalog before proceeding.',
				color: 'red',
				icon: <IconX size="1.1rem"/>
			});
			return;
		}
		
		if (showFARSelectionWarning && (!farCountry || !farSiteCode)) {
			logger.debug('Show alert if FAR fields are not selected');
			return;
		}
		
		if (selectedResource === 'Port' && (selectedPortService === 'SEN Data' || selectedPortService === 'Media Data')) {
			logger.debug('selectedPortService: ' + selectedPortService);
			
			if (!farCountry || !farSiteCode) {
				logger.debug('Show alert if FAR fields are not selected');
				notifications.show({
					withCloseButton: true,
					autoClose: 5000,
					title: 'Attention!',
					message: 'Please select FAR location details to add this service.',
					color: 'red',
					icon: <IconX size="1.1rem"/>
				});
				return;
			}
		}
		
		const newService = createNewServiceTemplate(
			selectedResource,
			selectedResource === 'Card' ? 'newServiceToCard' : 'newServiceToPort',
			selectedResource === 'Card' ? selectedCardService : selectedPortService,
			selectedDevice,
			secondStep
		);
		
		if (farCountry && farSiteCode && farSiteDescription) {
			newService.requestType = 'SENData';
		}
		
		addService(newService);
		logger.debug(
			`SecondStep [handleNewServiceClick] - newServiceIndex: ${newServiceIndex}, selectedResource: ${selectedResource}`
		);
	};
	
	const handleCloseModal = (index) => {
		logger.debug(
			`SecondStep [handleCloseModal] - Index: ${index}, currentIndex: ${currentIndex}, selectedServiceIndex: ${selectedServiceIndex} `
		);
		setSelectedCardService('');
		setSelectedPortService('');
		removeService(index);
		setIsOpen(false);
		
		if (currentIndex > 0) {
			setCurrentIndex(currentIndex - 1);
		}
		
		setSelectedServiceIndex(null);
		logger.debug(
			`SecondStep [handleCloseModal] - currentIndex: ${currentIndex}, selectedServiceIndex: ${selectedServiceIndex}`
		);
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
				logger.debug(
					`SecondStep [handleSiteChange] - Site: ${secondStep.site}, selectedSite: ${selectedSite}, url: ${url} `
				);
				
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
				logger.debug(
					`SecondStep [handleSiteChange] - Site: ${secondStep.farSite}, selectedSite: ${selectedSite}, url: ${url} `
				);
				
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
	
	// const {handleSubmit, formState} = methods;
	const {
		handleSubmit,
		formState: {errors, isValid, isSubmitting, isDirty}
	} = methods;
	
	const onSubmit = async (data, event) => {
		event.preventDefault();
		const methodData = methods.getValues();
		logger.debug(`SecondStep [onSubmit] - Services Length: ${methodData.services.length},
						formErrors - ${JSON.stringify(errors)},	isValid: ${isValid}`);
		
		if (methodData.services.length === 0) {
			showNotification({
				icon: <IconX/>,
				color: 'red',
				withCloseButton: true,
				position: 'top-center',
				title: 'Bummer!',
				message: 'No services added to the order. Please add at least one Service to proceed!'
			});
			return;
		} else if (!isValid) {
			showNotification({
				title: 'Invalid Service',
				withCloseButton: true,
				position: 'top-center',
				message: 'Please check if at least one service has all required fields!',
				color: 'red'
			});
			return;
		} else {
			showNotification({
				icon: <IconCheck/>,
				color: 'blue',
				withCloseButton: true,
				position: 'top-center',
				title: 'All good!',
				message: 'Your services were successfully added to the order!'
			});
		}
		
		logger.debug(`SecondStep [onSubmit] - formData: ${data} `);
		// Can the simple assignment can be used instead of individual assignments
		// setData({ step: 2, data: methodData });
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
								className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3"></div>
							<div
								className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
								<div>
									<h2 className="text-base font-semibold text-gray-700">Location Details</h2>
									<p className="mt-1 text-sm leading-6 text-gray-600">Select the Country and Site
										code.</p>
								</div>
								<div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-1">
									<div className="px-4 py-6 sm:p-8">
										<div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
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
														<option value="" disabled>
															Select Country
														</option>
														{isLoadingCountry ? (
															<option value="Loading" disabled>
																Loading.....
															</option>
														) : (
															countryOptions.map((option) => (
																<option key={option.id} value={option.value}>
																	{option.description}
																</option>
															))
														)}
													</select>
												</div>
											</div>
											<div className="sm:col-span-4">
												<label htmlFor="site-code"
													   className="block text-sm font-medium leading-6 text-gray-900">
													Site
												</label>
												<div className="mt-2">
													<select
														id="site"
														placeholder="Select Site"
														value={siteCode}
														onChange={(e) => handleSiteChange(e.target.value, 'site')}
														className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
													>
														<option value="" disabled>
															Select Site
														</option>
														{isLoadingSites && (
															<option value="Loading" disabled>
																Loading.....
															</option>
														)}
														{!isLoadingSites &&
															secondStep.siteOptions.map((option) => (
																<option key={option.id} value={option.value}>
																	{option.code}
																</option>
															))}
													</select>
												</div>
											</div>
											<div className="sm:col-span-4">
												<label htmlFor="site-description"
													   className="block text-sm font-medium leading-6 text-gray-900">
													Site Description
												</label>
												<div className="mt-2">
													<input
														id="siteDesc"
														type="text"
														value={secondStep.siteOptions.find((opt) => opt.code === siteCode)?.description || ''}
														placeholder="Site Description"
														readOnly
														className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
													/>
												</div>
											</div>
										</div>
									</div>
								</div>
								
								<Transition mounted={farFocusActive || farFieldsDisabled} transition="fade"
											duration={400}>
									{(styles) => (
										<FocusTrap active={farFocusActive}>
											<div
												className={`${
													farFieldsDisabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'
												} shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-1 transition-all duration-300 ${
													farFocusActive ? 'ring-4 ring-blue-500' : ''
												}`}
												style={styles}
											>
												<Group justify="left">
													<Code color="blue.9" c="blue">
														FAR side
													</Code>
												</Group>
												
												<div className="sm:p-8">
													<div
														className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
														<div className="sm:col-span-4">
															<label
																htmlFor="far-country"
																className={`block text-sm font-medium leading-6 text-gray-900 ${
																	farFieldsDisabled ? 'opacity-50' : ''
																}`}
															>
																Country
															</label>
															<div className="mt-2">
																<select
																	id="farCountry"
																	placeholder="Select Country"
																	value={farCountry}
																	onChange={(e) => handleCountryChange(e.target.value, 'farCountry')}
																	disabled={farFieldsDisabled}
																	className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6 ${
																		farFieldsDisabled ? 'bg-gray-200 cursor-not-allowed' : ''
																	}`}
																>
																	<option value="" disabled>
																		Select Country
																	</option>
																	{isLoadingFARCountry && (
																		<option value="Loading" disabled>
																			Loading.....
																		</option>
																	)}
																	{!isLoadingFARCountry &&
																		countryOptions.map((option) => (
																			<option key={option.id}
																					value={option.value}>
																				{option.description}
																			</option>
																		))}
																</select>
															</div>
														</div>
														<div className="sm:col-span-4">
															<label
																htmlFor="far-site-code"
																className={`block text-sm font-medium leading-6 text-gray-900 ${
																	farFieldsDisabled ? 'opacity-50' : ''
																}`}
															>
																Site
															</label>
															<div className="mt-2">
																<select
																	id="farSite"
																	placeholder="Select FAR Site"
																	value={farSiteCode}
																	onChange={(e) => handleSiteChange(e.target.value, 'farSite')}
																	disabled={farFieldsDisabled}
																	className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6 ${
																		farFieldsDisabled ? 'bg-gray-200 cursor-not-allowed' : ''
																	}`}
																>
																	<option value="" disabled>
																		Select Site
																	</option>
																	{isLoadingFARSites && (
																		<option value="Loading" disabled>
																			Loading.....
																		</option>
																	)}
																	{!isLoadingFARSites &&
																		secondStep.farSiteOptions.map((option) => (
																			<option key={option.id}
																					value={option.value}>
																				{option.code}
																			</option>
																		))}
																</select>
															</div>
														</div>
														<div className="sm:col-span-4">
															<label
																htmlFor="far-site-description"
																className={`block text-sm font-medium leading-6 text-gray-900 ${
																	farFieldsDisabled ? 'opacity-50' : ''
																}`}
															>
																Site Description
															</label>
															<div className="mt-2">
																<input
																	id="farSiteDesc"
																	type="text"
																	value={
																		secondStep.farSiteOptions.find((opt) => opt.code === farSiteCode)?.description || ''
																	}
																	placeholder="Site Description"
																	readOnly
																	className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
																		farFieldsDisabled ? 'bg-gray-200 cursor-not-allowed' : ''
																	}`}
																/>
															</div>
														</div>
													</div>
												</div>
											</div>
										</FocusTrap>
									)}
								</Transition>
							</div>
							<div
								className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
								<div>
									<h4 className="text-base font-semibold text-gray-700">Product Catalog</h4>
									<p className="mt-1 text-sm leading-6 text-gray-600">Add the services required to
										your Order.</p>
								</div>
								<div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
									<div className="px-4 py-6 sm:p-8">
										<div className="max-w-2xl space-y-10">
											<fieldset>
												<div>
													<legend
														className="text-sm font-semibold leading-6 text-gray-900">GMN
														Platforms
													</legend>
													<p className="mt-1 text-sm leading-6 text-gray-600">
														Choose the device for the Products offering
													</p>
												</div>
												
												<div className="mt-6 space-y-6">
													<div className="sm:col-span-8">
														<div className="mt-2 -ml-2">
															<select
																id="deviceCatalog"
																placeholder="Choose the device"
																value={selectedDevice}
																onChange={handleDeviceChange}
																disabled={!country || !siteCode}
																className="ml-2 border-gray-300 rounded-md w-80"
															>
																<option value="" disabled>
																	Select the device
																</option>
																{['Aperi', 'Ateme', 'Arista', 'Cisco', 'CP6000', 'DCM'].map((device) => (
																	<option key={device} value={device}>
																		{device}
																	</option>
																))}
															</select>
														</div>
													</div>
													<div>
														<legend
															className="text-sm font-semibold leading-6 text-gray-900">Product
															Category
														</legend>
														<p className="mt-1 text-sm leading-6 text-gray-600">
															Choose the resource to find services offered
														</p>
													</div>
													<div className="flex items-center gap-x-3">
														<input
															id="cardCategory"
															type="radio"
															value="Card"
															disabled={!country || !siteCode || selectedDevice !== 'Aperi'}
															checked={selectedResource === 'Card'}
															onChange={handleResourceChange}
															className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
														/>
														<label htmlFor="cardCategory"
															   className="block text-sm font-medium leading-6 text-gray-900">
															Card
														</label>
														<select
															id="cardServiceCatalog"
															value={selectedCardService}
															onChange={handleServiceChange}
															disabled={selectedDevice !== 'Aperi' || !selectedResource || selectedResource !== 'Card'}
															className="ml-12 border-gray-300 rounded-md w-80"
														>
															<option value="" disabled>
																Select the service
															</option>
															{cardServicesOptions.map((option) => (
																<option key={option.id} value={option.value}>
																	{option.value}
																</option>
															))}
														</select>
														<BtnFunction
															id="newServiceCard"
															disabled={newServiceButtonDisabled || selectedResource !== 'Card'}
															onClick={handleNewServiceClick}
															className="ml-4"
														>
															Add Service
														</BtnFunction>
													</div>
													<div className="flex items-center gap-x-3">
														<input
															id="portCategory"
															name="portCategory"
															type="radio"
															value="Port"
															disabled={!country || !siteCode}
															checked={selectedResource === 'Port'}
															onChange={handleResourceChange}
															className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
														/>
														<label htmlFor="portCategory"
															   className="block text-sm font-medium leading-6 text-gray-900">
															Port
														</label>
														<select
															id="portServiceCatalog"
															value={selectedPortService}
															onChange={handleServiceChange}
															disabled={!selectedResource || selectedResource !== 'Port'}
															className="ml-12 border-gray-300 rounded-md w-80"
														>
															<option value="" disabled>
																Select the service
															</option>
															{filteredPortServices.map((option) => (
																<option key={option.id} value={option.value}>
																	{option.value}
																</option>
															))}
														</select>
														{showFARSelectionWarning && (!farCountry || !farSiteCode) ? (
															<Alert title="Attention!" color="indigo"
																   icon={<IconAlertCircle size="2rem"/>}>
																Please select the FAR location details above to request
																this service.
															</Alert>
														) : (
															<BtnFunction
																id="newServicePort"
																disabled={newServiceButtonDisabled || selectedResource !== 'Port'}
																onClick={handleNewServiceClick}
																className="ml-4"
															>
																Add Service
															</BtnFunction>
														)}
													</div>
												</div>
											</fieldset>
											
											{secondStep.services.length > 0 && (
												<>
													{secondStep.services.map((service, index) => (
														<Fragment key={index}>
															<Modal
																opened={isOpen && selectedServiceIndex === index}
																closeOnClickOutside={false}
																withCloseButton={true}
																fullScreen
																onClose={() => handleCloseModal(index)}
																scrollAreaComponent={ScrollArea.Autosize}
																title={
																	<Text
																		color="darkblue"
																		size="md"
																		style={{
																			fontFamily: 'Arial',
																			fontWeight: 'bold',
																			textTransform: 'uppercase',
																			letterSpacing: '1px',
																			textAlign: 'center'
																		}}
																	>
																		{getRequestTypeTitle(secondStep.services[index].requestType)}
																	</Text>
																}
															>
																{service.workRequired === 'SEN Data' || service.workRequired === 'Media Data' ? (
																	<SENDataSection
																		key={index}
																		index={index}
																		userName={currentUser?.name}
																		service={service}
																		isLoadingChassis={isLoadingChassis}
																		isLoadingFARChassis={isLoadingFARChassis}
																		readonly={false}
																		onClose={() => handleCloseModal(index)}
																		onAddServiceFn={() => handleAddService(service, index)}
																	/>
																) : (
																	<ServiceModal
																		key={index}
																		index={index}
																		userName={currentUser?.name}
																		service={service}
																		isLoadingChassis={isLoadingChassis}
																		readonly={false}
																		onClose={() => handleCloseModal(index)}
																		onAddServiceFn={() => handleAddService(service, index)}
																	/>
																)}
																{/*<AddServiceModal*/}
																{/*	key={index}*/}
																{/*	index={index}*/}
																{/*	userName={currentUser?.name}*/}
																{/*	service={service}*/}
																{/*	isLoadingChassis={isLoadingChassis}*/}
																{/*	isLoadingFARChassis={isLoadingFARChassis}*/}
																{/*	readonly={false}*/}
																{/*	onClose={() => handleCloseModal(index)}*/}
																{/*	onAddServiceFn={() => handleAddService(service, index)}*/}
																{/*/>*/}
															</Modal>
														</Fragment>
													))}
												</>
											)}
										</div>
									</div>
								</div>
							</div>
							
							<div className="pb-2 gap-y-8">
								<div className="px-4 sm:px-0">
									<h2 className="text-base font-semibold text-gray-700">Services Cart</h2>
									<p className="mt-1 text-sm leading-6 text-gray-600 pb-8">
										Below is the list of the services you requested.
									</p>
								</div>
								<NewServicesTable/>
							</div>
							
							{/* Render errors */}
							
							{chassisRequestErrors && chassisRequestErrors.message && (
								<div className="mt-4 text-red-500">
									Error with Chassis API: {chassisRequestErrors.message}
									{chassisRequestErrors.errors && (
										<ul>
											{chassisRequestErrors.errors.map((error, index) => (
												<li key={index}>{error}</li>
											))}
										</ul>
									)}
								</div>
							)}
							
							{sitesRequestErrors && sitesRequestErrors.message && (
								<div className="mt-4 text-red-500">
									Error with Sites API: {sitesRequestErrors.message}
									{sitesRequestErrors.errors && (
										<ul>
											{sitesRequestErrors.errors.map((error, index) => (
												<li key={index}>{error}</li>
											))}
										</ul>
									)}
								</div>
							)}
							
							{errors.services && <p className="text-red-500">{errors.services.message}</p>}
							
							<div
								className="flex items-center justify-between border-t border-gray-900/10 px-4 py-12 sm:px-2">
								<div className="flex items-center gap-x-6">
									<button
										type="button"
										onClick={onCancel}
										disabled={isSubmitting}
										className="text-sm font-semibold leading-6 text-gray-900"
									>
										Cancel
									</button>
									<BtnFunction type="button" onClick={onSave} disabled={isSubmitting}>
										Save
									</BtnFunction>
								</div>
								<div className="flex items-center gap-x-6">
									<button
										type="button"
										onClick={onPrevious}
										disabled={isSubmitting}
										className="text-sm font-semibold leading-6 text-gray-900"
									>
										Back
									</button>
									<BtnFunction
										type="submit"
										// disabled={!isValid || isSubmitting}
										disabled={isSubmitting}
									>
										Next
									</BtnFunction>
								</div>
							</div>
						</div>
					</form>
				</FormProvider>
			</Fragment>
		</div>
	);
};

SecondStep.getInitialProps = async (context, client, currentUser) => {
	logger.debug(
		`SecondStep [getInitialProps] - currentUser : ${currentUser?.name}, local? : ${process.env.NEXT_PUBLIC_isLocal} `
	);
	
	if (process.env.NEXT_PUBLIC_isLocal === 'false') {
		try {
			const {data} = await client.get('/api/dna/countries/getCountries');
			return {countries: data, currentUser};
		} catch (error) {
			logger.error(
				`SecondStep [getInitialProps] - Error fetching the list of countries for GMN :  ${error.response?.status} - ${error.message} `
			);
			return {error};
		}
	}
};

export default SecondStep;
