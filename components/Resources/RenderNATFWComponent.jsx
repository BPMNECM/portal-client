import React from 'react';
import useServiceModalState from '@/hooks/useServiceModalState';
import AddVIPFlowsTable from '@/components/Tables/AddVIPFlowsTable';
import ExistingVIPFlowsTable from '@/components/Tables/ExistingVIPFlowsTable';
import {Accordion, Button, Divider, Group, Stack} from '@mantine/core';
import {IconPlus} from '@tabler/icons-react';
import Select from '@/components/Forms/Select';
import {getLogger} from '@/utils/logger/logger';
import {PhysicalInterfaceTypeOptions, RxOptions, TxOptions, vipBlockOptions} from '@/utils/lib/select-options';


const RenderNATFWComponent = ({index, service, userName, readonly}) => {
	const logger = getLogger('RenderNATFWComponent');
	const {
		handleInputChange,
		handleGenerateFlow,
		isLoadingPortValue,
		renderedTable
	} = useServiceModalState(index, service);
	logger.info(`RenderNATFWComponent - Index: ${index}, userName: ${userName}, readonly: ${readonly}, renderedTable: ${renderedTable} `);
	
	return (
		<div>
			<div className="mt-10">
				<div className="grid grid-cols-1">
					<Accordion
						defaultValue="addNewFlows"
						initialState={[]}
						variant="separated"
						chevronPosition="left"
						chevron={<IconPlus size="1rem"/>}
						sx={{
							borderRadius: '2px',
							padding: '1px'
						}}
						styles={{
							chevron: {
								'&[data-rotate]': {
									transform: 'rotate(45deg)'
								}
							},
							item: {
								backgroundColor: '#f5f5f5'
							}
						}}
					>
						<Accordion.Item
							value="addNewFlows"
							sx={{
								borderRadius: '8px',
								backgroundColor: '#e3f2fd'
							}}
						>
							<Accordion.Control
								sx={{
									color: '#1e88e5',
									fontWeight: 700,
									padding: '2px 16px'
								}}
							>
								Add New Video IP (NATFW) Flows
							</Accordion.Control>
							<Accordion.Panel
								sx={{
									padding: '16px',
									backgroundColor: '#ffffff'
								}}
							>
								<Group position="left" spacing="xl" grow>
									<Select
										id={`phyInterfaceType_${index}`}
										value={service.newPhyInterfaceType}
										label="Physical Interface Type"
										onChange={(e) => handleInputChange('newPhyInterfaceType', e.target.value)}
										disabled={readonly}
									>
										{PhysicalInterfaceTypeOptions.map((option) => (
											<option key={option.value} value={option.value}>
												{option.label}
											</option>
										))}
									</Select>
									<Select
										id={`VIPBlock_${index}`}
										value={service.newVIPBlock}
										label="VIP Block"
										onChange={(e) => handleInputChange('newVIPBlock', e.target.value)}
										disabled={readonly}
									>
										{vipBlockOptions.map((option) => (
											<option key={option.value} value={option.value}>
												{option.label}
											</option>
										))}
									</Select>
									<Select
										id={`TxFlows_${index}`}
										value={service.TxFlows}
										label="Tx flows"
										onChange={(e) => handleInputChange('TxFlows', e.target.value)}
										disabled={readonly}
									>
										{TxOptions.map((option) => (
											<option key={option.value} value={option.value}>
												{option.label}
											</option>
										))}
									</Select>
									<Select
										id={`RxFlows_${index}`}
										value={service.RxFlows}
										label="Rx flows"
										onChange={(e) => handleInputChange('RxFlows', e.target.value)}
										disabled={readonly}
									>
										{RxOptions.map((option) => (
											<option key={option.value} value={option.value}>
												{option.label}
											</option>
										))}
									</Select>
									<div style={{marginTop: '40px'}}>
										<Button
											leftIcon={<IconPlus/>}
											onClick={handleGenerateFlow}
											disabled={isLoadingPortValue}
										>
											Add Flows
										</Button>
									</div>
								</Group>
							</Accordion.Panel>
						</Accordion.Item>
					</Accordion>
				</div>
				
				<div className="mt-10">
					<Stack>
						<Divider/>
						<div style={{width: '100%', overflowX: 'auto'}}>
							
							{(renderedTable === 'existingFlows' || service.vipFlows.length > 0) && (
								// {service.vipFlows.length > 0 && (
								<ExistingVIPFlowsTable
									engineeringName={service.engineeringName}
									friendlyName={service.friendlyName}
									TxFlows={Number(service.TxFlows)}
									RxFlows={Number(service.RxFlows)}
									serviceIndex={index}
								/>
							)}
							
							{/*{(renderedTable === 'newFlows' || service.totalFlows > 0) && (*/}
							{(renderedTable === 'newFlows') && (
								<AddVIPFlowsTable
									engineeringName={service.engineeringName}
									friendlyName={service.friendlyName}
									TxFlows={Number(service.TxFlows)}
									RxFlows={Number(service.RxFlows)}
									index={index}
								/>
							)}
						
						</div>
					</Stack>
				</div>
			</div>
		</div>
	);
};

export default RenderNATFWComponent;
