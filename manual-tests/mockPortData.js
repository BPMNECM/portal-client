// manual-tests/mockPortData.js

export const mockPortData1 = [
    {
        'id': '801013',
        'href': 'https://dna.media.aws.cloud.in.company.com.au/api/v1/resource?id=801013',
        'name': 'TGL-GDIH-A1105-1A.5.4.H.VIP',
        'publicIdentifier': 'BARRYST AP VIP-1A.5.4.H',
        'description': 'This is a Port resource.',
        'administrativeState': 'PLANNED',
        'operationalState': null,
        'usageState': 'idle',
        'resourceStatus': 'available',
        'serialNumber': '-',
        'versionNumber': '1.2',
        'manufactureDate': '24-OCT-24',
        'resourceSpecification': [
            {}
        ],
        'resourceRelationship': [
            {
                'relationshipType': 'contains',
                'resource': {
                    'id': '86564',
                    'href': 'https://dna.media.aws.cloud.in.company.com.au/api/v1/resource?id=86564',
                    'name': 'TGL-GDIH-A1105-1A',
                    '@referredType': 'Chassis'
                }
            },
            {
                'relationshipType': 'contains',
                'resource': {
                    'id': '1752871',
                    'href': 'https://dna.media.aws.cloud.in.company.com.au/api/resource/resource?id=1752871',
                    'name': 'MS 5',
                    '@referredType': 'Slot'
                }
            },
            {
                'relationshipType': 'contains',
                'resource': {
                    'id': '1752871',
                    'href': 'https://dna.media.aws.cloud.in.company.com.au/api/resource/resource?id=1752871',
                    'name': 'SDMP-4S-Q40',
                    '@referredType': 'Card'
                }
            },
            {
                'relationshipType': 'contains',
                'resource': {
                    'id': '25229',
                    'href': 'https://dna.media.aws.cloud.in.company.com.au/api/resource/resource?id=25229',
                    'name': 'TGL-GDIH-A1105-1A.5.4.H.VIP.TX1',
                    '@referredType': 'VIP Flow'
                }
            },
            {
                'relationshipType': 'contains',
                'resource': {
                    'id': '25231',
                    'href': 'https://dna.media.aws.cloud.in.company.com.au/api/resource/resource?id=25231',
                    'name': 'TGL-GDIH-A1105-1A.5.4.H.VIP.TX2',
                    '@referredType': 'VIP Flow'
                }
            },
            {
                'relationshipType': 'contains',
                'resource': {
                    'id': '25232',
                    'href': 'https://dna.media.aws.cloud.in.company.com.au/api/resource/resource?id=25232',
                    'name': 'TGL-GDIH-A1105-1A.5.4.A.VIP.RX2',
                    '@referredType': 'VIP Flow'
                }
            },
            {
                'relationshipType': 'contains',
                'resource': {
                    'id': '25233',
                    'href': 'https://dna.media.aws.cloud.in.company.com.au/api/resource/resource?id=25233',
                    'name': 'TGL-GDIH-A1105-1A.5.4.H.VIP.TX3',
                    '@referredType': 'VIP Flow'
                }
            },
            {
                'relationshipType': 'contains',
                'resource': {
                    'id': '25235',
                    'href': 'https://dna.media.aws.cloud.in.company.com.au/api/resource/resource?id=25235',
                    'name': 'TGL-GDIH-A1105-1A.5.4.H.VIP.TX4',
                    '@referredType': 'VIP Flow'
                }
            },
            {
                'relationshipType': 'contains',
                'resource': {
                    'id': '25237',
                    'href': 'https://dna.media.aws.cloud.in.company.com.au/api/resource/resource?id=25237',
                    'name': 'TGL-GDIH-A1105-1A.5.4.H.VIP.TX5',
                    '@referredType': 'VIP Flow'
                }
            },
            {
                'relationshipType': 'contains',
                'resource': {
                    'id': '25239',
                    'href': 'https://dna.media.aws.cloud.in.company.com.au/api/resource/resource?id=25239',
                    'name': 'TGL-GDIH-A1105-1A.5.4.H.VIP.TX6',
                    '@referredType': 'VIP Flow'
                }
            }
        ],
        'resourceCharacteristics': [
            {
                'name': 'createdDate',
                'valueType': 'string',
                'value': '27-APR-20'
            },
            {
                'name': 'modifiedDate',
                'valueType': 'string',
                'value': '23-OCT-24'
            },
            {
                'name': 'network',
                'valueType': 'string',
                'value': 'GMN'
            },
            {
                'name': 'resourceType',
                'valueType': 'string',
                'value': 'port'
            },
            {
                'name': 'projectNumber',
                'valueType': 'string',
                'value': 'Not Provided'
            },
            {
                'name': 'portNo',
                'valueType': 'string',
                'value': '7'
            },
            {
                'name': 'transmissionId',
                'valueType': 'string',
                'value': 'TGL-GDIH-A1105-1A.5.4.H.VIP'
            },
            {
                'name': 'standardHighAvailability',
                'valueType': 'string',
                'value': null
            },
            {
                'name': 'portService',
                'valueType': 'string',
                'value': null
            },
            {
                'name': 'patchPanel',
                'valueType': 'string',
                'value': null
            },
            {
                'name': 'patchPanelPort',
                'valueType': 'string',
                'value': null
            },
            {
                'name': 'monitorPatchPanel',
                'valueType': 'string',
                'value': null
            },
            {
                'name': 'monitorPatchPanelPort',
                'valueType': 'string',
                'value': null
            },
            {
                'name': 'engineeringName',
                'valueType': 'string',
                'value': 'TGL-GDIH-A1105-1A.5.4.H.VIP'
            },
            {
                'name': 'friendlyName',
                'valueType': 'string',
                'value': 'BARRYST AP VIP-1A.5.4.H'
            },
            {
                'name': 'defaultApp',
                'valueType': 'string',
                'value': 'VIP (NATFW)'
            },
            {
                'name': 'vipNoFlows',
                'valueType': 'string',
                'value': '0'
            },
            {
                'name': 'interfaceType',
                'valueType': 'string',
                'value': null
            },
            {
                'name': 'pathTx',
                'valueType': 'string',
                'value': null
            },
            {
                'name': 'pathRx',
                'valueType': 'string',
                'value': null
            },
            {
                'name': 'globalPath',
                'valueType': 'string',
                'value': null
            },
            {
                'name': 'txBandwidthPathA',
                'valueType': 'string',
                'value': null
            },
            {
                'name': 'txBandwidthPathB',
                'valueType': 'string',
                'value': null
            },
            {
                'name': 'rxBandwidthPathA',
                'valueType': 'string',
                'value': null
            },
            {
                'name': 'rxBandwidthPathB',
                'valueType': 'string',
                'value': null
            },
            {
                'name': 'primaryIp',
                'valueType': 'string',
                'value': null
            },
            {
                'name': 'primaryMulticastIp',
                'valueType': 'string',
                'value': '225.12.20.30/23'
            },
            {
                'name': 'primaryGatewayIp',
                'valueType': 'string',
                'value': null
            },
            {
                'name': 'secondaryIp',
                'valueType': 'string',
                'value': '10.12.16.50'
            },
            {
                'name': 'secondaryMulticastIp',
                'valueType': 'string',
                'value': '225.212.21.30/23'
            }
        ],
        'resourceLookup': [
            {
                'id': '2823',
                'href': 'https://dna.media.aws.cloud.in.company.com.au/api/v1/catalog?id=2823',
                'referenceType': 'GMN_PERM_ITIN',
                'value': 'P',
                'description': 'Permanent',
                'deleted': null,
                'typeComment': 'Servic Use PERM/ITIN identifyer for GMN.'
            },
            {
                'id': '2809',
                'href': 'https://dna.media.aws.cloud.in.company.com.au/api/v1/catalog?id=2809',
                'referenceType': 'GMN_HITLESS',
                'value': 'H',
                'description': 'Hitless',
                'deleted': null,
                'typeComment': 'New GMN Hitless Services specific for Aperi & DCM. '
            },
            {
                'id': '562',
                'href': 'https://dna.media.aws.cloud.in.company.com.au/api/v1/catalog?id=562',
                'referenceType': 'PORT_STATUS',
                'value': 'PLANNED',
                'description': 'Planned',
                'deleted': null,
                'typeComment': 'Status used on the Port Details screen.'
            },
            {
                'id': '1216',
                'href': 'https://dna.media.aws.cloud.in.company.com.au/api/v1/catalog?id=1216',
                'referenceType': 'NETWORK_TYPE',
                'value': 'G',
                'description': 'GMN',
                'deleted': null,
                'typeComment': null
            },
            {
                'id': 'Incorrect value set for lookup GMN_PROD_GROUP. Correct data in DNA.',
                'href': 'Incorrect value set for lookup GMN_PROD_GROUP. Correct data in DNA.',
                'referenceType': 'Incorrect value set for lookup GMN_PROD_GROUP. Correct data in DNA.',
                'value': 'Incorrect value set for lookup GMN_PROD_GROUP. Correct data in DNA.',
                'description': 'Incorrect value set for lookup GMN_PROD_GROUP. Correct data in DNA.',
                'deleted': 'Incorrect value set for lookup GMN_PROD_GROUP. Correct data in DNA.',
                'typeComment': 'Incorrect value set for lookup GMN_PROD_GROUP. Correct data in DNA.'
            },
            {
                'id': '2750',
                'href': 'https://dna.media.aws.cloud.in.company.com.au/api/v1/catalog?id=2750',
                'referenceType': 'GMN_INTERF_TYPE',
                'value': 'VIP',
                'description': 'VIP',
                'deleted': null,
                'typeComment': 'Interface type for DCMD9902 and A1105 Aperi R6515 R6615 R7515 R7615 ATEME chassis in GMN.'
            }
        ],
        'relatedParty': [
            {
                'href': 'https://dna.media.aws.cloud.in.company.com.au/partyManagement/v1/customer/1521',
                'id': '1521',
                'name': 'Company Global',
                '@referredType': 'Customer'
            }
        ],
        'resourceAttachment': [
            {
                'id': '1',
                'href': 'http://server:port/documentManagement/document/1'
            }
        ],
        'note': [
            {
                'text': 'device and chassis resource captured as 1 record'
            }
        ],
        'place': {
            'id': '67091',
            'href': 'https://dna.media.aws.cloud.in.company.com.au/api/v1/site?id=67091',
            '@type': 'PlaceRef',
            '@referredType': 'Site',
            'siteCode': 'GDIH',
            'siteAddress': ', 45 Barry , Street, Carlton, Melbourne, VIC, AUS, '
        }
    }
];

