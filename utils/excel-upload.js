import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { showNotification } from '@mantine/notifications';
import { useState } from 'react';

export const handleExportRowsToExcel = async (rows) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('VIP Flows');
    
    // Define header row with dropdown columns for requestType and serviceType
    const header = [
        { header: 'ID', key: 'id', width: 10 },
        { header: 'Flow No', key: 'flowNo', width: 15 },
        { header: 'Service Tx/Rx', key: 'TxRx', width: 15 },
        { header: 'Engineering Name', key: 'engineeringName', width: 30 },
        { header: 'Friendly Name', key: 'friendlyName', width: 30 },
        { header: 'Status', key: 'status', width: 15 },
        { header: 'Customer VLAN(s)', key: 'customerVlan', width: 20 },
        { header: 'Customer IP Address', key: 'customerVideoIp', width: 20 },
        { header: 'Customer Netmask', key: 'customerNetmask', width: 20 },
        { header: 'Customer Gateway', key: 'customerGateway', width: 20 },
        { header: 'Customer IGMP Version', key: 'customerIgmpVersion', width: 20 },
        { header: 'Media Flow Source IP', key: 'mediaFlowSourceIp', width: 20 },
        { header: 'Media Flow Dest IP', key: 'mediaFlowDestIp', width: 20 },
        { header: 'Media Flow Source Port', key: 'mediaFlowSourcePort', width: 20 },
        { header: 'Media Flow Dest Port', key: 'mediaFlowDestPort', width: 20 },
        { header: 'Media Flow SSRC', key: 'mediaFlowSsrc', width: 20 },
        { header: 'Media Flow Protocol', key: 'mediaFlowProtocol', width: 20 },
        { header: 'Media Flow Hitless Mode', key: 'mediaFlowHitlessMode', width: 20 },
        { header: 'Media Flow Bitrate (Mbps)', key: 'mediaFlowMbps', width: 20 },
        { header: 'Request Type', key: 'requestType', width: 15 },
        { header: 'Service Type', key: 'serviceType', width: 15 }
    ];
    
    worksheet.columns = header;
    
    // Add the rows to the worksheet
    rows.forEach((row) => {
        worksheet.addRow(row.original);
    });
    
    // Apply data validation for dropdowns in "Request Type" and "Service Type"
    worksheet.getColumn('requestType').eachCell((cell, rowNumber) => {
        if (rowNumber !== 1) { // Skip header row
            cell.dataValidation = {
                type: 'list',
                allowBlank: true,
                formula1: '"New,Change"', // Define the options for requestType dropdown
                showErrorMessage: true,
                errorTitle: 'Invalid Input',
                error: 'Please select from the dropdown list.'
            };
        }
    });
    
    worksheet.getColumn('serviceType').eachCell((cell, rowNumber) => {
        if (rowNumber !== 1) { // Skip header row
            cell.dataValidation = {
                type: 'list',
                allowBlank: true,
                formula1: '"Hitless,Empty"', // Define the options for serviceType dropdown
                showErrorMessage: true,
                errorTitle: 'Invalid Input',
                error: 'Please select from the dropdown list.'
            };
        }
    });
    
    // Write the Excel file and trigger download
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), 'VIP_Flows.xlsx');
};

