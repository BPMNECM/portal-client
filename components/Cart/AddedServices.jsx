import React, { useState } from 'react';
import useOrderStore from '@/store/useOrderStore';
import { requestTypeDisplayNames } from '@/utils/form-utils';
import { Button, Modal, Table, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { getLogger } from '@/utils/logger/logger';

const logger = getLogger('AddedServicesTable');

const AddedServicesTable = () => {
    const { secondStep, removeService } = useOrderStore();
    const [opened, { close, open }] = useDisclosure(false);
    const [selectedIndex, setSelectedIndex] = useState(null);
    logger.info(`AddedServicesTable - Adding Service to the Table..`);
    
    const handleDeleteRow = (index) => {
        logger.info('AddedServicesTable [handleDeleteRow] - index : ' + index);
        setSelectedIndex(index);
        open();
    };
    
    const confirmDelete = () => {
        if (selectedIndex !== null) {
            logger.info(`Deleting service at index: ${selectedIndex}`);
            removeService(selectedIndex);
            close(); // Close the modal after deleting
        }
    };
    
    const rows = secondStep.services.map((service, index) => (
      <tr key={index}>
          <td>{index + 1}</td>
          <td>{requestTypeDisplayNames[service.requestType]}</td>
          <td>{service.resource}</td>
          <td>{service.workRequired}</td>
          {/*<td>{service.chassis}</td>*/}
          {/*<td>{service.slotName}</td>*/}
          {/*<td>{service.card}</td>*/}
          {/*<td>{service.resource === 'Card' ? 'Not Applicable' : service.port}</td>*/}
          {/*<td>*/}
          {/*    <TrashIcon*/}
          {/*      aria-label="Delete row"*/}
          {/*      onClick={() => handleDeleteRow(index)}*/}
          {/*      className="h-6 w-5 text-red-500 cursor-pointer"*/}
          {/*    />*/}
          {/*</td>*/}
      </tr>
    ));
    
    return (
      <>
          <Table
            className="addedServices-table"
            horizontalSpacing="sm" verticalSpacing="sm"
            striped highlightOnHover withBorder withColumnBorders>
              <thead>
              <tr>
                  <th style={{ backgroundColor: '#ADD8E6' }}>No</th>
                  <th style={{ backgroundColor: '#ADD8E6' }}>Request</th>
                  <th style={{ backgroundColor: '#ADD8E6' }}>Resource</th>
                  <th style={{ backgroundColor: '#ADD8E6' }}>Service</th>
                  {/*<th style={{ backgroundColor: '#ADD8E6' }}>Chassis</th>*/}
                  {/*<th style={{ backgroundColor: '#ADD8E6' }}>Slot</th>*/}
                  {/*<th style={{ backgroundColor: '#ADD8E6' }}>Card</th>*/}
                  {/*<th style={{ backgroundColor: '#ADD8E6' }}>Port</th>*/}
                  {/*<th style={{ backgroundColor: '#ADD8E6' }}>Action</th>*/}
              </tr>
              </thead>
              <tbody>{rows}</tbody>
          </Table>
          
          <Modal
            opened={opened}
            onClose={close}
            title="Confirm Deletion"
          >
              <Text>Are you sure you want to remove this service from the cart? This action cannot be undone.</Text>
              <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                  <Button color="red" onClick={confirmDelete} style={{ marginRight: '10px' }}>
                      Remove
                  </Button>
                  <Button variant="default" onClick={close}>
                      Cancel
                  </Button>
              </div>
          </Modal>
      </>
    );
};

export default AddedServicesTable;
