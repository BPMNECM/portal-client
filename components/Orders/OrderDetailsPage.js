import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import useRequest from '@/hooks/use-request';
import useNATFWDesign from '@/components/Design/UpdateNATFW';
import {requestTypeDisplayNames} from '@/utils/form-utils';
import {IconCheck, IconLoader, IconX} from '@tabler/icons-react';
import {getLogger} from '@/utils/logger/logger';
import {
	Box,
	Button,
	Divider,
	Drawer,
	Flex,
	Group,
	Highlight,
	Menu,
	Notification,
	Space,
	Stack,
	Switch,
	Table,
	Text,
	TextInput,
	Timeline,
	Title
} from '@mantine/core';
import {useDisclosure} from '@mantine/hooks';
import {saveAs} from 'file-saver';

const TEXT_PROPS = {fz: 'sm'};
const logger = getLogger('OrderDetailsPage');
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const OrderDetailsPage = ({data}) => {
	const router = useRouter();
	// const {orderId, issues} = router.query;
	const {orderId} = router.query; // Only get orderId from query
	const [issuesData, setIssuesData] = useState(null);
	const [showTimeline, setShowTimeline] = useState(false);
	const [loadingIssues, setLoadingIssues] = useState(false);
	const toggleTimeline = () => setShowTimeline(!showTimeline);
	const [showIssuesDrawer, setShowIssuesDrawer] = useState(false);
	
	const services = data.serviceOrder?.services || [];
	const [projectNumber, setProjectNumber] = useState(data.projectNumber || '');
	const [checked, setChecked] = useState(false);
	const [apiLogs, setApiLogs] = useState([]);
	
	const initialUiState = {
		showError: false,
		notificationMessage: '',
		showNotification: false,
		showLoader: false,
		status: 'idle'
	};
	const [uiState, setUiState] = useState(initialUiState);
	
	const updateUiState = (updates) => {
		setUiState((prevState) => ({...prevState, ...updates}));
	};
	
	const {showLoader, showNotification, showError, notificationMessage, status} = uiState;
	const [drawerOpened, {open: openDrawer, close: closeDrawer}] = useDisclosure(false);
	const {updateNATFWDesign, errorMessage, designNotification} = useNATFWDesign(orderId);
	logger.debug(`[OrderDetailsPage] - query:orderId : ${orderId}, props:orderData: ${JSON.stringify(data)} `);
	
	const saveLogsToFile = () => {
		const logs = {designNotification, errorMessage};
		const blob = new Blob([JSON.stringify(logs, null, 2)], {type: 'application/json'});
		saveAs(blob, `design-logs-${orderId}.json`);
	};
	
	const appendLog = (message, level = 'info') => {
		setApiLogs((prevLogs) => [
			...prevLogs,
			{message, level, timestamp: new Date().toLocaleTimeString()}
		]);
	};
	
	/** Sending Logs to Backend: **/
	// const saveLogsToBackend = async () => {
	// 	await fetch('/api/save-logs', {
	// 		method: 'POST',
	// 		headers: {'Content-Type': 'application/json'},
	// 		body: JSON.stringify({
	// 			orderId,
	// 			designNotification,
	// 			errorMessage
	// 		})
	// 	});
	// };
	
	/** Retrieving Logs from Backend: **/
		// useEffect(() => {
		// 	const fetchLogs = async () => {
		// 		const response = await fetch(`/api/get-logs?orderId=${orderId}`);
		// 		const data = await response.json();
		// 		if (data) {
		// 			setDesignNotification(data.designNotification || []);
		// 			setErrorMessage(data.errorMessage || []);
		// 		}
		// 	};
		//
		// 	fetchLogs();
		// }, [orderId]);
	
	const {doRequest: getOrderRequest, errors: getOrderErrors} = useRequest({
			url: `/api/orders/${orderId}`,
			method: 'get',
			onSuccess: (orderData) => {
				appendLog(`Order ${orderId} retrieved successfully`, 'info');
				logger.info(`OrderDetailsPage [Step1] - Order ${orderId} retrieved successfully...`);
				setIssuesData(orderData.issues);
			}
		});
	
	const fetchOrderAndExtractIssues = async () => {
		try {
			setShowIssuesDrawer(true);
			setLoadingIssues(true);
			logger.info(`OrderDetailsPage [fetchOrderAndExtractIssues] - orderId: ${orderId} `);
			
			const orderData = await getOrderRequest();
			const {issues} = orderData || {};
			if (!issues) {
				logger.warn(`No Pre-feasibility tickets were found for this order - ${orderId}`);
				throw new Error(`No Pre-feasibility tickets were found for this order - ${orderId}`);
			}
			setIssuesData(issues);
		} catch (error) {
			logger.error(`Error fetching order data or extracting issues: ${error} `);
			setIssuesData(null);
		} finally {
			setLoadingIssues(false);
		}
	};
	
	const handleTrackOrder = async () => {
		await fetchOrderAndExtractIssues();
		setShowTimeline(true);
	};
	
	const {doRequest: updateOrderRequest, errors: updateOrderErrors} = useRequest({
		url: `/api/orders/${orderId}`,
		method: 'put',
		onSuccess: async () => {
			appendLog(`Order ${orderId} updated successfully`, 'info');
			updateUiState({notificationMessage: `Order: ${orderId} updated successfully with project number`});
			logger.info(`OrderDetailsPage [Step1] - Order: ${orderId} updated successfully with project number`);
			// setNotificationMessage('Order successfully updated with project number');
			// setShowNotification(true);
			await delay(5000);
		}
	});
	
	const {doRequest: cancelOrderRequest, errors: cancelOrderErrors} = useRequest({
		url: `/api/orders/${orderId}`,
		method: 'delete',
		onSuccess: async () => {
			appendLog(`Order: ${orderId} cancelled successfully`, 'info');
			updateUiState({notificationMessage: `Order: ${orderId} cancelled successfully`});
			logger.info(`OrderDetailsPage - Order: ${orderId} cancelled successfully`);
			// setShowError(false);
			await router.push('/orders');
		}
	});
	
	useEffect(() => {
		// Fetch the order details and set the correct initial notification
		if (data?.status.toLowerCase() === 'awaiting:feasibility') {
			updateUiState({
				status: 'idle',
				notificationMessage: 'Order is awaiting feasibility analysis.',
				showNotification: true
			});
		} else if (data?.status.toLowerCase() === 'design:ready') {
			logger.info(`OrderDetailsPage - Pre-fill project number if available: ${data.id}`);
			setProjectNumber(data.projectNumber || '');
		}
	}, [data, orderId]);
	
	useEffect(() => {
		// Update notification dynamically based on Design completion status
		if (designNotification.length > 0) {
			const lastNotification = designNotification[designNotification.length - 1];
			
			if (lastNotification.step === '[Final Step] Design Summary' && lastNotification.status === 'success') {
				updateUiState({
					status: 'design:complete',
					notificationMessage: 'Design updates completed successfully',
					showNotification: true
				});
			}
		}
	}, [designNotification]);
	
	// Ensure failed designs do not update the UI to "design:complete"
	const handleSubmitToDesign = async () => {
		try {
			// Step 1: Update the order with the project number
			updateUiState({showLoader: true, status: 'Updating Order'});
			appendLog(`Updating OrderID ${orderId} with Project Number ${projectNumber}`, 'info');
			logger.info(`handleSubmitToDesign - Updating OrderID ${orderId} with Project Number ${projectNumber}`);
			await updateOrderRequest({projectNumber});
			
			// Step 2: Start the sequential update process with updateNATFWDesign
			updateUiState({status: 'Updating Design'});
			appendLog(`Starting NATFW Design updates for OrderID ${orderId}`, 'info');
			logger.info(`handleSubmitToDesign - Starting NATFW Design updates for OrderID ${orderId}`);
			await updateNATFWDesign();
			
			// Step 3: Notify on Errors during design
			const totalErrors = errorMessage.length;
			if (totalErrors > 0) {
				updateUiState({
					status: 'Design Update Failed',
					showError: true,
					notificationMessage: `❌ Design failed with ${totalErrors} errors. Check logs.`,
					showNotification: true
				});
				appendLog(`Design update failed with ${totalErrors} errors.`, 'error');
			} else {
				// Step 3: Notify on successful design
				updateUiState({
					status: 'design:complete',
					notificationMessage: '✅ Design updates completed successfully',
					showNotification: true
				});
				appendLog(`Design updates completed for OrderID ${orderId}`, 'success');
				logger.info(`handleSubmitToDesign - NATFW Design updates completed for OrderID ${orderId}`);
			}
		} catch (error) {
			logger.error(`Design creation failed for OrderID ${orderId}: ${error.message}`);
			updateUiState({
				status: 'Design Update Failed',
				showError: true,
				notificationMessage: `Design creation failed: ${error.message}`
			});
			appendLog(`Design creation failed for OrderID ${orderId}: ${error.message}`, 'error');
		} finally {
			updateUiState({showLoader: false});
		}
	};
	
	const handleCancelOrder = async () => {
		try {
			updateUiState({showLoader: true, status: 'cancelOrder'});
			appendLog(`Cancelling the Order: ${orderId}`, 'info');
			logger.info(`OrderDetailsPage - Cancelling the Order: ${orderId}`);
			// setShowLoader(true);
			await cancelOrderRequest();
		} catch (error) {
			updateUiState({
				showError: true,
				notificationMessage: `Order cancellation failed: ${error.message}`,
				status: 'cancellationFailed'
			});
			appendLog(`Order cancellation failed for Order: ${orderId} with error: ${error.message}`, 'error');
			logger.error(`OrderDetailsPage - Cancellation failed for the order ${orderId} due to ${error.message}`);
			// setShowError(true);
		} finally {
			updateUiState({showLoader: false});
			// setShowLoader(false);
		}
	};
	
	const handleBackToOrders = async () => {
		await router.push('/orders');
	};
	
	const handleBackToDashboard = async () => {
		await router.push('/');
	};
	
	// Display the API execution steps in the logs
	// - Design updates failed for Order: 673d2a98005daf3c34c22ae6. Total Errors: 3. Check logs for details."
	// - Design updates completed successfully for Order: 673d2a98005daf3c34c22ae6."
	const renderNotification = () => {
		if (!notificationMessage) return null;
		
		return (
			<Notification
				color={status === 'Design Update Failed' ? 'red' : 'blue'}
				title="Order Details Page"
				onClose={() => updateUiState({showNotification: false})}
				mt="md"
				loading={showLoader}
				icon={
					showError ? <IconX/> :
						showLoader ? <IconLoader/> : <IconCheck/>
				}
			>
				<Title order={6}>You can view the details of this order on this page</Title>
				Status of this Order is:
				<Text span c={status === 'Design Update Failed' ? 'red' : 'blue'}>{status.toUpperCase()}</Text>
				<Text>{notificationMessage}</Text>
			</Notification>
		);
	};
	
	
	return (
		<div className="mt-10 pb-10">
			{data ? (
				<Stack>
					<Switch
						label="Manual set Order ready for Design"
						checked={checked}
						onChange={(event) => setChecked(event.currentTarget.checked)}
					/>
					
					{showNotification && renderNotification()}
					
					<Drawer
						opened={showIssuesDrawer}
						onClose={() => setShowIssuesDrawer(false)}
						title={
							<Title order={5} color="blue">
								Timeline of Pre-feasibility tickets for this order
							</Title>
						}
						position="right"
						padding="md"
						size="lg"
					>
						{loadingIssues ? (
							<Notification color="blue" title="Loading Issues" mt="md" icon={<IconLoader/>}>
								Fetching the latest issues for this Order...
							</Notification>
						) : issuesData ? (
							<Timeline active={0} lineWidth={2} bulletSize={18}>
								{issuesData.projectStoryId && (
									<Timeline.Item title={issuesData.projectStoryId}>
										<Text c="dimmed" size="sm">Project Story ID</Text>
									</Timeline.Item>
								)}
								{issuesData.designStoryId && (
									<Timeline.Item title={issuesData.designStoryId}>
										<Text c="dimmed" size="sm">Design Story ID</Text>
									</Timeline.Item>
								)}
								{issuesData.networkStoryId && (
									<Timeline.Item title={issuesData.networkStoryId}>
										<Text c="dimmed" size="sm">Network Story ID</Text>
									</Timeline.Item>
								)}
								{issuesData.codecStoryId && (
									<Timeline.Item title={issuesData.codecStoryId}>
										<Text c="dimmed" size="sm">Codec Story ID</Text>
									</Timeline.Item>
								)}
								{issuesData.epicId && (
									<Timeline.Item title={issuesData.epicId}>
										<Text c="dimmed" size="sm">Epic ID</Text>
									</Timeline.Item>
								)}
							</Timeline>
						) : (
							<Text mt="md" color="red">
								There are no issues associated with this order.
							</Text>
						)}
					</Drawer>
					
					{showLoader && (
						<Notification
							color="blue"
							title="Processing..."
							mt="md"
							icon={<IconLoader/>}
						>
							{status === 'updatingOrder'
								? 'Updating order with project number...'
								: 'Updating NATFW Design...'}
						</Notification>
					)}
					
					{(data.status.toLowerCase() === 'design:ready' || checked) && (
						<Flex gap="sm" justify="flex-start">
							<Space h="xl"/>
							{data.projectNumber && (
								<Highlight
									ta="center"
									highlight={['Project Number']}
									highlightStyles={{
										backgroundImage: 'linear-gradient(45deg, red, blue)',
										fontWeight: 700,
										WebkitBackgroundClip: 'text',
										WebkitTextFillColor: 'transparent'
									}}
								>
									Project number is already updated for this order.
								</Highlight>
							)}
							<br/>
							<TextInput
								placeholder="Enter Project Number"
								value={projectNumber}
								style={{width: '200px'}}
								onChange={(event) => setProjectNumber(event.target.value)}
							/>
							<Button
								onClick={handleSubmitToDesign}
								disabled={!!data.projectNumber || showLoader}
								variant="light"
							>
								Submit to Design
							</Button>
							<Button onClick={openDrawer} variant="outline">
								View Design Logs
							</Button>
						</Flex>
					)}
					
					<Drawer
						opened={drawerOpened}
						onClose={closeDrawer}
						title="Design Logs"
						padding="md"
						size="xl"
					>
						<Stack spacing="md">
							<Title order={5} color="blue">
								Design Notifications
							</Title>
							{designNotification.length > 0 ? (
								<Timeline active={designNotification.length - 1} lineWidth={2} bulletSize={16}>
									{designNotification.map((log, index) => (
										<Timeline.Item
											key={index}
											title={log.step}
											bullet={
												log.status === 'success' ? (
													<IconCheck size="1rem"/>
												) : log.status === 'error' ? (
													<IconX size="1rem" color="red"/>
												) : (
													<IconLoader size="1rem"/>
												)
											}
											color={
												/** @type {import('@mantine/core').MantineColor} */
												(log.status === 'success'
													? 'teal'
													: log.status === 'error'
														? 'red'
														: 'blue')
											}
										>
											<Text size="sm" color={log.status === 'error' ? 'red' : 'dimmed'}>
												{log.message}
											</Text>
										</Timeline.Item>
									))}
								</Timeline>
							) : (
								<Text color="dimmed">No design notifications available.</Text>
							)}
							
							<Divider my="sm"/>
							
							<Title order={5} color="red">
								Error Notifications
							</Title>
							{errorMessage.length > 0 ? (
								<Stack spacing="xs">
									{errorMessage.map((error, index) => (
										<Text key={index} color="red" size="sm">
											{error}
										</Text>
									))}
								</Stack>
							) : (
								<Text color="dimmed">No errors recorded.</Text>
							)}
							
							<Group position="center">
								<Button onClick={saveLogsToFile} mt="md" size="xs">
									Save Logs to File
								</Button>
							</Group>
						</Stack>
					</Drawer>
					
					
					<Space h="xl"/>
					
					<Flex justify="space-between" align="center">
						<Title order={5} underline color="blue.5">Order Details</Title>
						<Flex gap="xl" justify="flex-end">
							<Button
								color="blue"
								onClick={handleTrackOrder}
								// onClick={toggleTimeline}
							>
								Track the Order
							</Button>
							
							<Button
								onClick={handleCancelOrder}
								color="red"
								variant="filled"
								disabled={data.status.toLowerCase() === 'cancelled'}>
								Cancel the Order
							</Button>
							<Menu shadow="md" width={200}>
								<Menu.Target>
									<Button
										variant="light">
										Back
									</Button>
								</Menu.Target>
								<Menu.Dropdown>
									<Menu.Item onClick={handleBackToOrders}>
										Back to Orders Page
									</Menu.Item>
									<Menu.Item onClick={handleBackToDashboard}>
										Back to Dashboard page
									</Menu.Item>
								</Menu.Dropdown>
							</Menu>
						</Flex>
					</Flex>
					
					<Flex align="center">
						<Text {...TEXT_PROPS} style={{color: 'gray', fontFamily: 'Verdana'}} mr="md">Project
							Name:</Text>
						<Text {...TEXT_PROPS}
							  style={{color: 'blue', fontFamily: 'Arial'}}>{data.serviceOrder.projectName}</Text>
					</Flex>
					
					<Flex align="center">
						<Text {...TEXT_PROPS} style={{color: 'gray', fontFamily: 'Verdana'}} mr="md">Order Type:</Text>
						<Text {...TEXT_PROPS}
							  style={{color: 'blue', fontFamily: 'Arial'}}>{data.serviceOrder.orderType}</Text>
					</Flex>
					
					<Flex align="center">
						<Text {...TEXT_PROPS} style={{color: 'gray', fontFamily: 'Verdana'}} mr="md">Customer
							Name:</Text>
						<Text {...TEXT_PROPS}
							  style={{color: 'blue', fontFamily: 'Arial'}}>{data.serviceOrder.customerName}</Text>
					</Flex>
					
					<Flex align="center">
						<Text {...TEXT_PROPS} style={{color: 'gray', fontFamily: 'Verdana'}} mr="md">A Site Name:</Text>
						<Text {...TEXT_PROPS}
							  style={{color: 'blue', fontFamily: 'Arial'}}>{data.serviceOrder.aSiteName}</Text>
					</Flex>
					
					<Flex align="center">
						<Text {...TEXT_PROPS} style={{color: 'gray', fontFamily: 'Verdana'}} mr="md">B Site Name:</Text>
						<Text {...TEXT_PROPS}
							  style={{color: 'blue', fontFamily: 'Arial'}}>{data.serviceOrder.bSiteName}</Text>
					</Flex>
					
					<Flex align="center">
						<Text {...TEXT_PROPS} style={{color: 'gray', fontFamily: 'Verdana'}} mr="md">Handover
							Date:</Text>
						<Text {...TEXT_PROPS}
							  style={{color: 'blue', fontFamily: 'Arial'}}>{data.serviceOrder.handoverDate}</Text>
					</Flex>
					
					<Flex align="center">
						<Text {...TEXT_PROPS} style={{color: 'gray', fontFamily: 'Verdana'}} mr="md">Raised by:</Text>
						<Text {...TEXT_PROPS}
							  style={{color: 'blue', fontFamily: 'Arial'}}>{data.userName}</Text>
					</Flex>
					
					<Divider/>
					
					<Box w="100%" ta="center">
						<Text
							size="md"
							fw={600}
							variant="gradient"
							gradient={{from: 'indigo', to: 'cyan', deg: 345}}>
							Services requested with this Order
						</Text>
					</Box>
					
					<Table
						striped
						highlightOnHover
						withBorder
						withColumnBorders
						withRowBorders
						horizontalSpacing="sm"
						verticalSpacing="sm">
						<thead>
						<tr>
							<th style={{backgroundColor: '#ADD8E6'}}>No</th>
							<th style={{backgroundColor: '#ADD8E6'}}>Request</th>
							<th style={{backgroundColor: '#ADD8E6'}}>Resource</th>
							<th style={{backgroundColor: '#ADD8E6'}}>Service</th>
							<th style={{backgroundColor: '#ADD8E6'}}>Chassis</th>
							<th style={{backgroundColor: '#ADD8E6'}}>Slot</th>
							<th style={{backgroundColor: '#ADD8E6'}}>Card</th>
							<th style={{backgroundColor: '#ADD8E6'}}>Port</th>
							<th style={{backgroundColor: '#ADD8E6'}}>View</th>
						</tr>
						</thead>
						<tbody>
						{services.map((service, index) => (
							<tr key={index}>
								<td>{index + 1}</td>
								<td>{requestTypeDisplayNames[service.requestType]}</td>
								<td>{service.resource}</td>
								<td>{service.workRequired}</td>
								<td>{service.chassis}</td>
								<td>{service.slotName}</td>
								<td>{service.card}</td>
								<td>{service.resource === 'Card' ? 'N/A' : service.port}</td>
								{service.requestType.includes('Port') && service.workRequired.includes('VIP (NATFW)') && (
									<td>
										<Button onClick={() => router.push(`/orders/${orderId}/services/${index}`)}
												variant="subtle">
											VIP services
										</Button>
									</td>
								)}
							</tr>
						))}
						</tbody>
					</Table>
					
					<Text ta="center" fz="sm" c="dimmed" mt="md">
						Note: Please ensure all information is accurate.
					</Text>
					
					<br/>
				</Stack>
			) : (
				<p>No order selected</p>
			)}
		</div>
	);
};

export default OrderDetailsPage;