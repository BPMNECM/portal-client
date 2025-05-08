import React, { useEffect } from 'react';
import { Button, Center, Group, Stack, Text, Title } from '@mantine/core';
import classes from '@/pages/misc/error.module.css';
import Link from 'next/link';
import Router from 'next/router';
import useRequest from '@/hooks/use-request';

const Signout = () => {
    
    const { doRequest } = useRequest({
        url: '/api/users/signout',
        method: 'post',
        body: {},
        onSuccess: () => Router.push('/auth/signin')
    });
    
    useEffect(() => {
        doRequest();
    }, []);
    
    return (
      <Center
        style={{
            height: '100vh',
            width: '100vw'
        }}
      >
          <Stack>
              <Center>
                  <img
                    className="absolute inset-0 h-64 w-full object-cover"
                    src="https://www.company.com.au/content/dam/shared-component-assets/tecom/articles/company-broadcast-services-delivers-the-future-of-remote-production-with-its-new-media-production-platform/updatedhero.png"
                    alt=""
                  />
              </Center>
              <Title className={classes.title}>
                  Signing you out...
              </Title>
              <Text fz="md" ta="center" className={classes.description}>
                  Please sign in to use the portal.
              </Text>
              <Group justify="center" mt="md">
                  <Button
                    size="md"
                    variant="subtle"
                    component={Link}
                    // leftSection={<IconHome2 size={18} />}
                    href="/auth/signin"
                  >
                      Take me to Login page
                  </Button>
              </Group>
          </Stack>
      </Center>
    );
};

export default Signout;
