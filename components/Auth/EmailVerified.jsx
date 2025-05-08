import { Badge, Button, Card, Group, Text } from '@mantine/core';
import { useRouter } from 'next/router';
import { IconArrowRight } from '@tabler/icons-react';

const EmailVerified = () => {
    const router = useRouter();
    
    const handleSignInClick = () => {
        router.push('/');
    };
    
    return (
      <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Group justify="space-between" mt="md" mb="xs">
              <Text
                size="md"
                fw={900}
                variant="gradient"
                gradient={{ from: 'blue', to: 'lime', deg: 259 }}
              >
                  Your account verification is
              </Text>
              <Badge color="pink">Successful</Badge>
          </Group>
          
          <Text
            size="sm"
            c="dimmed">
              You can now use the portal..
          </Text>
          
          <Button mt="md" radius="md"
                  variant="light"
                  onClick={handleSignInClick}
            // leftSection={<IconPhoto size={14} />}
                  rightSection={<IconArrowRight size={14} />}
          >
              Take me to the Landing Page
          </Button>
      
      </Card>
    );
};

export default EmailVerified;