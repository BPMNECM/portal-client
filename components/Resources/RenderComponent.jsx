import React, {useState} from 'react';
import useOrderStore from '@/store/useOrderStore';
import useServiceModalState from '@/hooks/useServiceModalState';
import useResourceHandlers from '@/hooks/useResourceHandlers';
import {Badge, Loader, Table, Text} from '@mantine/core';
import {getLogger} from '@/utils/logger/logger';
import DropdownUpdateBtn from '@/components/Forms/DropdownUpdateBtn';
import Select from '@/components/Forms/Select';
import BtnFunction from '@/components/Forms/Button';
import {
	CardStatusOptions,
	handOffOptions,
	PhysicalInterfaceTypeOptions,
	PinOutOptions,
	serviceUseOptions,
	VirtualInterfaceTypeOptions
} from '@/utils/lib/select-options';


const RenderComponent = ({
							 index,
							 service,
							 userName,
							 readonly,
							 isLoadingChassis,
							 isCardService,
							 isPortService
						 }) => {
	const logger = getLogger('RenderComponent');
	logger.info(`Index: ${index}, userName: ${userName}, isPortService: ${isPortService}, isCardService: ${isCardService},
                                            isLoadingChassis: ${isLoadingChassis}, readonly: ${readonly}`);
	
	const [chassisRequestErrors, setChassisRequestErrors] = useState(null);
	const [slotRequestErrors, setSlotRequestErrors] = useState(null);
	const [addCardRequestErrors, setAddCardRequestErrors] = useState(null);
	const [portRequestErrors, setPortRequestErrors] = useState(null);
	const [isLoadingSlots, setIsLoadingSlots] = useState(false);
	const [isLoadingCardValue, setIsLoadingCardValue] = useState(false);
	const [isLoadingPorts, setIsLoadingPorts] = useState(false);
	const [isLoadingPortValue, setIsLoadingPortValue] = useState(false);
	const [renderedTable, setRenderedTable] = useState(null);
	// const [addCardRefreshFlag, setAddCardRefreshFlag] = useState(false);
	
	const {handleInputChange} = useServiceModalState(index, service, userName);
	const {secondStep} = useOrderStore();
	
	const {
		handleChassisChange,
		handleSlotChange,
		handlePortChange,
		addNewCardRequest
	} = useResourceHandlers(index, service, userName,
		{
			setChassisRequestErrors, setSlotRequestErrors, setAddCardRequestErrors, setPortRequestErrors,
			setIsLoadingSlots, setIsLoadingCardValue,
			setIsLoadingPorts, setIsLoadingPortValue,
			setRenderedTable
			// setAddCardRefreshFlag
		});
	
	
	return (
		<div>
			<div className="shadow-sm ring-1 ring-gray-900/30 sm:rounded-xl md:col-span-4">
				<div className="px-4 py-6 sm:p-8">
					<div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-1">
						
						<div className="grid grid-cols-3 gap-x-6">
							<div className="col-span-1">
								<Select
									id={`chassis_${index}`}
									value={service.chassis}
									label="Chassis"
									onChange={(e) => handleChassisChange(e.target.value)}
									disabled={readonly}
									placeholder="Select chassis"
								>
									<option value="" disabled>
										Select
									</option>
									{isLoadingChassis ? (
										<option value="Loading" disabled>
											Loading.....
										</option>
									) : (
										secondStep.chassisOptions.map((option, index) => (
											<option key={index} value={option.name}>
												{option.name}
											</option>
										))
									)}
								</Select>
							</div>
							<div className="mt-10 flex items-center">
								<label htmlFor={`path_${index}`} className="block text-sm text-gray-600 mr-4 w-48">
									Belongs to path
								</label>
								<input
									type="text"
									id={`path_${index}`}
									placeholder="Path for the selected Chassis"
									value={service.path}
									readOnly
									className="mt-1 block w-full py-1 px-3 border border-gray-300 bg-white rounded-md
                                     shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500
                                     sm:text-sm"
								/>
							</div>
							<div className="col-span-1">
								{chassisRequestErrors && chassisRequestErrors.message && (
									<div className="mt-4 text-red-500">
										Error: {chassisRequestErrors.message}
										{chassisRequestErrors.errors && (
											<ul>
												{chassisRequestErrors.errors.map((error, index) => (
													<li key={index}>{error}</li>
												))}
											</ul>
										)}
									</div>
								)}
							</div>
						
						</div>
						
						<div className="grid grid-cols-3 gap-x-6">
							<div className="mt-1 col-span-1">
								<Select
									id={`slot_${index}`}
									value={service.slot}
									label="Slot"
									onChange={(e) => handleSlotChange(e.target.value)}
									disabled={readonly}
									placeholder={'Select slot'}
								>
									<option value="" disabled>
										Select
									</option>
									{isLoadingSlots ? (
										<option value="Loading" disabled>
											Loading.....
										</option>
									) : (
										service.slotOptions && service.slotOptions.length > 0 && service.slotOptions.map((slot) => {
											const slotName = slot?.name || slot?.publicIdentifier || 'Unnamed Slot';
											return (
												<option key={slot.id} value={slotName}>
													{slotName}
												</option>
											);
										})
									)}
								</Select>
							</div>
							<div className="mt-10 flex items-center">
								<label htmlFor={`slotName_${index}`} className="block text-sm text-gray-600 w-52">
									Public Identifier
								</label>
								<input
									id={`slotName_${index}`}
									type="text"
									label="Slot Name"
									placeholder="Public Identifier for selected Slot"
									value={service.slot && service.slotOptions.find((opt) => opt.name === service.slot)?.slotName}
									readOnly
									className="mt-3 block w-full py-1 px-3 border border-gray-300 bg-white rounded-md
                                shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500
                                sm:text-sm"
								/>
							</div>
							<div className="col-span-1">
								{slotRequestErrors && slotRequestErrors.message && (
									<div className="mt-4 text-red-500">
										Error: {slotRequestErrors.message}
										{slotRequestErrors.errors && (
											<ul>
												{slotRequestErrors.errors.map((error, index) => (
													<li key={index}>{error}</li>
												))}
											</ul>
										)}
									</div>
								)}
							</div>
						</div>
						
						<div className="grid grid-cols-3 gap-x-6">
							<div className="mt-6 col-span-1">
								<label
									htmlFor={`card_${index}`}
									className="block -mr-36 text-sm text-gray-600 w-full">
									Card installed on this Slot
								</label>
								<input
									id={`card_${index}`}
									type="text"
									label="Card Type"
									placeholder="Card type for selected Slot"
									value={service.card}
									readOnly
									className="mt-4 mr-4 block w-full py-1 px-2 border border-gray-300 bg-white rounded-md
                                          shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500
                                          sm:text-sm"
								/>
							</div>
							<div className="mt-10 flex items-center">
								<BtnFunction
									type="button"
									className="mt-5"
									onClick={() => addNewCardRequest(service.slotId)}
									disabled={service.card !== 'Empty Slot'}
								>
									Add Card
								</BtnFunction>
							</div>
							<div className="col-span-1">
								{addCardRequestErrors && addCardRequestErrors.message && (
									<div className="mt-4 text-red-500">
										Error: {addCardRequestErrors.message}
										{addCardRequestErrors.errors && (
											<ul>
												{addCardRequestErrors.errors.map((error, index) => (
													<li key={index}>{error}</li>
												))}
											</ul>
										)}
									</div>
								)}
							</div>
						</div>
						
						<div className="mt-8">
							<Badge size="lg" variant="light" radius="sm" color="blue">Current state of the selected
								Slot</Badge>
						</div>
						
						<Table
							striped
							highlightOnHover
							withBorder
							withColumnBorders
							className={'mt-4 mb-4 w-2/3'}>
							<thead>
							<tr>
								<th style={{backgroundColor: '#ADD8E6'}}>Attribute</th>
								<th style={{backgroundColor: '#ADD8E6'}}>Current state</th>
								<th style={{backgroundColor: '#ADD8E6'}}>Update</th>
							</tr>
							</thead>
							<tbody>
							<tr>
								<td>
									<Text
										size="sm"
										fw={500}
										variant="gradient"
										gradient={{from: 'black', to: 'gray', deg: 80}}
									>Project Number</Text>
								</td>
								<td>
									{isLoadingCardValue ? (
										<Loader color="blue" size="sm"/>
									) : (
										<Text
											size="sm"
											fw={400}
											variant="gradient"
											gradient={{from: 'indigo', to: 'indigo', deg: 90}}>
											{service.cardProjectNumber}
										</Text>
									)}
								</td>
								<td>
									<DropdownUpdateBtn
										label="Card Project Number"
										placeholder="Select"
										index={index}
										disabled={true}
										options={[
											{
												'value': service.cardProjectNumber,
												'description': service.cardProjectNumber
											}
										]}
										currentValue={service.cardProjectNumber}
									/>
								</td>
							</tr>
							<tr>
								<td>
									<Text
										size="sm"
										fw={500}
										variant="gradient"
										gradient={{from: 'black', to: 'gray', deg: 80}}>Card status</Text>
								</td>
								<td>
									{isLoadingCardValue ? (
										<Loader color="blue" size="sm"/>
									) : (
										<Text
											size="sm"
											fw={400}
											variant="gradient"
											gradient={{from: 'indigo', to: 'indigo', deg: 90}}>
											{service.cardStatusDescription}
										</Text>
									)}
								</td>
								<td>
									<DropdownUpdateBtn
										label="Card Status"
										placeholder="CardStatus"
										disabled={isPortService}
										options={CardStatusOptions}
										currentValue={service.cardStatus}
										newValue={service.newCardStatus}
										onChange={(selectedValue) => handleInputChange('newCardStatus', selectedValue)}
										onUpdate={() => {
											// Handle the onUpdate logic if needed
										}}
										index={index}
									/>
								</td>
							</tr>
							<tr>
								<td>
									<Text
										size="sm"
										fw={500}
										variant="gradient"
										gradient={{from: 'black', to: 'gray', deg: 80}}>Default App</Text>
								</td>
								<td>
									{isLoadingCardValue ? (
										<Loader color="blue" size="sm"/>
									) : (
										<Text
											size="sm"
											fw={400}
											variant="gradient"
											gradient={{from: 'indigo', to: 'indigo', deg: 90}}>
											{service.defaultApp}
										</Text>
									)}
								</td>
								<td>
									<DropdownUpdateBtn
										label="Default App"
										placeholder="defaultApp"
										disabled={isPortService}
										options={[
											{
												'value': service.newDefaultApp,
												'description': service.newDefaultApp
											}
										]}
										currentValue={service.defaultApp}
										newValue={service.newDefaultApp}
										onChange={(selectedValue) => handleInputChange('newDefaultApp', selectedValue)}
										onUpdate={() => {
											// Handle the onUpdate logic if needed
										}}
										index={index}
									/>
								</td>
							</tr>
							<tr>
								<td>
									<Text
										size="sm"
										fw={500}
										variant="gradient"
										gradient={{from: 'black', to: 'gray', deg: 80}}>Hand Off</Text>
								</td>
								<td>
									{isLoadingCardValue ? (
										<Loader color="blue" size="sm"/>
									) : (
										<Text
											size="sm"
											fw={400}
											variant="gradient"
											gradient={{from: 'indigo', to: 'indigo', deg: 90}}>
											{service.cardHandOffDescription}
										</Text>
									)}
								</td>
								<td>
									<DropdownUpdateBtn
										label="Hand Off"
										placeholder="HandOff"
										disabled={isPortService}
										options={handOffOptions}
										currentValue={service.cardHandOff}
										newValue={service.newCardHandOff}
										onChange={(selectedValue) => handleInputChange('newCardHandOff', selectedValue)}
										onUpdate={() => {
											// Handle the onUpdate logic if needed
										}}
										index={index}
									/>
								</td>
							</tr>
							<tr>
								<td>
									<Text
										size="sm"
										fw={500}
										variant="gradient"
										gradient={{from: 'black', to: 'gray', deg: 80}}>PinOut design</Text>
								</td>
								<td>
									{isLoadingCardValue ? (
										<Loader color="blue" size="sm"/>
									) : (
										<Text
											size="sm"
											fw={400}
											variant="gradient"
											gradient={{from: 'indigo', to: 'indigo', deg: 90}}>
											{service.pinOutDescription}
										</Text>
									)}
								</td>
								<td>
									<DropdownUpdateBtn
										label="PinOut design"
										placeholder="PinOut Design"
										disabled={isPortService}
										options={PinOutOptions}
										currentValue={service.pinOut}
										newValue={service.newPinOut}
										onChange={(selectedValue) => handleInputChange('newPinOut', selectedValue)}
										onUpdate={() => {
											// Handle the onUpdate logic if needed
										}}
										index={index}
									/>
								</td>
							</tr>
							</tbody>
						</Table>
						
						{isPortService && (
							<div>
								<div className="grid grid-cols-3 gap-y-2">
									<div className="col-span-1">
										<Select
											id={`port_${index}`}
											value={service.port}
											label="Port"
											onChange={(e) => handlePortChange(e.target.value)}
											disabled={readonly}
											placeholder={'Select port'}
										>
											<option value="" disabled>
												Select
											</option>
											{isLoadingPorts ? (
												<option value="Loading" disabled>
													Loading.....
												</option>
											) : (
												// Ensure portOptions is an array and map over it
												(Array.isArray(service.portOptions) && service.portOptions.length > 0 ? service.portOptions.map((port) => {
														const portName = port.name || port.publicIdentifier || 'Unnamed Port';
														return (
															<option key={port.id} value={portName}>
																{portName}
															</option>
														);
													})
													: (
														<option value="NoPorts" disabled>
															No Ports Available
														</option>
													))
											)}
										</Select>
									</div>
									<div className="mt-8 mr-6 ml-6 flex items-center">
										<label
											htmlFor={`engineeringName_${index}`}
											className="mt-2 block text-sm text-gray-600 w-72">
											Engineering Name
										</label>
										<input
											type="text"
											id={`engineeringName_${index}`}
											placeholder="Engineering Name for the selected port"
											value={service.engineeringName}
											readOnly
											className="mt-2 block w-full py-2 px-4 border border-gray-300 bg-white rounded-md
                                     shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500
                                     sm:text-sm"
										/>
									</div>
									<div className="col-span-1">
										{portRequestErrors && portRequestErrors.message && (
											<div className="mt-4 text-red-500">
												Error: {portRequestErrors.message}
												{portRequestErrors.errors && (
													<ul>
														{portRequestErrors.errors.map((error, index) => (
															<li key={index}>{error}</li>
														))}
													</ul>
												)}
											</div>
										)}
									</div>
								</div>
								
								<div className="mt-8 pb-2">
									<Badge size="lg" variant="light" radius="sm" color="blue"> Current state of the
										selected
										Port</Badge>
								</div>
								
								<Table
									striped
									highlightOnHover
									withBorder
									withColumnBorders
									className={'mt-4 mb-4 w-2/3'}>
									<thead>
									<tr>
										<th style={{backgroundColor: '#ADD8E6'}}>Attribute</th>
										<th style={{backgroundColor: '#ADD8E6'}}>Current state</th>
										<th style={{backgroundColor: '#ADD8E6'}}>Update</th>
									</tr>
									</thead>
									<tbody>
									<tr>
										<td>
											<Text
												size="sm"
												fw={500}
												variant="gradient"
												gradient={{from: 'black', to: 'gray', deg: 80}}>Friendly Name</Text>
										</td>
										<td>
											{isLoadingPortValue ? (
												<Loader color="blue" size="sm"/>
											) : (
												<Text
													size="sm"
													fw={400}
													variant="gradient"
													gradient={{from: 'indigo', to: 'indigo', deg: 90}}>
													{service.friendlyName}
												</Text>
											)}
										</td>
										<td>
											<DropdownUpdateBtn
												label="Friendly Name"
												placeholder="Select"
												index={index}
												disabled={true}
												options={[
													{
														'value': service.friendlyName,
														'description': service.friendlyName
													}
												]}
												currentValue={service.friendlyName}
											/>
										</td>
									</tr>
									<tr>
										<td>
											<Text
												size="sm"
												fw={500}
												variant="gradient"
												gradient={{from: 'black', to: 'gray', deg: 80}}>Project Number</Text>
										</td>
										<td>
											{isLoadingPortValue ? (
												<Loader color="blue" size="sm"/>
											) : (
												<Text
													size="sm"
													fw={400}
													variant="gradient"
													gradient={{from: 'indigo', to: 'indigo', deg: 90}}>
													{service.portProjectNumber}
												</Text>
											)}
										</td>
										<td>
											<DropdownUpdateBtn
												index={index}
												label="Port Project Number"
												placeholder="Select"
												disabled={true}
												options={[
													{
														'value': service.portProjectNumber,
														'description': service.portProjectNumber
													}
												]}
												currentValue={service.portProjectNumber}
											/>
										</td>
									</tr>
									<tr>
										<td>
											<Text
												size="sm"
												fw={500}
												variant="gradient"
												gradient={{from: 'black', to: 'gray', deg: 80}}>Port Number</Text>
										</td>
										<td>
											{isLoadingPortValue ? (
												<Loader color="blue" size="sm"/>
											) : (
												<Text
													size="sm"
													fw={400}
													variant="gradient"
													gradient={{from: 'indigo', to: 'indigo', deg: 90}}>
													{service.portNo}
												</Text>
											)}
										</td>
										<td>
											<DropdownUpdateBtn
												label="Port Number"
												placeholder="Select"
												index={index}
												disabled={true}
												options={[
													{
														'value': service.portNo,
														'description': service.portNo
													}
												]}
												currentValue={service.portNo}
											/>
										</td>
									</tr>
									<tr>
										<td>
											<Text
												size="sm"
												fw={500}
												variant="gradient"
												gradient={{from: 'black', to: 'gray', deg: 80}}>Port status</Text>
										</td>
										<td>
											{isLoadingPortValue ? (
												<Loader color="blue" size="sm"/>
											) : (
												<Text
													size="sm"
													fw={400}
													variant="gradient"
													gradient={{from: 'indigo', to: 'indigo', deg: 90}}>
													{service.portStatusDescription}
												</Text>
											)}
										</td>
										<td>
											<DropdownUpdateBtn
												index={index}
												label="Port Status"
												placeholder="PortStatus"
												// options={PortStatusOptions}
												options={[
													{
														'value': service.newPortStatus,
														'description': service.newPortStatusDescription
													}
												]}
												currentValue={service.portStatus}
												newValue={service.newPortStatus}
												onChange={(selectedValue) => handleInputChange('newPortStatus', selectedValue)}
												disabled={isPortService || readonly}
												onUpdate={() => {
													// Handle the onUpdate logic if needed
												}}
											/>
										</td>
									</tr>
									<tr>
										<td>
											<Text
												size="sm"
												fw={500}
												variant="gradient"
												gradient={{from: 'black', to: 'gray', deg: 80}}>Service type</Text>
										</td>
										<td>
											{isLoadingPortValue ? (
												<Loader color="blue" size="sm"/>
											) : (
												<Text
													size="sm"
													fw={400}
													variant="gradient"
													gradient={{from: 'indigo', to: 'indigo', deg: 90}}>
													{service.serviceType}
												</Text>
											)}
										</td>
										<td>
											<DropdownUpdateBtn
												index={index}
												label="Service type"
												placeholder="Select"
												options={[
													{
														'value': service.newServiceType,
														'description': service.newServiceType
													}
												]}
												currentValue={service.serviceType}
												newValue={service.newServiceType}
												onChange={(selectedValue) => handleInputChange('newServiceType', selectedValue)}
												disabled={isPortService || readonly}
												onUpdate={() => {
													// Handle the onUpdate logic if needed
												}}
											/>
										</td>
									</tr>
									<tr>
										<td>
											<Text
												size="sm"
												fw={500}
												variant="gradient"
												gradient={{from: 'black', to: 'gray', deg: 80}}>Hand Off</Text>
										</td>
										<td>
											{isLoadingPortValue ? (
												<Loader color="blue" size="sm"/>
											) : (
												<Text
													size="sm"
													fw={400}
													variant="gradient"
													gradient={{from: 'indigo', to: 'indigo', deg: 90}}>
													{service.handOffDescription}
												</Text>
											)}
										</td>
										<td>
											<DropdownUpdateBtn
												index={index}
												label="Hand-Off"
												placeholder="Select"
												options={handOffOptions}
												currentValue={service.handOff}
												newValue={service.newHandOff}
												onChange={(selectedValue) => handleInputChange('newHandOff', selectedValue)}
												onUpdate={() => {
													// Handle the onUpdate logic if needed
												}}
												disabled={readonly}
											/>
										</td>
									</tr>
									<tr>
										<td>
											<Text
												size="sm"
												fw={500}
												variant="gradient"
												gradient={{from: 'black', to: 'gray', deg: 80}}>Service Usage</Text>
										</td>
										<td>
											{isLoadingPortValue ? (
												<Loader color="blue" size="sm"/>
											) : (
												<Text
													size="sm"
													fw={400}
													variant="gradient"
													gradient={{from: 'indigo', to: 'indigo', deg: 90}}>
													{service.serviceUseDescription}
												</Text>
											)}
										</td>
										<td>
											<DropdownUpdateBtn
												index={index}
												label="Service Usage"
												placeholder="Select"
												options={serviceUseOptions}
												currentValue={service.serviceUse}
												newValue={service.newServiceUse}
												onChange={(selectedValue) => handleInputChange('newServiceUse', selectedValue)}
												onUpdate={() => {
													// Handle the onUpdate logic if needed
												}}
												disabled={readonly}
											/>
										</td>
									</tr>
									<tr>
										<td>
											<Text
												size="sm"
												fw={500}
												variant="gradient"
												gradient={{from: 'black', to: 'gray', deg: 80}}>Virtual Interface
												Type</Text>
										</td>
										<td>
											{isLoadingPortValue ? (
												<Loader color="blue" size="sm"/>
											) : (
												<Text
													size="sm"
													fw={400}
													variant="gradient"
													gradient={{from: 'indigo', to: 'indigo', deg: 90}}>
													{service.gmnInterfaceType}
												</Text>
											)}
										</td>
										<td>
											<DropdownUpdateBtn
												index={index}
												label="Virtual Interface Type"
												placeholder="Select"
												disabled={readonly}
												options={VirtualInterfaceTypeOptions}
												currentValue={service.gmnInterfaceType}
												newValue={service.newGMNInterfaceType}
												onChange={(selectedValue) => handleInputChange('newGMNInterfaceType', selectedValue)}
												onUpdate={() => {
													// Handle the onUpdate logic if needed
												}}
											/>
										</td>
									</tr>
									<tr>
										<td>
											<Text
												size="sm"
												fw={500}
												variant="gradient"
												gradient={{from: 'black', to: 'gray', deg: 80}}>Physical Interface
												Type</Text>
										</td>
										<td>
											{isLoadingPortValue ? (
												<Loader color="blue" size="sm"/>
											) : (
												<Text
													size="sm"
													fw={400}
													variant="gradient"
													gradient={{from: 'indigo', to: 'indigo', deg: 90}}>
													{service.phyInterfaceType}
												</Text>
											)}
										</td>
										<td>
											<DropdownUpdateBtn
												index={index}
												label="Physical Interface Type"
												placeholder="Select"
												options={PhysicalInterfaceTypeOptions}
												currentValue={service.phyInterfaceType}
												newValue={service.newPhyInterfaceType}
												onChange={(selectedValue) => handleInputChange('newPhyInterfaceType', selectedValue)}
												onUpdate={() => {
													// Handle the onUpdate logic if needed
												}}
												disabled={true}
											/>
										</td>
									</tr>
									<tr>
										<td>
											<Text
												size="sm"
												fw={500}
												variant="gradient"
												gradient={{from: 'black', to: 'gray', deg: 80}}>VIP Block</Text>
										</td>
										<td>
											{isLoadingPortValue ? (
												<Loader color="blue" size="sm"/>
											) : (
												<Text
													size="sm"
													fw={400}
													variant="gradient"
													gradient={{from: 'indigo', to: 'indigo', deg: 90}}>
													{service.vipBlock}
												</Text>
											)}
										</td>
										<td>
											<DropdownUpdateBtn
												index={index}
												label="VIP Block"
												placeholder="Select"
												disabled={true}
												currentValue={service.vipBlock}
												options={[
													{
														'value': service.vipBlock,
														'description': service.vipBlock
													}
												]}
												// newValue={service.newVIPBlock}
												// onChange={(selectedValue) => handleInputChange('newVIPBlock',
												// selectedValue)} options={vipBlockOptions}
											/>
										</td>
									</tr>
									</tbody>
								</Table>
							</div>
						)}
					
					</div>
				</div>
			</div>
		</div>
	);
};

export default RenderComponent;