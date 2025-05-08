import {Fragment} from 'react';
import Head from 'next/head';
import buildClient from '@/api/build-client';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';
import {MantineProvider} from '@mantine/core';
import {Notifications} from '@mantine/notifications';
import '@/styles/globals.css';
import Header from '@/components/Shared/Header';
import Footer from '@/components/Shared/Footer';
import {getLogger} from '@/utils/logger/logger';
import {userData} from '@/shared/data/user-data';
import {AuthProvider} from '@/hooks/use-auth';

const logger = getLogger('AppComponent');
const queryClient = new QueryClient();

const AppComponent = ({Component, pageProps, currentUser}) => {
	const title = `GMN Order Portal - ${process.env.NEXT_PUBLIC_custom_env}`;
	logger.info(`AppComponent - ${title} - currentUser: ${currentUser?.name}, isVerified: ${currentUser?.isVerified} `);
	
	return (
		<Fragment>
			<Head>
				<title>{title}</title>
				<meta name="description" content="GMN Order Portal"/>
				<meta name="viewport" content="width=device-width, initial-scale=1"/>
				<link rel="icon" href="/favicon.ico"/>
			</Head>
			
			<AuthProvider currentUser={currentUser}>
				<Header currentUser={currentUser}/>
				<div className="max-2xl">
					<QueryClientProvider client={queryClient}>
						<MantineProvider theme={{loader: 'bars'}}>
							<Notifications position="top-center"/>
							<Component currentUser={currentUser} {...pageProps} />
						</MantineProvider>
						{process.env.NODE_ENV !== 'production' && <ReactQueryDevtools initialIsOpen={false}/>}
					</QueryClientProvider>
				</div>
				<Footer/>
			</AuthProvider>
		</Fragment>
	);
};

AppComponent.getInitialProps = async (appContext) => {
	const client = buildClient(appContext.ctx);
	let currentUser = null;
	let pageProps = {}; // Call getInitialProps for Child components
	
	if (process.env.NEXT_PUBLIC_isLocal === 'true') {
		currentUser = userData;
	} else {
		const {data} = await client.get('/api/users/currentuser');
		currentUser = data.currentUser;
	}
	logger.info(`getInitialProps [App] - Logged in User: ${JSON.stringify(currentUser)} `);
	
	if (appContext.Component.getInitialProps) {
		pageProps = await appContext.Component.getInitialProps(appContext.ctx, client, currentUser);
	}
	
	return {
		pageProps,
		currentUser: currentUser
		// ...data
	};
};

export default AppComponent;
