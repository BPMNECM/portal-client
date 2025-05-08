import {useRef, useState} from 'react';
import useRequest from '@/hooks/use-request';
import {notifications} from '@mantine/notifications';
import {IconCheck, IconLoader, IconX} from '@tabler/icons-react';
import {getLogger} from '@/utils/logger/logger';
import {getUpdatedValue} from '@/utils/common-utils';

const logger = getLogger('useNATFWDesign');
const delay = async (ms, enableDelay = true) => {
	if (enableDelay) await new Promise((resolve) => setTimeout(resolve, ms));
};

const stepMessages = {
	fetchUpdatedOrder: '[Step 1] Fetch Updated Order',
	createProject: '[Step 2] Create Project',
	updateSlot: '[Step 3] Updating Slot',
	updatePort: '[Step 4] Updating Port',
	updateFlow: '[Step 5] Updating Flow',
	flowSummary: '[Step 6] Flow Execution Summary',
	designSummary: '[Final Step] Design Summary'
};

const useNATFWDesign = (orderId) => {
	const [errorMessage, setErrorMessage] = useState([]);
	const [designNotification, setDesignNotification] = useState([]);
	const errorRef = useRef([]);
	const designRef = useRef([]);
	
	const {doRequest: fetchUpdatedOrderRequest} = useRequest({
		url: `${process.env.NEXT_PUBLIC_DNA_HOST || ''}/api/orders/${orderId}`,
		method: 'get'
	});
	
	const {doRequest: createProjectRequest} = useRequest({
		url: `${process.env.NEXT_PUBLIC_DNA_HOST || ''}/api/dna/projects/createProject`,
		method: 'post'
	});
	
	const {doRequest: updateSlotRequest} = useRequest({
		url: `${process.env.NEXT_PUBLIC_DNA_HOST || ''}/api/dna/slots/updateSlot`,
		method: 'put'
	});
	
	const {doRequest: updatePortRequest} = useRequest({
		url: `${process.env.NEXT_PUBLIC_DNA_HOST || ''}/api/dna/ports/updatePort`,
		method: 'put'
	});
	
	const {doRequest: updateVIPWorkflowRequest} = useRequest({
		url: `${process.env.NEXT_PUBLIC_DNA_HOST || ''}/api/dna/flows/updateFlow`,
		method: 'put'
	});
	
	const {doRequest: getPortRequest} = useRequest({
		url: `${process.env.NEXT_PUBLIC_DNA_HOST || ''}/api/dna/ports/getPort`,
		method: 'get'
	});
	
	const appendErrorMessage = (message) => {
		if (!message) return; // Prevent empty messages
		if (errorRef.current.includes(message)) return; // Prevent duplicate errors
		
		errorRef.current.push(message);
		setErrorMessage([...errorRef.current]);
		logger.error(`appendErrorMessage - ERROR LOGGED: ${message} `);
		
		notifications.show({
			id: `error-${Date.now()}`,
			title: 'Execution Error',
			message,
			color: 'red',
			icon: <IconX size="1.1rem"/>,
			autoClose: 5000
		});
	};
	
	const appendDesignNotification = (step, message, status = 'success', count = null, total = null) => {
		let stepMessage = step;
		
		if (count !== null && total !== null) {
			// Example: "[Step 2.3] Updating Slot (2/5)"
			stepMessage = `${step} (${count}/${total})`;
		}
		
		const id = `${stepMessage}-${status}-${Date.now()}`;
		const newEntry = {step: stepMessage, message, status};
		
		designRef.current.push(newEntry);
		setDesignNotification([...designRef.current]);
		
		notifications.show({
			id,
			title: status === 'loading' ? 'Processing' : status === 'success' ? 'Success' : 'Error',
			message: `${stepMessage}: ${message}`,
			color: status === 'loading' ? 'blue' : status === 'success' ? 'teal' : 'red',
			icon: status === 'loading' ? <IconLoader size="1.1rem"/>
				: status === 'success' ? <IconCheck size="1.1rem"/>
					: <IconX size="1.1rem"/>,
			loading: status === 'loading',
			autoClose: status === 'loading' ? false : 5000
		});
		
		if (status === 'loading') {
			return id; // Return the notification ID for future updates
		}
	};
	
	const updateNotificationStatus = (id, status, message) => {
		const newEntry = {id, message, status};
		designRef.current.push(newEntry);
		setDesignNotification([...designRef.current]);
		
		notifications.update({
			id,
			title: status === 'loading' ? 'Processing' : status === 'success' ? 'Success' : 'Error',
			message,
			color: status === 'loading' ? 'blue' : status === 'success' ? 'teal' : 'red',
			icon: status === 'loading' ? <IconLoader size="1.1rem"/> : status === 'success' ?
				<IconCheck size="1.1rem"/> : <IconX size="1.1rem"/>,
			autoClose: status === 'loading' ? false : 5000
		});
	};
	
	const extractFlowIdsFromPort = async (portData, flow) => {
		const flowKey = `${flow.TxRx}${flow.flowNo}`;
		logger.info(`extractFlowIdsFromPort - flowKey: ${flowKey}`);
		
		const portFlowsList = portData.resourceRelationship.filter(
			(rel) => rel.relationshipType === 'contains' && rel.resource['@referredType'] === 'VIP Flow'
		);
		
		// Iterate over each flow extracted from Port
		for (const portFlow of portFlowsList) {
			const resourceName = portFlow.resource.name;
			const flowId = portFlow.resource.id;
			logger.info(`extractFlowIdsFromPort - flowKey: ${flowKey}, flowId: ${flowId}, resourceName: ${resourceName}`);
			
			// Check if resourceName ends with flowKey
			if (resourceName.endsWith(flowKey)) {
				logger.info(`extractFlowIdsFromPort - Matched flowId: ${flowId} for ${flowKey}`);
				return flowId; // Return the matched flowId
			}
		}
		return null;
	};
	
	const retryWithDelay = async (operation, retries = 1, delayTime = 1000) => {
		let attempt = 0;
		while (attempt < retries) {
			try {
				return await operation();
			} catch (error) {
				const statusCode = error.status || error.response?.status;
				if (statusCode >= 400 && statusCode < 500 && statusCode !== 408) throw error;
				attempt++;
				if (attempt >= retries) throw error;
				logger.warn(`Retry attempt ${attempt}/${retries} due to: ${error.message || 'Unknown error'}`);
				await delay(delayTime);
			}
		}
	};
	
	const updateCardSlot = async (service, updatedOrder, count, total) => {
		const statusMsg = `Updating slot ${service.slot} with id ${service.slotId} (${count}/${total})`;
		const notificationId = appendDesignNotification(stepMessages.updateSlot, statusMsg, 'loading', count, total);
		
		try {
			const updatedSlotRequestBody = {
				id: service.slotId,
				userId: updatedOrder.userName,
				projectNumber: updatedOrder.projectNumber,
				defaultApp: getUpdatedValue(service.newDefaultApp, service.defaultApp),
				pinoutDesign: getUpdatedValue(service.newPinOut, service.pinOut),
				serviceType: getUpdatedValue(service.newCardHandOff, service.cardHandOff),
				cardStatus: getUpdatedValue(service.newCardStatus, service.cardStatus),
				cardType: service.cardType || '101' // "101" or "102" or "103"
			};
			
			const response = await updateSlotRequest({
				params: {id: service.slotId},
				id: service.slotId,
				...updatedSlotRequestBody
			});
			
			if (response.status === 'error' || response.status >= 400) {
				throw new Error(`${response.message} - ${response.details || 'No additional details'}`);
			}
			
			updateNotificationStatus(notificationId, 'success', `✅ Slot ${service.slot} with id ${service.slotId} updated successfully.`);
		} catch (error) {
			const errorMessage = `❌ Slot update failed for Id: ${service.slotId} with error: ${error.message}`;
			updateNotificationStatus(notificationId, 'error', errorMessage);
			appendErrorMessage(errorMessage);
			logger.error(errorMessage);
		}
	};
	
	// Supports three use cases: source, far, and txRx (TX or RX for NATFW)
	// Dynamically constructs the updatedPortRequestBody based on the specified locationOrTxRx
	const updatePortService = async (service, updatedOrder, locationOrTxRx = null, count, total) => {
		const isSource = locationOrTxRx === 'source';
		const isFar = locationOrTxRx === 'far';
		const isTxRx = locationOrTxRx === 'TX' || locationOrTxRx === 'RX';
		// const entityType = isSource ? 'Source' : isFar ? 'Far' : isTxRx ? locationOrTxRx : 'Default';
		const entityType = isSource ? 'Source' : isFar ? 'Far' : locationOrTxRx || 'Default';
		const portId = isSource ? service.sourcePortId : isFar ? service.farPortId : service.portId; // Retrieve Port ID
		const statusMsg = `Updating ${entityType} Port ${portId}... (${count}/${total})`;
		const notificationId = appendDesignNotification(stepMessages.updatePort, statusMsg, 'loading', count, total);
		const noOfFlowsValue = isTxRx ? (locationOrTxRx === 'TX' ? service.TxFlows : service.RxFlows) : null;
		const newVIPBlock = parseInt(service.newVIPBlock, 10);
		
		try {
			const updatedPortRequestBody = {
				id: portId,
				path: isSource ? service.sourcePath : isFar ? service.farPath : service.path,
				bulkDeleteVipFlows: 'N', // Default to 'N'
				projectNumber: updatedOrder.projectNumber,
				portStatus: isSource
					? getUpdatedValue(service.sourceNewPortStatus, service.sourcePortStatus)
					: isFar
						? getUpdatedValue(service.farNewPortStatus, service.farPortStatus)
						: getUpdatedValue(service.newPortStatus, service.portStatus),
				defaultApp: isSource
					? getUpdatedValue(service.sourceNewServiceType, service.sourceServiceType)
					: isFar
						? getUpdatedValue(service.farNewServiceType, service.farServiceType)
						: getUpdatedValue(service.newServiceType, service.serviceType),
				virtualInterfaceType: isSource
					? getUpdatedValue(service.sourceNewGMNInterfaceType, service.sourceGMNInterfaceType)
					: isFar
						? getUpdatedValue(service.farNewGMNInterfaceType, service.farGMNInterfaceType)
						: getUpdatedValue(service.newGMNInterfaceType, service.gmnInterfaceType),
				serviceType: service.newHandOff === 'H' ? 'H' : '',
				serviceUse: isSource
					? ['Unassigned', 'U'].includes(service.sourceNewServiceUse || service.sourceServiceUse)
						? ''
						: getUpdatedValue(service.sourceNewServiceUse, service.sourceServiceUse)
					: isFar
						? ['Unassigned', 'U'].includes(service.farNewServiceUse || service.farServiceUse)
							? ''
							: getUpdatedValue(service.farNewServiceUse, service.farServiceUse)
						: ['Unassigned', 'U'].includes(service.newServiceUse || service.serviceUse)
							? ''
							: getUpdatedValue(service.newServiceUse, service.serviceUse),
				physicalInterfaceType: isTxRx
					? service.physicalInterfaceType // Use the provided value for TX/RX
					: '', // Assign empty string otherwise
				...(isTxRx ? {txRxVipFlows: locationOrTxRx} : {txRxVipFlows: ''}),
				...(isTxRx && noOfFlowsValue > 0 ? {noOfFlows: noOfFlowsValue} : {noOfFlows: 0}),
				...(isTxRx && newVIPBlock > 0 ? {vipBlock: newVIPBlock} : {vipBlock: 0})
			};
			
			const response = await updatePortRequest({
				params: {id: portId},
				id: portId,
				...updatedPortRequestBody
			});
			
			if (response.status === 'error' || response.status >= 400) {
				throw new Error(`${response.message} - ${response.details || 'No additional details'}`);
			}
			
			updateNotificationStatus(notificationId, 'success', `${entityType} updated successfully.`);
		} catch (error) {
			const errorMessage = `❌ ${locationOrTxRx || 'default'} Port update failed for Id: ${service.portId} with error: ${error.message}`;
			logger.error(`updatePortService - Failed updatePort: ${error.message}`);
			updateNotificationStatus(notificationId, 'error', errorMessage);
			appendErrorMessage(errorMessage);
		}
	};
	
	// This updates flow using Flow API request & includes the id as a query parameter > Uses ?id=${flowId} query
	// parameter in updateVIPWorkflowRequest Existing flows (Modified, Deleted) > Retrieves flow.id for existing flows
	// New flows will retrieve flowId dynamically before sending the API request > Calls extractFlowIdsFromPort when
	// status === 'New'
	const updateVIPFlows = async (service, updatedOrder, direction, count, total) => {
		try {
			const notificationId = appendDesignNotification(
				stepMessages.updateFlow,
				`Starting ${direction} flow updates on Port: ${service.port}, ${service.portId} (${count}/${total})`,
				'loading',
				count,
				total
			);
			
			const processedFlowIds = new Set();
			let successCount = 0;
			
			// Function to process flows
			const processFlows = async (flows, txRx) => {
				let index = 0;
				let portData = null;
				let portDataFetched = false;
				const filteredFlows = flows.filter((flow) => !processedFlowIds.has(flow.id));
				
				for (const flow of filteredFlows) {
					const totalFlows = filteredFlows.length;
					const flowCount = index + 1;
					
					let flowId = flow.id; // Default flowId from flow object
					let flowStatusMsg = `Flow ${flow.flowNo} (${txRx}) with status: ${flow.status}`;
					const flowNotificationId = appendDesignNotification(
						stepMessages.updateFlow,
						`Starting update for ${flowStatusMsg} (${flowCount}/${totalFlows})`,
						'loading',
						flowCount,
						totalFlows
					);
					
					let flowUpdatePayload = {
						// id - Assigned based on the status of the Flow
						// inUseYn - Assigned based on the status of the Flow
						// serviceType: getUpdatedValue(service.newServiceType, service.serviceType),
						projectNumber: updatedOrder.projectNumber,
						serviceType: getUpdatedValue(service.newHandOff, service.handOff),
						serviceUse: getUpdatedValue(service.newServiceUse, service.serviceUse),
						requestType: flow.requestType,
						scheduallUpdated: 'N',
						dataminerUpdated: 'N',
						flowPath: service.path,
						metFlowName: `${flow.status} requested by ${updatedOrder.userName} for this flow`,
						customerVlan: flow.customerVlan,
						customerVideoIp: flow.customerVideoIp,
						customerNetmask: flow.customerNetmask,
						customerGateway: flow.customerGateway,
						customerIgmpVersion: flow.customerIgmpVersion,
						mediaFlowSourceIp: flow.mediaFlowSourceIp,
						mediaFlowDestIp: flow.mediaFlowDestIp,
						mediaFlowSourcePort: flow.mediaFlowSourcePort,
						mediaFlowDestPort: flow.mediaFlowDestPort,
						mediaFlowSsrc: flow.mediaFlowSsrc,
						mediaFlowProtocol: flow.mediaFlowProtocol,
						mediaFlowHitlessMode: flow.mediaFlowHitlessMode,
						mediaFlowMbps: flow.mediaFlowMbps
					};
					
					switch (flow.status) {
						case 'Modified':
							flowUpdatePayload = {...flowUpdatePayload, id: flowId, inUseYn: 'Y'};
							break;
						case 'Deleted':
							flowUpdatePayload = {id: flowId, inUseYn: 'N', projectNumber: updatedOrder.projectNumber};
							break;
						case 'New':
							if (!portDataFetched) {
								try {
									const portResponse = await retryWithDelay(() => getPortRequest({params: {id: service.portId}}));
									portData = portResponse?.[0];
									portDataFetched = true;
									console.log('updateVIPFlows - [Step 2.6] Fetched portData: ', portData);
									
									if (!portData?.resourceRelationship?.length) {
										throw new Error(`Invalid port response: No resource relationships found for Port: ${service.portId}`);
									}
								} catch (portError) {
									const portErrorMsg = `[Step 2.6] Failed to fetch port data for ${txRx} flows: ${portError.message}`;
									appendErrorMessage(portErrorMsg);
									logger.error(portErrorMsg);
									updateNotificationStatus(flowNotificationId, 'error', portErrorMsg);
									continue;
								}
							}
							
							flowId = await extractFlowIdsFromPort(portData, flow); // Extract Flow ID for new flows
							if (!flowId) {
								const noFlowIdError = `No valid flow ID found for new ${txRx} flow: ${flow.flowNo}`;
								appendErrorMessage(noFlowIdError);
								logger.error(noFlowIdError);
								updateNotificationStatus(flowNotificationId, 'error', noFlowIdError);
								continue;
							}
							
							flowUpdatePayload = {...flowUpdatePayload, id: flowId, inUseYn: 'Y'};
							break;
						default:
							const skipMsg = `Skipping flow with unrecognized or unchanged status: ${flow.status || 'None'}`;
							appendDesignNotification(stepMessages.updateFlow, skipMsg, 'info', flowCount, totalFlows);
							logger.info(skipMsg);
							continue;
					}
					
					flowStatusMsg = `Flow ${flowUpdatePayload.id} (${txRx})`;
					updateNotificationStatus(flowNotificationId, 'loading', `Updating ${flowStatusMsg}`);
					
					try {
						await retryWithDelay(() =>
							updateVIPWorkflowRequest({
								params: {id: flowId},
								id: flowId,
								...flowUpdatePayload
							})
						);
						
						updateNotificationStatus(flowNotificationId, 'success', `✅ Successfully updated ${flowStatusMsg}`);
						processedFlowIds.add(flow.id);
						successCount++;
						logger.info(`[Step 2.6] Updated ${flowStatusMsg}`);
					} catch (error) {
						const errorMsg = `❌ Flow update failed for Id ${flowId}: ${error.message}`;
						updateNotificationStatus(flowNotificationId, 'error', errorMsg);
						appendErrorMessage(errorMsg);
						logger.error(errorMsg);
					}
					index++;
				}
			};
			
			const flows = service.detailedVIPFlows.filter(flow => flow.TxRx === direction);
			await processFlows(flows, direction);
			
			const flowSummary = `Updated ${successCount} ${direction} flows on Port: ${service.port}, ${service.portId}`;
			updateNotificationStatus(notificationId, 'success', `✅ Completed Flow execution summary: ${flowSummary}`);
		} catch (error) {
			const errorMsg = `❌ Error updating ${direction} flows: ${error.message}`;
			appendErrorMessage(errorMsg);
			logger.error(errorMsg);
		}
	};
	
	// Calls updatePortService twice for SEN Data and Media Data (source and far).
	// Preserves the existing logic for VIP (NATFW) using TX and RX.
	const updateNATFWDesign = async () => {
		try {
			logger.info(`[Step 2.0] Starting the Design for GMN Order: ${orderId}...`);
			errorRef.current = [];
			designRef.current = [];
			setErrorMessage([]);
			setDesignNotification([]);
			
			// Step 2.1: Fetch Updated Order
			const fetchUpdatedOrderId = appendDesignNotification(
				stepMessages.fetchUpdatedOrder,
				`Fetching updated order...`,
				'loading'
			);
			
			let updatedOrder;
			try {
				updatedOrder = await fetchUpdatedOrderRequest();
				updateNotificationStatus(fetchUpdatedOrderId, 'success', `Updated order ${orderId} fetched successfully.`);
			} catch (error) {
				const fetchError = `Failed to fetch updated order: ${orderId}, error: ${error.message}`;
				updateNotificationStatus(fetchUpdatedOrderId, 'error', fetchError);
				appendErrorMessage(fetchError);
				throw new Error(fetchError); // Exit execution if fetch fails
			}
			
			// Step 2.2: Create Project
			const projectNotificationId = appendDesignNotification(
				stepMessages.createProject,
				`Creating project...`,
				'loading'
			);
			
			try {
				await createProjectRequest({
					network: updatedOrder.serviceOrder.network,
					projectNumber: updatedOrder.projectNumber,
					customerHandoverTargetDate: updatedOrder.serviceOrder.handoverDate,
					cidn: updatedOrder.serviceOrder.cidn,
					customerName: updatedOrder.serviceOrder.customerName,
					aSiteName: updatedOrder.serviceOrder.aSiteName,
					aEndAddress: updatedOrder.serviceOrder.aEndAddress,
					bSiteName: updatedOrder.serviceOrder.bSiteName,
					bEndAddress: updatedOrder.serviceOrder.bEndAddress,
					workRequired: updatedOrder.serviceOrder.orderType, // or integer 0
					currentStageCode: updatedOrder.serviceOrder.currentStageCode,
					serviceType: updatedOrder.serviceOrder.serviceType
				});
				updateNotificationStatus(projectNotificationId, 'success', `Project created successfully for order: ${updatedOrder.projectNumber}`);
			} catch (error) {
				const projectError = `Failed to create project: ${error.message}`;
				updateNotificationStatus(projectNotificationId, 'error', projectError);
				appendErrorMessage(projectError);
				throw new Error(projectError); // Exit execution if project creation fails
			}
			
			// Step 2.3+: Process Services
			const services = updatedOrder.serviceOrder.services;
			
			// Compute total count for each service type
			const totalServices = services.length;
			let successfulUpdates = 0;
			
			const totalCardUpdates = services.filter(service => service.resource === 'Card').length;
			const totalPortUpdates = services.filter(service => service.resource === 'Port').length;
			const totalVIPPortUpdates = services.filter(service => service.resource === 'Port' && service.workRequired === 'VIP (NATFW)').length * 2; // TX + RX
			const totalVIPUpdates = services.filter(service => service.resource === 'Port' && service.workRequired === 'VIP (NATFW)').??????;
			let cardCount = 0, portCount = 0, vipPortCount = 0; vipCount = 0;
			
			for (const service of services) {
				try {
					if (service.resource === 'Card') {
						cardCount++;
						await updateCardSlot(service, updatedOrder, cardCount, totalCardUpdates);
					} else if (service.resource === 'Port' && (service.workRequired === 'SEN Data' || service.workRequired === 'Media Data')) {
						portCount++;
						await updatePortService(service, updatedOrder, 'source', portCount, totalPortUpdates);
						portCount++;
						await updatePortService(service, updatedOrder, 'far', portCount, totalPortUpdates);
					} else if (service.resource === 'Port' && service.workRequired === 'VIP (NATFW)') {
						vipPortCount++;
						await updatePortService(service, updatedOrder, 'TX', vipPortCount, totalVIPPortUpdates);
						await updateVIPFlows(service, updatedOrder, 'TX', vipCount, totalVIPUpdates);
						vipPortCount++;
						await updatePortService(service, updatedOrder, 'RX', vipPortCount, totalVIPPortUpdates);
						await updateVIPFlows(service, updatedOrder, 'RX', vipCount, totalVIPUpdates);
					} else if (service.resource === 'Port') {
						portCount++;
						await updatePortService(service, updatedOrder, portCount, totalPortUpdates);
					}
					successfulUpdates++;
					appendDesignNotification(stepMessages.updateSlot, `Successfully processed service: ${service.resource} for ${service.workRequired}`);
				} catch (error) {
					const serviceError = `❌ ${service.index} - Error while processing service ${service.resource} for ${service.workRequired} - ${error.message}`;
					appendErrorMessage(serviceError);
					logger.error(serviceError);
				}
			}
			
			// FINAL STEP: UPDATE DESIGN SUMMARY NOTIFICATION
			const totalErrors = errorRef.current.length;  // Tracks API errors
			if (totalErrors > 0) {
				appendDesignNotification(
					stepMessages.designSummary,
					`❌ Design updates failed for Order: ${orderId}. Total Errors: ${totalErrors}. Check logs for details.`,
					'error'
				);
			} else {
				appendDesignNotification(
					stepMessages.designSummary,
					`✅ Design updates completed successfully for Order: ${orderId} with ${totalServices} services...`,
					'success'
				);
			}
			
		} catch (error) {
			const errorMsg = `Error during NATFW Design updates: ${error.message}`;
			appendErrorMessage(errorMsg);
			logger.error(errorMsg);
		} finally {
			logger.info(`Design notifications: ${JSON.stringify(designRef.current)}`);
			logger.info(`Error notifications: ${JSON.stringify(errorRef.current)}`);
		}
	};
	
	return {updateNATFWDesign, errorMessage, designNotification};
};

export default useNATFWDesign;