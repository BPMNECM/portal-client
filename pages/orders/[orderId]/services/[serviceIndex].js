import dynamic from 'next/dynamic';
import React from 'react';
import { useRouter } from 'next/router';
import { Container, Notification, rem, Space } from '@mantine/core';
import SignInPrompt from '@/pages/misc/not-signed';
import { handleError } from '@/utils/common-utils';
import UnExpectedError from '@/pages/misc/unexpected-error';
import { IconX } from '@tabler/icons-react';
import { getLogger } from '@/utils/logger/logger';

const DetailedVIPFlowsTable = dynamic(() => import('@/components/Orders/DetailedVIPFlowsTable'), { ssr: false });
const logger = getLogger('ServiceDetailsPage');
const xIcon = <IconX style={{ width: rem(20), height: rem(20) }} />;

const ServiceDetailsPage = ({ order, orderId, serviceIndex, currentUser, error }) => {
    const router = useRouter();
    const service = order?.serviceOrder?.services?.[parseInt(serviceIndex, 10)];
    logger.info(`ServiceDetailsPage - currentUser: ${currentUser}, orderId: ${orderId}, serviceIndex: ${serviceIndex}`);
    
    if (error && error.message === 'Request failed with status code 401') {
        return <SignInPrompt />;
    } else if (!currentUser?.isVerified) {
        router.push('/auth/email-verification/resend-email');
    } else if (error) {
        const errorDetails = handleError(error);
        logger.error(`ServiceDetailsPage - Error : ${errorDetails}`);
        return <UnExpectedError error={errorDetails} />;
    }
    
    if (!service) {
        return (
          <div>
              <Space h="xl" />
              <Notification
                icon={xIcon}
                color="orange"
                title="Service not found!"
              >
                  {error ? JSON.stringify(error) : 'Service not found in this Order. Please verify.'}
              </Notification>
          </div>
        );
    }
    
    return (
      <Container size="2xl" px="xs" mx="xl">
          <DetailedVIPFlowsTable service={service} />
      </Container>
    );
};

ServiceDetailsPage.getInitialProps = async (context, client, currentUser) => {
    const { orderId, serviceIndex } = context.query;
    logger.info(`ServiceDetailsPage [getInitialProps] - orderId: ${orderId}, serviceIndex: ${serviceIndex}, currentUser: ${currentUser?.name}`);
    
    try {
        const { data } = await client.get(`/api/orders/${orderId}`);
        logger.debug(`ServiceDetailsPage [getInitialProps] - Order fetched successfully for orderId: ${orderId}`);
        return { order: data, orderId, serviceIndex, currentUser };
        
    } catch (error) {
        logger.error(`ServiceDetailsPage [getInitialProps] - Error fetching Order with Id: ${orderId}, ${error.statusCode} - ${error.message} `);
        return { error };
    }
};

export default ServiceDetailsPage;


// import { useAuth } from '@/hooks/use-auth';
// const { currentUser, loading } = useAuth();
// if (loading) {
//     return (
//       <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
//           <Loader size="xl" variant="dots" />
//       </div>
//     );
// }
// if (!currentUser) {
//     return <SignInPrompt />;
// }
// if (error) {
//     return <UnExpectedError error={error} />;
// }