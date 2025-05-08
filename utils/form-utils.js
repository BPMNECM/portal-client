import {format, isValid, parseISO} from 'date-fns';
import enGB from 'date-fns/locale/en-GB';
import {getLogger} from '@/utils/logger/logger';

const logger = getLogger('FormUtils');
export const isModel = (model, ...criteria) => criteria.some((criterion) => model.includes(criterion));

const isSDISlot = (model, name) => {
	const isAperi = isModel(model, 'A1105');
	const isCP6K = isModel(model, 'CP6000');
	const isAteme = isModel(model, 'R6515', 'R6615', 'R7515', 'R7615');
	
	return (
		(isAperi && name.includes('MS')) ||
		isAteme || isCP6K
	);
};

const isASISlot = (model, name) => {
	const isAperi = isModel(model, 'A1105');
	const isDCM = isModel(model, 'DCM');
	const isCP6K = isModel(model, 'CP6000');
	const isAteme = isModel(model, 'R6615', 'R7515', 'R7615');
	
	return (
		(isAperi && name.includes('MS')) ||
		(isDCM && (name === 'DCM-IO-PROC' || name === 'DCM-ASI-MK1')) ||
		isAteme || isCP6K
	);
};

const isNATFWSlot = (model, name) => {
	const isAperi = isModel(model, 'A1105');
	const isDCM = isModel(model, 'DCM');
	const isAteme = isModel(model, 'R6515', 'R6615', 'R7515', 'R7615');
	
	return (
		(isAperi && name.includes('MS')) ||
		(isDCM && ['DCM-IO-PROC', 'DCM-GBE-MK1'].includes(name)) ||
		(isAteme && ['ConnectX-5', 'ConnectX-6'].includes(name))
	);
};

const isSENSlot = (model, name) => {
	const isAperi = isModel(model, 'A1105');
	const isArista = isModel(model, '7020');
	const isCisco = isModel(model, 'NEXUS');
	
	// List of specific slot names for Aperis
	const aperiSlotNames = ['10G 2', '10G 3', '10G 4', '10G 5', '10G 6', '10G 7', 'CP1', 'CP2', 'CP3', 'CP4', 'CP5', 'CP6'];
	
	// Generate slot names for Arista from "Et 35" to "Et 54", excluding "Et 49"
	const aristaSlotNames = Array.from({length: 54 - 35 + 1}, (_, i) => `Et ${35 + i}`).filter((name) => name !== 'Et 49');
	
	// Generate slot names for Cisco from "Eth1/35" to "Eth1/54", excluding "Eth1/48"
	const ciscoSlotNames = Array.from({length: 54 - 35 + 1}, (_, i) => `Eth1/${35 + i}`).filter((name) => name !== 'Eth1/48');
	
	return (
		(isAperi && aperiSlotNames.includes(name)) || // Match Aperi slot names
		(isArista && aristaSlotNames.includes(name)) || // Match Arista slot names
		(isCisco && ciscoSlotNames.includes(name)) // Match Cisco slot names
	);
};

export const extractSENSlotIdsAndNames = (selectedChassis) => {
	logger.info('extractSENSlotIdsAndNames - Processing SEN Slot Criteria.');
	return extractSlotIdsAndNames(selectedChassis, isSENSlot);
};

export const extractNATFWSlotIdsAndNames = (selectedChassis) => {
	logger.info('extractNATFWSlotIdsAndNames - Processing NATFW Slot Criteria.');
	return extractSlotIdsAndNames(selectedChassis, isNATFWSlot);
};

/** Generalized Slot Extraction Utility **/

