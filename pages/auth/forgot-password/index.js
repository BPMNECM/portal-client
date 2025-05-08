'use client';

import React, { Fragment, useState } from 'react';
import Link from 'next/link';
import { Button, Center, Group, Paper, rem, Stack, Text, TextInput, Title, UnstyledButton } from '@mantine/core';
import { IconChevronLeft } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import classes from './page.module.css';
import Surface from '@/components/Surface';
import useRequest from '@/hooks/use-request';
import { getLogger } from '@/utils/logger/logger';

const logger = getLogger('ForgotPasswordIndex');

function ForgotPasswordIndex() {
    const [email, setEmail] = useState('');
    const router = useRouter();
    
    const { doRequest, errors } = useRequest({
        url: '/api/users/forgot-password',
        method: 'put',
        body: { email },
        onSuccess: () => {
            logger.info('Password reset email sent successfully');
            router.push('/auth/forgot-password/check-email');
        }
    });
    
    const handleSubmit = async () => {
        await doRequest();
    };
    
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
                  
                  <Title ta="center">Forgot your password?</Title>
                  <Text ta="center">Enter your email to get a reset link</Text>
                  
                  <Surface component={Paper} className={classes.card}>
                      <TextInput
                        label="Your email"
                        placeholder="me@email.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.currentTarget.value)}
                      />
                      {errors}
                      <Group justify="space-between" mt="lg" className={classes.controls}>
                          <UnstyledButton component={Link} href="/auth/signin" color="dimmed"
                                          className={classes.control}>
                              <Group gap={2} align="center">
                                  <IconChevronLeft stroke={1.5} style={{ width: rem(14), height: rem(14) }} />
                                  <Text size="sm" ml={5}>
                                      Back to the login page
                                  </Text>
                              </Group>
                          </UnstyledButton>
                          <Button onClick={handleSubmit} style={{ backgroundColor: 'gray', color: 'white' }}>
                              Reset password
                          </Button>
                      </Group>
                  </Surface>
              </Stack>
          </Center>
      </Fragment>
    );
}

export default ForgotPasswordIndex;
