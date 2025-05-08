import React, {Fragment, useState} from 'react';
import {Button, Collapse, ScrollArea, Table} from '@mantine/core';
import {FaMinus, FaPlus} from 'react-icons/fa';
import {getLogger} from '@/utils/logger/logger';

const logger = getLogger('ReviewServices');

const statusDisplayNames = {
	701: 'Planned'
	// Add other status codes and their display strings here
};

const CardTable = ({service, index}) => {
	const [isOpen, setIsOpen] = useState(false);
	logger.info(`CardTable - RequestType is ${service.requestType} for index ${index}`);
	
	return (
		<div className="pb-4 space-y-4 ">
			<Button onClick={() => setIsOpen(!isOpen)}
					className="mt-4 pb-2 py-2 px-2">
				{isOpen ? <FaMinus/> : <FaPlus/>}
				&nbsp;&nbsp;
				# {index + 1} -
				&nbsp;&nbsp;
				<span
					style={{fontWeight: 'bold', color: 'white'}}>{service.workRequired}
              </span>
				&nbsp;service requested on {service.resource}
				&nbsp;&nbsp;
			</Button>
			
			<Collapse in={isOpen} transition="rotate">
				
				<div style={{whiteSpace: 'nowrap'}}>
					<ScrollArea style={{width: '100%'}}>
						<Table
							withBorder
							shadow="sm"
							withColumnBorders
							striped
							highlightOnHover
							horizontalSpacing="xs"
							verticalSpacing="xs"
							fontSize="sm"
							verticalAlignment="top"
							style={{minWidth: '1200px'}}
						>
							<thead>
							<tr>
								<th
									rowSpan={2}
									style={{
										fontSize: '0.8rem',
										backgroundColor: '#ADD8E6',
										overflow: 'hidden',
										textOverflow: 'ellipsis',
										whiteSpace: 'nowrap'
									}}
								>
									Source Country
								</th>
								<th
									rowSpan={2}
									style={{
										fontSize: '0.8rem',
										backgroundColor: '#ADD8E6',
										overflow: 'hidden',
										textOverflow: 'ellipsis',
										whiteSpace: 'nowrap'
									}}
								>
									Source Site
								</th>
								<th
									rowSpan={2}
									style={{
										fontSize: '0.8rem',
										backgroundColor: '#ADD8E6',
										overflow: 'hidden',
										textOverflow: 'ellipsis',
										whiteSpace: 'nowrap'
									}}
								>
									Source Site Desc
								</th>
								<th
									rowSpan={2}
									style={{
										fontSize: '0.8rem',
										backgroundColor: '#ADD8E6',
										overflow: 'hidden',
										textOverflow: 'ellipsis',
										whiteSpace: 'nowrap'
									}}
								>
									Far Country
								</th>
								<th
									rowSpan={2}
									style={{
										fontSize: '0.8rem',
										backgroundColor: '#ADD8E6',
										overflow: 'hidden',
										textOverflow: 'ellipsis',
										whiteSpace: 'nowrap'
									}}
								>
									Far Site
								</th>
								<th
									rowSpan={2}
									style={{
										fontSize: '0.8rem',
										backgroundColor: '#ADD8E6',
										overflow: 'hidden',
										textOverflow: 'ellipsis',
										whiteSpace: 'nowrap'
									}}
								>
									Far Site Desc
								</th>
								<th
									rowSpan={2}
									style={{
										fontSize: '0.8rem',
										backgroundColor: '#ADD8E6',
										overflow: 'hidden',
										textOverflow: 'ellipsis',
										whiteSpace: 'nowrap'
									}}
								>
									Path
								</th>
							</tr>
							</thead>
							<tbody>
							<tr>
								<td style={{fontSize: '0.8rem', color: 'gray'}}>{service.sourceCountry}</td>
								<td style={{fontSize: '0.8rem', color: 'gray'}}>{service.sourceSite}</td>
								<td style={{fontSize: '0.8rem', color: 'gray'}}>{service.sourceSiteDesc}</td>
								<td style={{fontSize: '0.8rem', color: 'gray'}}>{service.farCountry}</td>
								<td style={{fontSize: '0.8rem', color: 'gray'}}>{service.farSite}</td>
								<td style={{fontSize: '0.8rem', color: 'gray'}}>{service.farSiteDesc}</td>
								<td style={{fontSize: '0.8rem', color: 'gray'}}>{service.path}</td>
							</tr>
							</tbody>
						</Table>
					</ScrollArea>
				</div>
				
				<div style={{whiteSpace: 'nowrap'}}>
					<ScrollArea style={{width: '100%'}}>
						<Table
							withBorder
							shadow="sm"
							withColumnBorders
							striped
							highlightOnHover
							horizontalSpacing="xs"
							verticalSpacing="xs"
							fontSize="sm"
							verticalAlignment="top"
							style={{minWidth: '1200px'}}
						>
							<thead>
							<tr>
								<th
									rowSpan={2}
									style={{
										fontSize: '0.8rem', backgroundColor: '#ADD8E6',
										overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
									}}>Chassis
								</th>
								<th
									rowSpan={2}
									style={{
										fontSize: '0.8rem', backgroundColor: '#ADD8E6',
										overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
									}}>Slot
								</th>
								<th
									rowSpan={2}
									style={{
										fontSize: '0.8rem', backgroundColor: '#ADD8E6',
										overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
									}}>Slot Name
								</th>
								<th
									rowSpan={2}
									style={{
										fontSize: '0.8rem', backgroundColor: '#ADD8E6',
										overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
									}}>Card
								</th>
								<th colSpan={2}
									style={{
										fontSize: '0.8rem', backgroundColor: '#ADD8E6',
										overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
									}}>Card Status
								</th>
								<th colSpan={2}
									style={{
										fontSize: '0.8rem', backgroundColor: '#ADD8E6',
										overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
									}}>Default App
								</th>
								<th colSpan={2}
									style={{
										fontSize: '0.8rem', backgroundColor: '#ADD8E6',
										overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
									}}>Card Hand Off
								</th>
								<th colSpan={2}
									style={{
										fontSize: '0.8rem', backgroundColor: '#ADD8E6',
										overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
									}}>Pin Out
								</th>
							</tr>
							<tr>
								<th style={{
									fontSize: '0.8rem',
									overflow: 'hidden',
									textOverflow: 'ellipsis',
									whiteSpace: 'nowrap'
								}}>Existing
								</th>
								<th style={{
									fontSize: '0.8rem',
									overflow: 'hidden',
									textOverflow: 'ellipsis',
									whiteSpace: 'nowrap'
								}}>New
								</th>
								<th style={{
									fontSize: '0.8rem',
									overflow: 'hidden',
									textOverflow: 'ellipsis',
									whiteSpace: 'nowrap'
								}}>Existing
								</th>
								<th style={{
									fontSize: '0.8rem',
									overflow: 'hidden',
									textOverflow: 'ellipsis',
									whiteSpace: 'nowrap'
								}}>New
								</th>
								<th style={{
									fontSize: '0.8rem',
									overflow: 'hidden',
									textOverflow: 'ellipsis',
									whiteSpace: 'nowrap'
								}}>Existing
								</th>
								<th style={{
									fontSize: '0.8rem',
									overflow: 'hidden',
									textOverflow: 'ellipsis',
									whiteSpace: 'nowrap'
								}}>New
								</th>
								<th style={{
									fontSize: '0.8rem',
									overflow: 'hidden',
									textOverflow: 'ellipsis',
									whiteSpace: 'nowrap'
								}}>Existing
								</th>
								<th style={{
									fontSize: '0.8rem',
									overflow: 'hidden',
									textOverflow: 'ellipsis',
									whiteSpace: 'nowrap'
								}}>New
								</th>
							</tr>
							</thead>
							<tbody>
							<tr>
								<td style={{fontSize: '0.8rem', width: '150px', color: 'gray'}}>{service.chassis}</td>
								<td style={{fontSize: '0.8rem', color: 'gray'}}>{service.slot}</td>
								<td style={{fontSize: '0.8rem', width: '190px', color: 'gray'}}>{service.slotName}</td>
								<td style={{fontSize: '0.8rem', width: '115px', color: 'gray'}}>{service.card}</td>
								<td style={{fontSize: '0.8rem', color: 'blue'}}>{service.cardStatus}</td>
								<td style={{
									fontSize: '0.8rem',
									color: service.newCardStatus === service.cardStatus ? 'blue' : 'green'
								}}>
									{statusDisplayNames[service.cardStatus] || service.cardStatus}
								</td>
								<td style={{fontSize: '0.8rem', color: 'blue'}}>{service.defaultApp}</td>
								<td style={{
									fontSize: '0.8rem',
									color: service.newDefaultApp === service.defaultApp ? 'blue' : 'green'
								}}>
									{service.newDefaultApp === service.defaultApp ? 'Unchanged' : service.newDefaultApp}
								</td>
								<td style={{fontSize: '0.8rem', color: 'blue'}}>{service.cardHandOff}</td>
								<td style={{
									fontSize: '0.8rem',
									color: service.newCardHandOff === service.cardHandOff ? 'blue' : 'green'
								}}>
									{service.newCardHandOff === service.cardHandOff ? 'Unchanged' : service.newCardHandOff}
								</td>
								<td style={{fontSize: '0.8rem', color: 'blue'}}>{service.pinOut}</td>
								<td
									style={{
										fontSize: '0.8rem',
										color: service.newPinOut === service.pinOut ? 'blue' : 'green'
									}}>
									{service.newPinOut === service.pinOut ? 'Unchanged' : service.newPinOut}
								</td>
							</tr>
							</tbody>
						</Table>
					</ScrollArea>
				</div>
			</Collapse>
		</div>
	);
};

