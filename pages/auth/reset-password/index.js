import { useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Button, Center, Group, Paper, PasswordInput, Progress, Stack, Text, Title } from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';
import useRequest from '@/hooks/use-request';
import classes from './page.module.css';

function PasswordRequirement({ meets, label }) {
    return (
      <Text component="div" color={meets ? 'teal' : 'red'} mt={5} size="sm">
          <Center inline>
              {meets ? <IconCheck size="0.9rem" stroke={1.5} /> : <IconX size="0.9rem" stroke={1.5} />}
              <Box ml={7}>{label}</Box>
          </Center>
      </Text>
    );
}

const requirements = [
    { re: /[0-9]/, label: 'Includes number' },
    { re: /[a-z]/, label: 'Includes lowercase letter' },
    { re: /[A-Z]/, label: 'Includes uppercase letter' },
    { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: 'Includes special symbol' }
];

function getStrength(password) {
    let multiplier = password.length > 5 ? 0 : 1;
    requirements.forEach((requirement) => {
        if (!requirement.re.test(password)) {
            multiplier += 1;
        }
    });
    return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 0);
}

const ResetPassword = () => {
    const router = useRouter();
    const { token } = router.query;
    
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordMatch, setPasswordMatch] = useState(true);
    const [formErrors, setFormErrors] = useState(null);
    
    const { doRequest, errors } = useRequest({
        url: `/api/users/reset-password/${token}`,
        method: 'post',
        body: { newPassword: password, confirmPassword },
        onSuccess: () => router.push('/auth/reset-password/reset-success')
    });
    
    const handlePasswordChange = (event) => {
        const newPassword = event.currentTarget.value;
        setPassword(newPassword);
        setPasswordMatch(newPassword === confirmPassword);
    };
    
    const handleConfirmPasswordChange = (event) => {
        const newConfirmPassword = event.currentTarget.value;
        setConfirmPassword(newConfirmPassword);
        setPasswordMatch(newConfirmPassword === password);
    };
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!passwordMatch) {
            setFormErrors('Passwords do not match');
            return;
        }
        await doRequest();
    };
    
    const strength = getStrength(password);
    
    const checks = requirements.map((requirement, index) => (
      <PasswordRequirement key={index} label={requirement.label} meets={requirement.re.test(password)} />
    ));
    
    const bars = Array(4)
      .fill(0)
      .map((_, index) => (
        <Progress
          styles={{ section: { transitionDuration: '0ms' } }}
          value={password.length > 0 && index === 0 ? 100 : strength >= ((index + 1) / 4) * 100 ? 100 : 0}
          color={strength > 80 ? 'teal' : strength > 50 ? 'yellow' : 'red'}
          key={index}
          size={4}
        />
      ));
    
    return (
      <Center style={{ height: '100vh', width: '100vw' }}>
          <Stack>
              <Title ta="center">Reset your password</Title>
              <Text ta="center">Enter your new password</Text>
              <Paper className={classes.card}>
                  <form onSubmit={handleSubmit}>
                      <PasswordInput
                        value={password}
                        onChange={handlePasswordChange}
                        placeholder="Your password"
                        label="Password"
                        required
                      />
                      <Group gap={5} grow mt="xs" mb="md">
                          {bars}
                      </Group>
                      <PasswordRequirement label="Has at least 10 characters" meets={password.length > 9} />
                      {checks}
                      
                      <PasswordInput
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                        placeholder="Confirm your password"
                        label="Confirm Password"
                        required
                        mt="md"
                      />
                      {!passwordMatch && (
                        <Text color="red" size="sm" mt="sm">
                            Passwords do not match
                        </Text>
                      )}
                      {formErrors && <Text color="red" size="sm" mt="sm">{formErrors}</Text>}
                      {errors && <Text color="red" size="sm" mt="sm">{errors}</Text>}
                      <Button type="submit" fullWidth mt="lg">
                          Reset Password
                      </Button>
                  </form>
              </Paper>
          </Stack>
      </Center>
    );
};

export default ResetPassword;
