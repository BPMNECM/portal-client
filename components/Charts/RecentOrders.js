import React from 'react';
import { Text } from '@mantine/core';
import { FaShoppingBag } from 'react-icons/fa';
import Link from 'next/link';

const RecentOrders = ({ orders }) => {
    
    if (!orders || !Array.isArray(orders)) {
        return (
          <div className="relative isolate overflow-hidden">
              <div className="w-full col-span-1 relative lg:h-[70vh] h-[50vh] m-auto p-4 border rounded-lg bg-white">
                  <div className="border-b border-b-gray-900/10 lg:border-t-gray-900/5 pb-4">
                      <Text
                        size="lg"
                        fw={700}
                        variant="gradient"
                        gradient={{ from: 'pink', to: 'lime', deg: 128 }}
                      >
                          Recent Orders
                      </Text>
                  </div>
                  <div
                    className="absolute left-0 top-full -z-10 mt-96 origin-top-left translate-y-40 -rotate-90 transform-gpu opacity-20 blur-3xl sm:left-1/2 sm:-ml-96 sm:-mt-10 sm:translate-y-0 sm:rotate-0 sm:transform-gpu sm:opacity-50"
                    aria-hidden="true"
                  >
                      <div
                        className="aspect-[1154/678] w-[72.125rem] bg-gradient-to-br from-[#FF80B5] to-[#9089FC]"
                        style={{
                            clipPath:
                              'polygon(100% 38.5%, 82.6% 100%, 60.2% 37.7%, 52.4% 32.1%, 47.5% 41.8%, 45.2% 65.6%, 27.5% 23.4%, 0.1% 35.3%, 17.9% 0%, 27.7% 23.4%, 76.2% 2.5%, 74.2% 56%, 100% 38.5%)'
                        }}
                      />
                  </div>
              </div>
          </div>
        );
    }
    
    return (
      <div className="relative isolate overflow-hidden">
          <div
            className="w-full col-span-1 relative lg:h-[70vh] h-[50vh] m-auto p-4 border rounded-lg bg-white overflow-scroll">
              <div className="border-b border-b-gray-900/10 lg:border-t-gray-900/5 mt-2 pb-4">
                  <Text
                    size="md"
                    fw={700}
                    variant="gradient"
                    gradient={{ from: 'grape', to: 'lime', deg: 128 }}
                  >
                      Recent Orders
                  </Text>
              </div>
              <ul>
                  {orders.map((order, id) => (
                    <li
                      key={id}
                      className="bg-gray-50 hover:bg-gray-100 rounded-lg my-3 p-2 flex items-center cursor-pointer"
                    >
                        <Link href={`/orders/${order.id}`} className="flex items-center w-full">
                            <div className="bg-purple-100 rounded-lg p-2 relative">
                                <FaShoppingBag className="text-purple-800" />
                            </div>
                            <div className="pl-4">
                                <Text size="sm"
                                      variant="gradient"
                                      gradient={{ from: 'violet', to: 'orange', deg: 128 }}>
                                    {order?.serviceOrder?.projectName || 'NA'}
                                </Text>
                                <Text size="sm" c="gray">{order?.serviceOrder?.orderType || 'NA'}</Text>
                            </div>
                            <div className="-mt-6 absolute right-6 text-sm">
                                <Text size="sm"
                                      variant="gradient"
                                      gradient={{
                                          from: 'grape',
                                          to: 'cyan',
                                          deg: 128
                                      }}> {order?.serviceOrder?.handoverDate || 'NA'}</Text>
                            </div>
                        </Link>
                    </li>
                  ))}
              </ul>
              
              <div
                className="absolute left-0 top-full -z-10 mt-96 origin-top-left translate-y-40 -rotate-90 transform-gpu opacity-20 blur-3xl sm:left-1/2 sm:-ml-96 sm:-mt-10 sm:translate-y-0 sm:rotate-0 sm:transform-gpu sm:opacity-50"
                aria-hidden="true"
              >
                  <div
                    className="aspect-[1154/678] w-[72.125rem] bg-gradient-to-br from-[#FF80B5] to-[#9089FC]"
                    style={{
                        clipPath:
                          'polygon(100% 38.5%, 82.6% 100%, 60.2% 37.7%, 52.4% 32.1%, 47.5% 41.8%, 45.2% 65.6%, 27.5% 23.4%, 0.1% 35.3%, 17.9% 0%, 27.7% 23.4%, 76.2% 2.5%, 74.2% 56%, 100% 38.5%)'
                    }}
                  />
              </div>
          </div>
      </div>
    );
};

export default RecentOrders;
