import React, { Fragment } from 'react';
import { useRouter } from 'next/router'; // Switch to next/router for query access
import OrdersList from '@/components/Orders/OrdersList';
import { Notification, rem, Space } from '@mantine/core';
import SignInPrompt from '@/pages/misc/not-signed';
import { useDelay } from '@/hooks/use-delay';
import { IconX } from '@tabler/icons-react';
import { getLogger } from '@/utils/logger/logger';

const logger = getLogger('OrderStatusPage');
const xIcon = <IconX style={{ width: rem(20), height: rem(20) }} />;

const OrderStatusPage = ({ orders, currentUser, error }) => {
    const router = useRouter();
    const { status } = router.query;
    const isDone = useDelay(1000);
    logger.info(`OrderStatusPage - Get Orders with status: ${status} for the user: ${currentUser?.name}`);
    
    if (error && error.message === 'Request failed with status code 401') {
        return <SignInPrompt />;
    } else if (!currentUser?.isVerified) {
        router.push('/auth/email-verification/resend-email');
    }
    
    if (!orders || error) {
        return (
          <Fragment>
              <Space h="xl" />
              <Notification
                icon={xIcon}
                color="red"
                title="Failed to fetch the list of Orders from Inventory">
                  {JSON.stringify(error)}
              </Notification>
          </Fragment>
        );
    }
    
    return (
      <div className="mt-10 px-28">
          <OrdersList data={orders} currentUser={currentUser} error={error} loading={!isDone} />
      </div>
    );
};

OrderStatusPage.getInitialProps = async (context, client, currentUser) => {
    const { status } = context.query;
    logger.info(`OrderStatusPage [getInitialProps] - Fetching orders with status: ${status} for user: ${currentUser?.name}`);
    
    try {
        const { data } = await client.get(`/api/orders?status=${status}`);
        
        if (!data || data.length === 0) {
            logger.warn(`OrderStatusPage [getInitialProps] - No orders found with status ${status} for user ${currentUser?.name}`);
            return { orders: [] };
        }
        logger.debug(`OrderStatusPage [getInitialProps] - Found ${data.length} orders with status ${status}`);
        return { orders: data };
    } catch (error) {
        logger.error(`OrderStatusPage [getInitialProps] - Error fetching Orders with status ${status}, ${error.response?.status} - ${error.message} `);
        return { error };
    }
};

export default OrderStatusPage;


// export async function getServerSideProps(context) {
//     const client = buildClient(context.req);  // Initialize your custom client with the request context
//     try {
//         const { status } = context.query;
//         const { data } = await client.get(`/api/orders?status=${status}`);
//         logger.info(`OrderStatusPage [getServerSideProps] - Fetching orders with status: ${status} `);
//         return { props: { orders: data } };
//     } catch (error) {
//         logger.error('OrderStatusPage [getServerSideProps] - Error fetching orders: ' + error);
//         return { props: { error: 'Error fetching orders' } };
//     }
// }

// import { useAuth } from '@/hooks/use-auth';
// const { currentUser, loading } = useAuth();
// if (loading) {
//     return (
//       <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
//           <Loader size="xl" variant="dots" />
//       </div>
//     );
// }