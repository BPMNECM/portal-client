import React, { useState } from 'react';
import { useRouter } from 'next/router';
import useRequest from '../../hooks/use-request';
import { Loader, Notification, rem } from '@mantine/core';
import SignInPrompt from '@/pages/misc/not-signed';
import { getLogger } from '@/utils/logger/logger';
import { IconX } from '@tabler/icons-react';
import { useAuth } from '@/hooks/use-auth';

const logger = getLogger('NewServiceOrder');

const NewServiceOrder = () => {
    const router = useRouter();
    const [projectName, setProjectName] = useState('');
    const [bSiteName, setBSiteName] = useState('');
    const { currentUser, loading } = useAuth();
    
    if (loading) {
        return (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
              <Loader size="xl" variant="dots" />
          </div>
        );
    }
    
    if (!currentUser) {
        return <SignInPrompt />;
    }
    
    if (currentUser && currentUser.name) {
        logger.info('Adding Service Order details on this Page : ' + currentUser.name);
    } else {
        logger.info('No user name available');
    }
    
    const { doRequest, errors } = useRequest({
        url: '/api/service-orders',
        method: 'post',
        body: {
            projectName,
            bSiteName
        },
        onSuccess: () => router.push('/')
    });
    
    const onSubmit = (event) => {
        event.preventDefault();
        doRequest();
    };
    
    const onBlur = () => {
        logger.trace('[NewServiceOrder] - onBlur function: ');
        
        const value = parseFloat(bSiteName);
        if (isNaN(value)) {
            return;
        }
        setBSiteName(value.toFixed(2));
    };
    
    return (
      <div>
          <h1>Create a Service Order</h1>
          <form onSubmit={onSubmit}>
              <div className="form-group">
                  <label>Project Name</label>
                  <input
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="form-control"
                  />
              </div>
              <div className="form-group">
                  <label>Site Code</label>
                  <input
                    value={bSiteName}
                    onBlur={onBlur}
                    onChange={(e) => setBSiteName(e.target.value)}
                    className="form-control"
                  />
              </div>
              
              {errors && (
                <Notification icon={<IconX size={rem(20)} />} color="red" title="New Order capture Failed">
                    {errors.message}
                    {errors.errors && (
                      <ul>
                          {errors.errors.map((error, index) => (
                            <li key={index}>{error.message}</li>
                          ))}
                      </ul>
                    )}
                </Notification>
              )}
              
              <button className="btn btn-primary">Submit</button>
          </form>
      </div>
    );
};

export default NewServiceOrder;
