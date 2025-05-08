import { Button, Card, Group, Text } from '@mantine/core';
import { useRouter } from 'next/router';

const EmailVerificationError = () => {
    const router = useRouter();
    const { message } = router.query;
    
    const handleSignInClick = () => {
        router.push('/auth/signin');
    };
    
    return (
      <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Group justify="space-between" mt="md" mb="xs">
              <Text
                size="md"
                fw={900}
                variant="gradient"
                gradient={{ from: 'red', to: 'orange', deg: 259 }}
              >
                  Verification Failed
              </Text>
          </Group>
          <Text size="sm" color="dimmed">
              {message ? decodeURIComponent(message) : 'An unexpected error occurred. Please try again.'}
          </Text>
          <Button
            mt="md"
            radius="md"
            variant="light"
            onClick={handleSignInClick}
          >
              Back to Sign In
          </Button>
      </Card>
    );
};

export default EmailVerificationError;