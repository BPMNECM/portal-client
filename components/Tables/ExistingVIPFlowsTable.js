import dynamic from 'next/dynamic';
import React, {Fragment, useEffect, useMemo, useState} from 'react';
import {useQuery} from '@tanstack/react-query';
import {MantineReactTable, MRT_EditActionButtons, useMantineReactTable} from 'mantine-react-table';
import useOrderStore from '@/store/useOrderStore';
import useFormRequest from '@/hooks/use-form-request';
import {modals} from '@mantine/modals';
import {showNotification} from '@mantine/notifications';
import {ActionIcon, Alert, Badge, Box, Button, Flex, Mark, Stack, Text, Title, Tooltip} from '@mantine/core';
import Papa from 'papaparse';
import {download, generateCsv} from 'export-to-csv';
import {extractFlowDetails} from '@/utils/resource-helper';
import {flowRequestTypeOptions, flowServiceTypeOptions} from '@/utils/lib/select-options';
import {csvConfig, generateFlowNames, validateFlow} from '@/utils/vip-flows-utils';
import {IconDownload, IconEdit, IconTrash, IconUpload} from '@tabler/icons-react';
import {getLogger} from '@/utils/logger/logger';

const BulkUpdateModal = dynamic(() => import('@/components/Modals/BulkUpdateModal'), {ssr: false});

