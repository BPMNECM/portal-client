import React from 'react';
import { useRouter } from 'next/router';
import { Button, Group, Table } from '@mantine/core';
import { getLogger } from '@/utils/logger/logger';
import SignInPrompt from '@/pages/misc/not-signed';

const logger = getLogger('VIPFlowsShow');

const VIPFlowsShow = ({ service, currentUser, error }) => {
    const router = useRouter();
    logger.info(`VIPFlowsShow - currentUser: ${currentUser?.name} `);
    
    if (error && error.message === 'Request failed with status code 401') {
        return <SignInPrompt />;
    } else if (!currentUser?.isVerified) {
        router.push('/auth/email-verification/resend-email');
    }
    
    if (error) {
        return (
          <div style={{ padding: '40px' }}>
              <p>Error: {error}</p>
              <Button onClick={() => router.back()}>Back</Button>
          </div>
        );
    }
    
    if (!service || !service.detailedVIPFlows) {
        return (
          <div style={{ padding: '40px' }}>
              <p>No VIP Flows available for this service.</p>
              <Button onClick={() => router.back()}>Back</Button>
          </div>
        );
    }
    
    return (
      <div style={{ padding: '40px' }}>
          <Group position="apart" style={{ marginBottom: '40px' }}>
              <div />
              <Button onClick={() => router.back()}>Back</Button>
          </Group>
          <Table>
              <thead>
              <tr>
                  <th rowSpan={2}
                      style={{ width: '50px', fontSize: '0.8rem', backgroundColor: '#ADD8E6' }}>No
                  </th>
                  <th rowSpan={2}
                      style={{
                          width: '50px',
                          fontSize: '0.8rem',
                          backgroundColor: '#ADD8E6'
                      }}>Status
                  </th>
                  <th rowSpan={2}
                      style={{ width: '50px', fontSize: '0.8rem', backgroundColor: '#ADD8E6' }}>Flow
                      No
                  </th>
                  <th rowSpan={2}
                      style={{
                          width: '50px',
                          fontSize: '0.8rem',
                          backgroundColor: '#ADD8E6'
                      }}>Direction
                  </th>
                  <th rowSpan={2}
                      style={{
                          fontSize: '0.8rem',
                          width: '208px',
                          backgroundColor: '#ADD8E6'
                      }}>Engineering
                      Name
                  </th>
                  <th rowSpan={2}
                      style={{
                          fontSize: '0.8rem',
                          width: '200px',
                          backgroundColor: '#ADD8E6'
                      }}>Friendly Name
                  </th>
                  <th colSpan={5} style={{
                      fontSize: '0.8rem',
                      width: '400px',
                      textAlign: 'center',
                      backgroundColor: '#ADD8E6'
                  }}>Customer
                  </th>
                  <th colSpan={8} style={{
                      fontSize: '0.8rem',
                      width: '600px',
                      textAlign: 'center',
                      backgroundColor: '#ADD8E6'
                  }}>Media Flow
                  </th>
              </tr>
              <tr>
                  <th style={{ fontSize: '0.8rem' }}>VLAN</th>
                  <th style={{ fontSize: '0.8rem' }}>VideoIP</th>
                  <th style={{ fontSize: '0.8rem' }}>Netmask</th>
                  <th style={{ fontSize: '0.8rem' }}>Gateway</th>
                  <th style={{ fontSize: '0.8rem' }}>IGMP V</th>
                  <th style={{ fontSize: '0.8rem' }}>SourceIP</th>
                  <th style={{ fontSize: '0.8rem' }}>DestIP</th>
                  <th style={{ fontSize: '0.8rem' }}>SourcePort</th>
                  <th style={{ fontSize: '0.8rem' }}>DestPort</th>
                  <th style={{ fontSize: '0.8rem' }}>SSRC</th>
                  <th style={{ fontSize: '0.8rem' }}>Protocol</th>
                  <th
                    style={{
                        fontSize: '0.8rem',
                        overflow: 'hidden',
                        textAlign: 'left'
                    }}>HitlessMode
                  </th>
                  <th style={{ fontSize: '0.8rem' }}>Bitrate</th>
              </tr>
              </thead>
              <tbody>
              {service.detailedVIPFlows && service.detailedVIPFlows.length > 0 &&
                service.detailedVIPFlows.map((flow, index) => (
                  <tr key={index}>
                      <td style={{ fontSize: '0.8rem', color: 'black' }}>{index + 1}</td>
                      <td style={{ fontSize: '0.8rem', color: 'black' }}>{flow.status}</td>
                      <td style={{ fontSize: '0.8rem', color: 'black' }}>{flow.flowNo}</td>
                      <td style={{ fontSize: '0.8rem', color: 'black' }}>{flow.TxRx}</td>
                      <td style={{
                          fontSize: '0.8rem',
                          color: 'black'
                      }}>{flow.engineeringName}</td>
                      <td
                        style={{ fontSize: '0.8rem', color: 'black' }}>{flow.friendlyName}</td>
                      <td
                        style={{ fontSize: '0.8rem', color: 'slategray' }}>{flow.customerVlan}</td>
                      <td
                        style={{
                            fontSize: '0.8rem',
                            color: 'slategray'
                        }}>{flow.customerVideoIp}</td>
                      <td style={{
                          fontSize: '0.8rem',
                          color: 'slategray'
                      }}>{flow.customerNetmask}</td>
                      <td style={{
                          fontSize: '0.8rem',
                          color: 'slategray'
                      }}>{flow.customerGateway}</td>
                      <td style={{
                          fontSize: '0.8rem',
                          color: 'slategray'
                      }}>{flow.customerIgmpVersion}</td>
                      <td
                        style={{
                            fontSize: '0.8rem',
                            color: 'slategray'
                        }}>{flow.mediaFlowSourceIp}</td>
                      <td style={{
                          fontSize: '0.8rem',
                          color: 'slategray'
                      }}>{flow.mediaFlowDestIp}</td>
                      <td style={{
                          fontSize: '0.8rem',
                          color: 'slategray'
                      }}>{flow.mediaFlowSourcePort}</td>
                      <td
                        style={{
                            fontSize: '0.8rem',
                            color: 'slategray'
                        }}>{flow.mediaFlowDestPort}</td>
                      <td
                        style={{ fontSize: '0.8rem', color: 'slategray' }}>{flow.mediaFlowSsrc}</td>
                      <td
                        style={{
                            fontSize: '0.8rem',
                            color: 'slategray'
                        }}>{flow.mediaFlowProtocol}</td>
                      <td style={{
                          fontSize: '0.8rem',
                          color: 'slategray'
                      }}>{flow.mediaFlowHitlessMode}</td>
                      <td
                        style={{ fontSize: '0.8rem', color: 'slategray' }}>{flow.mediaFlowMbps}</td>
                  </tr>
                ))}
              </tbody>
          </Table>
      </div>
    );
};

