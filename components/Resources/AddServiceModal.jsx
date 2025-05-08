import React from 'react';
import useAddServiceState from '@/hooks/useAddServiceState';
import RenderComponent from '@/components/Resources/RenderComponent';
import RenderNATFWComponent from '@/components/Resources/RenderNATFWComponent';
import {Group, Mark} from '@mantine/core';
import {getLogger} from '@/utils/logger/logger';
import BtnFunction from '@/components/Forms/Button';
import useServiceModalState from '@/hooks/useServiceModalState';


const AddServiceModal = ({
							 index,
							 service,
							 userName,
							 isLoadingChassis,
							 readonly,
							 onAddServiceFn,
							 onClose,
							 onUpdateServiceFn
						 }) => {
	const logger = getLogger('AddServiceModal');
	logger.info(`AddServiceModal - Index: ${index}, userName: ${userName}, isLoadingChassis: ${isLoadingChassis}, readonly: ${readonly} `);
	
	const isPortService = service.resource === 'Port';
	const isCardService = service.resource === 'Card';
	const isNATFWService = service.workRequired === 'VIP (NATFW)';
	const isSENService = (service.workRequired === 'SEN Data' || service.workRequired === 'Media Data');
	const isAddServiceEnabled = useAddServiceState(service, isCardService, isPortService);
	const {renderedTable} = useServiceModalState(index, service);
	
	logger.info(`AddServiceModal - Index: ${index}, isPortService: ${isPortService}, isCardService: ${isCardService},
                 isNATFWService: ${isNATFWService}, isSENService: ${isSENService}, renderedTable: ${renderedTable} `);
	
	return (
		<div className="grid grid-cols-1 gap-x-2 gap-y-4 md:grid-cols-1">
			<div>
				<h4 className="text-sm font-semibold leading-7 text-indigo-900">
					{index + 1} - {service.workRequired}
				</h4>
				<p className="text-sm text-gray-600">
					Select the resources for your <Mark color="cyan">{service.workRequired}</Mark> service
				</p>
			</div>
			
			{!isSENService && (
				<RenderComponent
					index={index}
					service={service}
					userName={userName}
					readonly={readonly}
					isLoadingChassis={isLoadingChassis}
					isCardService={isCardService}
					isPortService={isPortService}
				/>
			)}
			
			{isNATFWService && (renderedTable === 'existingFlows' || renderedTable === 'newFlows') && (
				<RenderNATFWComponent index={index} service={service} readonly={readonly}/>
			)}
			
			{/*{isSENService && (*/}
			{/*  <RenderSENComponent service={service} index={index} readonly={readonly} />*/}
			{/*)}*/}
			
			<div className="flex justify-center pb-2">
				<Group position="right" mt="md">
					{!readonly && (
						<div className="mt-2 col-span-1">
							{onAddServiceFn && (
								<BtnFunction
									type="button"
									onClick={() => {
										logger.info(`ServiceModal [onAddServiceFn]: Index ${index} `);
										onAddServiceFn(service, index);
									}}
									disabled={!isAddServiceEnabled}>
									Add to Cart
								</BtnFunction>
							)}
							{onUpdateServiceFn && (
								<BtnFunction
									type="button"
									onClick={() => {
										logger.debug(`ServiceModal [onUpdateServiceFn]: Index ${index} `);
										onUpdateServiceFn(index);
									}}
									disabled={!isAddServiceEnabled}>
									Update Service
								</BtnFunction>
							)}
						</div>
					)}
					<div className="mt-2 col-span-1">
						<BtnFunction type="button" onClick={onClose}>
							Close
						</BtnFunction>
					</div>
				</Group>
			</div>
		</div>
	);
};

export default AddServiceModal;
