import {getLogger} from '@/utils/logger/logger';
import {portServicesOptions} from '@/utils/lib/select-options';

const logger = getLogger('resource-helper');

export const characteristicMapping = {
	slot: {
		card: {source: 'resourceSpecification', property: 'model', name: 'resourceCardTypeSpecification'},
		cardProjectNumber: {source: 'resourceCharacteristics', property: 'projectNumber'},
		cardHandOff: {source: 'resourceLookup', property: 'GMN_HITLESS'},
		cardHandOffDescription: {source: 'resourceLookup', property: 'GMN_HITLESS', description: true},
		defaultApp: {source: 'resourceLookup', property: 'GMN_CRD_PRD_GRP'},
		pinOut: {source: 'resourceLookup', property: 'GMN_CRD_PINOUT'},
		pinOutDescription: {source: 'resourceLookup', property: 'GMN_CRD_PINOUT', description: true},
		cardStatus: {source: 'resourceLookup', property: 'CARD_STATUS'},
		cardStatusDescription: {source: 'resourceLookup', property: 'CARD_STATUS', description: true}
	},
	port: {
		serviceType: {source: 'resourceCharacteristics', property: 'defaultApp'},
		vipBlock: {source: 'resourceCharacteristics', property: 'vipNoFlows'},
		portProjectNumber: {source: 'resourceCharacteristics', property: 'projectNumber'},
		portNo: {source: 'resourceCharacteristics', property: 'portNo'},
		engineeringName: {source: 'resourceCharacteristics', property: 'engineeringName'},
		friendlyName: {source: 'resourceCharacteristics', property: 'friendlyName'},
		handOff: {source: 'resourceLookup', property: 'GMN_HITLESS'},
		handOffDescription: {source: 'resourceLookup', property: 'GMN_HITLESS', description: true},
		portStatus: {source: 'resourceLookup', property: 'PORT_STATUS'},
		portStatusDescription: {source: 'resourceLookup', property: 'PORT_STATUS', description: true},
		serviceUse: {source: 'resourceLookup', property: 'GMN_PERM_ITIN'},
		serviceUseDescription: {source: 'resourceLookup', property: 'GMN_PERM_ITIN', description: true},
		gmnInterfaceType: {source: 'resourceLookup', property: 'GMN_INTERF_TYPE'}
	}
};

export const findCharacteristicValue = (resourceType, characteristics, property, isLookup = false, name = null, description = false) => {
	logger.debug(`findCharacteristicValue: resourceType: ${resourceType}, property: ${property}`);
	
	if (!Array.isArray(characteristics)) {
		logger.error('findCharacteristicValue - characteristics is not an array or is either null or undefined!');
		return 'Unassigned';
	}
	
	const characteristic = characteristics.find((char) => {
		if (name && char.name === name) {
			return char.model || char.value;
		}
		
		return isLookup ? char.referenceType === property : char.name === property;
	});
	
	if (characteristic) {
		if (isLookup) {
			return description ? characteristic.description || 'Unassigned' : characteristic.value || 'Unassigned';
		}
		return characteristic.value || characteristic.model || 'Unassigned';
	}
	
	return 'Unassigned';
};

export const extractFlowDetails = (flowDetails) => {
	const characteristics = flowDetails.resourceCharacteristics || [];
	const findCharacteristic = (name) => characteristics.find((char) => char.name === name)?.value || '';
	
	return {
		id: flowDetails.id || 'NA',
		name: flowDetails.name || 'NA',
		status: 'Original',
		inUseYn: findCharacteristic('inUseYn'),
		flowNo: findCharacteristic('flowNo'),
		TxRx: findCharacteristic('direction'),
		mainPortEngineeringName: findCharacteristic('mainPortEngineeringName'),
		engineeringName: findCharacteristic('engineeringName'),
		friendlyName: findCharacteristic('friendlyName'),
		primaryIp: findCharacteristic('primaryIp'),
		primaryMulticastIp: findCharacteristic('primaryMulticastIp'),
		primaryVlan: findCharacteristic('primaryVlan'),
		secondaryIp: findCharacteristic('secondaryIp'),
		secondaryMulticastIp: findCharacteristic('secondaryMulticastIp'),
		secondaryVlan: findCharacteristic('secondaryVlan'),
		flowProjectNumber: findCharacteristic('flowProjectNumber'),
		flowStatus: findCharacteristic('flowStatus'),
		requestType: findCharacteristic('requestType'),
		scheduallUpdated: findCharacteristic('scheduallUpdated'),
		dataminerUpdated: findCharacteristic('dataminerUpdated'),
		serviceType: findCharacteristic('serviceType'),
		customerVlan: findCharacteristic('customerVlan'),
		customerVideoIp: findCharacteristic('customerVideoIp'),
		customerNetmask: findCharacteristic('customerNetmask'),
		customerGateway: findCharacteristic('customerGateway'),
		customerIgmpVersion: findCharacteristic('customerIgmpVersion'),
		mediaFlowSourceIp: findCharacteristic('mediaFlowSourceIp'),
		mediaFlowDestIp: findCharacteristic('mediaFlowDestIp'),
		mediaFlowSourcePort: findCharacteristic('mediaFlowSourcePort'),
		mediaFlowDestPort: findCharacteristic('mediaFlowDestPort'),
		mediaFlowSsrc: findCharacteristic('mediaFlowSsrc'),
		mediaFlowProtocol: findCharacteristic('mediaFlowProtocol'),
		mediaFlowHitlessMode: findCharacteristic('mediaFlowHitlessMode'),
		mediaFlowMbps: findCharacteristic('mediaFlowMbps')
	};
};

export const filterOptionsByDevice = (selectedDevice) => {
	logger.debug(`filterOptionsByDevice - selectedDevice: ${selectedDevice}`);
	
	const deviceMap = {
		APERI: 'APERI',
		ATEME: 'ATEME',
		ARISTA: 'ARISTA',
		CISCO: 'CISCO',
		CP6000: 'CP6000',
		DCM: 'DCM'
	};
	
	const deviceKeyword = deviceMap[selectedDevice.toUpperCase()];
	logger.debug(`filterOptionsByDevice - deviceKeyword: ${deviceKeyword}`);
	
	if (!deviceKeyword) {
		logger.warn(`filterOptionsByDevice - Invalid device name: ${selectedDevice}`);
		return [];
	}
	
	return portServicesOptions.filter(
		(option) => option.typeComment && option.typeComment.toUpperCase().includes(deviceKeyword)
	);
};

