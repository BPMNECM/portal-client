import clsx from 'clsx';
import React, { Children, cloneElement, isValidElement } from 'react';
import ReactFlagsSelect from 'react-flags-select';
import { useFormContext } from 'react-hook-form';
import { HiExclamationCircle } from 'react-icons/hi';

/** This component is used for react-flags-select **/
export default function ReactSelect({
                                        label,
                                        helperText,
                                        id,
                                        placeholder,
                                        readOnly = false,
                                        children,
                                        validation,
                                        ...rest
                                    }) {
    const {
        register,
        formState: { errors }
    } = useFormContext();
    
    // Remove disabled and selected attributes from the cloneElement
    const readOnlyChildren = Children.map(children, (child) => {
        if (isValidElement(child)) {
            return cloneElement(child);
        }
    });
    
    return (
      <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
          <label
            htmlFor={id}
            className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
          >
              {label}
          </label>
          <div className="relative mt-1">
              <div className="flex items-center rounded-md border-gray-300">
                  <ReactFlagsSelect
                    {...register(id, validation)}
                    // defaultValue to value blank, will get overridden by ...rest if needed
                    defaultValue=""
                    {...rest}
                    name={id}
                    id={id}
                    className={clsx(
                      readOnly
                        ? 'bg-gray-100 focus:ring-0 cursor-not-allowed border-gray-300 focus:border-gray-300 text-sm'
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
                  </ReactFlagsSelect>
                  
                  {errors[id] && (
                    <div
                      className="absolute inset-y-0 right-0 flex items-center pr-7 pb-8 pointer-events-none"> {/* Adjusted the padding-right (pr) */}
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
