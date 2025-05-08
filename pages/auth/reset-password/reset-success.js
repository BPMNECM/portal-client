import React from 'react';
import { Badge, Button, Card, Center, Group, Stack, Text } from '@mantine/core';
import { useRouter } from 'next/router';
import { IconArrowRight } from '@tabler/icons-react';

const ResetSuccess = () => {
    const router = useRouter();
    
    const handleSignInClick = () => {
        router.push('/auth/signin');
    };
    
    return (
      <Center style={{ height: '100vh', width: '100vw' }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Stack>
                  <Group position="center" mt="md" mb="xs">
                      <Text
                        size="lg"
                        fw={900}
                        variant="gradient"
                        gradient={{ from: 'blue', to: 'lime', deg: 259 }}
                      >
                          Your Password reset is
                      </Text>
                      <Badge color="pink">Successful</Badge>
                  </Group>
                  
                  <Text size="sm" color="dimmed" align="center">
                      You can now log in with your new password.
                  </Text>
                  
                  <Group position="center" mt="md">
                      <Button
                        radius="md"
                        variant="light"
                        onClick={handleSignInClick}
                        rightSection={<IconArrowRight size={14} />}
                      >
                          Take me to the Login page
                      </Button>
                  </Group>
              </Stack>
          </Card>
      </Center>
    );
};

export default ResetSuccess;
