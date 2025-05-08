'use client';

import {Fragment, useState} from 'react';
import {useRouter} from 'next/router';
import useOrderStore from '@/store/useOrderStore';
import useRequest from '@/hooks/use-request';
import {FormProvider, useForm} from 'react-hook-form';
import {showNotification} from '@mantine/notifications';
import Wizard from '@/components/Forms/Wizard';
import CustomLink from '@/components/Shared/CustomLink';
import DatePicker from '@/components/Forms/DatePicker';
import DropzoneInput from '@/components/Forms/DropzoneInput';
import Input from '@/components/Forms/Input';
import SelectMenu from '@/components/Forms/SelectMenu';
import Textarea from '@/components/Forms/TextArea';
import UnstyledLink from '@/components/Shared/UnstyledLink';
import BtnFunction from '@/components/Forms/Button';
import {getLogger} from '@/utils/logger/logger';
import SignInPrompt from '@/pages/misc/not-signed';
import clsx from 'clsx';
import dynamic from 'next/dynamic';
import {Grid, Paper, Text, Title} from '@mantine/core';

const ReviewServices = dynamic(() => import('@/components/Cart/ReviewServices'), {ssr: false});
const logger = getLogger('ReviewStep');

const ReviewServicesContainer = ({services = [], country, site, siteDesc}) => {
	// Handle empty array case
	if (!services.length) return <p>No services added.</p>;
	
	return (
		<div className="mt-4">
			<h1 className="mt-6 semibold text-indigo-900 text-sm">
				Review Services (Expand each service)
			</h1>
			<table className="mt-2 w-full divide-y divide-gray-300">
				<ReviewServices
					services={services}
					country={country}
					site={site}
					siteDesc={siteDesc}
				/>
			</table>
		</div>
	);
};

