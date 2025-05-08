import { Fragment } from 'react';
import ReactDatePicker from 'react-datepicker';
import { isValid, parseISO } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';
import { Controller, useFormContext } from 'react-hook-form';
import { HiOutlineCalendar } from 'react-icons/hi';
import { classNames } from '@/utils/common-utils';

export default function DatePicker({
                                       validation,
                                       label,
                                       id,
                                       placeholder,
                                       defaultYear,
                                       defaultMonth,
                                       defaultValue,
                                       helperText,
                                       readOnly = false,
                                       ...rest
                                   }) {
    const {
        formState: { errors },
        control
    } = useFormContext();
    
    // If there is a year default, then change the year to the props
    const defaultDate = new Date();
    if (defaultYear) defaultDate.setFullYear(defaultYear);
    if (defaultMonth) defaultDate.setMonth(defaultMonth);
    
    return (
      <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-28 sm:py-6">
          <label
            htmlFor={id}
            className="mt-2 block text-sm font-medium leading-6 text-gray-900"> {label}
          </label>
          
          <Controller
            control={control}
            rules={validation}
            defaultValue={defaultValue}
            name={id}
            render={({ field: { onChange, onBlur, value } }) => {
                // Ensure the value is a Date object or parse it if it's a string
                const parsedValue = typeof value === 'string' ? parseISO(value) : value;
                
                return (
                  <Fragment>
                      <div className="-ml-8 mt-2 sm:mt-0">
                          <div className="relative mt-1 mr-8">
                              <ReactDatePicker
                                name={id}
                                onChange={onChange}
                                onBlur={onBlur}
                                selected={isValid(parsedValue) ? parsedValue : null} // Ensure valid date
                                className={classNames(
                                  readOnly
                                    ? 'bg-gray-100 focus:ring-0 cursor-not-allowed border-gray-300 focus:border-gray-300 text-sm'
                                    : errors[id]
                                      ? 'focus:ring-red-500 border-red-500 focus:border-red-500 text-sm'
                                      : 'focus:ring-primary-500 border-gray-300 focus:border-primary-500 text-sm',
                                  'w-96',
                                  'block rounded-md shadow-sm'
                                )}
                                placeholderText={placeholder}
                                aria-describedby={id}
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                                openToDate={isValid(parsedValue) ? parsedValue : defaultDate} // Fallback to
                                                                                              // defaultDate if invalid
                                dateFormat="dd/MM/yyyy"
                                readOnly={readOnly}
                                {...rest}
                              />
                              <HiOutlineCalendar
                                className="absolute text-lg text-gray-500 transform -translate-y-1/2
                            pointer-events-none right-24 top-1/2" />
                          
                          </div>
                          <div className="mt-1">
                              {helperText && <p className="text-sm text-gray-500">{helperText}</p>}
                              {errors[id] && <span className="text-sm text-red-500">{errors[id].message}</span>}
                          </div>
                      </div>
                  </Fragment>
                );
            }}
          />
      </div>
    );
}