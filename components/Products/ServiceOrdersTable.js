'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { DataTable } from 'mantine-datatable';
import { ActionIcon, Box, Group, Tooltip } from '@mantine/core';
import { getLogger } from '@/utils/logger/logger';
import { IconChevronUp, IconEye, IconSelector } from '@tabler/icons-react';
import { showNotification } from '@mantine/notifications';

const PAGE_SIZES = [5, 10, 15, 20];
const ICON_SIZE = 22;

const ServiceOrdersTable = ({ serviceOrders, error, loading }) => {
    const router = useRouter();
    const logger = getLogger('ServiceOrdersTable');
    logger.info(`serviceOrders : ${JSON.stringify(serviceOrders)}`);
    
    if (error) {
        showNotification({
            title: 'Error',
            message: `${error}`,
            color: 'red',
            withCloseButton: true,
            position: 'top-center'
        });
    }
    
    const [pageSize, setPageSize] = useState(PAGE_SIZES[1]);
    
    useEffect(() => {
        setPage(1);
    }, [pageSize]);
    
    const [page, setPage] = useState(1);
    const [records, setRecords] = useState([]);
    const [sortStatus, setSortStatus] = useState({ columnAccessor: 'projectName', direction: 'asc' });
    const [sortedServiceOrders, setSortedServiceOrders] = useState([]);
    
    useEffect(() => {
        const data = [...serviceOrders];
        data.sort((a, b) => {
            if (sortStatus.columnAccessor === 'handoverDate') {
                const dateA = new Date(a[sortStatus.columnAccessor]);
                const dateB = new Date(b[sortStatus.columnAccessor]);
                return sortStatus.direction === 'asc' ? dateA - dateB : dateB - dateA;
            } else {
                const strA = a[sortStatus.columnAccessor];
                const strB = b[sortStatus.columnAccessor];
                return sortStatus.direction === 'asc' ? strA.localeCompare(strB) : strB.localeCompare(strA);
            }
        });
        setSortedServiceOrders(data);
    }, [sortStatus, serviceOrders]);
    
    useEffect(() => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        setRecords(sortedServiceOrders.slice(from, to));
    }, [page, pageSize, sortedServiceOrders]);
    
    return (
      <Box
        bg="#EDFEFF"
        // sx={{ height: 500 }}
      >
          <DataTable
            records={records}
            withBorder
            borderRadius="sm"
            shadow="sm"
            withColumnBorders
            striped
            highlightOnHover
            horizontalSpacing="sm"
            verticalSpacing="sm"
            fontSize="sm"
            verticalAlignment="center"
            columns={[
                {
                    accessor: 'projectName',
                    width: 100,
                    sortable: true,
                    headerStyle: { backgroundColor: 'lightblue' }
                },
                { accessor: 'remarks', width: 100 },
                { accessor: 'handoverDate', width: 100, sortable: true },
                { accessor: 'orderType', width: 100, sortable: true },
                { accessor: 'country', width: 100, sortable: true },
                { accessor: 'bSiteName', width: 100, sortable: true },
                { accessor: 'bEndAddress', width: 100 },
                { accessor: 'status', width: 100 },
                {
                    accessor: '',
                    width: 100,
                    title: 'Actions',
                    render: (item) => (
                      <Group gap="sm">
                          <Tooltip label="View order details">
                              <ActionIcon onClick={() => router.push(`/products/${item.id}`)}>
                                  <IconEye size={ICON_SIZE} />
                              </ActionIcon>
                          </Tooltip>
                      
                      </Group>
                    )
                }
                // Add more accessors for other fields as needed
            ]}
            totalRecords={serviceOrders.length}
            paginationColor="grape"
            recordsPerPage={pageSize}
            page={page}
            onPageChange={(p) => setPage(p)}
            recordsPerPageOptions={PAGE_SIZES}
            onRecordsPerPageChange={setPageSize}
            sortStatus={sortStatus}
            onSortStatusChange={setSortStatus}
            sortIcons={{
                sorted: <IconChevronUp size={14} />,
                unsorted: <IconSelector size={14} />
            }}
          />
      </Box>
    );
};

export default ServiceOrdersTable;