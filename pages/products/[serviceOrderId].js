import React from 'react';
import { useRouter } from 'next/router';
import useRequest from '@/hooks/use-request';
import { Button, Flex, Space } from '@mantine/core';
import SignInPrompt from '@/pages/misc/not-signed';
import UnExpectedError from '@/pages/misc/unexpected-error';
import { getLogger } from '@/utils/logger/logger';
import { handleError } from '@/utils/common-utils';
// import { useAuth } from '@/hooks/use-auth';

const logger = getLogger('ServiceOrderShow');

const ServiceOrderShow = ({ serviceOrder, currentUser, error }) => {
    // const { currentUser, loading } = useAuth();
    const router = useRouter();
    const isConfirmed = serviceOrder?.status === 'confirmed';
    logger.info(`ServiceOrderShow - currentUser: ${currentUser?.name}, serviceOrder status: ${isConfirmed}`);
    
    // if (loading) {
    //     return (
    //       <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    //           <Loader size="xl" variant="dots" />
    //       </div>
    //     );
    // }
    
    if (error && error.message === 'Request failed with status code 401') {
        return <SignInPrompt />;
    } else if (!currentUser?.isVerified) {
        router.push('/auth/email-verification/resend-email');
    } else if (error) {
        const errorDetails = handleError(error);
        logger.error(`ServiceOrderShow - Error : ${errorDetails}`);
        return <UnExpectedError error={errorDetails} />;
    }
    
    if (!serviceOrder) {
        return (
          <div style={{ padding: '40px' }}>
              <p>No Service Order found.</p>
              <Button onClick={() => router.back()}>Back</Button>
          </div>
        );
    }
    
    const { doRequest, errors } = useRequest({
        url: '/api/orders',
        method: 'post',
        body: {
            serviceOrderId: serviceOrder.id
        },
        onSuccess: (order) => router.push(`/orders/${order.id}`) // Correct router.push usage
    });
    
    const onPrevious = () => {
        logger.debug('DraftOrderShow [onPrevious] - Navigating back to Service Orders page!');
        router.push('/products');
    };
    
    return (
      <div>
          <div className="px-4 sm:px-6 lg:px-8 pb-60">
              <div className="sm:flex sm:items-center">
                  <div className="sm:flex-auto">
                      <h1 className="text-base font-semibold leading-6 text-gray-900 mt-8">
                          {serviceOrder.orderType} - {serviceOrder.projectName}
                      </h1>
                      <p className="mt-2 text-sm text-gray-700">
                          A list of all the services requested in this Service Order.
                      </p>
                      <p className="mt-4 text-sm text-gray-700">
                          <span className="font-bold">Country:</span> {serviceOrder.country}
                          <Space h="lg" />
                          <span className="font-bold">Site:</span> {serviceOrder.bSiteName}
                      </p>
                  </div>
                  <div className="mt-4 flex items-center">
                      <Flex gap="xl" justify="flex-end">
                          <Button
                            variant="filled"
                            color="green"
                            onClick={() => doRequest()}
                            disabled={isConfirmed}>
                              Place Order
                          </Button>
                          <Button
                            onClick={onPrevious}
                            variant="filled"
                          >
                              Back
                          </Button>
                      </Flex>
                  </div>
              </div>
              <div className="mt-8 flow-root">
                  <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                      <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                          <table className="min-w-full divide-y divide-gray-300">
                              <thead>
                              <tr className="divide-x divide-gray-200">
                                  <th scope="col"
                                      className="py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                                      Request type
                                  </th>
                                  <th scope="col"
                                      className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900">
                                      Chassis
                                  </th>
                                  <th scope="col"
                                      className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900">
                                      Slot
                                  </th>
                                  <th scope="col"
                                      className="py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900 sm:pr-0">
                                      Port
                                  </th>
                                  <th scope="col"
                                      className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900">
                                      Service type
                                  </th>
                                  <th scope="col"
                                      className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900">
                                      Port type
                                  </th>
                                  <th scope="col"
                                      className="py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900 sm:pr-0">
                                      Hand-Off
                                  </th>
                                  <th scope="col"
                                      className="py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900 sm:pr-0">
                                      Card
                                  </th>
                              </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200 bg-white">
                              {serviceOrder.services.map((service) => (
                                <tr key={service._id} className="divide-x divide-gray-200">
                                    <td
                                      className="whitespace-nowrap py-4 pl-4 pr-4 text-sm font-medium text-gray-900 sm:pl-0">
                                        {service.requestType}
                                    </td>
                                    <td className="whitespace-nowrap p-4 text-sm text-gray-500">{service.chassis}</td>
                                    <td className="whitespace-nowrap p-4 text-sm text-gray-500">{service.slot}</td>
                                    <td
                                      className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 sm:pr-0">{service.port}</td>
                                    <td
                                      className="whitespace-nowrap p-4 text-sm text-gray-500">{service.serviceType}</td>
                                    <td
                                      className="whitespace-nowrap p-4 text-sm text-gray-500">{service.serviceUse}</td>
                                    <td
                                      className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 sm:pr-0">{service.handOff}</td>
                                    <td
                                      className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 sm:pr-0">{service.card}</td>
                                </tr>
                              ))}
                              </tbody>
                          </table>
                      </div>
                  </div>
              </div>
              
              {errors && errors.message && (
                <div className="mt-4 text-red-500">{errors.message}</div>
              )}
          
          </div>
      </div>
    );
};

ServiceOrderShow.getInitialProps = async (context, client, currentUser) => {
    const { serviceOrderId } = context.query;
    logger.info(`ServiceOrderShow [getInitialProps] - currentUser: ${currentUser?.name}, serviceOrderId: ${serviceOrderId}`);
    
    try {
        const { data } = await client.get(`/api/service-orders/${serviceOrderId}`);
        
        if (!data?.services) {
            logger.warn(`ServiceOrderShow [getInitialProps] - No services found for serviceOrder ${serviceOrderId}`);
            return { notFound: true };
        }
        logger.debug(`ServiceOrderShow [getInitialProps] - Found serviceOrder with ${data.services.length} services.`);
        
        return { serviceOrder: data, currentUser };
        
    } catch (error) {
        logger.error(`ServiceOrderShow [getInitialProps] - Error fetching serviceOrder with Id: ${serviceOrderId}, ${error.response?.status} - ${error.message} `);
        return { error };
    }
};

export default ServiceOrderShow;

/**
 export async function getServerSideProps(context) {
 const client = buildClient(context.req);
 try {
 const { serviceOrderId } = context.query;
 const { data } = await client.get(`/api/service-orders/${serviceOrderId}`);
 if (!data) {
 logger.warn('DraftOrderShow [getServerSideProps] - No Draft Orders found!');
 return { notFound: true };
 }
 logger.debug('DraftOrderShow [getServerSideProps] - data : ' + JSON.stringify(data));
 return { props: { serviceOrder: data } };
 } catch (error) {
 logger.error('DraftOrderShow [getServerSideProps] - Error fetching the serviceOrder details: ' +
 error.message); return { props: { error: 'Error fetching service order details' } }; } }
 **/


