export const fakeIPFlowData = [];

// Generate data for Tx
for (let i = 1; i <= 24; i++) {
    fakeIPFlowData.push({
        flowNo: i.toString(),
        TxRx: 'Tx',
        engineeringName: `TGL-ULHZ-A1105-2B.1.3.H.VIP.TX${i}`,
        friendlyName: `ULHZ UK AP VIP-2B.1.3.H.TX${i}`,
        customerVlan: '',
        customerVideoIp: '',
        customerNetmask: '',
        customerGateway: '',
        customerIgmpVersion: '',
        mediaFlowSourceIp: '',
        mediaFlowDestIp: '',
        mediaFlowSourcePort: '',
        mediaFlowDestPort: '',
        mediaFlowSsrc: '',
        mediaFlowProtocol: '',
        mediaFlowHitlessMode: '',
        mediaFlowMbps: '',
        portStatus: 'Select'
    });
}

// Generate data for Rx
for (let i = 1; i <= 24; i++) {
    fakeIPFlowData.push({
        flowNo: i.toString(),
        TxRx: 'Rx',
        engineeringName: `TGL-ULHZ-A1105-2B.1.3.H.VIP.RX${i}`,
        friendlyName: `ULHZ UK AP VIP-2B.1.3.H.RX${i}`,
        customerVlan: '',
        customerVideoIp: '',
        customerNetmask: '',
        customerGateway: '',
        customerIgmpVersion: '',
        mediaFlowSourceIp: '',
        mediaFlowDestIp: '',
        mediaFlowSourcePort: '',
        mediaFlowDestPort: '',
        mediaFlowSsrc: '',
        mediaFlowProtocol: '',
        mediaFlowHitlessMode: '',
        mediaFlowMbps: '',
        portStatus: 'Select'
    });
}