const handleContinue = () => {
    
    const [csvData, setCsvData] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const [fileName, setFileName] = useState('');
    
    setShowAlert(false);
    if (csvData) {
        const fileReader = new FileReader();
        fileReader.onload = async (e) => {
            const buffer = e.target.result;
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.load(buffer);
            
            const worksheet = workbook.getWorksheet(1); // Assuming the data is on the first sheet
            const parsedData = [];
            
            worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
                if (rowNumber > 1) { // Skip the header row
                    const rowData = {
                        flowNo: row.getCell(1).value,
                        TxRx: row.getCell(2).value,
                        engineeringName: row.getCell(3).value,
                        friendlyName: row.getCell(4).value,
                        customerVlan: row.getCell(5).value,
                        customerVideoIp: row.getCell(6).value,
                        customerNetmask: row.getCell(7).value,
                        customerGateway: row.getCell(8).value,
                        customerIgmpVersion: row.getCell(9).value,
                        mediaFlowSourceIp: row.getCell(10).value,
                        mediaFlowSourcePort: row.getCell(11).value,
                        mediaFlowDestIp: row.getCell(12).value,
                        mediaFlowDestPort: row.getCell(13).value,
                        mediaFlowSsrc: row.getCell(14).value,
                        mediaFlowProtocol: row.getCell(15).value,
                        mediaFlowHitlessMode: row.getCell(16).value,
                        mediaFlowMbps: row.getCell(17).value,
                        requestType: row.getCell(18).value,
                        serviceType: row.getCell(19).value
                    };
                    parsedData.push(rowData);
                }
            });
            
            // Check row count
            if (parsedData.length !== data.length) {
                showNotification({
                    title: 'Import Error',
                    message: `Row count mismatch: XLSX has ${parsedData.length} rows, but the table has ${data.length} rows.`,
                    color: 'red'
                });
                return;
            }
            
            // Validate each row
            const updatedFlows = parsedData.map((csvRow) => {
                const matchingFlow = data.find(
                  (flow) =>
                    flow.flowNo === parseInt(csvRow.flowNo, 10) &&
                    flow.engineeringName === csvRow.engineeringName.trim()
                );
                
                if (!matchingFlow) {
                    showNotification({
                        title: 'Import Error',
                        message: `No matching row for flow number ${csvRow.flowNo} and engineering name ${csvRow.engineeringName} found in the table.`,
                        color: 'red'
                    });
                    return null; // Skip this row
                }
                
                // Ensure uneditable fields remain unchanged
                unEditableFields.forEach((field) => {
                    if (csvRow[field] !== matchingFlow[field]) {
                        showNotification({
                            title: 'Import Error',
                            message: `Field "${field}" cannot be changed. Restoring original value.`,
                            color: 'red'
                        });
                        csvRow[field] = matchingFlow[field]; // Restore the original value
                    }
                });
                
                return { ...matchingFlow, ...csvRow, status: 'Updated' }; // Update editable fields only
            }).filter(Boolean); // Remove any null rows
            
            if (updatedFlows.length === parsedData.length) {
                setDetailedVIPFlows(index, updatedFlows);
                showNotification({
                    title: 'Success',
                    message: 'XLSX imported successfully and table updated.',
                    color: 'green'
                });
            } else {
                showNotification({
                    title: 'Import Error',
                    message: 'Some rows could not be updated due to errors.',
                    color: 'red'
                });
            }
        };
        
        fileReader.readAsArrayBuffer(csvData);
    }
};

const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    
    if (file && file.name.endsWith('.xlsx')) {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(file);
        
        const worksheet = workbook.getWorksheet(1); // Assuming the first sheet contains the data
        const rows = [];
        
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) return; // Skip header row
            
            const rowData = {
                flowNo: row.getCell('B').value,
                TxRx: row.getCell('C').value,
                engineeringName: row.getCell('D').value,
                friendlyName: row.getCell('E').value,
                status: row.getCell('F').value,
                customerVlan: row.getCell('G').value,
                customerVideoIp: row.getCell('H').value,
                customerNetmask: row.getCell('I').value,
                customerGateway: row.getCell('J').value,
                customerIgmpVersion: row.getCell('K').value,
                mediaFlowSourceIp: row.getCell('L').value,
                mediaFlowDestIp: row.getCell('M').value,
                mediaFlowSourcePort: row.getCell('N').value,
                mediaFlowDestPort: row.getCell('O').value,
                mediaFlowSsrc: row.getCell('P').value,
                mediaFlowProtocol: row.getCell('Q').value,
                mediaFlowHitlessMode: row.getCell('R').value,
                mediaFlowMbps: row.getCell('S').value,
                requestType: row.getCell('T').value,
                serviceType: row.getCell('U').value
            };
            rows.push(rowData);
        });
        
        // Validate and set rows
        if (rows.length !== data.length) {
            showNotification({
                title: 'Import Error',
                message: `Row count mismatch: XLSX has ${rows.length} rows, but the table has ${data.length} rows.`,
                color: 'red'
            });
            return;
        }
        
        setDetailedVIPFlows(index, rows);
    } else {
        showNotification({
            title: 'Invalid File',
            message: 'Please upload a valid XLSX file.',
            color: 'red'
        });
    }
};