const ReviewStep = ({currentUser}) => {
	logger.info(`ReviewStep - Review the Order details before submission by User: ${currentUser?.name} `);
	if (!currentUser) return <SignInPrompt/>;
	
	const router = useRouter();
	const {
		firstStep,
		secondStep,
		setTransformedData,
		transformedData,
		setServiceOrderId,
		// orderType,
		orderData,
		serviceData,
		resourceData,
		smotData
	} = useOrderStore();
	
	const [requestData, setRequestData] = useState(null);
	const [orderCreated, setOrderCreated] = useState(false);
	
	const {doRequest, errors} = useRequest({
		url: '/api/service-orders',
		method: 'post',
		onSuccess: async (response) => {  // Make this async
			const serviceOrderId = response.id;
			logger.info(`ReviewOrder [useRequest] - serviceOrderId: ${serviceOrderId}`);
			setServiceOrderId(serviceOrderId);
			setOrderCreated(true); // Set orderCreated to true after successful creation
			// Redirect to submit step after creation
			await router.push({
				pathname: '/form/submit-step',
				query: {serviceOrderId}
			});
			
			// Show notification after redirect
			showNotification({
				title: 'All good!',
				withCloseButton: true,
				position: 'top-center',
				message: 'Order details have been successfully confirmed!',
				color: 'blue'
			});
		}
	});
	
	const methods = useForm({
		mode: 'onSubmit',
		defaultValues: {...firstStep, ...secondStep}
	});
	
	const {handleSubmit, formState} = methods;
	
	const onSubmit = async (data, event) => {
		event.preventDefault();
		logger.info(`ReviewStep [onSubmit] - data : ${JSON.stringify(data)} `);
		
		// Exclude below attributes - omit technique by leveraging object destructuring and the Rest (...)
		// operator
		const {
			customerHandoverTargetDate,
			siteOptions,
			chassisOptions,
			farSiteOptions,
			farChassisOptions,
			...filteredData
		} = data;
		
		logger.info(`ReviewStep [onSubmit] - filteredData : ${JSON.stringify(filteredData)} `);
		
		// Transform data before Posting it to database
		const transformedData = {
			userName: currentUser?.name ?? 'Portal User',
			...filteredData, // Includes all attributes except the excluded ones
			services: data.services.map(({
											 slotOptions,
											 portOptions,
											 sourceSlotOptions,
											 sourcePortOptions,
											 farSlotOptions,
											 farPortOptions,
											 ...filteredService
										 }) => ({
				...filteredService // Includes all service attributes except excluded ones
			}))
		};
		
		setTransformedData(transformedData);
		logger.info(`ReviewStep [onSubmit] - transformedData : ${JSON.stringify(transformedData)} `);
		
		// Await doRequest to ensure it completes before proceeding
		await doRequest(transformedData);
	};
	
	const onCancel = () => {
		logger.trace('ReviewStep [onCancel]');
		showNotification({
			title: 'Cancelled',
			withCloseButton: true,
			position: 'top-center',
			message: 'Order is cancelled, redirecting to Dashboard!',
			color: 'yellow'
		});
		router.push('/');
	};
	
	const onPrevious = () => {
		logger.trace('ReviewStep [onPrevious] - Navigating back!');
		showNotification({
			title: 'Back',
			withCloseButton: true,
			position: 'top-center',
			message: 'You have navigated back!',
			color: 'blue'
		});
		router.back();
	};
	
	const onSave = () => {
		logger.trace('ReviewStep [onSave] - Saving data!');
		// Save the serviceOrder data into database using api '/api/service-orders' and then go back
		// saveData();
		showNotification({
			title: 'Saved',
			withCloseButton: true,
			position: 'top-center',
			message: 'Order details have been saved successfully!',
			color: 'blue'
		});
	};
	
	// Handle back button
	const handleBack = () => {
		if (orderType === 'SMOT') {
			router.push('/form/smot-step');
		} else {
			router.push('/form/second-step');
		}
	};
	
	// Handle next button
	const handleNext = () => {
		router.push('/form/submit-step');
	};
	
	// Get the order type from the first step
	const orderType = firstStep.orderType;
	
	// Render order type specific review content
	const renderOrderTypeSpecificReview = () => {
		if (orderType === 'SMOT') {
			return (
				<div>
					<Title order={3} mt="md">
						Service Order Details
					</Title>
					<Grid>
						<Grid.Col span={6}>
							<Text weight={500}>Service Order ID:</Text>
							<Text>{smotData?.serviceOrderId || 'N/A'}</Text>
						</Grid.Col>
						<Grid.Col span={6}>
							<Text weight={500}>Service Type:</Text>
							<Text>{smotData?.serviceType || 'N/A'}</Text>
						</Grid.Col>
						{/* Add more SMOT specific fields */}
					</Grid>
				</div>
			);
		} else {
			// Default MOT review content
			return (
				<div>
					<Title order={3} mt="md">
						Service Details
					</Title>
					<Grid>
						{/* Render MOT specific review content */}
						{/* This would include serviceData and resourceData */}
					</Grid>
				</div>
			);
		}
	};
	
	return (
		
		<div className="px-28">
			{/*<Container size="lg" py="xl">*/}
			{/*	<Paper shadow="xs" p="md">*/}
			{/*		<Title order={2} mb="md">*/}
			{/*			Review Your Order*/}
			{/*		</Title>*/}
			{/*		*/}
			{/*		<div>*/}
			{/*			<Title order={3}>Order Information</Title>*/}
			{/*			<Grid>*/}
			{/*				<Grid.Col span={2}>*/}
			{/*					<Text weight={500}>Order Type:</Text>*/}
			{/*					<Text>*/}
			{/*						{orderType === 'SOT' && 'New Sales Order (SOT)'}*/}
			{/*						{orderType === 'MOT' && 'Modify Sales Order (MOT)'}*/}
			{/*						{orderType === 'SMOT'}*/}
			{/*					</Text>*/}
			{/*				</Grid.Col>*/}
			{/*				/!* Add more order information fields *!/*/}
			{/*			</Grid>*/}
			{/*		</div>*/}
			{/*		*/}
			{/*		{renderOrderTypeSpecificReview()}*/}
			{/*		*/}
			{/*		<Group position="right" mt="xl">*/}
			{/*			<Button variant="outline" onClick={handleBack}>*/}
			{/*				Back*/}
			{/*			</Button>*/}
			{/*			<Button onClick={handleNext}>Submit</Button>*/}
			{/*		</Group>*/}
			{/*	</Paper>*/}
			{/*</Container>*/}
			<Fragment>
				<Wizard activeStep={2}/>
				<FormProvider {...methods}>
					<form onSubmit={handleSubmit((data, event) => onSubmit(data, event))}>
						<div className="sm:space-y-4">
							<div
								className="mt-12 space-y-8 border-b border-gray-900/10  sm:border-t">
								<div className="mt-6">
									<h1 className="font-semibold text-indigo-900 text-xl">
										<CustomLink className="hover:text-blue-200" href="/form/first-step">
											Edit - Order details
										</CustomLink>
									</h1>
									
									<Paper shadow="xs" p="md">
										<SelectMenu readOnly id="network" label="Network"
													placeholder="Choose the Network">
											<option value="G">Global Media network (GMN)</option>
										</SelectMenu>
										<SelectMenu readOnly id="orderType" label="Order Type"
													placeholder="Choose Order Type">
											<option value="MOT">Modify Sales Order (MOT)</option>
											<option value="SOT">New Sales Order (SOT)</option>
											<option value="SMOT">Service Orders (SMOT)</option>
										</SelectMenu>
										<Input id="projectName" label="Project Name" readOnly/>
										<Textarea id="remarks" label="Remarks" readOnly/>
										<DatePicker id="customerHandoverTargetDate" label="HandOver Date" readOnly/>
										<DropzoneInput id="supportingDocs" label="Supporting Docs" readOnly/>
										<p className="text-sm text-indigo-400 text-center">
											File preview in progress
										</p>
									</Paper>
								</div>
							</div>
							
							<div className=" border-b border-gray-900/10">
								<h1 className="font-semibold text-indigo-900 text-xl">
									<CustomLink className="hover:text-blue-600" href="/form/second-step">
										Edit - Service details
									</CustomLink>
								</h1>
								
								<Paper shadow="xs" p="md">
									<ReviewServicesContainer
										services={secondStep.services}
										country={secondStep.country}
										site={secondStep.site}
										siteDesc={secondStep.siteDesc}
									/>
									{/*<NewServicesTable />*/}
								</Paper>
							</div>
							
							{/* Render errors for Post Service Orders request */}
							{errors && errors.message && (
								<div className="mt-4 text-red-500">{errors.message}</div>
							)}
							
							<UnstyledLink
								href="/misc/review-json"
								className={clsx(
									'mt-8 inline-block py-2 px-4 rounded font-bold hover:text-primary-400 animated-underline',
									'focus:outline-none focus-visible:ring ring-primary-400 ring-offset-2',
									'border border-gray-200 text-gray-400'
								)}
							> Review data
							</UnstyledLink>
							
							<div className="flex items-center justify-between gap-x-6
                                            border-t border-gray-900/10 px-4 py-4 sm:px-2">
								<div className="mt-4 flex items-center gap-x-6">
									<button
										type="button"
										onClick={onCancel}
										className="text-sm font-semibold leading-6 text-gray-900"
										disabled={formState.isSubmitting}
									>
										Cancel
									</button>
									<BtnFunction
										type="button"
										onClick={onSave}
										disabled={formState.isSubmitting}>
										Save
									</BtnFunction>
								</div>
								<div className="flex items-center gap-x-6">
									<button
										type="button"
										onClick={onPrevious}
										disabled={formState.isSubmitting}
										className="text-sm font-semibold leading-6 text-gray-900"
									>
										Back
									</button>
									<BtnFunction
										type="submit"
										disabled={formState.isSubmitting}
									>
										Confirm
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

ReviewStep.getInitialProps = async (context, client, currentUser) => {
	logger.info('ReviewStep [getInitialProps] - currentUser: ' + currentUser?.name);
	return {currentUser};
};

export default ReviewStep;


// import { useAuth } from '@/hooks/use-auth';
// import { Loader } from '@mantine/core';
// const { currentUser, loading } = useAuth();
// if (loading) {
//     return (
//       <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
//           <Loader size="xl" variant="dots" /> {/* You can change the size and variant as needed */}
//       </div>
//     );
// }
// if (!currentUser) {
//     return <SignInPrompt />;
// }