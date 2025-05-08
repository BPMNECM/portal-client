'use client';

import {Fragment, useEffect, useState} from 'react';
import {FormProvider, useForm} from 'react-hook-form';
import {useRouter} from 'next/router';
import {showNotification} from '@mantine/notifications';
import {yupResolver} from '@hookform/resolvers/yup';
import {secondStepSchema} from '@/utils/lib/yup';
import useOrderStore from '@/store/useOrderStore';
import Wizard from '@/components/Forms/Wizard';
import {IconCheck, IconEdit, IconEye, IconFilter, IconPlus, IconTrash} from '@tabler/icons-react';
import SignInPrompt from '@/pages/misc/not-signed';
import {getLogger} from '@/utils/logger/logger';
import {ActionIcon, Button, Group, Pagination, Select, Table, Text, TextInput} from '@mantine/core';

const logger = getLogger('SMOTStep');

// Mock data for port tables
const ingressPorts = [
	{id: 1, type: 'VIP', port: 'TOL-ULCZ-A1105-1A-2.3.A.VP.TX1', hitless: 'FALSE'},
	{id: 2, type: 'VIP', port: 'TOL-ULCZ-A1105-1A-2.3.A.VP.TX2', hitless: 'FALSE'},
	{id: 3, type: 'VIP', port: 'TOL-ULCZ-A1105-1A-2.3.A.VP.TX3', hitless: 'FALSE'},
	{id: 4, type: 'VIP', port: 'TOL-ULCZ-A1105-1A-2.3.A.VP.TX4', hitless: 'FALSE'},
	{id: 5, type: 'VIP', port: 'TOL-ULCZ-A1105-1A-2.3.A.VP.TX5', hitless: 'FALSE'},
	{id: 6, type: 'VIP', port: 'TOL-ULCZ-A1105-1A-2.4.A.VP.TX2', hitless: 'FALSE'},
	{id: 7, type: 'VIP', port: 'TOL-ULCZ-A1105-1A-2.4.A.VP.TX3', hitless: 'FALSE'},
	{id: 8, type: 'VIP', port: 'TOL-ULCZ-A1105-1A-2.4.A.VP.TX4', hitless: 'FALSE'},
	{id: 9, type: 'VIP', port: 'TOL-ULCZ-A1105-1A-2.4.A.VP.TX5', hitless: 'FALSE'},
	{id: 10, type: 'SDI', port: 'TOL-ULCZ-A1105-1A-3.1.HTX', hitless: 'TRUE'},
	{id: 11, type: 'SDI', port: 'TOL-ULCZ-A1105-1A-3.2.HTX', hitless: 'TRUE'},
	{id: 12, type: 'SDI', port: 'TOL-ULCZ-A1105-1A-4.1.A.TX', hitless: 'FALSE'},
	{id: 13, type: 'SDI', port: 'TOL-ULCZ-A1105-1A-4.2.A.TX', hitless: 'FALSE'},
	{id: 14, type: 'ASI', port: 'TOL-ULCZ-A1105-1A-5.1.HTX', hitless: 'TRUE'}
];

