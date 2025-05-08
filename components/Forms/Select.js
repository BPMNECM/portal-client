import clsx from 'clsx';
import React, { Children, cloneElement, isValidElement } from 'react';
import { useFormContext } from 'react-hook-form';
import { HiExclamationCircle } from 'react-icons/hi';
import { getLogger } from '@/utils/logger/logger';

/** This component is used for Select elements in ServiceModal **/
export default function Select({
                                   label,
                                   helperText,
                                   id,
                                   placeholder,
                                   readOnly = false,
                                   children,
                                   validation,
                                   ...rest
                               }) {
    
    const logger = getLogger('Select');
    const formContext = useFormContext();
    
    if (!formContext) {
        logger.warn('Select component must be wrapped in a FormProvider');
        return null; // or return a simple select component without form handling
    }
    
    const {
        register,
        formState: { errors }
    } = useFormContext();
    
    // Add disabled and selected attribute to option, will be used if readonly
    const readOnlyChildren = Children.map(children, (child) => {
        if (isValidElement(child)) {
            return cloneElement(child, {
                disabled: child.props.value !== rest?.defaultValue
                // selected: child.props.value === rest?.defaultValue
            });
        }
    });
    
    return (
      <div>
          <label htmlFor={id} className="block text-sm font-medium leading-6 text-gray-800 mt-4">
              {label}
          </label>
          <div className="relative mt-2">
              <div className="flex items-center rounded-md border-gray-300">
                  <select
                    {...register(id, validation)}
                    // defaultValue to value blank, will get overridden by ...rest if needed
                    defaultValue=""
                    {...rest}
                    name={id}
                    id={id}
                    className={clsx(
                      readOnly
                        ? 'mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6'
                        : errors[id]
                          ? 'focus:ring-red-500 border-red-500 focus:border-red-500 text-sm'
                          : 'focus:ring-primary-500 border-gray-300 focus:border-primary-500 text-sm',
                      'w-96',
                      'block w-full rounded-md shadow-sm',
                      'text-sm'
                    )}
                    aria-describedby={id}
                  >
                      {placeholder && (
                        <option value="" disabled hidden>
                            {placeholder}
                        </option>
                      )}
                      {readOnly ? readOnlyChildren : children}
                  </select>
                  
                  {errors[id] && (
                    <div
                      className="absolute inset-y-0 right-0 flex items-center pr-28 pb-8 pointer-events-none"> {/* Adjusted the padding-right (pr) */}
                        <HiExclamationCircle className="text-xl text-red-500" />
                    </div>
                  )}
              </div>
              
              <div className="mt-1">
                  {helperText && <p className="text-xs text-gray-500">{helperText}</p>}
                  {errors[id] && (
                    <span className="text-sm text-red-500">{errors[id].message}</span>
                  )}
              </div>
          </div>
      </div>
    );
}
