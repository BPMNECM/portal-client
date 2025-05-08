import React from 'react';
import { Alert } from '@mantine/core';
import { IconBug } from '@tabler/icons-react';

var __rest = (this && this.__rest) || function(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === 'function')
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};

const ErrorAlert = (_a) => {
    var { message } = _a, others = __rest(_a, ['message']);
    const icon = <IconBug size={18} />;
    const { title } = others;
    return (<Alert variant="light" color="red" title={title} icon={icon} {...others}>
        {message || ''}
    </Alert>);
};

export default ErrorAlert;