const egressPorts = [
	{id: 1, type: 'VIP', port: 'TOL-SYCZ-A1105-2A-2.3.A.VP.RX1', hitless: 'FALSE'},
	{id: 2, type: 'VIP', port: 'TOL-SYCZ-A1105-2A-2.3.A.VP.RX2', hitless: 'FALSE'},
	{id: 3, type: 'VIP', port: 'TOL-SYCZ-A1105-2A-2.3.A.VP.RX3', hitless: 'FALSE'},
	{id: 4, type: 'VIP', port: 'TOL-SYCZ-A1105-2A-2.3.A.VP.RX4', hitless: 'FALSE'},
	{id: 5, type: 'VIP', port: 'TOL-SYCZ-A1105-2A-2.3.A.VP.RX5', hitless: 'FALSE'},
	{id: 6, type: 'VIP', port: 'TOL-SYCZ-A1105-2A-3.4.A.VP.RX1', hitless: 'FALSE'},
	{id: 7, type: 'VIP', port: 'TOL-SYCZ-A1105-2A-3.4.A.VP.RX2', hitless: 'FALSE'},
	{id: 8, type: 'VIP', port: 'TOL-SYCZ-A1105-2A-3.4.A.VP.RX3', hitless: 'FALSE'},
	{id: 9, type: 'VIP', port: 'TOL-SYCZ-A1105-2A-3.4.A.VP.RX4', hitless: 'FALSE'},
	{id: 10, type: 'VIP', port: 'TOL-SYCZ-A1105-2A-3.4.A.VP.RX5', hitless: 'FALSE'},
	{id: 11, type: 'SDI', port: 'TOL-SYCZ-A1105-2A-5.1.HRX', hitless: 'TRUE'},
	{id: 12, type: 'SDI', port: 'TOL-SYCZ-A1105-2A-5.2.HRX', hitless: 'TRUE'},
	{id: 13, type: 'ASI', port: 'TOL-SYCZ-A1105-2A-5.1.HRX', hitless: 'TRUE'},
	{id: 14, type: 'ASI', port: 'TOL-SYCZ-A1105-2A-5.2.HRX', hitless: 'TRUE'}
];

// Mock data for services cart
const initialServices = [
	{
		id: 1,
		request: 'New',
		resource: 'Port',
		service: 'VIP',
		chassis: 'TOL-ULCZ-A1105',
		slot: '1A-2.3.A',
		card: 'VP',
		port: 'TX1'
	}
];