const PortTable = ({service, index}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [isVIPFlowsOpen, setIsVIPFlowsOpen] = useState(false);
	logger.info(`PortTable - RequestType is ${service.requestType} for index ${index}`);
	
	return (
		<div className="pb-4 space-y-4 ">
			<Button onClick={() => setIsOpen(!isOpen)}
					className="mt-4 pb-2 py-2 px-2">
				{isOpen ? <FaMinus/> : <FaPlus/>}
				&nbsp;&nbsp;
				# {index + 1} -
				&nbsp;&nbsp;
				<span
					style={{fontWeight: 'bold', color: 'white'}}>{service.workRequired}
              </span>
				&nbsp;service requested on {service.resource}
				&nbsp;&nbsp;
			</Button>
			<Collapse in={isOpen} transition="rotate">
				
				<div style={{whiteSpace: 'nowrap', marginBottom: '20px'}}>
					<ScrollArea style={{width: '100%'}}>
						<Table
							withBorder
							shadow="sm"
							withColumnBorders
							striped
							highlightOnHover
							horizontalSpacing="xs"
							verticalSpacing="xs"
							fontSize="sm"
							verticalAlignment="top"
							style={{minWidth: '1200px'}}
						>
							<thead>
							<tr>
								<th
									rowSpan={2}
									style={{
										fontSize: '0.8rem',
										backgroundColor: '#ADD8E6',
										overflow: 'hidden',
										textOverflow: 'ellipsis',
										whiteSpace: 'nowrap'
									}}
								>
									Path
								</th>
								<th
									rowSpan={2}
									style={{
										fontSize: '0.8rem',
										backgroundColor: '#ADD8E6',
										overflow: 'hidden',
										textOverflow: 'ellipsis',
										whiteSpace: 'nowrap'
									}}
								>
									Source Country
								</th>
								<th
									rowSpan={2}
									style={{
										fontSize: '0.8rem',
										backgroundColor: '#ADD8E6',
										overflow: 'hidden',
										textOverflow: 'ellipsis',
										whiteSpace: 'nowrap'
									}}
								>
									Source Site
								</th>
								<th
									rowSpan={2}
									style={{
										fontSize: '0.8rem',
										backgroundColor: '#ADD8E6',
										overflow: 'hidden',
										textOverflow: 'ellipsis',
										whiteSpace: 'nowrap'
									}}
								>
									Source Site description
								</th>
								<th
									rowSpan={2}
									style={{
										fontSize: '0.8rem',
										backgroundColor: '#ADD8E6',
										overflow: 'hidden',
										textOverflow: 'ellipsis',
										whiteSpace: 'nowrap'
									}}
								>
									Far Country
								</th>
								<th
									rowSpan={2}
									style={{
										fontSize: '0.8rem',
										backgroundColor: '#ADD8E6',
										overflow: 'hidden',
										textOverflow: 'ellipsis',
										whiteSpace: 'nowrap'
									}}
								>
									Far Site
								</th>
								<th
									rowSpan={2}
									style={{
										fontSize: '0.8rem',
										backgroundColor: '#ADD8E6',
										overflow: 'hidden',
										textOverflow: 'ellipsis',
										whiteSpace: 'nowrap'
									}}
								>
									Far Site description
								</th>
							
							</tr>
							</thead>
							<tbody>
							<tr>
								<td style={{fontSize: '0.8rem', color: 'black'}}>{service.path}</td>
								<td style={{fontSize: '0.8rem', color: 'black'}}>{service.sourceCountry}</td>
								<td style={{fontSize: '0.8rem', color: 'black'}}>{service.sourceSite}</td>
								<td style={{fontSize: '0.8rem', color: 'black'}}>{service.sourceSiteDesc}</td>
								<td style={{fontSize: '0.8rem', color: 'black'}}>{service.farCountry}</td>
								<td style={{fontSize: '0.8rem', color: 'black'}}>{service.farSite}</td>
								<td style={{fontSize: '0.8rem', color: 'black'}}>{service.farSiteDesc}</td>
							</tr>
							</tbody>
						</Table>
					</ScrollArea>
				</div>
				
				<div style={{whiteSpace: 'nowrap'}}>
					<ScrollArea style={{width: '100%'}}>
						<Table
							withBorder
							shadow="sm"
							withColumnBorders
							striped
							highlightOnHover
							horizontalSpacing="xs"
							verticalSpacing="xs"
							fontSize="sm"
							verticalAlignment="top"
							style={{minWidth: '1200px'}}
						>
							<thead>
							<tr>
								<th
									rowSpan={2}
									style={{
										fontSize: '0.8rem', backgroundColor: '#ADD8E6',
										overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
									}}>Chassis
								</th>
								<th
									rowSpan={2}
									style={{
										fontSize: '0.8rem', backgroundColor: '#ADD8E6',
										overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
									}}>Slot
								</th>
								<th
									rowSpan={2}
									style={{
										fontSize: '0.8rem', backgroundColor: '#ADD8E6',
										overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
									}}>Slot Name
								</th>
								<th
									rowSpan={2}
									style={{
										fontSize: '0.8rem', backgroundColor: '#ADD8E6',
										overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
									}}>Card
								</th>
								<th
									rowSpan={2}
									style={{
										fontSize: '0.8rem', backgroundColor: '#ADD8E6',
										overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
									}}>Port
								</th>
								<th
									colSpan={2}
									style={{
										fontSize: '0.8rem', backgroundColor: '#ADD8E6',
										overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
									}}>Port Status
								</th>
								<th
									colSpan={2}
									style={{
										fontSize: '0.8rem', backgroundColor: '#ADD8E6',
										overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
									}}>Service Type
								</th>
								<th
									colSpan={2}
									style={{
										fontSize: '0.8rem', backgroundColor: '#ADD8E6',
										overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
									}}>Hand Off
								</th>
								<th
									colSpan={2}
									style={{
										fontSize: '0.8rem', backgroundColor: '#ADD8E6',
										overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
									}}>Service Usage
								</th>
							</tr>
							<tr>
								<th style={{
									fontSize: '0.8rem',
									overflow: 'hidden',
									textOverflow: 'ellipsis',
									whiteSpace: 'nowrap'
									// backgroundColor: 'lightgray'
								}}>Existing
								</th>
								<th style={{
									fontSize: '0.8rem',
									overflow: 'hidden',
									textOverflow: 'ellipsis',
									whiteSpace: 'nowrap'
									// backgroundColor: 'lightgray'
								}}>New
								</th>
								<th style={{
									fontSize: '0.8rem',
									overflow: 'hidden',
									textOverflow: 'ellipsis',
									whiteSpace: 'nowrap'
								}}>Existing
								</th>
								<th style={{
									fontSize: '0.8rem',
									overflow: 'hidden',
									textOverflow: 'ellipsis',
									whiteSpace: 'nowrap'
								}}>New
								</th>
								<th style={{
									fontSize: '0.8rem',
									overflow: 'hidden',
									textOverflow: 'ellipsis',
									whiteSpace: 'nowrap'
								}}>Existing
								</th>
								<th style={{
									fontSize: '0.8rem',
									overflow: 'hidden',
									textOverflow: 'ellipsis',
									whiteSpace: 'nowrap'
								}}>New
								</th>
								<th style={{
									fontSize: '0.8rem',
									overflow: 'hidden',
									textOverflow: 'ellipsis',
									whiteSpace: 'nowrap'
								}}>Existing
								</th>
								<th style={{
									fontSize: '0.8rem',
									overflow: 'hidden',
									textOverflow: 'ellipsis',
									whiteSpace: 'nowrap'
								}}>New
								</th>
							</tr>
							</thead>
							<tbody>
							<tr>
								<td style={{fontSize: '0.8rem', width: '150px', color: 'black'}}>{service.chassis}</td>
								<td style={{fontSize: '0.8rem', color: 'black'}}>{service.slot}</td>
								<td style={{fontSize: '0.8rem', width: '190px', color: 'black'}}>{service.slotName}</td>
								<td style={{fontSize: '0.8rem', width: '115px', color: 'black'}}>{service.card}</td>
								<td style={{fontSize: '0.8rem', width: '210px', color: 'black'}}>{service.port}</td>
								<td style={{fontSize: '0.8rem', color: 'blue'}}>{service.portStatus}</td>
								<td style={{
									fontSize: '0.8rem',
									color: service.newPortStatus === service.portStatus ? 'gray' : 'green'
								}}>
									{service.newPortStatus === service.portStatus ? 'Unchanged' : service.newPortStatus}
								</td>
								<td style={{fontSize: '0.8rem', color: 'blue'}}>{service.serviceType}</td>
								<td style={{
									fontSize: '0.8rem',
									color: service.newServiceType === service.serviceType ? 'gray' : 'green'
								}}>
									{service.newServiceType === service.serviceType ? 'Unchanged' : service.newServiceType}
								</td>
								<td style={{fontSize: '0.8rem', color: 'blue'}}>{service.handOffDescription}</td>
								<td style={{
									fontSize: '0.8rem',
									color: service.newHandOff === service.handOff ? 'gray' : 'green'
								}}>
									{service.newHandOff === service.handOff ? 'Unchanged' : service.newHandOffDescription}
								</td>
								<td style={{fontSize: '0.8rem', color: 'blue'}}>{service.serviceUseDescription}</td>
								<td style={{
									fontSize: '0.8rem',
									color: service.newServiceUse === service.serviceUse ? 'gray' : 'green'
								}}>
									{service.newServiceUse === service.serviceUse ? 'Unchanged' : service.newServiceUseDescription}
								</td>
							</tr>
							</tbody>
						</Table>
					</ScrollArea>
					
					{service.workRequired === 'VIP (NATFW)' && (
						<div style={{paddingBottom: '20px'}}>
							<Button
								onClick={() => setIsVIPFlowsOpen(!isVIPFlowsOpen)}
								className="mt-2 pb-2 py-2">
								{isVIPFlowsOpen ? <FaMinus/> : <FaPlus/>}
								&nbsp;&nbsp;
								Show IP Flow details
							</Button>
						</div>
					)}
					<Collapse in={isVIPFlowsOpen} transition="rotate">
						<div style={{whiteSpace: 'nowrap', marginBottom: '20px'}}>
							<ScrollArea style={{width: '100%'}}>
								<Table
									withBorder
									shadow="sm"
									withColumnBorders
									striped
									highlightOnHover
									horizontalSpacing="xs"
									verticalSpacing="xs"
									fontSize="sm"
									verticalAlignment="top"
									style={{minWidth: '1200px'}}
								>
									<thead>
									<tr>
										<th
											rowSpan={2}
											style={{
												fontSize: '0.8rem',
												backgroundColor: '#ADD8E6',
												overflow: 'hidden',
												textOverflow: 'ellipsis',
												whiteSpace: 'nowrap'
											}}
										>
											Tx Flows
										</th>
										<th
											rowSpan={2}
											style={{
												fontSize: '0.8rem',
												backgroundColor: '#ADD8E6',
												overflow: 'hidden',
												textOverflow: 'ellipsis',
												whiteSpace: 'nowrap'
											}}
										>
											Rx Flows
										</th>
										<th
											colSpan={2}
											style={{
												fontSize: '0.8rem',
												backgroundColor: '#ADD8E6',
												overflow: 'hidden',
												textOverflow: 'ellipsis',
												whiteSpace: 'nowrap'
											}}
										>
											VIP Block
										</th>
										<th
											colSpan={2}
											style={{
												fontSize: '0.8rem',
												backgroundColor: '#ADD8E6',
												overflow: 'hidden',
												textOverflow: 'ellipsis',
												whiteSpace: 'nowrap'
											}}
										>
											Virtual Interface Type
										</th>
										<th
											colSpan={2}
											style={{
												fontSize: '0.8rem',
												backgroundColor: '#ADD8E6',
												overflow: 'hidden',
												textOverflow: 'ellipsis',
												whiteSpace: 'nowrap'
											}}
										>
											Physical Interface Type
										</th>
									</tr>
									<tr>
										<th
											style={{
												fontSize: '0.8rem',
												overflow: 'hidden',
												textOverflow: 'ellipsis',
												whiteSpace: 'nowrap'
											}}
										>
											Existing
										</th>
										<th
											style={{
												fontSize: '0.8rem',
												overflow: 'hidden',
												textOverflow: 'ellipsis',
												whiteSpace: 'nowrap'
											}}
										>
											New
										</th>
										<th
											style={{
												fontSize: '0.8rem',
												overflow: 'hidden',
												textOverflow: 'ellipsis',
												whiteSpace: 'nowrap'
											}}
										>
											Existing
										</th>
										<th
											style={{
												fontSize: '0.8rem',
												overflow: 'hidden',
												textOverflow: 'ellipsis',
												whiteSpace: 'nowrap'
											}}
										>
											New
										</th>
										<th
											style={{
												fontSize: '0.8rem',
												overflow: 'hidden',
												textOverflow: 'ellipsis',
												whiteSpace: 'nowrap'
											}}
										>
											Existing
										</th>
										<th
											style={{
												fontSize: '0.8rem',
												overflow: 'hidden',
												textOverflow: 'ellipsis',
												whiteSpace: 'nowrap'
											}}
										>
											New
										</th>
									</tr>
									</thead>
									<tbody>
									<tr>
										<td style={{fontSize: '0.8rem', color: 'black'}}>{service.TxFlows}</td>
										<td style={{fontSize: '0.8rem', color: 'black'}}>{service.RxFlows}</td>
										
										{/* VIP Block */}
										<td style={{fontSize: '0.8rem', color: 'blue'}}>{service.vipBlock}</td>
										<td style={{
											fontSize: '0.8rem',
											color: service.newVIPBlock !== service.vipBlock ? 'green' : 'gray'
										}}
										>
											{service.newVIPBlock === service.vipBlock ? 'Unchanged' : service.newVIPBlock}
										</td>
										
										{/* Virtual Interface Type */}
										<td
											style={{fontSize: '0.8rem', color: 'blue'}}>{service.gmnInterfaceType}</td>
										<td style={{
											fontSize: '0.8rem',
											color: service.newGMNInterfaceType !== service.gmnInterfaceType ? 'green' : 'gray'
										}}
										>
											{service.newGMNInterfaceType === service.gmnInterfaceType ? 'Unchanged' : service.newGMNInterfaceType}
										</td>
										
										{/* Physical Interface Type */}
										<td
											style={{fontSize: '0.8rem', color: 'blue'}}>{service.phyInterfaceType}</td>
										<td style={{
											fontSize: '0.8rem',
											color: service.newPhyInterfaceType !== service.phyInterfaceType ? 'green' : 'gray'
										}}
										>
											{service.newPhyInterfaceType === service.phyInterfaceType ? 'Unchanged' : service.newPhyInterfaceType}
										</td>
									</tr>
									</tbody>
								</Table>
							</ScrollArea>
						</div>
						
						<div style={{whiteSpace: 'nowrap', marginBottom: '20px'}}>
							<ScrollArea style={{width: '100%'}}>
								<Table
									withBorder
									shadow="sm"
									withColumnBorders
									striped
									highlightOnHover
									horizontalSpacing="xs"
									verticalSpacing="xs"
									fontSize="sm"
									verticalAlignment="top"
									style={{minWidth: '1200px'}}
								>
									<thead>
									<tr>
										<th rowSpan={2}
											style={{width: '50px', fontSize: '0.8rem', backgroundColor: '#ADD8E6'}}>No
										</th>
										<th rowSpan={2}
											style={{
												width: '50px',
												fontSize: '0.8rem',
												backgroundColor: '#ADD8E6'
											}}>Status
										</th>
										<th rowSpan={2}
											style={{width: '50px', fontSize: '0.8rem', backgroundColor: '#ADD8E6'}}>Flow
											No
										</th>
										<th rowSpan={2}
											style={{
												width: '50px',
												fontSize: '0.8rem',
												backgroundColor: '#ADD8E6'
											}}>Direction
										</th>
										<th rowSpan={2}
											style={{
												fontSize: '0.8rem',
												width: '208px',
												backgroundColor: '#ADD8E6'
											}}>Engineering
											Name
										</th>
										<th rowSpan={2}
											style={{
												fontSize: '0.8rem',
												width: '200px',
												backgroundColor: '#ADD8E6'
											}}>Friendly Name
										</th>
										<th colSpan={5} style={{
											fontSize: '0.8rem',
											width: '400px',
											textAlign: 'center',
											backgroundColor: '#ADD8E6'
										}}>Customer
										</th>
										<th colSpan={8} style={{
											fontSize: '0.8rem',
											width: '600px',
											textAlign: 'center',
											backgroundColor: '#ADD8E6'
										}}>Media Flow
										</th>
									</tr>
									<tr>
										<th style={{fontSize: '0.8rem'}}>VLAN</th>
										<th style={{fontSize: '0.8rem'}}>VideoIP</th>
										<th style={{fontSize: '0.8rem'}}>Netmask</th>
										<th style={{fontSize: '0.8rem'}}>Gateway</th>
										<th style={{fontSize: '0.8rem'}}>IGMP V</th>
										<th style={{fontSize: '0.8rem'}}>SourceIP</th>
										<th style={{fontSize: '0.8rem'}}>DestIP</th>
										<th style={{fontSize: '0.8rem'}}>SourcePort</th>
										<th style={{fontSize: '0.8rem'}}>DestPort</th>
										<th style={{fontSize: '0.8rem'}}>SSRC</th>
										<th style={{fontSize: '0.8rem'}}>Protocol</th>
										<th
											style={{
												fontSize: '0.8rem',
												overflow: 'hidden',
												textAlign: 'left'
											}}>HitlessMode
										</th>
										<th style={{fontSize: '0.8rem'}}>Bitrate</th>
									</tr>
									</thead>
									<tbody>
									{service.detailedVIPFlows && service.detailedVIPFlows.length > 0 &&
										service.detailedVIPFlows.map((flow, index) => (
											<tr key={index}>
												<td style={{fontSize: '0.8rem', color: 'black'}}>{index + 1}</td>
												<td style={{fontSize: '0.8rem', color: 'black'}}>{flow.status}</td>
												<td style={{fontSize: '0.8rem', color: 'black'}}>{flow.flowNo}</td>
												<td style={{fontSize: '0.8rem', color: 'black'}}>{flow.TxRx}</td>
												<td style={{
													fontSize: '0.8rem',
													color: 'black'
												}}>{flow.engineeringName}</td>
												<td
													style={{
														fontSize: '0.8rem',
														color: 'black'
													}}>{flow.friendlyName}</td>
												<td
													style={{
														fontSize: '0.8rem',
														color: 'slategray'
													}}>{flow.customerVlan}</td>
												<td
													style={{
														fontSize: '0.8rem',
														color: 'slategray'
													}}>{flow.customerVideoIp}</td>
												<td style={{
													fontSize: '0.8rem',
													color: 'slategray'
												}}>{flow.customerNetmask}</td>
												<td style={{
													fontSize: '0.8rem',
													color: 'slategray'
												}}>{flow.customerGateway}</td>
												<td style={{
													fontSize: '0.8rem',
													color: 'slategray'
												}}>{flow.customerIgmpVersion}</td>
												<td
													style={{
														fontSize: '0.8rem',
														color: 'slategray'
													}}>{flow.mediaFlowSourceIp}</td>
												<td style={{
													fontSize: '0.8rem',
													color: 'slategray'
												}}>{flow.mediaFlowDestIp}</td>
												<td style={{
													fontSize: '0.8rem',
													color: 'slategray'
												}}>{flow.mediaFlowSourcePort}</td>
												<td
													style={{
														fontSize: '0.8rem',
														color: 'slategray'
													}}>{flow.mediaFlowDestPort}</td>
												<td
													style={{
														fontSize: '0.8rem',
														color: 'slategray'
													}}>{flow.mediaFlowSsrc}</td>
												<td
													style={{
														fontSize: '0.8rem',
														color: 'slategray'
													}}>{flow.mediaFlowProtocol}</td>
												<td style={{
													fontSize: '0.8rem',
													color: 'slategray'
												}}>{flow.mediaFlowHitlessMode}</td>
												<td
													style={{
														fontSize: '0.8rem',
														color: 'slategray'
													}}>{flow.mediaFlowMbps}</td>
											</tr>
										))
									}
									</tbody>
								
								</Table>
							</ScrollArea>
						</div>
					</Collapse>
				</div>
			</Collapse>
		</div>
	);
};

const ReviewServices = ({services = []}) => {
	logger.info('ReviewServices - services:', services);
	
	if (!services.length) {
		return <p>No services added.</p>;
	}
	
	
	return (
		<div style={{whiteSpace: 'nowrap', marginBottom: '20px'}}>
			<ScrollArea style={{width: '100%'}}>
				<Table
					striped
					highlightOnHover
					// withBorder
					withColumnBorders
					shadow="sm"
					horizontalSpacing="xs"
					verticalSpacing="xs"
					fontSize="sm"
					verticalAlignment="top"
					style={{minWidth: '1200px'}}
				>
					<thead></thead>
					<tbody>
					{services.map((service, index) => (
						<Fragment key={index}>
							{service.resource.includes('Card') ? (
								<CardTable
									key={index}
									service={service}
									index={index}
								/>
							) : service.resource.includes('Port') ? (
								<PortTable
									key={index}
									service={service}
									index={index}
								/>
							) : null}
						</Fragment>
					))}
					</tbody>
				</Table>
			</ScrollArea>
		</div>
	);
};

export default ReviewServices;