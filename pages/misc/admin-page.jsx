import React, { Fragment } from 'react';
import { UsersTable } from '@/components/Users/UsersTable';
import SignInPrompt from '@/pages/misc/not-signed';
import UnExpectedError from '@/pages/misc/unexpected-error';
import { getLogger } from '@/utils/logger/logger';
import { handleError } from '@/utils/common-utils';
// import { useAuth } from '@/hooks/use-auth';
// import { Loader } from '@mantine/core';

const logger = getLogger('AdminPage');

const AdminPage = ({ users, currentUser, error }) => {
    // const { currentUser, loading } = useAuth();
    logger.info(`AdminPage - Get list of User registered with portal for the User : ${currentUser?.name}`);
    
    if (error && error.message === 'Request failed with status code 401') {
        return <SignInPrompt />;
    } else if (error) {
        const errorDetails = handleError(error);
        logger.error(`AdminPage - Error : ${errorDetails}`);
        return <UnExpectedError error={errorDetails} />;
    }
    
    // if (loading) {
    //     return (
    //       <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    //           <Loader size="xl" variant="dots" />
    //       </div>
    //     );
    // }
    
    // if (!currentUser) {
    //     return <SignInPrompt />;
    // }
    //
    // if (error) {
    //     return <UnExpectedError error={error} />;
    // }
    
    return (
      <Fragment>
          <UsersTable users={users} />
      </Fragment>
    );
};

AdminPage.getInitialProps = async (context, client, currentUser) => {
    logger.info(`AdminPage [getInitialProps] - CurrentUser: ${currentUser?.name}`);
    
    try {
        const { data } = await client.get('/api/users/usersList');
        logger.debug('AdminPage [getInitialProps] - Fetched all the GMN Portal Users..');
        
        return { users: data };
    } catch (error) {
        logger.error(`AdminPage [getInitialProps] - Error: ${error.response?.status} - ${error.message} `);
        return { error };
    }
};

export default AdminPage;