const SMOTStep = ({currentUser}) => {
	const router = useRouter();
	// Get the store state and actions
	const {firstStep, secondStep, setData} = useOrderStore();
	const smotStepData = useOrderStore((state) => state.smotStep) || {};
	
	// Get the set function directly to avoid using the problematic setSmotStep
	const setStore = useOrderStore((state) => state.set);
	
	const [isUserSignedIn, setIsUserSignedIn] = useState(true);
	const [serviceName, setServiceName] = useState('eSPORTS_01');
	const [services, setServices] = useState(initialServices);
	const [activePage, setActivePage] = useState(1);
	const [ingressPage, setIngressPage] = useState(1);
	const [egressPage, setEgressPage] = useState(1);
	const [selectedIngressPorts, setSelectedIngressPorts] = useState([]);
	const [selectedEgressPorts, setSelectedEgressPorts] = useState([]);
	
	// Initialize default values for the form
	const defaultValues = {
		serviceOrderId: smotStepData.serviceOrderId || '',
		serviceType: smotStepData.serviceType || '',
		description: smotStepData.description || '',
		priority: smotStepData.priority || 'Medium',
		requestedCompletionDate:
			smotStepData.requestedCompletionDate ||
			new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
		location: smotStepData.location || '',
		contactName: smotStepData.contactName || '',
		contactEmail: smotStepData.contactEmail || '',
		contactPhone: smotStepData.contactPhone || '',
		attachments: smotStepData.attachments || [],
		additionalNotes: smotStepData.additionalNotes || '',
		serviceStatus: smotStepData.serviceStatus || 'Draft'
	};
	
	const methods = useForm({
		mode: 'onChange',
		resolver: yupResolver(secondStepSchema),
		defaultValues: secondStep
	});
	
	const {
		handleSubmit,
		formState: {errors, isValid, isSubmitting, isDirty},
		getValues,
		trigger,
		watch
	} = methods;
	
	// Function to safely update the smotStep in the store
	// This function will only be called on explicit user actions, not on every form change
	const updateSmotStepData = (data) => {
		setStore((state) => ({
			...state,
			smotStep: {
				...state.smotStep,
				...data
			}
		}));
	};
	
	useEffect(() => {
		setIsUserSignedIn(!!currentUser);
		
		// Safely check environment variables
		try {
			const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
			const dnaHost = process.env.NEXT_PUBLIC_DNA_HOST || '';
			
			logger.debug(`Environment variables loaded: BASE_URL=${baseUrl}, DNA_HOST=${dnaHost}`);
		} catch (error) {
			logger.error(`Error accessing environment variables: ${error.message}`);
		}
		
		// Set form errors from react-hook-form
	}, [currentUser]);
	
	logger.debug(`SMOTStep - Adding SMOT Services to the Order by User: ${currentUser?.name}`);
	
	if (!isUserSignedIn) {
		return <SignInPrompt/>;
	}
	
	const onSubmit = async (data, event) => {
		event.preventDefault();
		logger.debug(`SMOTStep [onSubmit] - formErrors - ${JSON.stringify(errors)}, isValid: ${isValid}`);
		
		// Update the store with final form data
		updateSmotStepData({
			...data,
			services,
			serviceName,
			serviceStatus: 'Submitted'
		});
		
		showNotification({
			icon: <IconCheck/>,
			color: 'blue',
			withCloseButton: true,
			position: 'top-center',
			title: 'All good!',
			message: 'Your services were successfully added to the order!'
		});
		
		await router.push('/form/review-step');
	};
	
	const onPrevious = () => {
		logger.debug('SMOTStep [onPrevious] - When Back button is clicked, then go to previous page..');
		
		if (isDirty) {
			// Save changes before navigating back
			updateSmotStepData({
				...getValues(),
				services,
				serviceName
			});
			
			showNotification({
				title: 'Changes Detected',
				withCloseButton: true,
				position: 'top-center',
				message: 'Your changes have been saved automatically.',
				color: 'blue'
			});
		}
		
		router.back();
	};
	
	const onCancel = () => {
		logger.debug('SMOTStep [onCancel] - When Cancel button is clicked, then go to Dashboard page..');
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
						updateSmotStepData({
							...getValues(),
							services,
							serviceName,
							serviceStatus: 'Draft'
						});
						
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
		logger.debug('SMOTStep [onSave] - When Save button is clicked, then save changes to the orders database..');
		
		updateSmotStepData({
			...getValues(),
			services,
			serviceName,
			serviceStatus: 'Draft'
		});
		
		showNotification({
			title: 'Success',
			withCloseButton: true,
			position: 'top-center',
			message: 'Order details have been saved successfully!',
			color: 'blue'
		});
	};
	
	const addService = () => {
		// Logic to add selected ports as services
		const newServices = [
			...services,
			...selectedIngressPorts.map((portId) => {
				const port = ingressPorts.find((p) => p.id === portId);
				const [chassis, slotInfo] = port.port.split('-', 3);
				const [slot, cardAndPort] = slotInfo.split('/');
				const card = cardAndPort ? cardAndPort.split('.')[0] : '';
				const portNumber = port.port.split('.').pop();
				
				return {
					id: services.length + portId,
					request: 'New',
					resource: 'Port',
					service: port.type,
					chassis: `${chassis}-${slotInfo}`,
					slot,
					card,
					port: portNumber
				};
			}),
			...selectedEgressPorts.map((portId) => {
				const port = egressPorts.find((p) => p.id === portId);
				const [chassis, slotInfo] = port.port.split('-', 3);
				const [slot, cardAndPort] = slotInfo.split('/');
				const card = cardAndPort ? cardAndPort.split('.')[0] : '';
				const portNumber = port.port.split('.').pop();
				
				return {
					id: services.length + portId + 100,
					request: 'New',
					resource: 'Port',
					service: port.type,
					chassis: `${chassis}-${slotInfo}`,
					slot,
					card,
					port: portNumber
				};
			})
		];
		
		setServices(newServices);
		setSelectedIngressPorts([]);
		setSelectedEgressPorts([]);
		
		showNotification({
			title: 'Service Added',
			message: 'Selected ports have been added to your services cart',
			color: 'green',
			icon: <IconCheck/>,
			withCloseButton: true,
			position: 'top-center'
		});
	};
	
	const resetCart = () => {
		setServices([]);
		showNotification({
			title: 'Cart Reset',
			message: 'All services have been removed from your cart',
			color: 'blue',
			withCloseButton: true,
			position: 'top-center'
		});
	};
	
	const removeService = (id) => {
		setServices(services.filter((service) => service.id !== id));
		showNotification({
			title: 'Service Removed',
			message: 'The service has been removed from your cart',
			color: 'blue',
			withCloseButton: true,
			position: 'top-center'
		});
	};
	
	const addPathRedundancy = () => {
		showNotification({
			title: 'Path Redundancy',
			message: 'Path redundancy feature will be implemented in a future update',
			color: 'blue',
			withCloseButton: true,
			position: 'top-center'
		});
	};
	
	const toggleIngressPortSelection = (portId) => {
		setSelectedIngressPorts((prev) => (prev.includes(portId) ? prev.filter((id) => id !== portId) : [...prev, portId]));
	};
	
	const toggleEgressPortSelection = (portId) => {
		setSelectedEgressPorts((prev) => (prev.includes(portId) ? prev.filter((id) => id !== portId) : [...prev, portId]));
	};
	
	// Calculate pagination
	const itemsPerPage = 5;
	const ingressPortsToShow = ingressPorts.slice((ingressPage - 1) * itemsPerPage, ingressPage * itemsPerPage);
	const egressPortsToShow = egressPorts.slice((egressPage - 1) * itemsPerPage, egressPage * itemsPerPage);
	const servicesToShow = services.slice((activePage - 1) * itemsPerPage, activePage * itemsPerPage);
	
	return (
		<div className="px-4 -mb-8">
			<Fragment>
				<Wizard activeStep={2}/>
				<FormProvider {...methods}>
					<form onSubmit={handleSubmit((data, event) => onSubmit(data, event))}>
						<div className="space-y-6">
							{/* Service Name */}
							<div className="mt-6">
								<Text weight={500} size="md" className="mb-2">
									Service Name
								</Text>
								<TextInput value={serviceName} onChange={(e) => setServiceName(e.target.value)}
										   className="max-w-md"/>
							</div>
							
							{/* Path Configuration */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								{/* Path 1 - Ingress */}
								<div className="border rounded-md p-4">
									<Text weight={500} size="md" className="mb-4">
										Path 1 - Ingress
									</Text>
									
									<div className="mb-4">
										<Text weight={500} size="sm" className="mb-1">
											Country
										</Text>
										<Select
											data={[
												{value: 'uk', label: 'United Kingdom'},
												{value: 'us', label: 'United States'},
												{value: 'ca', label: 'Canada'}
											]}
											defaultValue="uk"
											className="mb-4"
										/>
									</div>
									
									<div className="grid grid-cols-4 gap-2 mb-4">
										<div>
											<Text weight={500} size="sm" className="mb-1">
												Signal Type
											</Text>
											<Select
												data={[
													{value: 'hitless', label: 'Hitless'},
													{value: 'standard', label: 'Standard'}
												]}
												defaultValue="hitless"
											/>
										</div>
										<div>
											<Text weight={500} size="sm" className="mb-1">
												Service Ingress
											</Text>
											<Select
												data={[
													{value: 'chassis', label: 'Chassis'},
													{value: 'port', label: 'Port'}
												]}
												defaultValue="chassis"
											/>
										</div>
										<div>
											<Text weight={500} size="sm" className="mb-1">
												Ingress Site
											</Text>
											<Select
												data={[
													{value: 'port', label: 'Port'},
													{value: 'site1', label: 'Site 1'}
												]}
												defaultValue="port"
											/>
										</div>
										<div>
											<Text weight={500} size="sm" className="mb-1">
												ULCZ
											</Text>
											<TextInput defaultValue="Customer 2022-7-Ingress"/>
										</div>
									</div>
									
									{/* Ingress Ports Table */}
									<div className="border rounded-md overflow-hidden">
										<Table striped highlightOnHover>
											<thead>
											<tr>
												<th style={{width: 50}}>Select</th>
												<th>Signal Type</th>
												<th>Port</th>
												<th>Hitless</th>
											</tr>
											</thead>
											<tbody>
											{ingressPortsToShow.map((port) => (
												<tr key={port.id}
													className={selectedIngressPorts.includes(port.id) ? 'bg-blue-50' : ''}>
													<td>
														<input
															type="checkbox"
															checked={selectedIngressPorts.includes(port.id)}
															onChange={() => toggleIngressPortSelection(port.id)}
															className="h-4 w-4"
														/>
													</td>
													<td>{port.type}</td>
													<td>{port.port}</td>
													<td>{port.hitless}</td>
												</tr>
											))}
											</tbody>
										</Table>
										<div className="p-2 flex justify-end">
											<Pagination
												total={Math.ceil(ingressPorts.length / itemsPerPage)}
												value={ingressPage}
												onChange={setIngressPage}
												size="sm"
											/>
										</div>
									</div>
								</div>
								
								{/* Path 1 - Egress */}
								<div className="border rounded-md p-4">
									<Text weight={500} size="md" className="mb-4">
										Path 1 - Egress
									</Text>
									
									<div className="mb-4">
										<Text weight={500} size="sm" className="mb-1">
											Country
										</Text>
										<Select
											data={[
												{value: 'au', label: 'Australia'},
												{value: 'nz', label: 'New Zealand'},
												{value: 'sg', label: 'Singapore'}
											]}
											defaultValue="au"
											className="mb-4"
										/>
									</div>
									
									<div className="grid grid-cols-4 gap-2 mb-4">
										<div>
											<Text weight={500} size="sm" className="mb-1">
												Signal Type
											</Text>
											<Select
												data={[
													{value: 'hitless', label: 'Hitless'},
													{value: 'standard', label: 'Standard'}
												]}
												defaultValue="hitless"
											/>
										</div>
										<div>
											<Text weight={500} size="sm" className="mb-1">
												Service Egress
											</Text>
											<Select
												data={[
													{value: 'chassis', label: 'Chassis'},
													{value: 'port', label: 'Port'}
												]}
												defaultValue="chassis"
											/>
										</div>
										<div>
											<Text weight={500} size="sm" className="mb-1">
												Egress Site
											</Text>
											<Select
												data={[
													{value: 'port', label: 'Port'},
													{value: 'site1', label: 'Site 1'}
												]}
												defaultValue="port"
											/>
										</div>
										<div>
											<Text weight={500} size="sm" className="mb-1">
												SYCZ
											</Text>
											<TextInput defaultValue="Customer 2022-7-Egress"/>
										</div>
									</div>
									
									{/* Egress Ports Table */}
									<div className="border rounded-md overflow-hidden">
										<Table striped highlightOnHover>
											<thead>
											<tr>
												<th style={{width: 50}}>Select</th>
												<th>Signal Type</th>
												<th>Port</th>
												<th>Hitless</th>
											</tr>
											</thead>
											<tbody>
											{egressPortsToShow.map((port) => (
												<tr key={port.id}
													className={selectedEgressPorts.includes(port.id) ? 'bg-blue-50' : ''}>
													<td>
														<input
															type="checkbox"
															checked={selectedEgressPorts.includes(port.id)}
															onChange={() => toggleEgressPortSelection(port.id)}
															className="h-4 w-4"
														/>
													</td>
													<td>{port.type}</td>
													<td>{port.port}</td>
													<td>{port.hitless}</td>
												</tr>
											))}
											</tbody>
										</Table>
										<div className="p-2 flex justify-end">
											<Pagination
												total={Math.ceil(egressPorts.length / itemsPerPage)}
												value={egressPage}
												onChange={setEgressPage}
												size="sm"
											/>
										</div>
									</div>
								</div>
							</div>
							
							{/* Add Path Redundancy Button */}
							<Button fullWidth color="blue" onClick={addPathRedundancy} leftIcon={<IconPlus size={16}/>}>
								Add Path Redundancy
							</Button>
							
							{/* Add Service Button */}
							<div className="flex justify-end mt-4">
								<Button
									color="blue"
									onClick={addService}
									disabled={selectedIngressPorts.length === 0 && selectedEgressPorts.length === 0}
									leftIcon={<IconPlus size={16}/>}
								>
									Add Service
								</Button>
							</div>
							
							{/* Services Cart */}
							<div className="mt-8">
								<div className="flex justify-between items-center mb-4">
									<Text weight={500} size="lg">
										Services Cart
									</Text>
									<Button variant="outline" color="red" size="sm" onClick={resetCart}
											disabled={services.length === 0}>
										Reset Cart
									</Button>
								</div>
								<Text size="sm" color="dimmed" className="mb-4">
									Below is the list of the services you requested.
								</Text>
								
								{/* Search Box */}
								<div className="mb-4">
									<TextInput placeholder="Search all services" icon={<IconFilter size={16}/>}
											   className="max-w-md"/>
								</div>
								
								{/* Services Table */}
								<div className="border rounded-md overflow-hidden">
									<Table striped highlightOnHover>
										<thead>
										<tr>
											<th style={{width: 50}}>#</th>
											<th>Request</th>
											<th>Resource</th>
											<th>Service</th>
											<th>Chassis</th>
											<th>Slot</th>
											<th>Card</th>
											<th>Port</th>
											<th style={{width: 120}}>Actions</th>
										</tr>
										</thead>
										<tbody>
										{servicesToShow.length > 0 ? (
											servicesToShow.map((service, index) => (
												<tr key={service.id}>
													<td>{(activePage - 1) * itemsPerPage + index + 1}</td>
													<td>{service.request}</td>
													<td>{service.resource}</td>
													<td>{service.service}</td>
													<td>{service.chassis}</td>
													<td>{service.slot}</td>
													<td>{service.card}</td>
													<td>{service.port}</td>
													<td>
														<Group spacing={4}>
															<ActionIcon color="blue" variant="subtle">
																<IconEye size={16}/>
															</ActionIcon>
															<ActionIcon color="green" variant="subtle">
																<IconEdit size={16}/>
															</ActionIcon>
															<ActionIcon color="red" variant="subtle"
																		onClick={() => removeService(service.id)}>
																<IconTrash size={16}/>
															</ActionIcon>
														</Group>
													</td>
												</tr>
											))
										) : (
											<tr>
												<td colSpan={9} className="text-center py-4">
													No services added yet. Select ports and click "Add Service" to add
													services to your cart.
												</td>
											</tr>
										)}
										</tbody>
									</Table>
									{services.length > itemsPerPage && (
										<div className="p-2 flex justify-end">
											<Pagination
												total={Math.ceil(services.length / itemsPerPage)}
												value={activePage}
												onChange={setActivePage}
												size="sm"
											/>
										</div>
									)}
								</div>
							</div>
							
							{/* Action Buttons */}
							<div
								className="flex items-center justify-between border-t border-gray-900/10 px-4 py-12 sm:px-2">
								<div className="flex items-center gap-x-6">
									<Button
										type="button"
										onClick={onCancel}
										disabled={isSubmitting}
										style={{color: 'Black', backgroundColor: 'white'}}
									>
										Cancel
									</Button>
									<Button type="button" onClick={onSave} disabled={isSubmitting} color="blue"
											variant="outline">
										Save
									</Button>
								</div>
								<div className="flex items-center gap-x-6">
									<Button
										type="button"
										onClick={onPrevious}
										disabled={isSubmitting}
										style={{color: 'Black', backgroundColor: 'white'}}
									>
										Back
									</Button>
									<Button type="submit" disabled={isSubmitting || services.length === 0} color="blue">
										Next
									</Button>
								</div>
							</div>
						</div>
					</form>
				</FormProvider>
			</Fragment>
		</div>
	);
};

SMOTStep.getInitialProps = async (context, client, currentUser) => {
	logger.debug(`SMOTStep [getInitialProps] - currentUser: ${currentUser?.name}`);
	return {currentUser};
};

export default SMOTStep;
