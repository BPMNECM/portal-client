import React, { useEffect, useState } from 'react';
import { DataTable } from 'mantine-datatable';
import { ActionIcon, Badge, Group, MultiSelect, Text, TextInput, Tooltip } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { IconEye } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import ErrorAlert from '@/components/Shared/ErrorAlert';
import { getLogger } from '@/utils/logger/logger';

const PAGE_SIZES = [5, 10, 20];
const ICON_SIZE = 18;
const logger = getLogger('OrdersList');

const getStatusColor = (status) => {
    switch (status) {
        case 'created':
            return 'green';
        case 'saved':
            return 'blue';
        case 'submitted':
            return 'teal';
        case 'cancelled':
            return 'red';
        case 'rejected':
            return 'pink';
        case 'failed':
            return 'gray';
        case 'awaiting:feasibility':
            return 'orange';
        case 'design':
            return 'yellow';
        case 'completed':
            return 'purple';
        default:
            return 'dark';
    }
};

const StatusBadge = ({ status }) => {
    return (
      <Badge color={getStatusColor(status)} variant="filled" radius="sm">
          {status}
      </Badge>
    );
};

const OrdersList = ({ data, currentUser, error, loading }) => {
    const router = useRouter();
    logger.info(`OrdersList - Get Orders List for the user: ${currentUser?.name}`);
    const [query, setQuery] = useState('');
    const [debouncedQuery] = useDebouncedValue(query, 200);
    const [selectedStatuses, setSelectedStatuses] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [records, setRecords] = useState(data.slice(0, pageSize));
    const [sortStatus, setSortStatus] = useState({ columnAccessor: 'serviceOrder.handoverDate', direction: 'asc' });
    
    const columns = [
        {
            accessor: 'id',
            title: 'Order ID',
            render: (item) => <Text>{item.id}</Text>
        },
        {
            accessor: 'userName',
            title: 'User',
            render: (item) => <Text>{item.userName}</Text>
        },
        {
            accessor: 'serviceOrder.projectName',
            title: 'Project Name',
            sortable: true,
            render: ({ serviceOrder }) => serviceOrder.projectName,
            filter: (
              <TextInput
                label="Project Name"
                description="Show Orders for the project that includes the specified text"
                placeholder="Search project..."
                value={query}
                onChange={(e) => setQuery(e.currentTarget.value)}
              />
            ),
            filtering: query !== ''
        },
        {
            accessor: 'status',
            render: (item) => <StatusBadge status={item.status} />,
            filter: (
              <MultiSelect
                label="Status"
                description="Show all projects with status"
                data={[...new Set(data.map((e) => e.status))]}
                value={selectedStatuses}
                placeholder="Search statuses…"
                onChange={setSelectedStatuses}
                // leftSection={<IconSearch size={16} />}
                clearable
                searchable
              />
            ),
            filtering: selectedStatuses.length > 0
        },
        {
            accessor: 'serviceOrder.bSiteName',
            title: 'Site Code',
            sortable: true,
            render: ({ serviceOrder }) => serviceOrder.bSiteName,
            filter: (
              <TextInput
                label="Site Code"
                description="Show Orders with Site that includes the specified text"
                placeholder="Search Sites..."
                value={query}
                onChange={(e) => setQuery(e.currentTarget.value)}
              />
            ),
            filtering: query !== ''
        },
        {
            accessor: 'serviceOrder.remarks',
            title: 'Work Required',
            render: ({ serviceOrder }) => serviceOrder.remarks
        },
        {
            accessor: 'serviceOrder.country',
            title: 'Country',
            render: ({ serviceOrder }) => serviceOrder.country
        },
        {
            accessor: 'serviceOrder.handoverDate',
            title: 'Handover Date',
            sortable: true,
            render: ({ serviceOrder }) => serviceOrder.handoverDate,
            filter: (
              <TextInput
                label="Handover Date"
                description="Filter Orders with matching dates"
                placeholder="Search Orders..."
                value={query}
                onChange={(e) => setQuery(e.currentTarget.value)}
              />
            ),
            filtering: query !== ''
        },
        {
            accessor: '',
            title: 'Actions',
            render: (item) => (
              <Group gap="sm">
                  <Tooltip label="View order details">
                      <ActionIcon onClick={() => router.push(`/orders/${item.id}`)}>
                          <IconEye size={ICON_SIZE} />
                      </ActionIcon>
                  </Tooltip>
              </Group>
            )
        }
    ];
    
    useEffect(() => {
        setPage(1);
    }, [pageSize]);
    
    useEffect(() => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        const sortedData = data.sort((a, b) => {
            const dateA = new Date((a.serviceOrder.handoverDate || '').replace(/(\d+)\/(\w+)\/(\d+)/, '$2 $1, $3'));
            const dateB = new Date((b.serviceOrder.handoverDate || '').replace(/(\d+)\/(\w+)\/(\d+)/, '$2 $1, $3'));
            return sortStatus.direction === 'asc' ? dateA - dateB : dateB - dateA;
        });
        let filtered = sortedData.slice(from, to);
        if (debouncedQuery || selectedStatuses.length) {
            filtered = data
              .filter(({ serviceOrder, status }) => {
                  if (debouncedQuery !== '' &&
                    !serviceOrder.projectName
                      .toLowerCase()
                      .includes(debouncedQuery.trim().toLowerCase())) {
                      return false;
                  }
                  if (selectedStatuses.length &&
                    !selectedStatuses.includes(status)) {
                      return false;
                  }
                  return true;
              })
              .slice(from, to);
        }
        setRecords(filtered);
    }, [sortStatus, data, page, pageSize, debouncedQuery, selectedStatuses]);
    
    return error ? (
      <ErrorAlert title="Error loading orders" message={error.toString()} />
    ) : (
      <DataTable
        minHeight={200}
        verticalSpacing="xs"
        striped
        highlightOnHover
        columns={columns}
        records={records}
        totalRecords={debouncedQuery || selectedStatuses.length > 0 ? records.length : data.length}
        recordsPerPage={pageSize}
        page={page}
        onPageChange={setPage}
        recordsPerPageOptions={PAGE_SIZES}
        onRecordsPerPageChange={setPageSize}
        sortStatus={sortStatus}
        onSortStatusChange={setSortStatus}
        fetching={loading}
      />
    );
};

export default OrdersList;