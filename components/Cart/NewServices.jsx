import React, {useMemo, useState} from 'react';
import {MantineReactTable, MRT_GlobalFilterTextInput, useMantineReactTable} from 'mantine-react-table';
import useOrderStore from '@/store/useOrderStore';
import ServiceModal from '@/components/Modals/ServiceModal';
import {modals, ModalsProvider} from '@mantine/modals';
import {ActionIcon, Button, Flex, Modal, ScrollArea, Stack, Text, Tooltip} from '@mantine/core';
import {IconEdit, IconEye, IconTrash} from '@tabler/icons-react';
import {getRequestTypeTitle, requestTypeDisplayNames} from '@/utils/form-utils';
import {getLogger} from '@/utils/logger/logger';
import SENDataSection from '@/components/Modals/SENDataSection';

const FnNewServicesTable = () => {
	const logger = getLogger('NewServicesTable');
	const {secondStep, removeService, updateService, resetCart} = useOrderStore();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedServiceIndex, setSelectedServiceIndex] = useState(null);
	const [modalMode, setModalMode] = useState(''); // 'view', 'edit', or 'add'
	
	const handleEditService = (index) => {
		logger.debug(`NewServicesTable [handleEditService] - Edit Service at Index: ${index}`);
		setSelectedServiceIndex(index);
		setModalMode('edit');
		setIsModalOpen(true);
	};
	
	const handleViewService = (index) => {
		logger.debug(`NewServicesTable [handleViewService] - View Service at Index: ${index}`);
		setSelectedServiceIndex(index);
		setModalMode('view');
		setIsModalOpen(true);
	};
	
	const handleDeleteService = (rowIndex) => {
		logger.debug('NewServicesTable [handleDeleteService]: rowIndex: ' + rowIndex);
		openDeleteConfirmModal(rowIndex);
	};
	
	const openDeleteConfirmModal = (rowIndex) => {
		logger.debug(`openDeleteConfirmModal: rowIndex: ${rowIndex}`);
		
		modals.openConfirmModal({
			title: 'Are you sure you want to delete this service?',
			children: (
				<Text>
					Are you sure you want to delete service #{rowIndex + 1}? This action cannot be undone.
				</Text>
			),
			labels: {confirm: 'Delete', cancel: 'Cancel'},
			confirmProps: {color: 'red'},
			onConfirm: () => {
				logger.debug('Deleting service at index: ' + rowIndex);
				removeService(rowIndex);
			}
		});
		
		logger.debug('Confirmation modal should be open now.');
	};
	
	const handleUpdateService = (index, updatedService) => {
		logger.debug(`NewServicesTable [handleUpdateService] - Updated Service at Index: ${index}`);
		updateService(index, updatedService);
		closeModal();
	};
	
	const closeModal = () => {
		logger.debug('NewServicesTable [closeModal]: ');
		setIsModalOpen(false);
		setSelectedServiceIndex(null);
		setModalMode('');
	};
	
	const columns = useMemo(
		() => [
			{
				accessorKey: 'requestType',
				header: 'Request',
				mantineTableHeadCellProps: {
					style: {backgroundColor: '#ADD8E6'}
				},
				Cell: ({cell}) => requestTypeDisplayNames[cell.getValue()]
			},
			{
				accessorKey: 'resource',
				header: 'Resource',
				mantineTableHeadCellProps: {
					style: {backgroundColor: '#ADD8E6'}
				}
			},
			{
				accessorKey: 'workRequired',
				header: 'Service',
				mantineTableHeadCellProps: {
					style: {backgroundColor: '#ADD8E6'}
				}
			},
			{
				accessorKey: 'chassis',
				header: 'Chassis',
				mantineTableHeadCellProps: {
					style: {backgroundColor: '#ADD8E6'}
				}
			},
			{
				accessorKey: 'slotName',
				header: 'Slot',
				mantineTableHeadCellProps: {
					style: {backgroundColor: '#ADD8E6'}
				}
			},
			{
				accessorKey: 'card',
				header: 'Card',
				mantineTableHeadCellProps: {
					style: {backgroundColor: '#ADD8E6'}
				}
			},
			{
				accessorKey: 'port',
				header: 'Port',
				mantineTableHeadCellProps: {
					style: {backgroundColor: '#ADD8E6'}
				},
				Cell: ({row}) => row.original.resource === 'Card' ? 'Not Applicable' : row.original.port
			},
			{
				id: 'actions',
				header: 'Actions',
				mantineTableHeadCellProps: {
					style: {backgroundColor: '#ADD8E6', textAlign: 'left'}
				},
				Cell: ({row}) => (
					<Flex gap="sm" justify="flex-start">
						<Tooltip label="View">
							<ActionIcon onClick={() => {
								logger.debug('NewServicesTable [ActionIcon View] - Clicked');
								handleViewService(row.index);
							}}>
								<IconEye/>
							</ActionIcon>
						</Tooltip>
						<Tooltip label="Edit">
							<ActionIcon onClick={() => {
								logger.debug('NewServicesTable [ActionIcon Edit] - Clicked');
								handleEditService(row.index);
							}}>
								<IconEdit/>
							</ActionIcon>
						</Tooltip>
						<Tooltip label="Delete">
							<ActionIcon color="red" onClick={() => {
								logger.debug('NewServicesTable [ActionIcon Delete] - Clicked');
								handleDeleteService(row.index);
							}}>
								<IconTrash/>
							</ActionIcon>
						</Tooltip>
					</Flex>
				),
				size: 80
			}
		],
		[]
	);
	
	const table = useMantineReactTable({
		columns,
		data: secondStep.services,
		enableRowNumbers: true,
		enablePinning: true,
		enableSorting: true,
		enableColumnFilters: true,
		enableEditing: false,
		enableRowActions: false,
		enableColumnActions: false,
		paginationDisplayMode: 'pages',
		enableGlobalFilter: false,
		globalFilterFn: 'contains',
		mantineSearchTextInputProps: {
			placeholder: 'Search all services'
		},
		getRowId: (row) => row.id,
		renderTopToolbarCustomActions: () => (
			<Button onClick={resetCart}>Reset Cart</Button>
		),
		initialState: {
			pagination: {pageIndex: 0, pageSize: 5},
			density: 'xs',
			showGlobalFilter: true
		}
	});
	
	const handleSearchKeyDown = (e) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			e.stopPropagation();
		}
	};
	
	return (
		<Stack>
			<Flex justify="space-between" align="center">
				<MRT_GlobalFilterTextInput
					table={table}
					onKeyDown={handleSearchKeyDown}
				/>
				{/*<MRT_TablePagination table={table} />*/}
			</Flex>
			
			<MantineReactTable
				table={table}
				mantinePaginationProps={{
					rowsPerPageOptions: ['5', '10', '15']
				}}
				mantineTableProps={{
					highlightOnHover: true,
					withColumnBorders: true,
					withBorder: true,
					striped: true
				}}
				mantineTableContainerProps={{
					sx: {
						minHeight: '200px',
						maxHeight: '400px'
					}
				}}
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
			/>
			
			<Modal
				key={selectedServiceIndex}
				opened={isModalOpen}
				onClose={closeModal}
				closeOnClickOutside={false}
				withCloseButton={true}
				scrollAreaComponent={ScrollArea.Autosize}
				// size="auto"
				fullScreen
				title={
					selectedServiceIndex !== null && secondStep.services[selectedServiceIndex] ? (
						<Text
							color="darkblue"
							size="md"
							style={{
								fontFamily: 'Arial',
								fontWeight: 'bold',
								textTransform: 'uppercase',
								letterSpacing: '1px',
								textAlign: 'center'
							}}>
							{getRequestTypeTitle(secondStep.services[selectedServiceIndex].requestType)}
						</Text>
					) : (
						<Text color="darkblue" size="md"
							  style={{fontFamily: 'Arial', fontWeight: 'bold', textAlign: 'center'}}>
							Service Details
						</Text>
					)
				}>
				{selectedServiceIndex !== null && secondStep.services[selectedServiceIndex] &&
					secondStep.services[selectedServiceIndex].workRequired === 'VIP (NATFW)' && (
						<ServiceModal
							key={selectedServiceIndex}
							index={selectedServiceIndex}
							service={secondStep.services[selectedServiceIndex]}
							readonly={modalMode === 'view'}
							onClose={closeModal}
							onUpdateServiceFn={modalMode === 'edit' ? handleUpdateService : undefined}
						/>
					)}
				
				{selectedServiceIndex !== null && secondStep.services[selectedServiceIndex] &&
					secondStep.services[selectedServiceIndex].workRequired === 'SEN Data' &&
					secondStep.services[selectedServiceIndex].workRequired === 'Media Data' && (
						<SENDataSection
							key={selectedServiceIndex}
							index={selectedServiceIndex}
							service={secondStep.services[selectedServiceIndex]}
							readonly={modalMode === 'view'}
							onClose={closeModal}
							onUpdateServiceFn={modalMode === 'edit' ? handleUpdateService : undefined}
						/>
					)}
			
			</Modal>
		</Stack>
	);
};

const NewServicesTable = () => (
	<ModalsProvider>
		<FnNewServicesTable/>
	</ModalsProvider>
);

export default NewServicesTable;
