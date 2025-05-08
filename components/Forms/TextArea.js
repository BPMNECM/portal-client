import clsx from 'clsx';
import { useFormContext } from 'react-hook-form';
import { HiExclamationCircle } from 'react-icons/hi';

export default function Textarea({
                                     label,
                                     placeholder = '',
                                     helperText,
                                     id,
                                     type = 'textarea',
                                     readOnly = false,
                                     validation,
                                     ...rest
                                 }) {
    const {
        register,
        formState: { errors }
    } = useFormContext();
    
    return (
      <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
          <label
            htmlFor={id}
            className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
              {label}
          </label>
          
          <div className="relative mt-1 rounded-md border-gray-300">
				<textarea
                  {...register(id, validation)}
                  {...rest}
                  type={type}
                  name={id}
                  id={id}
                  readOnly={readOnly}
                  rows={6}
                  className={clsx(
                    readOnly
                      ? 'bg-gray-100 focus:ring-0 cursor-not-allowed border-gray-300 focus:border-gray-300'
                      : errors[id] ?
                        'focus:ring-red-500 border-red-500 focus:border-red-500'
                        : 'focus:ring-primary-500 border-gray-300 focus:border-primary-500',
                    'text-sm block w-full rounded-md shadow-sm')}
                  placeholder={placeholder}
                  aria-describedby={id}
                />
              
              {errors[id] && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none pb-12">
                    <HiExclamationCircle className="text-xl text-red-500" />
                </div>
              )}
              
              <div className="mt-1">
                  {helperText && <p className="text-sm text-gray-500">{helperText}</p>}
                  {errors[id] && (
                    <span className="text-sm text-red-500">{errors[id].message}</span>
                  )}
              </div>
          </div>
      </div>
    );
}
