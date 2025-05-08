import dynamic from 'next/dynamic';
import React, {useState} from 'react';
import {useRouter} from 'next/router';
import {Divider, Group, Highlight, Notification, rem, Space, Switch, Text, Tooltip} from '@mantine/core';
import SignInPrompt from '@/pages/misc/not-signed';
import {handleError} from '@/utils/common-utils';
import UnExpectedError from '@/pages/misc/unexpected-error';
import {getLogger} from '@/utils/logger/logger';
import {IconX} from '@tabler/icons-react';

// import { ordersList } from '@/shared/data/orders-list';
// import OrdersList from '@/components/Orders/OrdersList';

const OrdersList = dynamic(() => import('@/components/Orders/OrdersList'), {ssr: false});
const logger = getLogger('OrderIndex');
const xIcon = <IconX style={{width: rem(20), height: rem(20)}}/>;

const OrderIndex = ({orders, myOrders, currentUser, error}) => {
	const router = useRouter();
	const [showMyOrders, setShowMyOrders] = useState(false);
	const displayedOrders = showMyOrders ? myOrders : orders;
	logger.info(`OrderIndex - currentUser: ${currentUser?.name}, Orders count: ${orders?.length}`);
	
	if (error && error.message === 'Request failed with status code 401') {
		return <SignInPrompt/>;
	} else if (process.env.NODE_ENV !== 'development' && !currentUser?.isVerified) {
		router.push('/auth/email-verification/resend-email');
	} else if (error) {
		const errorDetails = handleError(error);
		logger.error(`OrderIndex - Error : ${errorDetails}`);
		return <UnExpectedError error={errorDetails}/>;
	}
	
	if (!displayedOrders) {
		return (
			<div>
				<Space h="xl"/>
				<Notification
					icon={xIcon}
					color="orange"
					title="Failed to load Orders!"
				>
					{error ? JSON.stringify(error) : 'Orders not available!'}
				</Notification>
			</div>
		);
	}
	
	return (
		<div className="mt-8 px-10 mb-96">
			<Highlight
				ta="center"
				highlight={['Design:Ready', 'Project Number']}
				highlightStyles={{
					backgroundImage: 'linear-gradient(45deg, red, blue)',
					fontWeight: 700,
					WebkitBackgroundClip: 'text',
					WebkitTextFillColor: 'transparent'
				}}
			>
				You can only update the Orders with status Design:Ready with Project Number and
				Submit for Design.
			</Highlight>
			
			<div className="mt-4">
				<Group position="apart">
					<div/>
					<Tooltip label="Show only orders submitted by me">
						<Switch
							checked={showMyOrders}
							onChange={(event) => setShowMyOrders(event.currentTarget.checked)}
							label={<Text color="blue" weight={500}>Show my Orders</Text>}
						/>
					</Tooltip>
				</Group>
				<Space h="xl"/>
				<Divider/>
				<OrdersList data={displayedOrders} currentUser={currentUser} error={error} loading={false}/>
			</div>
		</div>
	);
};

OrderIndex.getInitialProps = async (context, client, currentUser) => {
	try {
		const {data} = await client.get('/api/orders');
		const myOrdersResponse = await client.get('/api/orders/my-orders');
		
		logger.debug(`OrderIndex [getInitialProps] - User: ${currentUser?.name}, Orders count: ${data.length}`);
		
		return {orders: data, myOrders: myOrdersResponse.data, currentUser};
	} catch (error) {
		logger.error(`OrderIndex [getInitialProps] - Error fetching the Orders - ${error.statusCode} - ${error.message}`);
		return {error};
	}
};

export default OrderIndex;

// import { useAuth } from '@/hooks/use-auth';
// const { currentUser, loading } = useAuth();
// if (loading) {
//     return (
//       <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
//           <Loader size="xl" variant="dots" />
//       </div>
//     );
// }