VIPFlowsShow.getInitialProps = async (context, client, currentUser) => {
    const { serviceOrderId, serviceId } = context.query;
    logger.info(`VIPFlowsShow [getInitialProps] - currentUser: ${currentUser?.name}, serviceOrderId: ${serviceOrderId}, serviceId: ${serviceId}`);
    
    try {
        const { data } = await client.get(`/api/service-orders/${serviceOrderId}`);
        
        if (!data?.services) {
            logger.warn(`VIPFlowsShow [getInitialProps] - No services found for serviceOrder ${serviceOrderId}`);
            return { notFound: true };
        }
        
        // Find the matching service by serviceId
        const service = data.services.find((s) => s.slotId === serviceId);
        
        if (!service) {
            logger.warn(`VIPFlowsShow [getInitialProps] - No service matching slotId ${serviceId} found in serviceOrder ${serviceOrderId}`);
            return { notFound: true };
        }
        logger.debug(`VIPFlowsShow [getInitialProps] - Found service: ${JSON.stringify(service)}`);
        
        return { service };
        
    } catch (error) {
        logger.error(`VIPFlowsShow [getInitialProps] - Error fetching serviceOrder with Id: ${serviceOrderId}, ${error.response?.status} - ${error.message} `);
        return { error };
    }
};

export default VIPFlowsShow;

/**
 export async function getServerSideProps(context) {
 const client = buildClient(context.req);  // Initialize your custom client with the request context
 try {
 const { serviceOrderId, serviceId } = context.query;
 const { data } = await client.get(`/api/service-orders/${serviceOrderId}`);
 const service = data.services.find((s) => s.slotId === serviceId);
 
 if (!service) {
 logger.error('VIPFlowsShow [getServerSideProps] - Service not found');
 return { notFound: true };
 }
 
 logger.debug('VIPFlowsShow [getServerSideProps] - data : ' + JSON.stringify(service));
 return { props: { service } };
 } catch (error) {
 logger.error('VIPFlowsShow [getServerSideProps] - Error fetching the service details: ' + error.message);
 return { props: { error: 'Error fetching service details' } };
 }
 }
 **/


