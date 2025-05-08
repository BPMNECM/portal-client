import dynamic from 'next/dynamic';
import React, {Fragment} from 'react';
import {useRouter} from 'next/router';
import {Container, Notification, rem, Space, Stack, Text} from '@mantine/core';
import SignInPrompt from '@/pages/misc/not-signed';
import {IconX} from '@tabler/icons-react';
import {getLogger} from '@/utils/logger/logger';

// import OrderDetailsPage from '@/components/Orders/OrderDetailsPage';
const OrderDetailsPage = dynamic(() => import('@/components/Orders/OrderDetailsPage'), {ssr: false});
const logger = getLogger('OrderShow');
const xIcon = <IconX style={{width: rem(20), height: rem(20)}}/>;

const OrderShow = ({order, orderId, currentUser, error}) => {
	// const { currentUser, loading } = useAuth();
	const router = useRouter();
	logger.info(`OrderShow - orderId: ${orderId}, currentUser: ${currentUser?.name} `);
	
	if (error && error.message === 'Request failed with status code 401') {
		return <SignInPrompt/>;
	} else if (process.env.NEXT_PUBLIC_ENV !== 'development' && !currentUser?.isVerified) {
		router.push('/auth/email-verification/resend-email');
	}
	
	if (!order || error) {
		return (
			<Fragment>
				<Space h="xl"/>
				<Notification
					icon={xIcon}
					color="red"
					title="Failed to fetch this Order data from DNA">
					{JSON.stringify(error)}
				</Notification>
			</Fragment>
		);
	}
	
	return (
		<Container size="2xl" px="xs" mx="xl">
			<Stack spacing="xl">
				<OrderDetailsPage data={order}/>
				{error && (
					<Text color="red" mt="sm">
						{error.message}
					</Text>
				)}
			</Stack>
		</Container>
	);
};

OrderShow.getInitialProps = async (context, client, currentUser) => {
	const {orderId} = context.query;
	logger.info(`OrderShow [getInitialProps] - currentUser: ${currentUser?.name}, orderId: ${orderId}`);
	
	try {
		const {data} = await client.get(`/api/orders/${orderId}`);
		logger.debug(`OrderShow [getInitialProps] - Fetched order with orderId: ${orderId}`);
		
		return {order: data, orderId, currentUser};
	} catch (error) {
		logger.error(`OrderShow [getInitialProps] - Error fetching the order with orderId ${orderId}: ${error.message}`);
		return {error};
	}
};

export default OrderShow;
