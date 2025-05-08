import * as yup from 'yup';

export const requiredDateSchema = yup.date().required('Handover date for your Order is required.');

export const firstStepSchema = yup.object().shape({
	network: yup.string().required('Choose the Network.'),
	orderType: yup.string().required('Choose the type of your Order.'),
	projectName: yup
		.string()
		// .matches(/^(FY\d{2})([A-Z]{3})([A-Z]{2}\d{2})$/, 'Invalid format')
		.required('Project Name is required.'),
	remarks: yup.string().required('Brief description about the order is required.'),
	customerHandoverTargetDate: requiredDateSchema,
	// supportingDocs: yup.mixed().required('Supporting documents like HLD is required.'),
	supportingDocs: yup
		.mixed()
		.test('required', 'Supporting documents like HLD is required.', (value) => {
			return value && value.length > 0;
		})
		.required('Supporting document like HLD is required.')
});

const serviceSchema = yup.object().shape({
	sourceCountry: yup.string().required('Country is missing from the order').notOneOf([''], 'Country cannot be empty'),
	sourceSite: yup.string().required('Site is missing from the order').notOneOf([''], 'Site cannot be empty'),
	sourceSiteDesc: yup
		.string()
		.required('Site Description is missing from the order')
		.notOneOf([''], 'Site Description cannot be empty'),
	
	resource: yup
		.string()
		.required('Service resource is missing from the order')
		.notOneOf([''], 'Service resource cannot be empty'),
	requestType: yup
		.string()
		.required('Service type is missing from the order')
		.notOneOf([''], 'Service type cannot be empty'),
	workRequired: yup
		.string()
		.required('Service required is missing from the order')
		.notOneOf([''], 'Service required cannot be empty'),
	chassis: yup.string().required('Chassis is required in the Order').notOneOf([''], 'Chassis cannot be empty'),
	slot: yup.string().required('Slot is required in the Order').notOneOf([''], 'Slot cannot be empty'),
	
	// Optional fields (can be empty)
	farCountry: yup.string().nullable(),
	farSite: yup.string().nullable(),
	farSiteDesc: yup.string().nullable(),
	path: yup.string().nullable(),
	slotId: yup.string().notRequired(),
	slotName: yup.string().notRequired(),
	card: yup.string().notRequired(),
	cardStatus: yup.string().notRequired(),
	newCardStatus: yup.string().notRequired(),
	cardStatusDescription: yup.string().notRequired(),
	newCardStatusDescription: yup.string().notRequired(),
	cardProjectNumber: yup.string().notRequired(),
	cardNewProjectNumber: yup.string().notRequired(),
	defaultApp: yup.string().notRequired(),
	newDefaultApp: yup.string().notRequired(),
	cardHandOff: yup.string().notRequired(),
	newCardHandOff: yup.string().notRequired(),
	cardHandOffDescription: yup.string().notRequired(),
	newCardHandOffDescription: yup.string().notRequired(),
	pinOut: yup.string().notRequired(),
	newPinOut: yup.string().notRequired(),
	pinOutDescription: yup.string().notRequired(),
	newPinOutDescription: yup.string().notRequired(),
	port: yup.string().notRequired(),
	portId: yup.string().notRequired(),
	portStatus: yup.string().notRequired(),
	newPortStatus: yup.string().notRequired(),
	portStatusDescription: yup.string().notRequired(),
	newPortStatusDescription: yup.string().notRequired(),
	engineeringName: yup.string().notRequired(),
	friendlyName: yup.string().notRequired(),
	portNo: yup.string().notRequired(),
	portProjectNumber: yup.string().notRequired(),
	portNewProjectNumber: yup.string().notRequired(),
	totalFlows: yup.number().notRequired(),
	TxFlows: yup.number().notRequired(),
	RxFlows: yup.number().notRequired(),
	vipBlock: yup.number().notRequired(),
	newVIPBlock: yup.number().notRequired(),
	serviceType: yup.string().notRequired(),
	newServiceType: yup.string().notRequired(),
	handOff: yup.string().notRequired(),
	newHandOff: yup.string().notRequired(),
	handOffDescription: yup.string().notRequired(),
	newHandOffDescription: yup.string().notRequired(),
	serviceUse: yup.string().notRequired(),
	newServiceUse: yup.string().notRequired(),
	serviceUseDescription: yup.string().notRequired(),
	newServiceUseDescription: yup.string().notRequired(),
	gmnInterfaceType: yup.string().notRequired(),
	newGMNInterfaceType: yup.string().notRequired(),
	phyInterfaceType: yup.string().notRequired(),
	newPhyInterfaceType: yup.string().notRequired(),
	
	// Nested array field (detailedVIPFlows)
	detailedVIPFlows: yup
		.array()
		.of(
			yup.object().shape({
				flowNo: yup.number().notRequired(),
				TxRx: yup.string().notRequired(),
				engineeringName: yup.string().notRequired(),
				friendlyName: yup.string().notRequired(),
				status: yup.string().notRequired(),
				customerVlan: yup.string().notRequired(),
				customerVideoIp: yup.string().notRequired(),
				customerNetmask: yup.string().notRequired(),
				customerGateway: yup.string().notRequired(),
				customerIgmpVersion: yup.string().notRequired(),
				mediaFlowSourceIp: yup.string().notRequired(),
				mediaFlowDestIp: yup.string().notRequired()
			})
		)
		.notRequired()
});

