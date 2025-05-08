import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { ActionIcon, Group, Paper, Select, Text } from '@mantine/core';
import { IconDotsVertical } from '@tabler/icons-react';
import Surface from '@/components/Surface';

// Importing Chart dynamically if necessary
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const BarChart = ({ orders }) => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // State for chart data, options, and year selection
    const [chartData, setChartData] = useState({
        series: [
            { name: 'Orders Created This Month', data: [] },
            { name: 'Orders To Be Handed Over', data: [] }
        ],
        options: {
            chart: {
                type: 'bar',
                height: 300,
                stacked: true,
                toolbar: {
                    show: true
                },
                zoom: {
                    enabled: true
                },
                fontFamily: 'Open Sans, sans-serif'
            },
            dataLabels: {
                enabled: false
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    borderRadius: 4,
                    columnWidth: '25%',
                    dataLabels: {
                        total: {
                            enabled: false,
                            style: {
                                fontSize: '13px',
                                fontWeight: 900
                            }
                        }
                    }
                }
            },
            xaxis: {
                categories: monthNames.map((_, idx) => monthNames[idx].substr(0, 3))
            },
            yaxis: {
                labels: {
                    style: {
                        colors: '#000' // Custom color or remove if not needed
                    }
                }
            },
            legend: {
                show: true,
                labels: {
                    colors: '#000' // Custom color or remove if not needed
                }
            }
        }
    });
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [availableYears, setAvailableYears] = useState([]);
    
    // Effect to update available years based on orders
    useEffect(() => {
        if (orders) {
            const yearsSet = new Set();
            orders.ordersCreatedThisMonth.forEach(order => {
                if (order._id.yearMonth) {
                    const [year] = order._id.yearMonth.split('-');
                    yearsSet.add(year);
                }
            });
            orders.ordersToBeHandedOver.forEach(order => {
                if (order._id.yearMonth) {
                    const [year] = order._id.yearMonth.split('-');
                    yearsSet.add(year);
                }
            });
            const yearsArray = Array.from(yearsSet).sort();
            setAvailableYears(yearsArray);
        }
    }, [orders]);
    
    // Effect to update chart data when orders or selected year change
    useEffect(() => {
        if (orders) {
            // Filter orders based on the selected year
            const filteredCreatedThisMonth = orders.ordersCreatedThisMonth.filter(order => {
                if (order._id.yearMonth) {
                    const [year] = order._id.yearMonth.split('-');
                    return year === selectedYear.toString();
                }
                return false;
            });
            const filteredToBeHandedOver = orders.ordersToBeHandedOver.filter(order => {
                if (order._id.yearMonth) {
                    const [year] = order._id.yearMonth.split('-');
                    return year === selectedYear.toString();
                }
                return false;
            });
            
            // Create a set of all unique months for the selected year
            const allMonths = new Set();
            filteredCreatedThisMonth.forEach(order => {
                const [year, month] = order._id.yearMonth.split('-');
                if (year === selectedYear.toString()) allMonths.add(month);
            });
            filteredToBeHandedOver.forEach(order => {
                const [year, month] = order._id.yearMonth.split('-');
                if (year === selectedYear.toString()) allMonths.add(month);
            });
            
            // Convert Set to Array and sort it
            const sortedMonths = Array.from(allMonths).sort();
            
            // Create a mapping from month to index in monthNames
            const monthIndexMap = monthNames.reduce((acc, month, index) => {
                acc[month] = index;
                return acc;
            }, {});
            
            // Initialize datasets with zeros
            const createdDataset = new Array(12).fill(0);
            const handedOverDataset = new Array(12).fill(0);
            
            // Fill datasets with actual data
            filteredCreatedThisMonth.forEach(order => {
                if (order._id.yearMonth) {
                    const [year, month] = order._id.yearMonth.split('-');
                    const monthIndex = monthIndexMap[monthNames[parseInt(month, 10) - 1]];
                    createdDataset[monthIndex] = order.count;
                }
            });
            
            filteredToBeHandedOver.forEach(order => {
                if (order._id.yearMonth) {
                    const [year, month] = order._id.yearMonth.split('-');
                    const monthIndex = monthIndexMap[monthNames[parseInt(month, 10) - 1]];
                    handedOverDataset[monthIndex] = order.count;
                }
            });
            
            setChartData({
                ...chartData,
                series: [
                    { ...chartData.series[0], data: createdDataset },
                    { ...chartData.series[1], data: handedOverDataset }
                ]
            });
        }
    }, [orders, selectedYear]);
    
    return (
      <Surface component={Paper}
               className="w-full col-span-2 lg:h-[70vh] h-[50vh] m-auto p-4 border rounded-lg bg-white">
          <Group justify="space-between" mb="md">
              <Text size="lg" fw={600}
                    variant="gradient"
                    gradient={{ from: 'red', to: 'indigo', deg: 128 }}
              >
                  Monthly Orders Report
              </Text>
              <Select
                placeholder="Select Year"
                data={availableYears.map(year => ({ value: year, label: year }))}
                value={selectedYear.toString()}
                onChange={(value) => setSelectedYear(parseInt(value, 10))}
              />
              <ActionIcon variant="subtle">
                  <IconDotsVertical size={16} />
              </ActionIcon>
          </Group>
          <Chart
            options={chartData.options}
            series={chartData.series}
            type="bar"
            height={300}
            width={'100%'}
          />
      </Surface>
    );
};

export default BarChart;