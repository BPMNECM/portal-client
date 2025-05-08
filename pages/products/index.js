import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Divider, Highlight, Space } from '@mantine/core';
import SignInPrompt from '@/pages/misc/not-signed';
import UnExpectedError from '@/pages/misc/unexpected-error';
import { getLogger } from '@/utils/logger/logger';
import { handleError } from '@/utils/common-utils';
// import { useAuth } from '@/hooks/use-auth';
// import { productsData } from '@/shared/data/products-data';
// import ServiceOrdersTable from '@/components/Products/ServiceOrdersTable';

const ServiceOrdersTable = dynamic(() => import('@/components/Products/ServiceOrdersTable'), { ssr: false });
const logger = getLogger('ServiceOrderIndex');

const ServiceOrderIndex = ({ serviceOrders, currentUser, error }) => {
    const router = useRouter();
    const [showMyOrders, setShowMyOrders] = useState(false);
    logger.debug(`ServiceOrderIndex - currentUser: ${currentUser?.name} `);
    
    if (error && error.message === 'Request failed with status code 401') {
        return <SignInPrompt />;
    } else if (!currentUser?.isVerified) {
        router.push('/auth/email-verification/resend-email');
    } else if (error) {
        const errorDetails = handleError(error);
        logger.error(`ServiceOrderIndex - Error : ${errorDetails}`);
        return <UnExpectedError error={errorDetails} />;
    }
    
    if (!serviceOrders) {
        return (
          <div style={{ padding: '40px' }}>
              <p>No Service Orders found.</p>
              <Button onClick={() => router.back()}>Back</Button>
          </div>
        );
    }
    
    return (
      <div className="mt-8 px-10 mb-44">
          <Highlight
            ta="center"
            highlight={['updated', 'pending']}
            highlightStyles={{
                backgroundImage: 'linear-gradient(45deg, red, blue)',
                fontWeight: 700,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
            }}
          >
              These are the GMN Orders pending submission. These Orders can be updated until submission
          </Highlight>
          <Space h="lg" />
          < Divider />
          <div className="mt-6">
              <ServiceOrdersTable serviceOrders={serviceOrders} error={error} loading={false} />
          </div>
      </div>
    );
};


ServiceOrderIndex.getInitialProps = async (context, client, currentUser) => {
    logger.info(`ServiceOrderIndex [getInitialProps] - currentUser: ${currentUser?.name}`);
    
    try {
        const { data } = await client.get('/api/service-orders');
        
        if (!data || data.length === 0) {
            logger.warn('ServiceOrderIndex [getInitialProps] - No Service orders found!');
            return { notFound: true };
        }
        logger.debug(`ServiceOrderIndex [getInitialProps] - Retrieved draftOrders: ${JSON.stringify(data)} `);
        
        return { serviceOrders: data, currentUser };
        
    } catch (error) {
        logger.error(`ServiceOrderIndex [getInitialProps] - Error fetching serviceOrders: ${error.response?.status} - ${error.message} `);
        return { error };
    }
};

export default ServiceOrderIndex;

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
// } else if (!currentUser?.isVerified) {
//     router.push('/auth/email-verification/resend-email');
// }
// if (error) {
//     return <UnExpectedError error={error} />;
// }