'use client';
import {useRouter} from 'next/router';
import {Button, Center, Group, Stack, Text, Title, useMantineTheme} from '@mantine/core';
import classes from '../error.module.css';

const SignInPrompt = () => {
	const router = useRouter();
	const theme = useMantineTheme();
	
	const handleSignInClick = () => {
		router.push('/auth/signin');
	};
	
	return (
		<Center
			style={{
				height: '100vh',
				width: '100vw',
				backgroundColor: theme.colors.gray[0],
				color: theme.colors.dark[8]
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
					You are NOT Signed in!
				</Title>
				<Text fz="md" ta="center" className={classes.description}>
					Please sign in to use the portal.
				</Text>
				<Group justify="center" mt="md">
					<Button
						size="md"
						variant="subtle"
						onClick={handleSignInClick} // Use router.push for navigation
					>
						Take me to Login page
					</Button>
				</Group>
			</Stack>
		</Center>
	);
};

export default SignInPrompt;
