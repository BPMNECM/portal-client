const testOrderData = {
    orderId: '6685ff005e80b7f118202044',
    projectName: 'Resources Project',
    network: 'G',
    handoverDate: '10/JAN/2024',
    cidn: '15768',
    customerName: 'TGL',
    aSiteName: 'Core',
    aEndAddress: 'Core',
    bSiteName: 'Resources Site',
    bEndAddress: 'Resources Address',
    remarks: 'Hitless/Non-Hitless',
    currentStageCode: 'DSAL',
    serviceType: 'HD',
    services: [
        {
            slotId: '1763222',
            newDefaultApp: 'aperi-app-natfw-1g',
            newPinOut: 'D',
            newCardHandOff: 'H',
            newCardStatus: 702,
            cardType: 101,
            portId: '805826',
            newPortStatus: 'Planned',
            newServiceType: 'VIP',
            newHandOff: 'Hitless',
            newServiceUse: 'Permanent',
            TxFlows: '2',
            RxFlows: '2',
            vipBlock: '24',
            newVIPBlock: 48,
            newPhyInterfaceType: 'SFP1GBE',
            vipFlows: [
                {
                    customerVideoIp: '10.92.106.90',
                    customerVlan: '110',
                    customerNetmask: '255.255.255.192',
                    customerGateway: 'N/A',
                    customerIgmpVersion: 'v3',
                    mediaFlowSourceIp: '10.92.106.70',
                    mediaFlowDestIp: '239.6.1.1',
                    mediaFlowSourcePort: '5000',
                    mediaFlowDestPort: '5000',
                    mediaFlowSsrc: 'ignored',
                    mediaFlowProtocol: '2022-7',
                    mediaFlowHitlessMode: 'passthrough',
                    mediaFlowMbps: '25'
                }
            ]
        }
    ]
};

export default testOrderData;