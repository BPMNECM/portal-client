import { useState } from 'react';
import debounce from 'lodash/debounce';
import { Badge, Button, Divider, Group, Modal, Select, Text, TextInput } from '@mantine/core';
import { isValidIp, isValidVlan } from '@/utils/vip-flows-utils';
import { flowRequestTypeOptions, flowServiceTypeOptions } from '@/utils/lib/select-options';

const BulkUpdateModal = ({ opened, onClose, bulkUpdateValues, setBulkUpdateValues, handleBulkUpdateSubmit }) => {
    const [validationErrors, setValidationErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Debounced validation logic
    const validateField = debounce((field, value) => {
        const errors = { ...validationErrors };
        
        if (field === 'customerVlan' && value && !isValidVlan(value)) {
            errors.customerVlan = 'Invalid VLAN';
        } else {
            delete errors.customerVlan;
        }
        
        if (field === 'customerVideoIp' && value && !isValidIp(value)) {
            errors.customerVideoIp = 'Invalid IP Address';
        } else {
            delete errors.customerVideoIp;
        }
        
        if (field === 'customerNetmask' && value && !isValidIp(value)) {
            errors.customerNetmask = 'Invalid Netmask Address';
        } else {
            delete errors.customerNetmask;
        }
        
        if (field === 'customerGateway' && value && !isValidIp(value)) {
            errors.customerGateway = 'Invalid Gateway Address';
        } else {
            delete errors.customerGateway;
        }
        
        // Media Flow validation
        if (field === 'mediaFlowSourceIp' && value && !isValidIp(value)) {
            errors.mediaFlowSourceIp = 'Invalid Media Flow Source IP';
        } else {
            delete errors.mediaFlowSourceIp;
        }
        
        if (field === 'mediaFlowDestIp' && value && !isValidIp(value)) {
            errors.mediaFlowDestIp = 'Invalid Media Flow Destination IP';
        } else {
            delete errors.mediaFlowDestIp;
        }
        
        if (field === 'mediaFlowSourcePort' && value && isNaN(Number(value))) {
            errors.mediaFlowSourcePort = 'Invalid Source Port';
        } else {
            delete errors.mediaFlowSourcePort;
        }
        
        if (field === 'mediaFlowDestPort' && value && isNaN(Number(value))) {
            errors.mediaFlowDestPort = 'Invalid Destination Port';
        } else {
            delete errors.mediaFlowDestPort;
        }
        
        setValidationErrors(errors);
    }, 300); // Debounce duration 300ms
    
    // Update state and trigger validation
    const handleInputChange = (field, value) => {
        setBulkUpdateValues((prevValues) => ({ ...prevValues, [field]: value }));
        validateField(field, value); // Trigger debounced validation
    };
    
    const handleSubmit = () => {
        setIsSubmitting(true);
        handleBulkUpdateSubmit();
        setIsSubmitting(false);
    };
    
    return (
      <Modal opened={opened} onClose={onClose} title={
          <Group noWrap>
              <Badge color="blue" variant="outline" size="lg" radius="sm">
                  Bulk Update Flows
              </Badge>
          </Group>
      }>
          <Divider my="sm" />
          {/* Customer fields */}
          <TextInput
            label="Customer VLAN(s)"
            value={bulkUpdateValues.customerVlan}
            onChange={(e) => handleInputChange('customerVlan', e.target.value)}
            error={validationErrors.customerVlan}
          />
          <TextInput
            label="Customer IP Address"
            value={bulkUpdateValues.customerVideoIp}
            onChange={(e) => handleInputChange('customerVideoIp', e.target.value)}
            error={validationErrors.customerVideoIp}
          />
          <TextInput
            label="Customer Netmask"
            value={bulkUpdateValues.customerNetmask}
            onChange={(e) => handleInputChange('customerNetmask', e.target.value)}
            error={validationErrors.customerNetmask}
          />
          <TextInput
            label="Customer Gateway"
            value={bulkUpdateValues.customerGateway}
            onChange={(e) => handleInputChange('customerGateway', e.target.value)}
            error={validationErrors.customerGateway}
          />
          <TextInput
            label="Customer IGMP Version"
            value={bulkUpdateValues.customerIgmpVersion}
            onChange={(e) => handleInputChange('customerIgmpVersion', e.target.value)}
            error={validationErrors.customerIgmpVersion}
          />
          
          {/* Media flow fields */}
          <TextInput
            label="Media Flow Source IP"
            value={bulkUpdateValues.mediaFlowSourceIp}
            onChange={(e) => handleInputChange('mediaFlowSourceIp', e.target.value)}
            error={validationErrors.mediaFlowSourceIp}
          />
          <TextInput
            label="Media Flow Destination IP"
            value={bulkUpdateValues.mediaFlowDestIp}
            onChange={(e) => handleInputChange('mediaFlowDestIp', e.target.value)}
            error={validationErrors.mediaFlowDestIp}
          />
          <TextInput
            label="Media Flow Source Port"
            value={bulkUpdateValues.mediaFlowSourcePort}
            onChange={(e) => handleInputChange('mediaFlowSourcePort', e.target.value)}
            error={validationErrors.mediaFlowSourcePort}
          />
          <TextInput
            label="Media Flow Destination Port"
            value={bulkUpdateValues.mediaFlowDestPort}
            onChange={(e) => handleInputChange('mediaFlowDestPort', e.target.value)}
            error={validationErrors.mediaFlowDestPort}
          />
          <TextInput
            label="Media Flow SSRC"
            value={bulkUpdateValues.mediaFlowSsrc}
            onChange={(e) => handleInputChange('mediaFlowSsrc', e.target.value)}
          />
          <TextInput
            label="Media Flow Protocol"
            value={bulkUpdateValues.mediaFlowProtocol}
            onChange={(e) => handleInputChange('mediaFlowProtocol', e.target.value)}
          />
          <TextInput
            label="Media Flow Hitless Mode"
            value={bulkUpdateValues.mediaFlowHitlessMode}
            onChange={(e) => handleInputChange('mediaFlowHitlessMode', e.target.value)}
          />
          <TextInput
            label="Media Flow Bitrate (Mbps)"
            value={bulkUpdateValues.mediaFlowMbps}
            onChange={(e) => handleInputChange('mediaFlowMbps', e.target.value)}
          />
          
          <Select
            label="Request Type"
            value={bulkUpdateValues.requestType}
            onChange={(value) => setBulkUpdateValues({ ...bulkUpdateValues, requestType: value })}
            data={flowRequestTypeOptions.map((option) => ({ value: option.value, label: option.label }))}
          />
          <Select
            label="Service Type"
            value={bulkUpdateValues.serviceType}
            onChange={(value) => setBulkUpdateValues({ ...bulkUpdateValues, serviceType: value })}
            data={flowServiceTypeOptions.map((option) => ({ value: option.value, label: option.label }))}
          />
          
          {Object.keys(validationErrors).length > 0 && (
            <Text color="red">Please fix the validation errors before submitting.</Text>
          )}
          
          <Divider my="sm" />
          
          <Button onClick={handleSubmit} disabled={isSubmitting || Object.keys(validationErrors).length > 0}>
              {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
      
      </Modal>
    );
};

export default BulkUpdateModal;