export const extractSlotIdsAndNames = (selectedChassis, typeCriteria) => {
	const model = selectedChassis.resourceSpecification[0]?.model || '';
	logger.info(`extractSlotIdsAndNames - Retrieve Slots on the selected Chassis model: ${model} `);
	
	const slots = selectedChassis.resourceRelationship.reduce((acc, relationship) => {
		const {resource} = relationship;
		const {id, name, '@referredType': type} = resource;
		
		if (type === 'Slot' && typeCriteria(model, name)) {
			// Get the model from `resourceSlotNameSpecification`
			const slotModel = selectedChassis.resourceSpecification.find(
				(spec) => spec.name === 'resourceSlotNameSpecification'
			)?.model || 'Unknown';
			
			acc.push({
				id,
				name,
				slotName: `${selectedChassis.publicIdentifier}-${name}`,
				model,
				slotModel
			});
		}
		return acc;
	}, []);
	
	if (slots.length === 0) {
		logger.warn(
			`extractSlotIdsAndNames - No slots with matching criteria found for chassis: ${selectedChassis.publicIdentifier}.`
		);
	} else {
		logger.info(
			`extractSlotIdsAndNames - ${slots.length} slots with matching criteria found for chassis: ${selectedChassis.publicIdentifier}.`
		);
	}
	
	const sortedSlots = slots.sort((a, b) => a.id - b.id);
	logger.info('extractSlotIdsAndNames - Extracted Slot Data: ' + JSON.stringify(sortedSlots));
	return sortedSlots;
};

export const extractPortIdsAndNames = (selectedSlot) => {
	logger.debug('extractPortIdsAndNames - Retrieve portIds, portNames for the selected Slot: ' + JSON.stringify(selectedSlot));
	
	const portData = selectedSlot.resourceRelationship
		.filter((relationship) => relationship.resource['@referredType'] === 'Port')
		.map((relationship) => ({
			id: relationship.resource.id,
			name: relationship.resource.name || 'Unnamed Port' // Assign 'Unnamed Port' if name is missing
		}));
	
	logger.debug('extractPortIdsAndNames - Filtered out Ports : ' + JSON.stringify(portData));
	return portData;
};

/** Unused functions below **/

export const oldExtractSlotIdsAndNames = (selectedChassis) => {
	logger.debug('extractSlotIdsAndNames - SelectedChassis : ' + JSON.stringify(selectedChassis));
	
	const slotData = selectedChassis.resourceRelationship
		// 'Card' is not used to ensure all Slots are retrieved
		.filter((relationship) => relationship.resource['@referredType'] === 'Slot')
		.filter((relationship) => {
			const model = selectedChassis.resourceSpecification[0]?.model;
			
			// Aperi: 'SDMP' is not used to ensure all Slots are retrieved
			// DCMs: 'DCM-IO-PROC' is used
			if (model.includes('A1105') && relationship.resource.name.includes('MS')) {
				return true;
			} else if (model.includes('DCM') && relationship.resource.name === 'DCM-IO-PROC') {
				return true;
			}
			return false;
		})
		.map((relationship) => {
			const slotId = relationship.resource.id;
			
			// Find the corresponding resource for the slotId
			const slotResource = selectedChassis.resourceRelationship.find(
				(rel) => rel.relationshipType === 'contains' && rel.resource.id === slotId
			);
			
			if (slotResource) {
				const slotName = `${selectedChassis.publicIdentifier}-${slotResource.resource.name}`;
				return {
					id: slotResource.resource.id,
					name: slotResource.resource.name,
					slotName: slotName
				};
			}
			// Handle the case when slotResource is not found
			return null;
		})
		.filter((slot) => slot !== null)
		// Sort the slot data by id in ascending order
		.sort((a, b) => a.id - b.id);
	
	logger.debug('extractSlotIdsAndNames - Extracted Slot Data : ' + JSON.stringify(slotData));
	return slotData;
};

export const extractSlotIdsWithCard = (selectedChassis) => {
	logger.debug('extractSlotIdsWithCard - Retrieve Slots with SDMP card installed in the selected Chassis: ' + JSON.stringify(selectedChassis));
	
	const slotIds = selectedChassis.resourceRelationship
		.filter((relationship) => relationship.resource['@referredType'] === 'Card')
		.filter((relationship) => {
			const model = selectedChassis.resourceSpecification[0]?.model;
			if (model.includes('A1105') && relationship.resource.name.includes('SDMP')) {
				return true;
			} else if (model.includes('DCM') && relationship.resource.name === 'DCM-IO-PROC') {
				return true;
			}
			return false;
		})
		.map((relationship) => relationship.resource.id);
	
	logger.debug('extractSlotIdsWithCard - Filtered out Slots : ' + JSON.stringify(slotIds));
	return slotIds;
};

