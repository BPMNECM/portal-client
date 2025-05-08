import React from 'react';
import {useRouter} from 'next/router';
import {Button, Group, Table} from '@mantine/core';
import {getLogger} from '@/utils/logger/logger';
import SignInPrompt from '@/pages/misc/not-signed';
// import { useAuth } from '@/hooks/use-auth';

const logger = getLogger('DraftOrderShow');

const DraftOrderShow = ({serviceOrder, currentUser, error}) => {
	// const { currentUser, loading } = useAuth();
	const router = useRouter();
	logger.info(`DraftOrderShow - currentUser: ${currentUser?.name}`);
	
	if (error && error.message === 'Request failed with status code 401') {
		return <SignInPrompt/>;
	} else if (process.env.NEXT_PUBLIC_ENV !== 'development' && !currentUser?.isVerified) {
		router.push('/auth/email-verification/resend-email');
	}
	
	if (error) {
		return (
			<div style={{padding: '40px'}}>
				<p>Error: {error}</p>
				<Button onClick={() => router.back()}>Back</Button>
			</div>
		);
	}
	
	// Handle undefined serviceOrder or services
	if (!serviceOrder || !serviceOrder.services) {
		return (
			<div style={{padding: '40px'}}>
				<p>No services available for this service order.</p>
				<Button onClick={() => router.back()}>Back</Button>
			</div>
		);
	}
	
	return (
		<div style={{padding: '40px'}}>
			<Group position="apart" style={{marginBottom: '40px'}}>
				<div/>
				<Button onClick={() => router.back()}>Back</Button>
			</Group>
			
			<Table>
				<thead>
				<tr>
					<th>Request Type</th>
					<th>Work Required</th>
					<th>Chassis</th>
					<th>Slot</th>
					<th>Service Type</th>
					<th>Media IP Data</th>
				</tr>
				</thead>
				<tbody>
				{serviceOrder.services.map((service) => (
					<tr key={service.slotId}>
						<td>{service.requestType}</td>
						<td>{service.workRequired}</td>
						<td>{service.chassis}</td>
						<td>{service.slot}</td>
						<td>{service.serviceType}</td>
						<td>
							<Button
								onClick={() => router.push(`/drafts/${serviceOrder.id}/services/${service.slotId}/flows-table`)}>View</Button>
						</td>
					</tr>
				))}
				</tbody>
			</Table>
		</div>
	);
};

DraftOrderShow.getInitialProps = async (context, client, currentUser) => {
	const {serviceOrderId} = context.query;
	logger.info(`DraftOrderShow [getInitialProps] - currentUser: ${currentUser?.name}, serviceOrderId: ${serviceOrderId}`);
	
	try {
		const {data} = await client.get(`/api/service-orders/${serviceOrderId}`);
		
		if (!data?.services) {
			logger.warn(`DraftOrderShow [getInitialProps] - No services found for draftOrder ${serviceOrderId}`);
			return {notFound: true};
		}
		logger.debug(`DraftOrderShow [getInitialProps] - Found serviceOrder: ${JSON.stringify(data)}`);
		
		return {serviceOrder: data};
		
	} catch (error) {
		logger.error(`DraftOrderShow [getInitialProps] - Error fetching draftOrder with Id: ${serviceOrderId}, ${error.response?.status} - ${error.message} `);
		return {error};
	}
};

export default DraftOrderShow;


/**
 export async function getServerSideProps(context) {
 const client = buildClient(context.req);
 try {
 const { serviceOrderId } = context.query;
 const { data } = await client.get(`/api/service-orders/${serviceOrderId}`);
 
 if (!data || !data.services) {
 logger.warn('DraftOrderShow [getServerSideProps] - ServiceOrder or services not found');
 return { notFound: true };
 }
 
 logger.debug('DraftOrderShow [getServerSideProps] - data : ' + JSON.stringify(data));
 return { props: { serviceOrder: data } };
 } catch (error) {
 logger.error('DraftOrderShow [getServerSideProps] - Error fetching the serviceOrder details: ' +
 error.message);
 return { props: { error: 'Error fetching serviceOrder details' } };
 }
 }
 **/