const handleCancel = () => {
    setShowAlert(false);
    setFileName(''); // Clear file name on cancel
};

const handleExportRows = (rows) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('VIP Flows');
    
    // Define columns for the worksheet
    worksheet.columns = [
        { header: 'Flow Number', key: 'flowNo', width: 10 },
        { header: 'Service Tx/Rx', key: 'TxRx', width: 10 },
        { header: 'Engineering Name', key: 'engineeringName', width: 30 },
        { header: 'Friendly Name', key: 'friendlyName', width: 30 },
        { header: 'Customer VLAN(s)', key: 'customerVlan', width: 15 },
        { header: 'Customer IP Address', key: 'customerVideoIp', width: 15 },
        { header: 'Customer Netmask', key: 'customerNetmask', width: 15 },
        { header: 'Customer Gateway', key: 'customerGateway', width: 15 },
        { header: 'Customer IGMP Version', key: 'customerIgmpVersion', width: 15 },
        { header: 'Media Flow Source IP Address', key: 'mediaFlowSourceIp', width: 15 },
        { header: 'Media Flow Dest IP Address', key: 'mediaFlowDestIp', width: 15 },
        { header: 'Media Flow Source Port', key: 'mediaFlowSourcePort', width: 15 },
        { header: 'Media Flow Dest Port', key: 'mediaFlowDestPort', width: 15 },
        { header: 'Media Flow SSRC', key: 'mediaFlowSsrc', width: 15 },
        { header: 'Media Flow Protocol', key: 'mediaFlowProtocol', width: 15 },
        { header: 'Media Flow Hitless Mode', key: 'mediaFlowHitlessMode', width: 15 },
        { header: 'Media Flow Bitrate (Mbps)', key: 'mediaFlowMbps', width: 15 },
        { header: 'Request Type', key: 'requestType', width: 15 },
        { header: 'Service Type', key: 'serviceType', width: 15 }
    ];
    
    // Add the rows to the worksheet
    rows.forEach((row) => {
        worksheet.addRow({
            flowNo: row.original.flowNo,
            TxRx: row.original.TxRx,
            engineeringName: row.original.engineeringName,
            friendlyName: row.original.friendlyName,
            customerVlan: row.original.customerVlan,
            customerVideoIp: row.original.customerVideoIp,
            customerNetmask: row.original.customerNetmask,
            customerGateway: row.original.customerGateway,
            customerIgmpVersion: row.original.customerIgmpVersion,
            mediaFlowSourceIp: row.original.mediaFlowSourceIp,
            mediaFlowDestIp: row.original.mediaFlowDestIp,
            mediaFlowSourcePort: row.original.mediaFlowSourcePort,
            mediaFlowDestPort: row.original.mediaFlowDestPort,
            mediaFlowSsrc: row.original.mediaFlowSsrc,
            mediaFlowProtocol: row.original.mediaFlowProtocol,
            mediaFlowHitlessMode: row.original.mediaFlowHitlessMode,
            mediaFlowMbps: row.original.mediaFlowMbps,
            requestType: row.original.requestType,
            serviceType: row.original.serviceType
        });
    });
    
    workbook.xlsx.writeBuffer().then((buffer) => {
        saveAs(new Blob([buffer]), 'VIPFlows.xlsx');
    });
};


