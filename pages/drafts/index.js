import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Divider, Group, Switch, Table, Text, Tooltip } from '@mantine/core';
import { getLogger } from '@/utils/logger/logger';
import SignInPrompt from '@/pages/misc/not-signed';
import UnExpectedError from '@/pages/misc/unexpected-error';
import { handleError } from '@/utils/common-utils';

const logger = getLogger('DraftOrderIndex');

const DraftOrderIndex = ({ serviceOrders = [], currentUser, error }) => {
    const router = useRouter();
    const [showMyOrders, setShowMyOrders] = useState(false);
    logger.info(`DraftOrderIndex - currentUser: ${currentUser?.name} `);
    
    if (error && error.message === 'Request failed with status code 401') {
        return <SignInPrompt />;
    } else if (!currentUser?.isVerified) {
        router.push('/auth/email-verification/resend-email');
    } else if (error) {
        const errorDetails = handleError(error);
        logger.error(`DraftOrderIndex - Error : ${errorDetails}`);
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
      <div style={{ padding: '40px' }}>
          <Group position="apart" style={{ marginBottom: '40px' }}>
              <div />
              <Tooltip label="Show orders submitted by me" refProp="rootRef">
                  <Switch
                    checked={showMyOrders}
                    onChange={(event) => setShowMyOrders(event.currentTarget.checked)}
                    label={<Text color="blue" weight={500}>Show my Orders</Text>}
                  />
              </Tooltip>
          </Group>
          <Divider />
          <Table>
              <thead>
              <tr>
                  <th>Project Name</th>
                  <th>Remarks</th>
                  <th>Handover Date</th>
                  <th>Supporting Docs</th>
                  <th>Order Type</th>
                  <th>Customer Name</th>
                  <th>CIDN</th>
                  <th>A Site Name</th>
                  <th>A End Address</th>
                  <th>Current Stage Code</th>
                  <th>Service Type</th>
                  <th>Country</th>
                  <th>B Site Name</th>
                  <th>B End Address</th>
                  <th>Services</th>
              </tr>
              </thead>
              <tbody>
              {serviceOrders.map((serviceOrder) => (
                <tr key={serviceOrder.id}>
                    <td>{serviceOrder.projectName}</td>
                    <td>{serviceOrder.remarks}</td>
                    <td>{serviceOrder.handoverDate}</td>
                    <td>
                        {serviceOrder.supportingDocs.map((doc, index) => (
                          <a key={index} href={doc.preview} target="_blank" rel="noopener noreferrer">
                              {doc.path}
                          </a>
                        ))}
                    </td>
                    <td>{serviceOrder.orderType}</td>
                    <td>{serviceOrder.customerName}</td>
                    <td>{serviceOrder.cidn}</td>
                    <td>{serviceOrder.aSiteName}</td>
                    <td>{serviceOrder.aEndAddress}</td>
                    <td>{serviceOrder.currentStageCode}</td>
                    <td>{serviceOrder.serviceType}</td>
                    <td>{serviceOrder.country}</td>
                    <td>{serviceOrder.bSiteName}</td>
                    <td>{serviceOrder.bEndAddress}</td>
                    <td>
                        <Button onClick={() => router.push(`/drafts/${serviceOrder.id}/services`)}>View</Button>
                    </td>
                </tr>
              ))}
              </tbody>
          </Table>
      </div>
    );
};

DraftOrderIndex.getInitialProps = async (context, client, currentUser) => {
    logger.info(`DraftOrderIndex [getInitialProps] - currentUser: ${currentUser?.name}`);
    
    try {
        const { data } = await client.get('/api/service-orders');
        
        if (!data || data.length === 0) {
            logger.warn('DraftOrderIndex [getInitialProps] - No draft orders found!');
            return { notFound: true };
        }
        logger.debug(`DraftOrderIndex [getInitialProps] - Fetched ${data.length} draft orders.`);
        
        return { serviceOrders: data, currentUser };
        
    } catch (error) {
        logger.error(`DraftOrderIndex [getInitialProps] - Error fetching draftOrders: ${error.response?.status} - ${error.message} `);
        return { error };
    }
};

export default DraftOrderIndex;
