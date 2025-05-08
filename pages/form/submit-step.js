'use client';

import React, {Fragment, useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import useOrderStore from '@/store/useOrderStore';
import useFormRequest from '@/hooks/use-form-request';
import Wizard from '@/components/Forms/Wizard';
import {
	Anchor,
	Breadcrumbs,
	Button,
	Divider,
	Flex,
	Loader,
	Notification,
	rem,
	Space,
	Stack,
	Table,
	Text
} from '@mantine/core';
import {notifications} from '@mantine/notifications';
import {IconCheck, IconX} from '@tabler/icons-react';
import {getLogger} from '@/utils/logger/logger';
import AddedServices from '@/pages/cart/added-services';

const logger = getLogger('SubmitOrder');
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const showErrorNotification = (title, message, errors = []) => {
	const errorDetails = errors.map((error, index) => `${index + 1}. ${error.message || error}`).join('\n');
	notifications.show({
		color: 'red',
		title,
		message: `${message}\n\nDetails:\n${errorDetails}`,
		icon: <IconX/>,
		autoClose: 10000,
		withCloseButton: true,
		position: 'top-center'
	});
};

const updateNotification = (id, title, message, color = 'blue') => {
	notifications.update({
		id,
		color,
		title,
		message,
		icon: <IconCheck style={{width: rem(18), height: rem(18)}}/>,
		autoClose: 5000
	});
};

const showSuccessNotification = (title, message) => {
	notifications.show({
		color: 'green',
		title,
		message,
		icon: <IconCheck/>,
		autoClose: 10000,
		withCloseButton: true,
		position: 'top-center'
	});
};

const SubmitStep = ({currentUser}) => {
	const router = useRouter();
	const [mounted, setMounted] = useState(false);
	const [orderId, setOrderId] = useState(null);
	const [serviceOrderId, setServiceOrderId] = useState(null);
	const {transformedData} = useOrderStore();
	const services = transformedData?.services || [];
	const [status, setStatus] = useState('idle');
	const [submitting, setSubmitting] = useState(false);
	const [progressMessage, setProgressMessage] = useState('Initializing...');
	const {doRequest: createOrderRequest, errors: createOrderErrors} = useFormRequest();
	const {doRequest: createIssuesRequest, errors: createIssuesErrors} = useFormRequest();
	const {doRequest: updateOrderRequest, errors: updateOrderErrors} = useFormRequest();
	logger.info(`SubmitStep - Submit Order with no of services: ${services.length}, currentUser: ${currentUser?.name}`);
	
	const cartItems = [
		{title: `Number of Services requested: ${services.length}`, href: '#'},
		{title: 'click here', href: '/cart/added-services'}
		// {
		// 	title: 'Review Services', href: {
		// 		pathname: '/cart/review-services',
		// 		query: {service: JSON.stringify(services)}
		// 	}
		// }
	].map((cartItem, index) => (
		<Anchor href={cartItem.href} key={index}>
			<Text size="sm" variant="gradient" td="underline" gradient={{from: 'blue', to: 'cyan', deg: 90}}>
				{cartItem.title}
			</Text>
		</Anchor>
	));
	
	useEffect(() => {
		setMounted(true);
		if (!currentUser) {
			(async () => {
				await router.push('/auth/signin', undefined, {shallow: true});
			})();
		} else if (router.isReady) {
			const {serviceOrderId} = router.query;
			setServiceOrderId(serviceOrderId);
		}
	}, [router.isReady, router.query, currentUser]);
	
	const handleApiError = (notificationId, error) => {
		setSubmitting(false);
		const apiErrors = error.response?.data?.errors || [{message: error.message}];
		showErrorNotification('Error', 'API call failed', apiErrors);
	};
	
	const handleSubmit = async (event) => {
		event.preventDefault();
		setSubmitting(true);
		setStatus('loading');
		
		notifications.show({
			loading: true,
			title: 'Submitting your order',
			message: 'Please wait while your order is being processed...',
			autoClose: 10000,
			withCloseButton: false
		});
		
		try {
			// Step 1: Create the Order
			setProgressMessage('Step 1: Creating Order...');
			const order = await createOrderRequest({
				url: '/api/orders',
				method: 'post',
				body: {serviceOrderId}
			});
			
			if (!order || !order.id) {
				logger.error('Order ID not found after Order creation');
				throw new Error('Order ID not found after Order creation');
			}
			setOrderId(order.id);
			const orderInfo = `Order ID: ${order.id}, state orderId: ${orderId}`;
			
			logger.info(`Step 1: Order created: ${orderInfo}`);
			await delay(2000);
			
			// Step 2: Create Jira issues for the Order
			setProgressMessage('Step 2: Creating Jira Issues...');
			const issues = await createIssuesRequest({
				url: '/api/issues',
				method: 'post',
				body: {orderId: order.id}
			});
			const {epicId, projectStoryId, designStoryId, networkStoryId, codecStoryId} = issues;
			const issueInfo = `OrderId: ${orderId}, epicId: ${epicId}, projectStoryId: ${projectStoryId}, designStoryId: ${designStoryId},
                                networkStoryId: ${networkStoryId}, codecStoryId: ${codecStoryId}`;
			
			logger.info(`Step 2: Jira issues created for the Order: ${issueInfo}`);
			await delay(2000);
			
			// Step 3: Update the order with the created Jira issue IDs and User
			setProgressMessage('Step 3: Updating Order with Jira Issues...');
			await updateOrderRequest({
				url: `/api/orders/${order.id}`,
				method: 'put',
				body: {
					epicId,
					projectStoryId,
					designStoryId,
					networkStoryId,
					codecStoryId,
					userName: currentUser?.name ?? 'Portal User'
				}
			});
			setStatus('success');
			setProgressMessage('Step 3: Successfully submitted your order!');
			logger.info(`Step 3: Successfully updated Order ${order.id} with Jira Issues by User: ${currentUser?.name}`);
			await delay(2000);
			
			// Step 4: Display all collected info in final notification
			setProgressMessage('Step 4: Successfully submitted your Order for Pre-feasibility!');
			logger.info(`Step 4: Successfully submitted your Order for Pre-feasibility: orderInfo: ${orderInfo}, issueInfo: ${issueInfo}`);
			await delay(2000);
			
			// Step 5: Redirect to order details page
			setTimeout(async () => {
				setSubmitting(false);  // Stop the loader
				// await router.push(`/orders/${order.id}`);
				await router.push({
					// pathname: '/orders/[orderId]',
					pathname: `/orders/${order.id}`,
					query: {orderId: issues.orderId, issues: JSON.stringify(issues)}
				}, undefined, {shallow: true});
			}, 2000);
			
		} catch (err) {
			setSubmitting(false);
			setStatus('failure');
			setProgressMessage('Error: Order submission failed!');
			handleApiError('order_submission_error', err);
		}
	};
	
	const onPrevious = () => {
		logger.info('SubmitOrder - Go back to Review Page!');
		router.back();
	};
	
	const reviewJSON = () => {
		logger.info('SubmitOrder - Review Order before submission');
		(async () => {
			await router.push('/misc/submit-json', null, {shallow: true});
		})();
	};
	
	const onCancel = () => {
		logger.info('SubmitOrder - Cancel will redirect to Dashboard!');
		(async () => {
			await router.push('/', null, {shallow: true});
		})();
	};
	
	if (!mounted || !currentUser) return null;
	
	return (
		<Fragment>
			<Wizard activeStep={3}/>
			<Stack>
				<div className="space-y-12 sm:space-y-16 pb-10">
					<header className="float-none relative isolate pt-0">
						<div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
							<div
								className="absolute left-16 top-full -mt-15 transform-gpu opacity-50 blur-3xl xl:left-1/2 xl:-ml-80">
								<div
									className="aspect-[1154/678] w-[72.125rem] bg-gradient-to-br from-[#FF80B5] to-[#9089FC]"
									style={{
										clipPath:
											'polygon(100% 38.5%, 82.6% 100%, 60.2% 37.7%, 52.4% 32.1%, 47.5% 41.8%, 45.2% 65.6%, 27.5% 23.4%, 0.1% 35.3%, 17.9% 0%, 27.7% 23.4%, 76.2% 2.5%, 74.2% 56%, 100% 38.5%)'
									}}
								/>
							</div>
							<div className="absolute inset-x-0 bottom-0 h-px bg-gray-900/5"/>
						</div>
						<div className="max-w-7xl py-10 sm:px-80">
							<Flex justify="space-between" align="center">
								<div className="flex items-center gap-x-4">
									<img
										src="https://tailwindcss.com/plus-assets/img/logos/48x48/tuple.svg"
										alt=""
										className="h-16 w-16 flex-none rounded-full ring-1 ring-gray-900/10"
									/>
									<h1>
										<div className="text-base leading-10 text-gray-500">
											GMN Order Summary <span className="text-gray-700"></span>
										</div>
										<div className="mt-1 text-sm font-semibold leading-6 text-gray-700">
											<dt className="inline text-gray-600 text-sm">Project Name :</dt>
											{' '}
											<dd className="inline text-gray-900">
												{transformedData?.projectName}
											</dd>
										</div>
									</h1>
								</div>
							</Flex>
						</div>
					</header>
					<div className="min-w-full py-1 sm:px-12 lg:px-16">
						<div className="mx-12 lg:grid-cols-2">
							<div
								className="shadow-sm ring-1 ring-gray-900/5 sm:mx-0 sm:rounded-lg xl:px-10 xl:pb-8 xl:pt-10">
								<Text size="md" variant="gradient" td="underline"
									  gradient={{from: 'blue', to: 'cyan', deg: 90}}>
									Order
									Information
								</Text>
								<dl className="mt-6 grid grid-cols-1 text-sm leading-6 sm:grid-cols-2">
									<div className="sm:pr-4">
										<dt className="inline text-gray-500 text-sm">Classification :</dt>
										{' '}
										<dd className="inline text-gray-900">
											{transformedData?.orderType}
										</dd>
										<div className="mt-1">
											<span className="font-medium text-gray-500">Description : </span>
											<span className="text-gray-900">{transformedData?.remarks}</span>
										</div>
										<div className="mt-1">
											<span className="text-gray-500"> Stage code : </span>
											<span
												className="text-gray-900">{transformedData?.currentStageCode}</span>
											<dd className="mt-1 text-gray-500">
												<span className="text-gray-500">Service type : </span>
												<span
													className="text-gray-900">{transformedData?.serviceType}</span>
											</dd>
										</div>
									</div>
									<div className="mt-2 sm:mt-0 sm:pl-4">
										<dt className="inline text-gray-500">Due on :</dt>
										{' '}
										<dd className="inline text-gray-900">
											<time dateTime={transformedData?.handoverDate}>
												{transformedData?.handoverDate}
											</time>
										</dd>
										<div className="mt-1 sm:pr-4">
											<dt className="inline text-gray-500 text-sm">Submitted by :</dt>
											{' '}
											<dd className="inline text-gray-900">
												{currentUser?.name}
											</dd>
											<div className="mt-1">
												<span className="text-gray-500">Customer name : </span>
												<span
													className="text-gray-900">{transformedData?.customerName}</span>
												<dd className="mt-1 text-gray-500">
													<span className="text-gray-500">CIDN : </span>
													{transformedData?.cidn}
												</dd>
											</div>
										</div>
									</div>
									<div className="mt-6 border-t border-gray-900/5 pt-6 sm:pr-4">
										<dt className="font-semibold text-gray-900">From :</dt>
										<dd className="mt-2 text-gray-500">
											<div className="mt-1">
												<span className="text-gray-500">Site Address : </span>
												<span
													className="text-gray-900">{transformedData?.aEndAddress}</span>
											</div>
										</dd>
										<dd className="mt-1 text-gray-500">
											<span className="text-gray-500">Site Code : </span>
											<span className="text-gray-900">{transformedData?.aSiteName}</span>
										</dd>
									</div>
									<div className="mt-8 sm:mt-6 sm:border-t sm:border-gray-900/5 sm:pl-4 sm:pt-6">
										<dt className="font-semibold text-gray-900">To :</dt>
										<dd className="mt-2 text-gray-500">
											<div className="mt-1">
												<span className="text-gray-500">Site Address : </span>
												<span
													className="text-gray-900">{transformedData?.bEndAddress}</span>
											</div>
										</dd>
										<dd className="mt-1 text-gray-500">
											<span className="text-gray-500">Site Code : </span>
											<span className="text-gray-900">{transformedData?.bSiteName}</span>
										</dd>
									</div>
								</dl>
								<Space h="lg"/>
								<Divider/>
								<Space h="lg"/>
								<Flex
									mih={30}
									gap="lg"
									justify="left"
									align="left"
									direction="row"
									wrap="wrap"
								>
									<Breadcrumbs separator="→" mt="xs">
										{cartItems}
									</Breadcrumbs>
								</Flex>
								
								<form onSubmit={handleSubmit}>
									<Stack>
										{submitting && (
											<div style={{
												position: 'fixed',
												top: 0,
												left: 0,
												width: '100%',
												height: '100vh',
												display: 'flex',
												flexDirection: 'column',
												justifyContent: 'center',
												alignItems: 'center',
												backgroundColor: 'rgba(255, 255, 255, 0.6)',
												zIndex: 1000
											}}>
												<Loader size="xl"/>
												<p style={{
													marginTop: '20px',
													fontSize: '18px',
													color: '#000'
												}}>{progressMessage}</p>
											</div>
										)}
										{status === 'loading' && (
											<Notification color="blue" title="Submitting">
												Please wait while your order is being processed...
											</Notification>
										)}
										{status === 'success' && (
											<Notification color="teal" title="Success"
														  onClose={() => router.push(`/orders/${orderId}`)}>
												Order and issues were successfully created!
											</Notification>
										)}
										{status === 'failure' && (
											<Notification color="red" title="Error"
														  onClose={() => setSubmitting(false)}>
												There was an issue with submitting your order.
											</Notification>
										)}
										< AddedServices/>
										<Space h="lg"/>
										<Flex
											mih={30}
											gap="md"
											justify="left"
											align="left"
											direction="row"
											wrap="wrap">
											<Text size="sm" variant="gradient" td="underline"
												  gradient={{from: 'blue', to: 'cyan', deg: 90}}>
												Invoice
											</Text>
										</Flex>
										<Table striped highlightOnHover withBorder withColumnBorders>
											<thead>
											<tr>
												<th>Description</th>
												<th>Unit Price</th>
												<th>Amount</th>
											</tr>
											</thead>
											<tbody>
											<tr>
												<td></td>
												<td>Subtotal</td>
												<td></td>
											</tr>
											<tr>
												<td></td>
												<td>Shipping</td>
												<td></td>
											</tr>
											<tr>
												<td></td>
												<td>Discount</td>
												<td></td>
											</tr>
											<tr>
												<td></td>
												<td>Total</td>
												<td></td>
											</tr>
											</tbody>
										</Table>
									</Stack>
									<Space h="xl"/>
									<Divider size="md"/>
									<div
										className="flex items-center justify-between gap-x-6 border-t border-gray-900/10 px-4 py-2 sm:px-8">
										<div className="mt-8 flex items-center gap-x-6">
											<button
												type="button"
												onClick={() => onCancel()}
												className="text-sm font-semibold leading-6 text-gray-900">
												Cancel
											</button>
											<Button
												type="button"
												style={{backgroundColor: 'lightgray'}}
												onClick={() => reviewJSON()}>
												View JSON
											</Button>
										</div>
										<div className="mt-8 flex items-center gap-x-6">
											<button
												type="button"
												onClick={() => onPrevious()}
												className="text-sm font-semibold leading-6 text-gray-900">
												Back
											</button>
											
											{/*{submitButton}*/}
											<Button type="submit" disabled={submitting}>
												{submitting ? 'Submitting...' : 'Submit Order'}
											</Button>
											
											{/* Error Notifications for Each API */}
											{createOrderErrors && createOrderErrors.message && (
												<div className="mt-4 text-red-500">
													Error with Order Submission: {createOrderErrors.message}
													{createOrderErrors.errors && (
														<ul>
															{createOrderErrors.errors.map((error, index) => (
																<li key={index}>{error}</li>
															))}
														</ul>
													)}
												</div>
											)}
											{createIssuesErrors && createIssuesErrors.message && (
												<div className="mt-4 text-red-500">
													Error with creation of Jira Issues: {createIssuesErrors.message}
													{createIssuesErrors.errors && (
														<ul>
															{createIssuesErrors.errors.map((error, index) => (
																<li key={index}>{error}</li>
															))}
														</ul>
													)}
												</div>
											)}
											{updateOrderErrors && updateOrderErrors.message && (
												<div className="mt-4 text-red-500">
													Error while updating the Order: {updateOrderErrors.message}
													{updateOrderErrors.errors && (
														<ul>
															{updateOrderErrors.errors.map((error, index) => (
																<li key={index}>{error}</li>
															))}
														</ul>
													)}
												</div>
											)}
										
										</div>
									</div>
								</form>
							</div>
						</div>
					</div>
				</div>
			</Stack>
		</Fragment>
	);
};

SubmitStep.getInitialProps = async (context, client, currentUser) => {
	logger.info('SubmitStep [getInitialProps] - currentUser: ' + currentUser?.name);
	return {currentUser};
};

export default SubmitStep;


