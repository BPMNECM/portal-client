import React, { useMemo } from 'react';
import { useRouter } from 'next/router';
import { MantineReactTable, useMantineReactTable } from 'mantine-react-table';
import { Box, Button, Flex, Space, Stack, Title } from '@mantine/core';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { IconDownload } from '@tabler/icons-react';
import { getLogger } from '@/utils/logger/logger';

const DetailedVIPFlowsTable = ({ service }) => {
    const router = useRouter();
    const VIPFlowsData = service?.detailedVIPFlows || [];
    const logger = getLogger('DetailedVIPFlowsTable');
    logger.info('DetailedVIPFlowsTable - Received Service data : ' + JSON.stringify(VIPFlowsData));
    
    const handleExportRows = (rows) => {
        const doc = new jsPDF();
        const tableData = rows.map((row) => Object.values(row.original));
        const tableHeaders = columns.map((c) => c.header);
        
        autoTable(doc, {
            head: [tableHeaders],
            body: tableData
        });
        
        doc.save('VIP-flows-data.pdf');
    };
    
    const columns = useMemo(() => [
        {
            accessorKey: 'status',
            header: 'Status',
            size: 150,
            mantineTableHeadCellProps: { style: { backgroundColor: 'lightgray', color: 'black' } },
            Cell: ({ cell }) => {
                const status = cell.getValue();
                let backgroundColor;
                switch (status) {
                    case 'Original':
                        backgroundColor = 'blue';
                        break;
                    case 'New':
                        backgroundColor = 'green';
                        break;
                    case 'Modified':
                        backgroundColor = 'yellow';
                        break;
                    case 'Deleted':
                        backgroundColor = 'red';
                        break;
                    default:
                        backgroundColor = 'gray';
                }
                return (
                  <Box
                    sx={(theme) => ({
                        backgroundColor: theme.colors[backgroundColor][7],
                        color: '#fff',
                        borderRadius: '4px',
                        padding: '4px',
                        textAlign: 'center'
                    })}
                  >
                      {status}
                  </Box>
                );
            }
        },
        {
            accessorKey: 'flowNo',
            header: 'Flow No',
            size: 120,
            enableEditing: false,
            mantineTableHeadCellProps: { style: { backgroundColor: 'lightgray', color: 'black' } }
        },
        {
            accessorKey: 'name',
            header: 'Flow Name',
            size: 300,
            mantineTableHeadCellProps: { style: { backgroundColor: 'lightgray', color: 'black' } }
        },
        {
            accessorKey: 'TxRx',
            header: 'Direction',
            size: 150,
            mantineTableHeadCellProps: { style: { backgroundColor: 'lightgray', color: 'black' } }
        },
        // Customer and Media Flow fields
        {
            accessorKey: 'customerVlan', header: 'Customer VLAN', size: 200,
            mantineTableHeadCellProps: { style: { backgroundColor: 'lightgray', color: 'black' } }
        },
        {
            accessorKey: 'customerVideoIp', header: 'Customer Video IP', size: 200,
            mantineTableHeadCellProps: { style: { backgroundColor: 'lightgray', color: 'black' } }
        },
        {
            accessorKey: 'customerNetmask', header: 'Customer Netmask', size: 200,
            mantineTableHeadCellProps: { style: { backgroundColor: 'lightgray', color: 'black' } }
        },
        {
            accessorKey: 'customerGateway', header: 'Customer Gateway', size: 200,
            mantineTableHeadCellProps: { style: { backgroundColor: 'lightgray', color: 'black' } }
        },
        {
            accessorKey: 'customerIgmpVersion', header: 'Customer IGMP Version', size: 200,
            mantineTableHeadCellProps: { style: { backgroundColor: 'lightgray', color: 'black' } }
        },
        {
            accessorKey: 'mediaFlowSourceIp', header: 'Media Flow Source IP', size: 250,
            mantineTableHeadCellProps: { style: { backgroundColor: 'lightgray', color: 'black' } }
        },
        {
            accessorKey: 'mediaFlowDestIp', header: 'Media Flow Destination IP', size: 250,
            mantineTableHeadCellProps: { style: { backgroundColor: 'lightgray', color: 'black' } }
        },
        {
            accessorKey: 'mediaFlowSourcePort', header: 'Media Flow Source Port', size: 250,
            mantineTableHeadCellProps: { style: { backgroundColor: 'lightgray', color: 'black' } }
        },
        {
            accessorKey: 'mediaFlowDestPort', header: 'Media Flow Destination Port', size: 300,
            mantineTableHeadCellProps: { style: { backgroundColor: 'lightgray', color: 'black' } }
        },
        {
            accessorKey: 'mediaFlowSsrc', header: 'Media Flow SSRC', size: 200,
            mantineTableHeadCellProps: { style: { backgroundColor: 'lightgray', color: 'black' } }
        },
        {
            accessorKey: 'mediaFlowProtocol', header: 'Media Flow Protocol', size: 200,
            mantineTableHeadCellProps: { style: { backgroundColor: 'lightgray', color: 'black' } }
        },
        {
            accessorKey: 'mediaFlowHitlessMode', header: 'Media Flow Hitless Mode', size: 240,
            mantineTableHeadCellProps: { style: { backgroundColor: 'lightgray', color: 'black' } }
        },
        {
            accessorKey: 'mediaFlowMbps', header: 'Media Flow Mbps', size: 200,
            mantineTableHeadCellProps: { style: { backgroundColor: 'lightgray', color: 'black' } }
        },
        {
            accessorKey: 'serviceType', header: 'Service Type', size: 150,
            mantineTableHeadCellProps: { style: { backgroundColor: 'lightgray', color: 'black' } }
        },
        {
            accessorKey: 'requestType', header: 'Request Type', size: 150,
            mantineTableHeadCellProps: { style: { backgroundColor: 'lightgray', color: 'black' } }
        },
        // Hidden columns (initialState.hiddenColumns set to hide on load)
        {
            accessorKey: 'mainPortEngineeringName', header: 'Main Port Engineering Name', size: 200,
            mantineTableHeadCellProps: { style: { backgroundColor: 'lightgray', color: 'black' } }
        },
        {
            accessorKey: 'engineeringName', header: 'Engineering Name', size: 200,
            mantineTableHeadCellProps: { style: { backgroundColor: 'lightgray', color: 'black' } }
        },
        {
            accessorKey: 'friendlyName', header: 'Friendly Name', size: 200,
            mantineTableHeadCellProps: { style: { backgroundColor: 'lightgray', color: 'black' } }
        },
        {
            accessorKey: 'primaryIp', header: 'Primary IP', size: 150,
            mantineTableHeadCellProps: { style: { backgroundColor: 'lightgray', color: 'black' } }
        },
        {
            accessorKey: 'primaryMulticastIp', header: 'Primary Multicast IP', size: 150,
            mantineTableHeadCellProps: { style: { backgroundColor: 'lightgray', color: 'black' } }
        },
        {
            accessorKey: 'primaryVlan', header: 'Primary VLAN', size: 80,
            mantineTableHeadCellProps: { style: { backgroundColor: 'lightgray', color: 'black' } }
        },
        {
            accessorKey: 'secondaryIp', header: 'Secondary IP', size: 150,
            mantineTableHeadCellProps: { style: { backgroundColor: 'lightgray', color: 'black' } }
        },
        {
            accessorKey: 'secondaryMulticastIp', header: 'Secondary Multicast IP', size: 150,
            mantineTableHeadCellProps: { style: { backgroundColor: 'lightgray', color: 'black' } }
        },
        {
            accessorKey: 'secondaryVlan', header: 'Secondary VLAN', size: 80,
            mantineTableHeadCellProps: { style: { backgroundColor: 'lightgray', color: 'black' } }
        },
        {
            accessorKey: 'flowProjectNumber', header: 'Flow Project Number', size: 150,
            mantineTableHeadCellProps: { style: { backgroundColor: 'lightgray', color: 'black' } }
        },
        {
            accessorKey: 'flowStatus', header: 'Flow Status', size: 120,
            mantineTableHeadCellProps: { style: { backgroundColor: 'lightgray', color: 'black' } }
        },
        {
            accessorKey: 'scheduallUpdated', header: 'Scheduall Updated', size: 100,
            mantineTableHeadCellProps: { style: { backgroundColor: 'lightgray', color: 'black' } }
        },
        {
            accessorKey: 'dataminerUpdated', header: 'Dataminer Updated', size: 100,
            mantineTableHeadCellProps: { style: { backgroundColor: 'lightgray', color: 'black' } }
        }
    ], []);
    
    const table = useMantineReactTable({
        columns,
        data: VIPFlowsData,
        paginationDisplayMode: 'pages',
        positionToolbarAlertBanner: 'bottom',
        enableRowNumbers: true,
        enableEditing: false,
        enableDensityToggle: false,
        enableColumnResizing: true,
        enablePinning: true,
        mantineTableProps: { striped: true },
        mantineTableBodyCellProps: {
            sx: {
                borderRight: '2px solid #e0e0e0' //add a border between columns
            }
        },
        initialState: {
            density: 'xs',
            columnVisibility: {
                mainPortEngineeringName: false,
                engineeringName: false,
                friendlyName: false,
                primaryIp: false,
                primaryMulticastIp: false,
                primaryVlan: false,
                secondaryIp: false,
                secondaryMulticastIp: false,
                secondaryVlan: false,
                flowProjectNumber: false,
                flowStatus: false,
                scheduallUpdated: false,
                dataminerUpdated: false
            }
        },
        mantineTableContainerProps: {
            sx: { minHeight: '500px', overflowX: 'auto' }
        },
        renderTopToolbarCustomActions: ({ table }) => (
          <Box
            sx={{
                display: 'flex',
                gap: '16px',
                padding: '8px',
                flexWrap: 'wrap'
            }}
          >
              <Button
                disabled={table.getPrePaginationRowModel().rows.length === 0}
                onClick={() => handleExportRows(table.getPrePaginationRowModel().rows)}
                leftIcon={<IconDownload />}
                variant="filled">
                  Export to PDF
              </Button>
          </Box>
        )
    });
    
    return (
      <Stack>
          <Space h="xl" />
          <Flex justify="space-between" align="center">
              <Title order={5} color="blue.5">VIP Flows Data</Title>
              <Button onClick={() => router.back()}>
                  Back
              </Button>
          </Flex>
          <MantineReactTable table={table} />
      </Stack>
    );
};

export default DetailedVIPFlowsTable;
