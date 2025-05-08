import React, {Fragment, useEffect, useMemo, useState} from 'react';
import useOrderStore from '@/store/useOrderStore';
import {modals} from '@mantine/modals';
import {MantineReactTable, MRT_EditActionButtons, useMantineReactTable} from 'mantine-react-table';
import {ActionIcon, Alert, Badge, Box, Button, Flex, Mark, Stack, Text, Title, Tooltip} from '@mantine/core';
import Papa from 'papaparse';
import {download, generateCsv} from 'export-to-csv';
import {csvConfig, generateFlowNames, validateFlow} from '@/utils/vip-flows-utils';
import {notifications, showNotification} from '@mantine/notifications';
import {flowRequestTypeOptions, flowServiceTypeOptions} from '@/utils/lib/select-options';
import {IconDownload, IconEdit, IconTrash, IconUpload} from '@tabler/icons-react';
import {getLogger} from '@/utils/logger/logger';

const AddVIPFlowsTable = ({
							  index,
							  engineeringName,
							  friendlyName,
							  TxFlows,
							  RxFlows,
							  triggerFlowGeneration,
							  onFlowsGenerated // Passed function to notify parent
						  }) => {
	const logger = getLogger('AddVIPFlowsTable');
	const [validationErrors, setValidationErrors] = useState({});
	const [csvData, setCsvData] = useState(null);
	const [showAlert, setShowAlert] = useState(false);
	const [fileName, setFileName] = useState('');
	const {secondStep, setDetailedVIPFlows} = useOrderStore();
	const {detailedVIPFlows} = secondStep.services[index];
	const unEditableFields = ['id', 'flowNo', 'TxRx', 'engineeringName', 'friendlyName', 'status'];
	logger.debug(`AddVIPFlowsTable - index: ${index}, engineeringName: ${engineeringName}, friendlyName: ${friendlyName}, TxFlows: ${TxFlows}, RxFlows: ${RxFlows}`);
	
	const generateNewFlows = () => {
		const lastTxCount = detailedVIPFlows.filter(f => f.TxRx === 'TX').length;
		const lastRxCount = detailedVIPFlows.filter(f => f.TxRx === 'RX').length;
		
		logger.info(`generateNewFlows - lastTxCount: ${lastTxCount}, lastRxCount: ${lastRxCount}`);
		
		// Generate new flows with updated flow counts
		const newFlows = generateFlowNames(
			engineeringName,
			friendlyName,
			TxFlows,
			RxFlows,
			lastTxCount + 1,
			lastRxCount + 1,
			'AddVIPFlowsTable'
		);
		
		// Append new flows to Zustand
		setDetailedVIPFlows(index, [...detailedVIPFlows, ...newFlows]);
		
		// Show notification and reset counts after notification closes
		notifications.show({
			title: 'VIP Flows Generated',
			message: `${TxFlows} TX and ${RxFlows} RX flows added to the table.`,
			onClose: onFlowsGenerated // Reset Tx/Rx flow counts
		});
	};
	
	useEffect(() => {
		if (triggerFlowGeneration && (TxFlows > 0 || RxFlows > 0)) {
			generateNewFlows();
		}
	}, [triggerFlowGeneration, TxFlows, RxFlows]); // Trigger only when these change
	
	const data = detailedVIPFlows;
	logger.info(`AddVIPFlowsTable - Updated detailedVIPFlows: ${JSON.stringify(data)}`);
	
	const columns = useMemo(
		() => [
			{accessorKey: 'id', header: 'ID', enableEditing: false, size: 10},
			{
				accessorKey: 'status',
				header: 'Status',
				Cell: ({cell}) => <Badge>{cell.getValue() || 'NA'}</Badge>,
				enableEditing: false
			},
			{accessorKey: 'flowNo', header: 'Flow Number', enableEditing: false, enablePinning: true, size: 10},
			{accessorKey: 'TxRx', header: 'Service Tx/Rx', enableEditing: false, enablePinning: true, size: 10},
			{
				accessorKey: 'engineeringName',
				header: 'Flow Engineering Name',
				enableEditing: false,
				enablePinning: true,
				size: 100
			},
			{
				accessorKey: 'friendlyName',
				header: 'Flow Friendly Name',
				enableEditing: false,
				enablePinning: true,
				size: 100
			},
			{accessorKey: 'customerVlan', header: 'Customer VLAN(s)', enableEditing: true},
			{accessorKey: 'customerVideoIp', header: 'Customer IP Address', enableEditing: true},
			{accessorKey: 'customerNetmask', header: 'Customer Netmask', enableEditing: true},
			{accessorKey: 'customerGateway', header: 'Customer Gateway', enableEditing: true},
			{accessorKey: 'customerIgmpVersion', header: 'Customer IGMP Version', enableEditing: true},
			{accessorKey: 'mediaFlowSourceIp', header: 'Media Flow Source IP', enableEditing: true},
			{accessorKey: 'mediaFlowDestIp', header: 'Media Flow Dest IP', enableEditing: true},
			{accessorKey: 'mediaFlowSourcePort', header: 'Media Flow Source Port', enableEditing: true},
			{accessorKey: 'mediaFlowDestPort', header: 'Media Flow Dest Port', enableEditing: true},
			{accessorKey: 'mediaFlowSsrc', header: 'Media Flow SSRC', enableEditing: true},
			{accessorKey: 'mediaFlowProtocol', header: 'Media Flow Protocol', enableEditing: true},
			{accessorKey: 'mediaFlowHitlessMode', header: 'Media Flow Hitless Mode', enableEditing: true},
			{accessorKey: 'mediaFlowMbps', header: 'Media Flow Bitrate (Mbps)', enableEditing: true},
			{
				accessorKey: 'requestType',
				header: 'Request Type',
				editVariant: 'select',
				mantineEditSelectProps: {
					data: flowRequestTypeOptions.map(option => ({value: option.value, label: option.label})),
					error: validationErrors?.requestType
				}
			},
			{
				accessorKey: 'serviceType',
				header: 'Service Type',
				editVariant: 'select',
				mantineEditSelectProps: {
					data: flowServiceTypeOptions.map(option => ({value: option.value, label: option.label})),
					error: validationErrors?.serviceType
				}
			}
		],
		[validationErrors]
	);
	
	const handleAddNewFlow = (flowType) => {
		const nextTxFlowNumber = data.filter(flow => flow.TxRx === 'TX').length + 1;
		const nextRxFlowNumber = data.filter(flow => flow.TxRx === 'RX').length + 1;
		const flowNumber = flowType === 'TX' ? nextTxFlowNumber : nextRxFlowNumber;
		
		const newFlow = {
			flowNo: flowNumber,
			TxRx: flowType,
			mainPortEngineeringName: `${engineeringName}`,
			engineeringName: `${engineeringName}.${flowType}${flowNumber}`,
			friendlyName: `${friendlyName}.${flowType}${flowNumber}`,
			status: 'New'
		};
		
		const updatedFlows = [...data, newFlow];
		setDetailedVIPFlows(index, updatedFlows);
	};
	
	const handleDeleteRow = (row) => {
		modals.openConfirmModal({
			title: 'Delete Flow',
			children: <Text>Are you sure you want to delete flow number {row.original.flowNo}
				{'  '} for interface type {row.original.TxRx}? This action cannot be undone.
			</Text>,
			labels: {confirm: 'Delete', cancel: 'Cancel'},
			confirmProps: {color: 'red'},
			onConfirm: () => {
				logger.info(`handleDeleteRow - New Flows data: ${JSON.stringify(data)}`);
				const updatedFlows = data.filter(flow => flow.engineeringName !== row.original.engineeringName);
				setDetailedVIPFlows(index, updatedFlows);
			}
		});
	};
	
	const handleExportRows = (rows) => {
		const rowData = rows.map((row) => ({
			// id: row.original.id,
			// status: row.original.status,
			flowNo: row.original.flowNo,
			TxRx: row.original.TxRx,
			engineeringName: row.original.engineeringName,
			friendlyName: row.original.friendlyName,
			customerVlan: row.original.customerVlan,
			customerVideoIp: row.original.customerVideoIp,
			customerNetmask: row.original.customerNetmask,
			customerGateway: row.original.customerGateway,
			customerIgmpVersion: row.original.customerIgmpVersion,
			mediaFlowSourceIp: row.original.mediaFlowSourceIp,
			mediaFlowDestIp: row.original.mediaFlowDestIp,
			mediaFlowSourcePort: row.original.mediaFlowSourcePort,
			mediaFlowDestPort: row.original.mediaFlowDestPort,
			mediaFlowSsrc: row.original.mediaFlowSsrc,
			mediaFlowProtocol: row.original.mediaFlowProtocol,
			mediaFlowHitlessMode: row.original.mediaFlowHitlessMode,
			mediaFlowMbps: row.original.mediaFlowMbps,
			requestType: row.original.requestType,
			serviceType: row.original.serviceType
		}));
		logger.debug(`handleExportRows - rowCount: ${rowData.length} and rowData: ${JSON.stringify(rowData)} `);
		
		const csv = generateCsv(csvConfig)(rowData);
		download(csvConfig)(csv);
	};
	
	const handleFileUpload = (event) => {
		const file = event.target.files[0];
		if (file) {
			setCsvData(file);
			setFileName(file.name); // Set the file name to display
			setShowAlert(true);
		}
	};
	
	const handleContinue = () => {
		setShowAlert(false);
		if (csvData) {
			Papa.parse(csvData, {
				header: true,
				skipEmptyLines: true,
				complete: (results) => {
					const parsedData = results.data;
					
					// Check if the number of rows in CSV matches the table
					if (parsedData.length !== data.length) {
						showNotification({
							title: 'Import Error',
							message: `Row count mismatch: CSV has ${parsedData.length} rows, but the table has ${data.length} rows.`,
							color: 'red',
							withCloseButton: true,
							position: 'top-center'
						});
						return;
					}
					
					// Prepare the updated flow data
					const updatedFlows = parsedData.map((csvRow) => {
						const matchingFlow = data.find(
							(flow) =>
								flow.flowNo === parseInt(csvRow.flowNo, 10) &&
								flow.engineeringName === csvRow.engineeringName.trim()
						);
						
						if (!matchingFlow) {
							showNotification({
								title: 'Import Error',
								message: `No matching row for flow number ${csvRow.flowNo} and engineering name ${csvRow.engineeringName} found in the table.`,
								color: 'red',
								withCloseButton: true,
								position: 'top-center'
							});
							return null; // Skip this row
						}
						
						// Ensure uneditable fields remain unchanged
						const updatedRow = {...matchingFlow}; // Start with matching flow as the base
						
						unEditableFields.forEach((field) => {
							if (csvRow[field] !== matchingFlow[field]) {
								showNotification({
									title: 'Validation',
									message: `Field "${field}" cannot be changed. Restoring original value.`,
									color: 'blue',
									withCloseButton: true,
									position: 'top-center'
								});
								// Restore the original value for uneditable fields
								updatedRow[field] = matchingFlow[field];
							}
						});
						
						// Only override editable fields from the CSV
						return {
							...updatedRow,
							customerVlan: csvRow.customerVlan,
							customerVideoIp: csvRow.customerVideoIp,
							customerNetmask: csvRow.customerNetmask,
							customerGateway: csvRow.customerGateway,
							customerIgmpVersion: csvRow.customerIgmpVersion,
							mediaFlowSourceIp: csvRow.mediaFlowSourceIp,
							mediaFlowDestIp: csvRow.mediaFlowDestIp,
							mediaFlowSourcePort: csvRow.mediaFlowSourcePort,
							mediaFlowDestPort: csvRow.mediaFlowDestPort,
							mediaFlowSsrc: csvRow.mediaFlowSsrc,
							mediaFlowProtocol: csvRow.mediaFlowProtocol,
							mediaFlowHitlessMode: csvRow.mediaFlowHitlessMode,
							mediaFlowMbps: csvRow.mediaFlowMbps,
							requestType: csvRow.requestType,
							serviceType: csvRow.serviceType,
							status: 'New' // Mark as 'Updated' or 'New'
						};
					}).filter(Boolean); // Remove any null rows (skipped rows)
					
					// Check if all rows were updated correctly
					if (updatedFlows.length === parsedData.length) {
						setDetailedVIPFlows(index, updatedFlows); // Update Zustand with validated data
						showNotification({
							title: 'Success',
							message: 'CSV imported successfully and table updated.',
							color: 'green',
							withCloseButton: true,
							position: 'top-center'
						});
					} else {
						showNotification({
							title: 'Import Error',
							message: 'Some rows could not be updated due to errors.',
							color: 'red',
							withCloseButton: true,
							position: 'top-center'
						});
					}
				},
				error: (error) => {
					showNotification({
						title: 'Parsing Error',
						message: `Failed to parse CSV: ${error.message}`,
						color: 'red',
						withCloseButton: true,
						position: 'top-center'
					});
				}
			});
		}
	};
	
	const handleCancel = () => {
		setShowAlert(false);
		setFileName(''); // Clear file name on cancel
	};
	
	const handleSaveRowEdits = ({values, table}) => {
		logger.info(`AddVIPFlowsTable - handleSaveRowEdits: flowNo: ${JSON.stringify(values)}`);
		const newValidationErrors = validateFlow(values);
		
		if (Object.values(newValidationErrors).some((error) => error)) {
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
		const updatedFlows = detailedVIPFlows.map((flow) =>
			flow.engineeringName === values.engineeringName ? {...values, status: 'New'} : flow
		);
		setDetailedVIPFlows(index, updatedFlows);
		setValidationErrors({});
		table.setEditingRow(null);
	};
	
	const handleCreateRow = ({values, exitCreatingMode}) => {
		modals.openConfirmModal({
			title: 'Create New Flow',
			children: (
				<Text>
					Are you sure you want to create a new flow with the following details?
					<br/>
					Flow No: {values.flowNo} <br/>
					Engineering Name: {values.engineeringName} <br/>
					Friendly Name: {values.friendlyName}
				</Text>
			),
			confirmProps: {color: 'blue'},
			onConfirm: () => {
				const newFlow = {
					...values,
					status: 'New' // Mark new row as "New"
				};
				setDetailedVIPFlows(index, [...detailedVIPFlows, newFlow]);
				exitCreatingMode();
			}
		});
	};
	
	const table = useMantineReactTable({
		columns,
		data,
		enableRowSelection: true,
		enableEditing: true,
		enableRowcount: true,
		enableRowNumbers: true,
		enablePinning: true,
		editDisplayMode: 'modal',
		columnFilterDisplayMode: 'popover',
		paginationDisplayMode: 'pages',
		positionToolbarAlertBanner: 'bottom',
		initialState: {density: 'xs'},
		onEditingRowSave: handleSaveRowEdits,
		onCreatingRowSave: handleCreateRow,
		getRowId: (row) => row.id,
		mantineTableContainerProps: {sx: {minHeight: '300px'}},
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
		renderCreateRowModalContent: ({table, row, internalEditComponents}) => (
			<Stack>
				<Title order={3}>Create New Flow</Title>
				{internalEditComponents}
				<Flex justify="flex-end" mt="xl">
					<MRT_EditActionButtons variant="text" table={table} row={row}/>
				</Flex>
			</Stack>
		),
		renderEditRowModalContent: ({table, row, internalEditComponents}) => (
			<Stack>
				<Title order={3}>Edit Flow</Title>
				{internalEditComponents}
				<Flex justify="flex-end" mt="xl">
					<MRT_EditActionButtons variant="text" table={table} row={row}/>
				</Flex>
			</Stack>
		),
		renderTopToolbarCustomActions: ({table}) => (
			<Box sx={{display: 'flex', gap: '16px', padding: '8px', flexWrap: 'wrap'}}>
				{/*<Button onClick={() => handleAddNewFlow('TX')}>Create TX Flow</Button>*/}
				{/*<Button onClick={() => handleAddNewFlow('RX')}>Create RX Flow</Button>*/}
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
				<input id="csvUpload"
					   type="file"
					   accept=".csv"
					   style={{display: 'none'}}
					   onChange={handleFileUpload}
				/>
			</Box>
		)
	});
	
	return (
		<Fragment>
			<Flex justify="space-between" align="center" mb="md">
				<Badge size="lg" variant="light" radius="sm" color="blue">
					Add New VIP Flows
				</Badge>
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
				mantineTableProps={{
					striped: true,
					sx: {
						fontSize: '0.8rem',
						padding: '4px'
					}
				}}
			/>
		</Fragment>
	);
};

export default AddVIPFlowsTable;
