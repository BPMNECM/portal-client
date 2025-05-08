import React from 'react';
import { getLogger } from '@/utils/logger/logger';

const DropdownUpdateBtn = ({
                               label,
                               placeholder,
                               disabled,
                               options,
                               currentValue,
                               newValue,
                               onChange,
                               onUpdate,
                               index
                           }) => {
    
    const logger = getLogger('DropdownUpdateBtn: ');
    logger.debug(`DropdownUpdateBtn - currentValue: ${currentValue}, newValue:${newValue}, index: ${index}, label: ${label} `);
    
    return (
      <select
        id={`${label}_${index}`}
        placeholder={placeholder}
        disabled={disabled}
        value={newValue}
        onChange={(e) => {
            onChange(e.target.value);
            onUpdate(index);
        }}
        className="relative block w-full border-0 bg-gray py-2 text-green-800 ring-1 ring-inset
              ring-gray-200 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
      >
          <option value="" disabled>
              Choose an option
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
                {option.description || option.label} {/* Use description if available, otherwise use label */}
            </option>
          ))}
      </select>
    
    );
};

export default DropdownUpdateBtn;
