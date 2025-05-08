'use client';

import {Fragment, useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import {FormProvider, useForm} from 'react-hook-form';
import {firstStepSchema} from '@/utils/lib/yup';
import useOrderStore from '@/store/useOrderStore';
import {yupResolver} from '@hookform/resolvers/yup';
import {useDisclosure} from '@mantine/hooks';
import {showNotification} from '@mantine/notifications';
import {Button, Group, Modal, Text} from '@mantine/core';
import BtnFunction from '@/components/Forms/Button';
import Wizard from '@/components/Forms/Wizard';
import Input from '@/components/Forms/Input';
import Textarea from '@/components/Forms/TextArea';
import DatePicker from '@/components/Forms/DatePicker';
import DropzoneInput from '@/components/Forms/DropzoneInput';
import SelectMenu from '@/components/Forms/SelectMenu';
import {formatHandoverDate, isFormDataModified} from '@/utils/form-utils';
import {getLogger} from '@/utils/logger/logger';
import SignInPrompt from '@/pages/misc/not-signed';

const logger = getLogger('FirstStep');

const FirstStep = ({currentUser}) => {
	let isModified;
	const router = useRouter();
	const {firstStep, setData} = useOrderStore();
	const [opened, {close, open}] = useDisclosure(false);
	const [isUserSignedIn, setIsUserSignedIn] = useState(true);
	
	const methods = useForm({
		mode: 'onSubmit',
		resolver: yupResolver(firstStepSchema),
		defaultValues: firstStep
	});
	
	const {handleSubmit, formState, watch} = methods;
	const orderType = watch('orderType');
	
	useEffect(() => {
		setIsUserSignedIn(!!currentUser);
		
		// Safely check environment variables
		try {
			const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
			const dnaHost = process.env.NEXT_PUBLIC_DNA_HOST || '';
			
			logger.debug(`Environment variables loaded: BASE_URL=${baseUrl}, DNA_HOST=${dnaHost}`);
		} catch (error) {
			logger.error(`Error accessing environment variables: ${error.message}`);
		}
		
		if (process.env.NODE_ENV !== 'development' && currentUser && !currentUser.isVerified) {
			router.push('/auth/email-verification/resend-email');
		}
	}, [currentUser, router]);
	
	logger.info(`FirstStep - Adding Order details on this page by User: ${currentUser?.name} `);
	
	if (!isUserSignedIn) {
		return <SignInPrompt/>;
	}
	
	const onSubmit = async (data, event) => {
		event.preventDefault();
		const handoverDate = data.customerHandoverTargetDate ? new Date(data.customerHandoverTargetDate) : null;
		
		const formattedData = {
			...data,
			handoverDate: formatHandoverDate(handoverDate)
		};
		
		isModified = isFormDataModified(formattedData, firstStep);
		
		if (isModified) {
			setData({step: 1, data: formattedData});
			
			// Route based on the selected order type
			if (data.orderType === 'SMOT') {
				await router.push('/form/smot-step');
			} else {
				await router.push('/form/second-step');
			}
			
			showNotification({
				title: 'All good!',
				message: 'Order details have been successfully captured!',
				color: 'blue',
				position: 'top-center',
				withCloseButton: true
			});
		} else {
			const proceed = confirm('No changes detected. Do you still want to proceed to the next page?');
			if (proceed) {
				// Route based on the selected order type
				if (data.orderType === 'SMOT') {
					await router.push('/form/smot-step');
				} else {
					await router.push('/form/second-step');
				}
			}
		}
	};
	
	const onCancel = async () => {
		logger.trace('FirstStep [onCancel] - Cancelling and redirecting to Dashboard.');
		showNotification({
			title: 'Cancelled',
			withCloseButton: true,
			position: 'top-center',
			message: 'Operation cancelled, redirecting to Dashboard!',
			color: 'yellow'
		});
		await router.push('/');
	};
	
	const onPrevious = async () => {
		logger.trace('FirstStep [onPrevious] - Navigating back!');
		showNotification({
			title: 'Back',
			withCloseButton: true,
			position: 'top-center',
			message: 'You have navigated back!',
			color: 'blue'
		});
		await router.back();
	};
	
	const onSave = () => {
		logger.trace('FirstStep [onSave] - Saving data!');
		// Save the serviceOrder data into database using api '/api/service-orders' and then go back
		// saveData();
		showNotification({
			title: 'Saved',
			withCloseButton: true,
			position: 'top-center',
			message: 'Order details have been saved successfully!',
			color: 'blue'
		});
	};
	
	return (
		<div className="px-32">
			<Fragment>
				<Wizard activeStep={0}/>
				<FormProvider {...methods}>
					<form onSubmit={handleSubmit((data, event) => onSubmit(data, event))}>
						<div className="space-y-12">
							<div
								className="mt-12 border-b border-gray-900/10 pb-2 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:border-t">
								<SelectMenu label="Network" id="network" placeholder="Choose the network">
									<option value="G">Global Media network (GMN)</option>
								</SelectMenu>
								<SelectMenu label="Order Type" id="orderType" placeholder="Choose an option">
									<option value="SOT">New Sales Order (SOT)</option>
									<option value="MOT">Modify Sales Order (MOT)</option>
									<option value="SMOT">Service Orders (SMOT)</option>
								</SelectMenu>
								<Input label="Project Name" id="projectName"
									   helperText="For example: NBC Sports - Media Edge"/>
								<Textarea
									label="Remarks"
									id="remarks"
									placeholder="Provide additional details"
									helperText="Brief description about this order"
								/>
								<DatePicker
									label="Handover Date"
									id="customerHandoverTargetDate"
									placeholder="Select the required date"
								/>
								<DropzoneInput
									label="Supporting Docs"
									id="supportingDocs"
									accept="application/pdf, image/png, image/jpg, image/jpeg"
									helperText="You can only drop .pdf, .jpg, .jpeg, or .png file here"
									maxFiles={3}
								/>
							</div>
							
							<div className="flex items-center justify-between gap-x-8 py-6 px-2">
								<Modal
									opened={opened}
									onClose={close}
									size="auto"
									title={
										<Text
											color="red"
											size="md"
											style={{
												fontFamily: 'Arial',
												fontWeight: 'bold',
												textTransform: 'uppercase',
												letterSpacing: '1px',
												textAlign: 'center'
											}}
										>
											Note
										</Text>
									}
								>
									<Text>To save the Order details and to resume later, click 'Continue' else
										'Cancel' </Text>
									<Group mt="xl">
										<BtnFunction variant="outline" onClick={onSave}>
											Continue
										</BtnFunction>
										<BtnFunction variant="outline" onClick={onCancel}>
											Cancel
										</BtnFunction>
									</Group>
								</Modal>
								
								<Group position="left">
									<Button
										onClick={open}
										style={{color: 'Black', backgroundColor: 'white'}}
										disabled={formState.isSubmitting}
									>
										Cancel
									</Button>
									<BtnFunction type="button" onClick={open}
												 disabled={!formState.isValid || formState.isSubmitting}>
										Save
									</BtnFunction>
								</Group>
								
								<div className="flex items-center gap-x-4">
									<Button
										type="button"
										style={{color: 'Black', backgroundColor: 'white'}}
										onClick={onPrevious}
										disabled={formState.isSubmitting}
									>
										Back
									</Button>
									<BtnFunction disabled={formState.isSubmitting} type="submit">
										Next
									</BtnFunction>
								</div>
							</div>
						</div>
					</form>
				</FormProvider>
			</Fragment>
		</div>
	);
};

FirstStep.getInitialProps = async (context, client, currentUser) => {
	logger.info('FirstStep [getInitialProps] - currentUser: ' + currentUser?.name);
	return {currentUser};
};

export default FirstStep;
