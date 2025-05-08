import React from 'react';
import { Button } from '@mantine/core';
import clsx from 'clsx';
import { CheckCircleIcon, MinusCircleIcon, XCircleIcon } from '@heroicons/react/20/solid';
import { ArrowLeftCircleIcon, Bars3Icon } from '@heroicons/react/24/outline';
import { PlusCircleIcon } from '@heroicons/react/16/solid';

export default function BtnFunction({
                                        children,
                                        className = '',
                                        variant = 'primary',
                                        disabled = false,
                                        ...rest
                                    }) {
    
    const getButtonClasses = (text) => {
        switch (text) {
            case 'Cancel':
            case 'Back':
                return {
                    colorClass: 'bg-gray-200 hover:bg-gray-600',
                    bgColorClass: 'black'
                };
            case 'View JSON':
                return {
                    colorClass: 'bg-gray-200 hover:bg-gray-600',
                    bgColorClass: 'text-white'
                };
            case 'Close':
                return {
                    colorClass: 'bg-gray-500 hover:bg-gray-900',
                    bgColorClass: 'text-white',
                    icon: <XCircleIcon className="mr-2 h-5 w-5 text-white" aria-hidden="true" />
                };
            case 'Next':
                return {
                    colorClass: 'bg-indigo-500 hover:bg-indigo-800',
                    bgColorClass: 'text-white shadow-sm focus-visible:outline'
                    // icon: <CheckCircleIcon className="mr-2 h-5 w-5 text-white" aria-hidden="true" />
                };
            case 'Confirm':
                return {
                    colorClass: 'bg-indigo-600 hover:bg-indigo-800',
                    bgColorClass: 'text-white shadow-sm focus-visible:outline',
                    icon: <CheckCircleIcon className="mr-2 h-5 w-5 text-white" aria-hidden="true" />
                };
            case 'Save':
                return {
                    colorClass: 'bg-blue-400 hover:bg-blue-800',
                    bgColorClass: 'text-white shadow-sm focus-visible:outline'
                    // icon: <CheckCircleIcon className="mr-2 h-5 w-5 text-white" aria-hidden="true" />
                };
            case 'New Service':
                return {
                    colorClass: 'bg-green-600 hover:bg-green-800',
                    bgColorClass: 'text-white shadow-sm focus-visible:outline',
                    icon: <PlusCircleIcon className="mr-2 h-5 w-5 text-white" aria-hidden="true" />
                };
            case 'Add to Cart':
                return {
                    colorClass: 'bg-green-600 hover:bg-green-800',
                    bgColorClass: 'text-white shadow-sm focus-visible:outline',
                    icon: <PlusCircleIcon className="mr-2 h-5 w-5 text-white" aria-hidden="true" />
                };
            case 'Add Service':
                return {
                    colorClass: 'bg-blue-400 hover:bg-blue-800',
                    bgColorClass: 'text-white shadow-sm focus-visible:outline',
                    icon: <PlusCircleIcon className="mr-2 h-5 w-5 text-white" aria-hidden="true" />
                };
            case 'Update Service':
                return {
                    colorClass: 'bg-yellow-600 hover:bg-yellow-900',
                    bgColorClass: 'text-white shadow-sm focus-visible:outline',
                    icon: <Bars3Icon className="mr-2 h-5 w-5 text-white" aria-hidden="true" />
                };
            case 'Remove service':
                return {
                    colorClass: 'bg-red-400 hover:bg-red-800',
                    bgColorClass: 'text-white shadow-sm focus-visible:outline',
                    icon: <MinusCircleIcon className="mr-2 h-5 w-5 text-white" aria-hidden="true" />
                };
            case 'Generate Flows':
                return {
                    colorClass: 'bg-blue-500 hover:bg-blue-800',
                    bgColorClass: 'text-white shadow-sm focus-visible:outline',
                    icon: <ArrowLeftCircleIcon className="mr-2 h-5 w-5 text-white" aria-hidden="true" />
                };
            case 'Create New Flow':
                return {
                    colorClass: 'bg-green-600 hover:bg-green-800',
                    // bgColorClass: 'text-white shadow-sm focus-visible:outline',
                    icon: <PlusCircleIcon className="mr-2 h-5 w-5 text-white" aria-hidden="true" />
                };
            case 'Add Card':
                return {
                    icon: <PlusCircleIcon className="mr-2 h-5 w-5 text-white" aria-hidden="true" />
                };
            default:
                return {
                    colorClass: 'bg-gray-400 hover:bg-gray-800'
                    // bgColorClass: 'text-white shadow-sm focus-visible:outline'
                };
        }
    };
    
    const { colorClass, bgColorClass, icon } = getButtonClasses(children);
    
    return (
      <Button
        {...rest}
        className={clsx(
          colorClass,
          'inline-flex justify-center rounded-md px-4 py-2 text-sm font-medium',
          bgColorClass,
          'focus-visible:outline-2 focus-visible:outline-offset-2 ',
          {
              'cursor-not-allowed opacity-50': disabled // Apply disabled style
          },
          className
        )}
        disabled={disabled}
      >
          {icon && icon} {/* Render icon if it's defined */}
          {children}
      </Button>
    );
    
}