export const extractPortIds = (selectedSlot) => {
	logger.debug('extractPortIds - Retrieve portIds for the selected Slot: ' + JSON.stringify(selectedSlot));
	
	const portIds = selectedSlot.resourceRelationship
		.filter((relationship) => relationship.resource['@referredType'] === 'Port')
		.map((relationship) => relationship.resource.id);
	
	logger.debug('fetchPortsData - Filtered out Ports : ' + portIds);
	return portIds;
};

/** General Utilities functions below **/

export const determinePath = (chassis) => {
	const patternA = /-\d+A$/; // Matches '-nA' at the end of the string, where 'n' is any integer
	const patternB = /-\d+B$/; // Matches '-nB' at the end of the string, where 'n' is any integer
	
	const isAperiOrAteme = /A1105|ATEME|CP6K|DCM|R6515|R6615|R7515|R7615/.test(chassis); // Matches Aperi, Ateme, CP6K,
																						 // DCM, and Ateme devices
	const isArista = /7020/.test(chassis); // Matches Arista devices
	const isCisco = /9300/.test(chassis); // Matches Cisco devices
	
	// For Aperi, Ateme, CP6K, DCM devices, path is indicated by 'A' or 'B' at the end
	if (isAperiOrAteme) {
		if (patternA.test(chassis)) {
			return 'A';
		} else if (patternB.test(chassis)) {
			return 'B';
		} else {
			return 'Unknown Path';
		}
	}
	
	// For Arista devices, path is determined by 'b-acc' substring in the chassis name
	if (isArista) {
		if (/b-acc/.test(chassis)) {
			return 'B';
		} else if (/a-acc/.test(chassis)) {
			return 'A';
		} else {
			return 'Unknown Path';
		}
	}
	
	// For Cisco devices, path is determined by 'b-acc' substring in the chassis name
	if (isCisco) {
		if (/b-acc/.test(chassis)) {
			return 'B';
		} else if (/a-acc/.test(chassis)) {
			return 'A';
		} else {
			return 'Unknown Path';
		}
	}
	
	return 'Unknown Path';
};

export const isFormDataModified = (formData, initialData) => {
	
	if (!formData || !initialData) {
		// Handle the case where either formData or initialData is not available
		return false;
	}
	
	// Check if any field is different
	return Object.keys(formData).some((key) => {
		
		if (key === 'network') {
			return formData[key].value !== initialData[key].value;
		}
		
		// Handle special cases, e.g., supportingDocs array
		if (key === 'supportingDocs') {
			return (
				formData[key].length !== initialData[key].length ||
				formData[key].some((doc, index) => doc.path !== initialData[key][index].path)
			);
		}
		
		// Handle date field
		if (key === 'customerHandoverTargetDate') {
			return formatHandoverDate(formData[key]) !== initialData['handoverDate'];
		}
		
		// Default comparison
		return formData[key] !== initialData[key];
	});
};

export const formatHandoverDate = (dateString) => {
	let parsedDate = null;
	
	// Ensure dateString is not null and is a valid ISO date
	if (dateString) {
		// Check if dateString is already a Date object
		if (typeof dateString === 'string') {
			parsedDate = parseISO(dateString); // Try to parse as ISO string
		} else if (dateString instanceof Date) {
			parsedDate = dateString; // Already a Date object
		}
	}
	
	// Check if parsedDate is valid
	return parsedDate && isValid(parsedDate) ? format(parsedDate, 'dd/MMM/yyyy', {locale: enGB}) : '';
};

export const getRequestTypeTitle = (requestType) => {
	switch (requestType) {
		case 'newServiceToPort':
			return 'Add New Service to the Port';
		case 'modifyServiceToPort':
			return 'Modify existing Service on the Port';
		case 'newServiceToCard':
			return 'Add New Service to the Card';
		case 'modifyServiceToCard':
			return 'Modify existing Service on the Card';
		default:
			return '';
	}
};

export const requestTypeDisplayNames = {
	newServiceToPort: 'New Service',
	newServiceToCard: 'New Service',
	modifyServiceToPort: 'Modify Service',
	modifyServiceToCard: 'Modify Service'
};



