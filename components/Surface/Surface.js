'use client';

import { Box, createPolymorphicComponent } from '@mantine/core';
import { forwardRef } from 'react';

const Surface = createPolymorphicComponent(
  forwardRef(({ children, width, ...others }, ref) => (
    <Box component="div" style={{ width }} {...others} ref={ref}>
        {children}
    </Box>
  ))
);

export default Surface;