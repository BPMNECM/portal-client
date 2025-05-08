import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import useRequest from '@/hooks/use-request';
import { Button, Notification, Text } from '@mantine/core';

const ResendEmail = ({ currentUser }) => {
    const router = useRouter();
    const [emailSent, setEmailSent] = useState(false);
    
    useEffect(() => {
        const emailSentStatus = localStorage.getItem('emailSent');
        if (emailSentStatus) {
            setEmailSent(true);
        }
    }, []);
    
    const { doRequest, errors } = useRequest({
        url: '/api/users/resend-email',
        method: 'post',
        body: { email: currentUser?.email },
        onSuccess: () => {
            setEmailSent(true);
            localStorage.setItem('emailSent', 'true');
        }
    });
    
    const handleResendEmail = async () => {
        await doRequest();
    };
    
    return (
      <div className="container mx-auto mt-10 pb-96">
          <Text
            size="lg"
            fw={600}
            variant="gradient"
            gradient={{ from: 'red', to: 'lime', deg: 90 }}
          >
              Email Verification Required
          </Text>
          
          <p className="mb-4">
              Please verify your email to access the full functionality of the portal. An email has been sent
              to {currentUser?.email}. If you didn't receive the email, click the button below to resend it.
          </p>
          
          <Button
            onClick={handleResendEmail}
            disabled={emailSent}
          >
              Resend Verification Email
          </Button>
          
          {errors && (
            <Notification
              title="Error"
              color="red"
              onClose={() => setEmailSent(false)}
            >
                {errors.message}
            </Notification>
          )}
          
          {emailSent && (
            <Notification
              title="Success"
              color="green"
              onClose={() => setEmailSent(false)}
            >
                Verification email has been resent!
            </Notification>
          )}
      </div>
    );
};

export default ResendEmail;
