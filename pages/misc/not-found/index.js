'use client';

import React, { Fragment } from 'react';
import { useRouter } from 'next/router';
import { Button, Center, Flex, Stack, Text, Title, useMantineTheme } from '@mantine/core';
import classes from '../error.module.css';
import Link from 'next/link';


function Error404() {
    const router = useRouter();
    const theme = useMantineTheme();
    
    return (
      <Fragment>
          <Center
            style={{
                height: '100vh',
                width: '100vw',
                backgroundColor: theme.colors.gray[0],
                color: theme.colors.dark[8]
            }}>
              
              <Stack>
                  {/*<Center>*/}
                  {/*    <img*/}
                  {/*      className="absolute inset-0 h-64 w-full object-cover"*/}
                  {/*      src="https://www.company.com.au/content/dam/shared-component-assets/tecom/articles/company-broadcast-services-delivers-the-future-of-remote-production-with-its-new-media-production-platform/updatedhero.png"*/}
                  {/*      alt=""*/}
                  {/*    />*/}
                  {/*</Center>*/}
                  
                  <div className={classes.label}>404</div>
                  <Title className={classes.title}>
                      You have found a secret place.
                  </Title>
                  <Text fz="md" ta="center" className={classes.description}>
                      Unfortunately, this is only a 404 page. You may have mistyped the
                      address, or the page has been moved to another URL.
                  </Text>
                  
                  <Flex justify="center" mt="lg" className={classes.controls}>
                      <Button
                        size="md"
                        variant="subtle"
                        // leftSection={<IconArrowLeft size={18} />}
                        onClick={() => {
                            router.back();
                        }}>
                          Go back
                      </Button>
                      <Button
                        size="md"
                        variant="subtle"
                        component={Link}
                        // leftSection={<IconHome2 size={18} />}
                        href="/"
                      >
                          Take me to home page
                      </Button>
                  </Flex>
              </Stack>
          </Center>
      </Fragment>
    );
}

export default Error404;