export const secondStepSchema = yup.object().shape({
	services: yup.array().test(
		'minLength', // First test to check if there is at least one service
		'At least one service must be added to the order to proceed to the next step!',
		(value) => value && value.length > 0 // Check that array length is greater than 0
	)
	// .test(
	// 	'hasValidService', // Second test to check if at least one service has all required fields filled
	// 	'Please check if at least one Service has all required fields!',
	// 	(services) => {
	// 		console.log('secondStepSchema - Services data before validation:', services);
	// 		// Check if array has services, then validate service fields
	// 		return services && services.length > 0 && services.some(service => {
	// 			// Check if at least one service has all required fields filled
	// 			return Object.values(service).every(value => value !== '');
	// 		});
	// 	}
	// )
});

export const validateSecondStep = yup.object().shape({
	services: yup
		.array()
		.min(1, 'At least one service must be added to the order to proceed to the next step!')
		.of(serviceSchema) // Validate each service item against serviceSchema
		.test(
			'hasValidService', // Ensure at least one service has all required fields
			'Please ensure at least one Service has all required fields!',
			(services) => {
				if (!services || services.length === 0) return false;
				
				console.log('validateSecondStep - Services data before validation:', services);
				
				// Filter out services that are entirely empty (all required fields are empty)
				const filledServices = services.filter((service) => {
					return Object.keys(service).some((key) => service[key] !== '');
				});
				
				// Check if at least one filtered service fully meets the serviceSchema requirements
				return filledServices.some((service) => {
					try {
						serviceSchema.validateSync(service, {abortEarly: false});
						return true;
					} catch (error) {
						console.log('Validation failed for service:', service, 'with error:', error.errors);
						return false;
					}
				});
			}
		)
});

export const validateServices = yup.object().shape({
	services: yup
		.array()
		.test(
			'hasValidService',
			'At least one service must be added to the order to proceed to the next step!',
			(services) => {
				console.log('validateServices - Services data before validation:', services);
				
				// First check if the array length is greater than 0
				if (!services || services.length === 0) {
					return false; // Fail validation if no services are present
				}
				// Then, check if at least one service has all required fields filled with non-empty values
				return services.some((service) => {
					return Object.values(service).every((value) => value !== '');
				});
			}
		)
});

export const newSiteSchema = yup.object().shape({
	country: yup.string().required('Select the Country.'),
	siteCode: yup.string().required('Select the Site Code.'),
	siteName: yup.string().required('Select the Site Name.')
});

export const smotStepSchema = yup.object().shape({
	serviceOrderId: yup.string().required('Service Order ID is required'),
	serviceType: yup.string().required('Service Type is required'),
	description: yup.string().required('Description is required').min(10, 'Description must be at least 10 characters'),
	priority: yup.string().required('Priority is required'),
	requestedCompletionDate: yup
		.date()
		.required('Completion date is required')
		.min(new Date(), 'Completion date cannot be in the past'),
	location: yup.string().required('Location is required'),
	serviceStatus: yup.string().required('Service Status is required'),
	contactName: yup.string().required('Contact name is required'),
	contactEmail: yup.string().required('Contact email is required').email('Must be a valid email address'),
	contactPhone: yup
		.string()
		.required('Contact phone is required')
		.matches(/^[0-9\-+$$$$ ]+$/, 'Phone number is not valid'),
	attachments: yup.array(),
	additionalNotes: yup.string(),
	activationType: yup.object().shape({
		single: yup.boolean(),
		dual: yup.boolean()
	}),
	connectionType: yup.object().shape({
		p2p: yup.boolean(),
		p2mp: yup.boolean()
	})
});
