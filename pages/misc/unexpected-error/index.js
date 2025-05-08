'use client';

import React, { Fragment, useEffect } from 'react';
import { Button, Center, Group, Stack, Text, Title, useMantineTheme } from '@mantine/core';
import { useRouter } from 'next/router';
import classes from '../error.module.css';
import { getLogger } from '@/utils/logger/logger';

function UnExpectedError({ error }) {
    const router = useRouter();
    const theme = useMantineTheme();
    const logger = getLogger('UnExpectedError: ');
    
    useEffect(() => {
        logger.error('UnExpectedError - Log the error to an error reporting service : ' + JSON.stringify(error));
    }, [error]);
    
    const handleReload = () => {
        if (typeof window !== 'undefined') {
            window.location.reload(); // Ensure window.location.reload is called as a function
        }
    };
    
    return (
      <Fragment>
          <Center style={{
              height: '100vh',
              width: '100vw',
              backgroundColor: theme.colors.gray[0],
              color: theme.colors.dark[8]
          }}>
              <Stack>
                  <div className={classes.label}>400</div>
                  <Title className={classes.title}>Sorry, unexpected error..</Title>
                  <Text fz="md" ta="center" className={classes.description}>
                      {error ? error.message : 'An unexpected error occurred. Please try again later.'}
                  </Text>
                  <Group justify="center" mt="md">
                      <Button
                        size="md"
                        variant="subtle"
                        onClick={handleReload}>
                          Refresh Page
                      </Button>
                      <Button
                        size="md"
                        variant="subtle"
                        onClick={() => router.push('/')}>
                          Take me to home page
                      </Button>
                  </Group>
              </Stack>
          </Center>
      </Fragment>
    );
}

export default UnExpectedError;