const ExistingVIPFlowsTable = ({
								   serviceIndex,
								   engineeringName,
								   friendlyName,
								   TxFlows,
								   RxFlows,
								   triggerFlowGeneration,
								   onFlowsGenerated
							   }) => {
	const logger = getLogger('ExistingVIPFlowsTable');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [csvData, setCsvData] = useState(null);
	const [showAlert, setShowAlert] = useState(false);
	const [fileName, setFileName] = useState('');
	const [validationErrors, setValidationErrors] = useState({});
	const [bulkUpdateModalOpened, setBulkUpdateModalOpened] = useState(false);
	const [bulkUpdateValues, setBulkUpdateValues] = useState({});
	const {secondStep, setDetailedVIPFlows} = useOrderStore();
	const {vipFlows, detailedVIPFlows} = secondStep.services[serviceIndex];
	const {doRequest: doVIPFlowsDataRequest, errors: VIPFlowsDataRequestErrors} = useFormRequest();
	const unEditableFields = ['id', 'flowNo', 'TxRx', 'engineeringName', 'friendlyName', 'status'];
	
	logger.info(`ExistingVIPFlowsTable - serviceIndex: ${serviceIndex}, engineeringName: ${engineeringName},
	                friendlyName: ${friendlyName}, TxFlows: ${TxFlows}, RxFlows: ${RxFlows}`);
	
	const generateNewFlows = () => {
		const lastTxCount = detailedVIPFlows.filter(f => f.TxRx === 'TX').length;
		const lastRxCount = detailedVIPFlows.filter(f => f.TxRx === 'RX').length;
		logger.info(`ExistingVIPFlowsTable: generateNewFlows - lastTxCount: ${lastTxCount}, lastRxCount: ${lastRxCount}`);
		
		const newFlows = generateFlowNames(
			engineeringName,
			friendlyName,
			TxFlows,
			RxFlows,
			lastTxCount + 1,
			lastRxCount + 1,
			'ExistingVIPFlowsTable'
		);
		
		// Append new flows to Zustand state
		setDetailedVIPFlows(serviceIndex, [...detailedVIPFlows, ...newFlows]);
		
		showNotification({
			title: 'VIP Flows Generated',
			message: `${TxFlows} TX and ${RxFlows} RX flows added to the table.`,
			color: 'green',
			position: 'top-center'
		});
		
		// Reset Tx/Rx counts after generation
		onFlowsGenerated();
	};
	
	useEffect(() => {
		if (triggerFlowGeneration && (TxFlows > 0 || RxFlows > 0)) {
			generateNewFlows();
		}
	}, [triggerFlowGeneration, TxFlows, RxFlows]);
	
	const handleAddNewFlow = (flowType) => {
		const flowCount = flowType === 'TX'
			? detailedVIPFlows.filter(flow => flow.TxRx === 'TX').length + 1
			: detailedVIPFlows.filter(flow => flow.TxRx === 'RX').length + 1;
		
		const newFlow = {
			flowNo: flowCount,
			TxRx: flowType,
			engineeringName: `${engineeringName}.VIP.${flowType}${flowCount}`,
			friendlyName: `${friendlyName}.VIP.${flowType}${flowCount}`,
			status: 'New'
		};
		
		setDetailedVIPFlows(serviceIndex, [...detailedVIPFlows, newFlow]);
		
		showNotification({
			title: 'New Flow Added',
			message: `New ${flowType} flow ${flowCount} added successfully.`,
			color: 'green',
			position: 'top-center'
		});
	};
	
	const columns = useMemo(
		() => [
			{
				accessorKey: 'id',
				header: 'ID',
				enableEditing: false,
				size: 50
			},
			{
				accessorKey: 'status',
				header: 'Status',
				enableEditing: false,
				Cell: ({cell}) => <Badge>{cell.getValue() || 'Original'}</Badge>
			},
			{
				accessorKey: 'flowNo',
				header: 'Flow Number',
				size: 10,
				enableEditing: false,
				mantineTableHeadCellProps: {style: {backgroundColor: 'lightgray', color: 'black'}}
			},
			{
				accessorKey: 'inUseYn',
				header: 'In Use Yes/No',
				size: 10,
				enableEditing: false,
				mantineTableHeadCellProps: {style: {backgroundColor: 'lightgray', color: 'black'}}
			},
			{
				accessorKey: 'TxRx',
				header: 'Direction',
				size: 50,
				enableEditing: false,
				mantineTableHeadCellProps: {style: {backgroundColor: 'lightgray', color: 'black'}}
			},
			{
				accessorKey: 'mainPortEngineeringName',
				header: 'Main Port Engineering Name',
				enableEditing: false,
				mantineTableHeadCellProps: {style: {backgroundColor: 'lightgray', color: 'black'}},
				size: 300
			},
			{
				accessorKey: 'engineeringName',
				header: 'Flow Engineering Name',
				enableEditing: false,
				size: 300,
				mantineTableHeadCellProps: {style: {backgroundColor: 'lightgray', color: 'black'}}
			},
			{
				accessorKey: 'friendlyName',
				header: 'Flow Friendly Name',
				enableEditing: false,
				size: 300,
				mantineTableHeadCellProps: {style: {backgroundColor: 'lightgray', color: 'black'}}
			},
			{
				accessorKey: 'primaryIp',
				header: 'Primary IP',
				enableEditing: false,
				mantineTableHeadCellProps: {style: {backgroundColor: 'lightgray', color: 'black'}}
			},
			{
				accessorKey: 'primaryMulticastIp',
				header: 'Primary Multicast IP',
				enableEditing: false,
				size: 300,
				mantineTableHeadCellProps: {style: {backgroundColor: 'lightgray', color: 'black'}}
			},
			{
				accessorKey: 'primaryVlan',
				header: 'Primary Vlan ID',
				enableEditing: false,
				mantineTableHeadCellProps: {style: {backgroundColor: 'lightgray', color: 'black'}}
			},
			{
				accessorKey: 'secondaryIp',
				header: 'Secondary IP',
				enableEditing: false,
				mantineTableHeadCellProps: {style: {backgroundColor: 'lightgray', color: 'black'}}
			},
			{
				accessorKey: 'secondaryMulticastIp',
				header: 'Secondary Multicast IP',
				enableEditing: false,
				size: 300,
				mantineTableHeadCellProps: {style: {backgroundColor: 'lightgray', color: 'black'}}
			},
			{
				accessorKey: 'secondaryVlan',
				header: 'Secondary Vlan ID',
				enableEditing: false,
				mantineTableHeadCellProps: {style: {backgroundColor: 'lightgray', color: 'black'}}
			},
			{
				accessorKey: 'flowProjectNumber',
				header: 'Project Number',
				enableEditing: false,
				mantineTableHeadCellProps: {style: {backgroundColor: 'lightblue', color: 'black'}}
			},
			{
				accessorKey: 'flowStatus',
				header: 'Port Status',
				enableEditing: false,
				mantineTableHeadCellProps: {style: {backgroundColor: 'lightblue', color: 'black'}}
			},
			{
				accessorKey: 'requestType',
				header: 'Request Type',
				editVariant: 'select',
				mantineTableHeadCellProps: {style: {backgroundColor: 'lightblue', color: 'black'}},
				mantineEditSelectProps: {
					data: flowRequestTypeOptions.map(option => ({value: option.value, label: option.label})),
					onFocus: () => setValidationErrors({...validationErrors, requestType: undefined}),
					error: validationErrors?.requestType
				}
			},
			{
				accessorKey: 'scheduallUpdated',
				header: 'ScheduALL Updated',
				size: 10,
				enableEditing: false,
				mantineTableHeadCellProps: {style: {backgroundColor: 'lightblue', color: 'black'}}
			},
			{
				accessorKey: 'dataminerUpdated',
				header: 'Dataminer Updated',
				size: 10,
				enableEditing: false,
				mantineTableHeadCellProps: {style: {backgroundColor: 'lightblue', color: 'black'}}
			},
			{
				accessorKey: 'serviceType',
				header: 'Service Type',
				editVariant: 'select',
				mantineTableHeadCellProps: {style: {backgroundColor: 'lightblue', color: 'black'}},
				mantineEditSelectProps: {
					data: flowServiceTypeOptions.map(option => ({value: option.value, label: option.label})),
					onFocus: () => setValidationErrors({...validationErrors, serviceType: undefined}),
					error: validationErrors?.serviceType
				}
			},
			{
				accessorKey: 'customerVlan',
				header: 'Customer VLAN(s)',
				mantineTableHeadCellProps: {style: {backgroundColor: 'lightgreen', color: 'black'}}
			},
			{
				accessorKey: 'customerVideoIp',
				header: 'Customer IP Address',
				mantineTableHeadCellProps: {style: {backgroundColor: 'lightgreen', color: 'black'}}
			},
			{
				accessorKey: 'customerNetmask',
				header: 'Customer Netmask',
				mantineTableHeadCellProps: {style: {backgroundColor: 'lightgreen', color: 'black'}}
			},
			{
				accessorKey: 'customerGateway',
				header: 'Customer Gateway',
				mantineTableHeadCellProps: {style: {backgroundColor: 'lightgreen', color: 'black'}}
			},
			{
				accessorKey: 'customerIgmpVersion',
				header: 'Customer IGMP Version',
				size: 300,
				mantineTableHeadCellProps: {style: {backgroundColor: 'lightgreen', color: 'black'}}
			},
			{
				accessorKey: 'mediaFlowSourceIp',
				header: 'Media Flow Source IP',
				size: 300,
				mantineTableHeadCellProps: {style: {backgroundColor: '#ffd43b', color: 'black'}}
			},
			{
				accessorKey: 'mediaFlowDestIp',
				header: 'Media Flow Dest IP',
				mantineTableHeadCellProps: {style: {backgroundColor: '#ffd43b', color: 'black'}}
			},
			{
				accessorKey: 'mediaFlowSourcePort',
				header: 'Media Flow Source Port',
				size: 300,
				mantineTableHeadCellProps: {style: {backgroundColor: '#ffd43b', color: 'black'}}
			},
			{
				accessorKey: 'mediaFlowDestPort',
				header: 'Media Flow Dest Port',
				size: 300,
				mantineTableHeadCellProps: {style: {backgroundColor: '#ffd43b', color: 'black'}}
			},
			{
				accessorKey: 'mediaFlowSsrc',
				header: 'Media Flow SSRC',
				mantineTableHeadCellProps: {style: {backgroundColor: '#ffd43b', color: 'black'}}
			},
			{
				accessorKey: 'mediaFlowProtocol',
				header: 'Media Flow Protocol',
				mantineTableHeadCellProps: {style: {backgroundColor: '#ffd43b', color: 'black'}}
			},
			{
				accessorKey: 'mediaFlowHitlessMode',
				header: 'Media Flow Hitless Mode',
				size: 300,
				mantineTableHeadCellProps: {style: {backgroundColor: '#ffd43b', color: 'black'}}
			},
			{
				accessorKey: 'mediaFlowMbps',
				header: 'Media Flow Bitrate (Mbps)',
				size: 300,
				mantineTableHeadCellProps: {style: {backgroundColor: '#ffd43b', color: 'black'}}
			}
		],
		[validationErrors]
	);
	
	const handleDeleteRow = (row) => {
		modals.openConfirmModal({
			title: 'Are you sure you want to delete this flow?',
			children: <Text>Are you sure you want to delete flow {row.original.id}? This action cannot be
				undone.</Text>,
			labels: {confirm: 'Delete', cancel: 'Cancel'},
			confirmProps: {color: 'red'},
			onConfirm: () => {
				const updatedFlows = detailedVIPFlows.map((flow) =>
					flow.id === row.original.id
						? {...flow, id: flow.id, status: 'Deleted', inUseYn: 'N'}
						: flow
				);
				setDetailedVIPFlows(serviceIndex, updatedFlows); // Use serviceIndex to update Zustand
			}
		});
	};
	
	const handleBulkDeleteRows = (rows) => {
		const selectedRowIds = rows.map(r => r.original.id).join(', ');
		
		modals.openConfirmModal({
			title: 'Bulk Delete Flows',
			children: (
				<Text>
					Are you sure you want to delete the selected flows with IDs: {selectedRowIds}?
				</Text>
			),
			labels: {confirm: 'Delete', cancel: 'Cancel'},
			confirmProps: {color: 'red'},
			onConfirm: () => {
				const updatedFlows = detailedVIPFlows.map((flow) =>
					rows.find(r => r.original.id === flow.id)
						? {...flow, id: flow.id, status: 'Deleted', inUseYn: 'N'}
						: flow
				);
				setDetailedVIPFlows(serviceIndex, updatedFlows); // Use serviceIndex to update Zustand
			}
		});
	};
	
	const handleSaveRowEdits = ({values, table}) => {
		const newValidationErrors = validateFlow(values);
		
		if (Object.values(newValidationErrors).some(error => error)) {
			setValidationErrors(newValidationErrors);
			
			Object.entries(newValidationErrors).forEach(([field, error]) => {
				showNotification({
					title: 'Validation Error',
					message: `${field}: ${error}`,
					color: 'red',
					withCloseButton: true,
					position: 'top-center'
				});
			});
			
			return;
		}
		
		// Update Zustand state
		const updatedFlows = detailedVIPFlows.map(flow =>
			flow.id === values.id ? {...values, id: flow.id, status: 'Modified'} : flow
		);
		
		setDetailedVIPFlows(serviceIndex, updatedFlows);
		setValidationErrors({});  // Clear errors and close modal
		table.setEditingRow(null); //exit editing mode
	};
	
	const handleOpenBulkUpdateModal = () => {
		setBulkUpdateModalOpened(true);
		setBulkUpdateValues({
			customerVlan: '',
			customerVideoIp: '',
			customerNetmask: '',
			customerGateway: '',
			customerIgmpVersion: '',
			mediaFlowSourceIp: '',
			mediaFlowDestIp: '',
			mediaFlowSourcePort: '',
			mediaFlowDestPort: '',
			mediaFlowSsrc: '',
			mediaFlowProtocol: '', // 'ST2022-2'
			mediaFlowHitlessMode: '', // '2022-7'
			mediaFlowMbps: '', // '100'
			requestType: '',
			serviceType: ''
		});
	};
	
	const handleBulkUpdateSubmit = () => {
		logger.debug('Handle form submission for bulk updates');
		
		setIsSubmitting(true);
		const selectedRows = table.getSelectedRowModel().rows;
		
		if (selectedRows.length > 0) {
			handleBulkUpdate(selectedRows, bulkUpdateValues);
		}
		
		setIsSubmitting(false);
		setBulkUpdateModalOpened(false);
	};
	
	const handleBulkUpdate = (rows, updatedValues) => {
		logger.debug(`Bulk Update function for selected rows: ${rows.length} `);
		
		const updatedFlows = detailedVIPFlows.map(flow => {
			// Check if the current flow is one of the selected rows
			const isSelected = rows.find(r => r.original.id === flow.id);
			
			if (isSelected) {
				// Create a copy of the original flow data
				const updatedFlow = {...flow};
				
				updatedFlow.id = flow.id;
				updatedFlow.status = 'Modified';
				
				// Update only the fields that have a value in the updatedValues
				if (updatedValues.customerVlan) {
					updatedFlow.customerVlan = updatedValues.customerVlan;
				}
				if (updatedValues.customerVideoIp) {
					updatedFlow.customerVideoIp = updatedValues.customerVideoIp;
				}
				if (updatedValues.customerNetmask) {
					updatedFlow.customerNetmask = updatedValues.customerNetmask;
				}
				if (updatedValues.customerGateway) {
					updatedFlow.customerGateway = updatedValues.customerGateway;
				}
				if (updatedValues.customerIgmpVersion) {
					updatedFlow.customerIgmpVersion = updatedValues.customerIgmpVersion;
				}
				if (updatedValues.mediaFlowSourceIp) {
					updatedFlow.mediaFlowSourceIp = updatedValues.mediaFlowSourceIp;
				}
				if (updatedValues.mediaFlowDestIp) {
					updatedFlow.mediaFlowDestIp = updatedValues.mediaFlowDestIp;
				}
				if (updatedValues.mediaFlowSourcePort) {
					updatedFlow.mediaFlowSourcePort = updatedValues.mediaFlowSourcePort;
				}
				if (updatedValues.mediaFlowDestPort) {
					updatedFlow.mediaFlowDestPort = updatedValues.mediaFlowDestPort;
				}
				if (updatedValues.mediaFlowSsrc) {
					updatedFlow.mediaFlowSsrc = updatedValues.mediaFlowSsrc;
				}
				if (updatedValues.mediaFlowProtocol) {
					updatedFlow.mediaFlowProtocol = updatedValues.mediaFlowProtocol;
				}
				if (updatedValues.mediaFlowHitlessMode) {
					updatedFlow.mediaFlowHitlessMode = updatedValues.mediaFlowHitlessMode;
				}
				if (updatedValues.mediaFlowMbps) {
					updatedFlow.mediaFlowMbps = updatedValues.mediaFlowMbps;
				}
				if (updatedValues.requestType) {
					updatedFlow.requestType = updatedValues.requestType;
				}
				if (updatedValues.serviceType) {
					updatedFlow.serviceType = updatedValues.serviceType;
				}
				
				return updatedFlow;
			}
			
			// Return the original flow if it wasn't selected
			return flow;
		});
		
		// Update Zustand state with the modified flows
		setDetailedVIPFlows(serviceIndex, updatedFlows);
	};
	
	const handleAddFlowSubmit = async ({values, exitCreatingMode}) => {
		logger.info(`handleAddFlowSubmit - values: ${JSON.stringify(values)} `);
		const validationErrors = validateFlow(values);
		
		if (Object.values(validationErrors).some((error) => error)) {
			setValidationErrors(validationErrors);
			return;
		}
		
		// Add the new flow to the Zustand state and MRT table
		const newFlow = {
			...values,  // Use pre-populated and user-filled values
			status: 'New'  // Always set status to 'New' for newly created flows
		};
		
		// Update Zustand state and MRT
		const updatedFlows = [...detailedVIPFlows, newFlow];
		setDetailedVIPFlows(serviceIndex, updatedFlows);
		
		exitCreatingMode(); // Exit create mode
		setValidationErrors({});
	};
	
	const fetchAndSetVIPFlowDetails = async (vipFlows) => {
		try {
			const detailedVIPFlows = await Promise.allSettled(
				vipFlows.map(async (flow) => {
					try {
						const url = `${process.env.NEXT_PUBLIC_DNA_HOST || ''}/api/dna/flows/getFlow?id=${flow.id}`;
						const flowDetails = await doVIPFlowsDataRequest({url, method: 'get'});
						
						if (!flowDetails || typeof flowDetails !== 'object') {
							logger.warn(`Invalid response for flow: ${flow.id}`);
							return null;
						}
						
						return extractFlowDetails(flowDetails);
					} catch (error) {
						logger.error(`Failed to fetch flow with id ${flow.id}: ${error.message}`);
						return null; // Don't throw to avoid stopping Promise.allSettled
					}
				})
			);
			
			const validFlows = detailedVIPFlows.filter((result) => result.status === 'fulfilled' && result.value !== null).map((result) => result.value);
			
			setDetailedVIPFlows(serviceIndex, validFlows);
			return validFlows;
			
		} catch (error) {
			logger.error(`Error fetching VIP flows: ${error.message}`);
			// Show error notification or handle error gracefully
			showNotification({
				title: 'Error',
				message: 'Failed to fetch VIP flow details.',
				color: 'red',
				withCloseButton: true,
				position: 'top-center'
			});
			throw error;
		}
	};
	
	const {isError, isFetching, refetch} = useQuery(
		['fetchDetailedVIPFlows', vipFlows],
		async () => await fetchAndSetVIPFlowDetails(vipFlows),
		{refetchOnWindowFocus: false, enabled: false}
	);
	
	const handleExportRows = (rows) => {
		logger.info('handleExportRows');
		
		const rowData = rows.map((row) => row.original);
		const csv = generateCsv(csvConfig)(rowData);
		download(csvConfig)(csv);
	};
	
	const handleImportCsv = (file) => {
		Papa.parse(file, {
			header: true,
			skipEmptyLines: true,
			complete: (results) => {
				const parsedData = results.data;
				const updatedFlows = detailedVIPFlows.map((existingRow) => {
					let csvRow = null;
					
					if (existingRow.status === 'New') {
						// Match by flowNo and engineeringName for 'New' status rows
						csvRow = parsedData.find((row) =>
							parseInt(row.flowNo, 10) === existingRow.flowNo &&
							row.engineeringName.trim() === existingRow.engineeringName
						);
					} else {
						// Match by id for 'Original', 'Deleted', or 'Modified' status rows
						csvRow = parsedData.find((row) => row.id === existingRow.id.toString());
					}
					
					if (!csvRow) return existingRow; // Skip non-matching rows
					
					// Check for changes in updateable fields
					const fieldsToUpdate = [
						'customerVlan', 'customerVideoIp', 'customerNetmask', 'customerGateway',
						'customerIgmpVersion', 'mediaFlowSourceIp', 'mediaFlowDestIp',
						'mediaFlowSourcePort', 'mediaFlowDestPort', 'mediaFlowSsrc',
						'mediaFlowProtocol', 'mediaFlowHitlessMode', 'mediaFlowMbps',
						'requestType', 'serviceType'
					];
					
					let isModified = false;
					const updatedRow = {...existingRow};
					
					fieldsToUpdate.forEach((field) => {
						if (csvRow[field] !== undefined && csvRow[field] !== existingRow[field]) {
							updatedRow[field] = csvRow[field];
							isModified = true;
						}
					});
					
					// Update the status to "Modified" if changes were made and the status is not "New"
					if (isModified && existingRow.status !== 'New') {
						updatedRow.status = 'Modified';
					}
					
					return updatedRow;
				});
				
				// Update Zustand state and notify user
				setDetailedVIPFlows(serviceIndex, updatedFlows);
				showNotification({
					title: 'Success',
					message: 'CSV imported successfully and table updated.',
					color: 'green',
					position: 'top-center'
				});
			},
			error: (error) => {
				showNotification({
					title: 'Parsing Error',
					message: `Failed to parse CSV: ${error.message}`,
					color: 'red',
					position: 'top-center'
				});
			}
		});
	};
	
	const handleFileUpload = (event) => {
		const file = event.target.files[0];
		if (file) {
			setCsvData(file);
			setFileName(file.name);
			setShowAlert(true);
		}
	};
	
	const handleContinue = () => {
		setShowAlert(false);
		if (csvData) {
			handleImportCsv(csvData);
			setFileName(''); // Clear file name after processing
		}
	};
	
	const handleCancel = () => {
		setShowAlert(false);
		setFileName(''); // Clear file name on cancel
	};
	
	useEffect(() => {
		if (detailedVIPFlows?.length > 0) {
			logger.info(`Using cached VIP flows from Zustand. Displaying existing data.`);
			// We don't need to manually trigger a fetch here as we're using cached data
		} else {
			logger.info(`No cached VIP flows found. You can manually fetch using the 'Fetch Existing VIP Flows' button.`);
		}
	}, [detailedVIPFlows]);
	
	const handleFetchVIPFlows = () => {
		refetch();  // Only fetch when the button is clicked
	};
	
	const table = useMantineReactTable({
		columns,
		data: detailedVIPFlows?.length > 0 ? detailedVIPFlows : [],
		createDisplayMode: 'modal',
		editDisplayMode: 'modal',
		enableEditing: true,
		getRowId: (row) => row.id,
		onCreatingRowSave: handleAddFlowSubmit,
		onEditingRowSave: handleSaveRowEdits,
		enableRowSelection: true,
		enableRowcount: true,
		enableRowNumbers: true,
		enablePinning: true,
		enableClickToCopy: true,
		// enableColumnResizing: true, // new
		onCreatingRowCancel: () => setValidationErrors({}),
		onEditingRowCancel: () => setValidationErrors({}),
		mantineEditRowModalProps: {
			closeOnClickOutside: false,
			withCloseButton: true
		},
		renderEditRowModalContent: ({internalEditComponents, row, table}) => (
			<Stack>
				<Title order={5}>Edit Flow</Title>
				{internalEditComponents} {/* Built-in MRT edit inputs */}
				<Flex justify="flex-end" mt="xl">
					<MRT_EditActionButtons variant="text" table={table} row={row}/>
				</Flex>
			</Stack>
		),
		renderCreateRowModalContent: ({table, row, internalEditComponents}) => (
			<Stack>
				<Title order={3}>Create New Flow</Title>
				{internalEditComponents}
				<Flex justify="flex-end" mt="xl">
					<MRT_EditActionButtons variant="text" table={table} row={row || {}}/>
				</Flex>
			</Stack>
		),
		renderRowActions: ({row, table}) => (
			<Flex gap="md">
				<Tooltip label="Edit">
					<ActionIcon onClick={() => table.setEditingRow(row)}>
						<IconEdit/>
					</ActionIcon>
				</Tooltip>
				<Tooltip label="Delete">
					<ActionIcon color="red" onClick={() => handleDeleteRow(row)}>
						<IconTrash/>
					</ActionIcon>
				</Tooltip>
			</Flex>
		),
		renderTopToolbarCustomActions: ({table}) => (
			<Box sx={{display: 'flex', gap: '16px', padding: '8px', flexWrap: 'wrap'}}>
				{/*<Button onClick={() => table.setCreatingRow(true)}>Create New Flow</Button>*/}
				{/*<Button onClick={() => handleAddNewFlow('TX')}>Create New TX Flow</Button>*/}
				{/*<Button onClick={() => handleAddNewFlow('RX')}>Create New RX Flow</Button>*/}
				<Button disabled={table.getSelectedRowModel().rows.length === 0}
						onClick={handleOpenBulkUpdateModal}
				>
					Bulk Update Selected Rows
				</Button>
				<Button disabled={table.getSelectedRowModel().rows.length === 0}
						onClick={() => handleBulkDeleteRows(table.getSelectedRowModel().rows)}
				>
					Bulk Delete Selected Rows
				</Button>
				<Button
					disabled={table.getPrePaginationRowModel().rows.length === 0}
					onClick={() => handleExportRows(table.getPrePaginationRowModel().rows)}
					leftIcon={<IconDownload/>}
					variant="filled"
				>
					Export All Rows
				</Button>
				<Button
					leftIcon={<IconDownload/>}
					variant="filled"
					disabled={
						!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
					}
					onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
				>
					Export Selected Rows
				</Button>
				<Button
					leftIcon={<IconUpload/>}
					onClick={() => document.getElementById('csvUpload').click()}
				>
					Import CSV
				</Button>
				<input
					id="csvUpload"
					type="file"
					accept=".csv"
					style={{display: 'none'}}
					// onChange={(e) => handleImportCsv(e.target.files[0])}
					onChange={handleFileUpload}
				/>
			</Box>
		),
		initialState: {
			density: 'xs',
			expanded: true,
			pagination: {pageIndex: 0, pageSize: 10},
			sorting: [{id: 'TxRx', desc: false}]
		},
		state: {
			showProgressBars: isFetching,
			showLoadingOverlay: isFetching,
			showSkeletons: isFetching,
			showAlertBanner: isError,
			isSaving: false
		},
		columnFilterDisplayMode: 'popover',
		paginationDisplayMode: 'pages',
		positionToolbarAlertBanner: 'bottom',
		mantineTableContainerProps: {sx: {minHeight: '300px'}},
		mantineToolbarAlertBannerProps: isError ? {
			color: 'red', children: 'Error fetching VIP flows data'
		} : undefined
	});
	
	return (
		<Fragment>
			<Flex justify="space-between" align="center" mb="md">
				<Badge size="lg" variant="light" radius="sm" color="blue">
					Current state of VIP Flows
				</Badge>
				<Button onClick={handleFetchVIPFlows} disabled={isFetching}>
					{isFetching ? 'Fetching...' : 'Fetch Existing VIP Flows'}
				</Button>
			</Flex>
			
			{showAlert && (
				<Alert title="Warning" color="red">
					<Text>Importing this CSV will overwrite the data in the table.</Text>
					<Text>File Name: <Mark color="teal.2">{fileName}</Mark> </Text>
					<Button onClick={handleCancel} className="cancel-button mt-4 ml-4 mr-6">
						Cancel
					</Button>
					<Button onClick={handleContinue} className="continue-button">
						Continue
					</Button>
				</Alert>
			)}
			
			<MantineReactTable
				table={table}
				mantineTableHeadCellProps={{
					// Decrease font size for headers
					sx: {
						fontWeight: 'normal',
						fontSize: '0.7rem', // Smaller font size for header
						padding: '4px', // Reduce padding for header cells
						backgroundColor: '#f0f0f0' // Optional: header background color
					}
				}}
				mantinePaperProps={{
					shadow: 'none',
					sx: {
						borderRadius: '4px', // Adjust overall table structure
						padding: '8px', // Add padding around the entire table
						border: '2px dashed #e0e0e0' // Table border
					}
				}}
				mantineTableProps={{
					striped: true,
					sx: {
						fontSize: '0.8rem', // Decrease font size for the table
						padding: '4px' // Adjust padding for table cells
					}
				}}
				mantineTableBodyProps={{
					sx: {
						// Make odd rows a darker color and adjust row height
						'& tr:nth-of-type(odd)': {
							backgroundColor: '#f5f5f5' // Stripe for odd rows
						},
						'& tr': {
							height: '24px' // Decrease row height
						}
					}
				}}
				mantineTableBodyCellProps={{
					sx: {
						fontSize: '0.8rem', // Decrease font size for cell values
						padding: '4px', // Adjust padding for cells
						borderRight: '2px solid #e0e0e0' // Add border between columns
					}
				}}
				mantineTableContainerProps={{
					style: {
						maxWidth: '100%'
					}
				}}
			/>
			<BulkUpdateModal
				opened={bulkUpdateModalOpened}
				onClose={() => setBulkUpdateModalOpened(false)}
				bulkUpdateValues={bulkUpdateValues}
				setBulkUpdateValues={setBulkUpdateValues}
				handleBulkUpdateSubmit={handleBulkUpdateSubmit}
			/>
			<div className="col-span-1">
				{VIPFlowsDataRequestErrors && VIPFlowsDataRequestErrors.message && (
					<div className="mt-4 text-red-500">
						Errors fetching Flows API: {VIPFlowsDataRequestErrors.message}
					</div>
				)}
			</div>
		</Fragment>
	);
};

export default ExistingVIPFlowsTable;