export const mockPortData2 = [
    {
        'id': '800925',
        'href': 'https://dna.media.aws.cloud.in.company.com.au/api/v1/resource?id=800925',
        'name': 'TGL-GDIH-A1105-1B.2.4.H.VIP',
        'publicIdentifier': 'BARRYST AP VIP-1B.2.4.H',
        'description': 'This is a Port resource.',
        'administrativeState': 'PLANNED',
        'operationalState': null,
        'usageState': 'idle',
        'resourceStatus': 'available',
        'serialNumber': '-',
        'versionNumber': '1.2',
        'manufactureDate': '24-OCT-24',
        'resourceSpecification': [
            {}
        ],
        'resourceRelationship': [
            {
                'relationshipType': 'contains',
                'resource': {
                    'id': '86498',
                    'href': 'https://dna.media.aws.cloud.in.company.com.au/api/v1/resource?id=86498',
                    'name': 'TGL-GDIH-A1105-1B',
                    '@referredType': 'Chassis'
                }
            },
            {
                'relationshipType': 'contains',
                'resource': {
                    'id': '1751094',
                    'href': 'https://dna.media.aws.cloud.in.company.com.au/api/resource/resource?id=1751094',
                    'name': 'MS 2',
                    '@referredType': 'Slot'
                }
            },
            {
                'relationshipType': 'contains',
                'resource': {
                    'id': '1751094',
                    'href': 'https://dna.media.aws.cloud.in.company.com.au/api/resource/resource?id=1751094',
                    'name': 'SDMP-4S-Q40',
                    '@referredType': 'Card'
                }
            },
            {
                'relationshipType': 'contains',
                'resource': {
                    'id': '34701',
                    'href': 'https://dna.media.aws.cloud.in.company.com.au/api/resource/resource?id=34701',
                    'name': 'TGL-GDIH-A1105-1B.2.4.H.VIP.TX1',
                    '@referredType': 'VIP Flow'
                }
            },
            {
                'relationshipType': 'contains',
                'resource': {
                    'id': '34702',
                    'href': 'https://dna.media.aws.cloud.in.company.com.au/api/resource/resource?id=34702',
                    'name': 'TGL-GDIH-A1105-1B.2.4.H.VIP.RX1',
                    '@referredType': 'VIP Flow'
                }
            },
            {
                'relationshipType': 'contains',
                'resource': {
                    'id': '34703',
                    'href': 'https://dna.media.aws.cloud.in.company.com.au/api/resource/resource?id=34703',
                    'name': 'TGL-GDIH-A1105-1B.2.4.H.VIP.TX2',
                    '@referredType': 'VIP Flow'
                }
            },
            {
                'relationshipType': 'contains',
                'resource': {
                    'id': '34704',
                    'href': 'https://dna.media.aws.cloud.in.company.com.au/api/resource/resource?id=34704',
                    'name': 'TGL-GDIH-A1105-1B.2.4.H.VIP.RX2',
                    '@referredType': 'VIP Flow'
                }
            },
            {
                'relationshipType': 'contains',
                'resource': {
                    'id': '34705',
                    'href': 'https://dna.media.aws.cloud.in.company.com.au/api/resource/resource?id=34705',
                    'name': 'TGL-GDIH-A1105-1B.2.4.H.VIP.TX3',
                    '@referredType': 'VIP Flow'
                }
            },
            {
                'relationshipType': 'contains',
                'resource': {
                    'id': '34706',
                    'href': 'https://dna.media.aws.cloud.in.company.com.au/api/resource/resource?id=34706',
                    'name': 'TGL-GDIH-A1105-1B.2.4.H.VIP.RX3',
                    '@referredType': 'VIP Flow'
                }
            },
            {
                'relationshipType': 'contains',
                'resource': {
                    'id': '34707',
                    'href': 'https://dna.media.aws.cloud.in.company.com.au/api/resource/resource?id=34707',
                    'name': 'TGL-GDIH-A1105-1B.2.4.H.VIP.TX4',
                    '@referredType': 'VIP Flow'
                }
            },
            {
                'relationshipType': 'contains',
                'resource': {
                    'id': '34708',
                    'href': 'https://dna.media.aws.cloud.in.company.com.au/api/resource/resource?id=34708',
                    'name': 'TGL-GDIH-A1105-1B.2.4.H.VIP.RX4',
                    '@referredType': 'VIP Flow'
                }
            },
            {
                'relationshipType': 'contains',
                'resource': {
                    'id': '34709',
                    'href': 'https://dna.media.aws.cloud.in.company.com.au/api/resource/resource?id=34709',
                    'name': 'TGL-GDIH-A1105-1B.2.4.H.VIP.TX5',
                    '@referredType': 'VIP Flow'
                }
            },
            {
                'relationshipType': 'contains',
                'resource': {
                    'id': '34710',
                    'href': 'https://dna.media.aws.cloud.in.company.com.au/api/resource/resource?id=34710',
                    'name': 'TGL-GDIH-A1105-1B.2.4.H.VIP.RX5',
                    '@referredType': 'VIP Flow'
                }
            }
        ],
        'resourceCharacteristics': [
            {
                'name': 'createdDate',
                'valueType': 'string',
                'value': '27-APR-20'
            },
            {
                'name': 'modifiedDate',
                'valueType': 'string',
                'value': '02-SEP-24'
            },
            {
                'name': 'network',
                'valueType': 'string',
                'value': 'GMN'
            },
            {
                'name': 'resourceType',
                'valueType': 'string',
                'value': 'port'
            },
            {
                'name': 'projectNumber',
                'valueType': 'string',
                'value': 'DemoPortalTest001'
            },
            {
                'name': 'portNo',
                'valueType': 'string',
                'value': '7'
            },
            {
                'name': 'transmissionId',
                'valueType': 'string',
                'value': 'TGL-GDIH-A1105-1B.2.4.H.VIP'
            },
            {
                'name': 'standardHighAvailability',
                'valueType': 'string',
                'value': null
            },
            {
                'name': 'portService',
                'valueType': 'string',
                'value': null
            },
            {
                'name': 'patchPanel',
                'valueType': 'string',
                'value': null
            },
            {
                'name': 'patchPanelPort',
                'valueType': 'string',
                'value': null
            },
            {
                'name': 'monitorPatchPanel',
                'valueType': 'string',
                'value': null
            },
            {
                'name': 'monitorPatchPanelPort',
                'valueType': 'string',
                'value': null
            },
            {
                'name': 'engineeringName',
                'valueType': 'string',
                'value': 'TGL-GDIH-A1105-1B.2.4.H.VIP'
            },
            {
                'name': 'friendlyName',
                'valueType': 'string',
                'value': 'BARRYST AP VIP-1B.2.4.H'
            },
            {
                'name': 'defaultApp',
                'valueType': 'string',
                'value': 'VIP (NATFW)'
            },
            {
                'name': 'vipNoFlows',
                'valueType': 'string',
                'value': '5'
            },
            {
                'name': 'interfaceType',
                'valueType': 'string',
                'value': null
            },
            {
                'name': 'pathTx',
                'valueType': 'string',
                'value': null
            },
            {
                'name': 'pathRx',
                'valueType': 'string',
                'value': null
            },
            {
                'name': 'globalPath',
                'valueType': 'string',
                'value': null
            },
            {
                'name': 'txBandwidthPathA',
                'valueType': 'string',
                'value': null
            },
            {
                'name': 'txBandwidthPathB',
                'valueType': 'string',
                'value': null
            },
            {
                'name': 'rxBandwidthPathA',
                'valueType': 'string',
                'value': null
            },
            {
                'name': 'rxBandwidthPathB',
                'valueType': 'string',
                'value': null
            },
            {
                'name': 'primaryIp',
                'valueType': 'string',
                'value': '10.212.16.38'
            },
            {
                'name': 'primaryMulticastIp',
                'valueType': 'string',
                'value': '225.212.20.18/23'
            },
            {
                'name': 'primaryGatewayIp',
                'valueType': 'string',
                'value': null
            },
            {
                'name': 'secondaryIp',
                'valueType': 'string',
                'value': null
            },
            {
                'name': 'secondaryMulticastIp',
                'valueType': 'string',
                'value': '225.12.21.18/23'
            }
        ],
        'resourceLookup': [
            {
                'id': '2823',
                'href': 'https://dna.media.aws.cloud.in.company.com.au/api/v1/catalog?id=2823',
                'referenceType': 'GMN_PERM_ITIN',
                'value': 'P',
                'description': 'Permanent',
                'deleted': null,
                'typeComment': 'Servic Use PERM/ITIN identifyer for GMN.'
            },
            {
                'id': '2809',
                'href': 'https://dna.media.aws.cloud.in.company.com.au/api/v1/catalog?id=2809',
                'referenceType': 'GMN_HITLESS',
                'value': 'H',
                'description': 'Hitless',
                'deleted': null,
                'typeComment': 'New GMN Hitless Services specific for Aperi & DCM. '
            },
            {
                'id': '562',
                'href': 'https://dna.media.aws.cloud.in.company.com.au/api/v1/catalog?id=562',
                'referenceType': 'PORT_STATUS',
                'value': 'PLANNED',
                'description': 'Planned',
                'deleted': null,
                'typeComment': 'Status used on the Port Details screen.'
            },
            {
                'id': '1216',
                'href': 'https://dna.media.aws.cloud.in.company.com.au/api/v1/catalog?id=1216',
                'referenceType': 'NETWORK_TYPE',
                'value': 'G',
                'description': 'GMN',
                'deleted': null,
                'typeComment': null
            },
            {
                'id': 'Incorrect value set for lookup GMN_PROD_GROUP. Correct data in DNA.',
                'href': 'Incorrect value set for lookup GMN_PROD_GROUP. Correct data in DNA.',
                'referenceType': 'Incorrect value set for lookup GMN_PROD_GROUP. Correct data in DNA.',
                'value': 'Incorrect value set for lookup GMN_PROD_GROUP. Correct data in DNA.',
                'description': 'Incorrect value set for lookup GMN_PROD_GROUP. Correct data in DNA.',
                'deleted': 'Incorrect value set for lookup GMN_PROD_GROUP. Correct data in DNA.',
                'typeComment': 'Incorrect value set for lookup GMN_PROD_GROUP. Correct data in DNA.'
            },
            {
                'id': '2750',
                'href': 'https://dna.media.aws.cloud.in.company.com.au/api/v1/catalog?id=2750',
                'referenceType': 'GMN_INTERF_TYPE',
                'value': 'VIP',
                'description': 'VIP',
                'deleted': null,
                'typeComment': 'Interface type for DCMD9902 and A1105 Aperi R6515 R6615 R7515 R7615 ATEME chassis in GMN.'
            }
        ],
        'relatedParty': [
            {
                'href': 'https://dna.media.aws.cloud.in.company.com.au/partyManagement/v1/customer/1521',
                'id': '1521',
                'name': 'Company Global',
                '@referredType': 'Customer'
            }
        ],
        'resourceAttachment': [
            {
                'id': '1',
                'href': 'http://server:port/documentManagement/document/1'
            }
        ],
        'note': [
            {
                'text': 'device and chassis resource captured as 1 record'
            }
        ],
        'place': {
            'id': '67091',
            'href': 'https://dna.media.aws.cloud.in.company.com.au/api/v1/site?id=67091',
            '@type': 'PlaceRef',
            '@referredType': 'Site',
            'siteCode': 'GDIH',
            'siteAddress': ', 45 Barry , Street, Carlton, Melbourne, VIC, AUS, '
        }
    }
];

module.exports = { mockPortData1, mockPortData2 };


