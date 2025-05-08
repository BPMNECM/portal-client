import React from 'react';
import Link from 'next/link';
import { classNames } from '@/utils/common-utils';
import { getLogger } from '@/utils/logger/logger';

const TopCards = ({ orders, products }) => {
    const logger = getLogger('TopCards: ');
    logger.info('The environment: ' + process.env.NEXT_PUBLIC_custom_env);
    
    // Calculate statistics based on the properties of the orders and products data
    const calculateStats = () => {
        const draftProductsCount = products ? products.length : 0;
        logger.info(`Inside calculateStats - draftProductsCount: ${draftProductsCount}`);
        
        if (!orders || !orders.length) {
            return [
                { id: 1, name: 'Total Orders', stat: '0', bgColorClass: 'bg-indigo-500', href: '/orders' },
                {
                    id: 2,
                    name: 'Pending Submission',
                    stat: draftProductsCount,
                    bgColorClass: 'bg-yellow-500',
                    href: '/products'
                },
                {
                    id: 3,
                    name: 'In Feasibility',
                    stat: '0',
                    bgColorClass: 'bg-sky-500',
                    href: '/orders/status/feasibility'
                },
                {
                    id: 4,
                    name: 'Ready for Design',
                    stat: '0',
                    bgColorClass: 'bg-cyan-500',
                    href: '/orders/status/design'
                },
                {
                    id: 5,
                    name: 'Design Completed',
                    stat: '0',
                    bgColorClass: 'bg-lime-500',
                    href: '/orders/status/completed'
                },
                { id: 6, name: 'Cancelled', stat: '0', bgColorClass: 'bg-pink-500', href: '/orders/status/cancelled' },
                { id: 7, name: 'Rejected', stat: '0', bgColorClass: 'bg-rose-500', href: '/orders/status/rejected' },
                { id: 8, name: 'Fulfilled', stat: '0', bgColorClass: 'bg-green-500', href: '/orders/status/fulfilled' }
            ];
        }
        
        const totalOrders = orders.length;
        // const createdOrders = orders.filter((order) => order.status === 'Created').length;
        const feasibilityOrders = orders.filter((order) => order.status === 'awaiting:feasibility').length;
        const designOrders = orders.filter((order) => order.status === 'design:ready').length;
        const completedOrders = orders.filter((order) => order.status === 'design:complete').length;
        const cancelledOrders = orders.filter((order) => order.status === 'cancelled').length;
        const rejectedOrders = orders.filter((order) => order.status === 'feasibility:rejected').length;
        const fulfilledOrders = orders.filter((order) => order.status === 'fulfilled').length;
        
        return [
            { id: 1, name: 'Total Orders', stat: totalOrders, bgColorClass: 'bg-indigo-500', href: '/orders' },
            {
                id: 2,
                name: 'Pending Submission',
                stat: draftProductsCount,
                bgColorClass: 'bg-yellow-500',
                href: '/products'
            },
            {
                id: 3,
                name: 'In Feasibility',
                stat: feasibilityOrders,
                bgColorClass: 'bg-sky-500',
                href: '/orders/status/feasibility'
            },
            {
                id: 4,
                name: 'Ready for Design',
                stat: designOrders,
                bgColorClass: 'bg-cyan-500',
                href: '/orders/status/design'
            },
            {
                id: 5,
                name: 'Design Completed',
                stat: completedOrders,
                bgColorClass: 'bg-lime-500',
                href: '/orders/status/completed'
            },
            {
                id: 6,
                name: 'Cancelled',
                stat: cancelledOrders,
                bgColorClass: 'bg-pink-500',
                href: '/orders/status/cancelled'
            },
            {
                id: 7,
                name: 'Rejected',
                stat: rejectedOrders,
                bgColorClass: 'bg-rose-500',
                href: '/orders/status/rejected'
            },
            {
                id: 8,
                name: 'Fulfilled',
                stat: fulfilledOrders,
                bgColorClass: 'bg-green-600',
                href: '/orders/status/fulfilled'
            }
        ];
    };
    
    const orderStats = calculateStats();
    logger.info('TopCards - orderStats in JSON format : ' + JSON.stringify(orderStats));
    
    return (
      <div className="relative isolate overflow-hidden pt-4 pb-6">
          <div className="px-2 sm:px-6 lg:px-8">
              <ul role="list" className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-8">
                  {orderStats.map((item) => (
                    <li key={item.id} className="relative flex flex-col rounded-md shadow-sm bg-white h-full">
                        <div
                          className={classNames(
                            item.bgColorClass,
                            'flex items-center justify-center rounded-t-md text-sm font-medium text-white px-4 py-2'
                          )}
                          style={{
                              minWidth: '8rem',
                              minHeight: '2rem'
                          }}
                        >
                            {item.name}
                        </div>
                        <div
                          className="flex flex-grow items-center justify-center bg-white border-t border-r border-l border-gray-200 px-4 py-2 text-sm">
                            {item.stat}
                        </div>
                        <div
                          className="flex items-center justify-center bg-gray-100 rounded-b-md border border-gray-200 px-4 py-2 text-sm">
                            <Link href={item.href} className="font-small text-indigo-900 hover:text-indigo-400">
                                View all
                            </Link>
                        </div>
                    </li>
                  ))}
              </ul>
          </div>
      </div>
    );
};

export default TopCards;
