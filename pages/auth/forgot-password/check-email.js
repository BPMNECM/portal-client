'use client';

import React, { Fragment } from 'react';
import Link from 'next/link';
import { Button, Center, Flex, Stack, Text, Title } from '@mantine/core';
import classes from './page.module.css';

function CheckEmail() {
    return (
      <Fragment>
          <Center style={{
              height: '100vh',
              width: '100vw'
          }}>
              <Stack>
                  <Center>
                      <img
                        className="absolute inset-0 h-64 w-full object-cover"
                        src="https://www.company.com.au/content/dam/shared-component-assets/tecom/articles/company-broadcast-services-delivers-the-future-of-remote-production-with-its-new-media-production-platform/updatedhero.png"
                        alt=""
                      />
                  </Center>
                  
                  <Title ta="center">Check your email</Title>
                  <Text ta="center">We have sent a password reset link to your email. Please check your email and follow
                      the instructions to reset your password.</Text>
                  
                  <Flex justify="center" mt="lg" className={classes.controls}>
                      <Button component={Link} href="/auth/signin"
                              style={{ backgroundColor: 'gray', color: 'white' }}>
                          Back to Login
                      </Button>
                  </Flex>
              </Stack>
          </Center>
      </Fragment>
    );
}

export default CheckEmail;
