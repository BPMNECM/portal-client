'use client';

import {Fragment, useEffect} from 'react';
import {useRouter} from 'next/router';
import TopCards from '@/components/Charts/TopCards';
import BarChart from '@/components/Charts/BarChart';
import RecentOrders from '@/components/Charts/RecentOrders';
import {getLogger} from '@/utils/logger/logger';
import {ordersData} from '@/shared/data/orders-data';
import {productsData} from '@/shared/data/products-data';
import {handleError} from '@/utils/common-utils';
import UnExpectedError from '@/pages/misc/unexpected-error';

const LandingPage = ({orders, products, summary, currentUser, error}) => {
	const router = useRouter();
	const logger = getLogger('LandingPage');
	logger.info(`LandingPage - Username: ${currentUser?.name}, isVerified: ${currentUser?.isVerified}`);
	
	useEffect(() => {
		if (error?.status === 401 || error?.status === 400) {
			logger.info('LandingPage - Redirecting to Sign-In as user is not authenticated');
			router.push('/auth/signin');
		} else if (currentUser && !currentUser.isVerified) {
			router.push('/auth/email-verification/resend-email');
		}
	}, [currentUser, error]);
	
	if (error && error.status !== 401) {
		const errorDetails = handleError(error);
		logger.error(`LandingPage - Error : ${errorDetails}`);
		return <UnExpectedError error={errorDetails}/>;
	}
	
	return (
		<Fragment>
			<div className="relative isolate overflow-hidden pt-2 bg-gray-200">
				<main>
					<TopCards orders={orders} products={products}/>
					<div className="px-6 grid md:grid-cols-3 gap-4 pb-6">
						<BarChart orders={summary}/>
						<RecentOrders orders={orders}/>
					</div>
				</main>
			</div>
		</Fragment>
	);
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
	const logger = getLogger('LandingPage');
	logger.info(
		`getInitialProps [Index] - CurrentUser: ${currentUser?.name}, LocalDev? ${process.env.NEXT_PUBLIC_isLocal}`
	);
	
	if (process.env.NEXT_PUBLIC_isLocal === 'true') {
		const products = productsData;
		const orders = ordersData;
		return {orders: orders, products: products};
	} else {
		try {
			const ordersResponse = await client.get('/api/orders');
			const orderSummaryResponse = await client.get('/api/orders/summary');
			const productsResponse = await client.get('/api/service-orders');
			
			return {
				orders: ordersResponse.data,
				products: productsResponse.data,
				summary: orderSummaryResponse.data
			};
		} catch (error) {
			logger.error(`getInitialProps [Index] - Error fetching Orders ${JSON.stringify(error)} `);
			return {error};
		}
	}
};

export default LandingPage;
