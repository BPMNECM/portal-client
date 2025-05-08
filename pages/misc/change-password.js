import React, { useState } from 'react';
import useRequest from '../../hooks/use-request';
import SignInPrompt from '@/pages/misc/not-signed';
import { Notification, rem } from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';

const changePassword = ({ currentUser }) => {
    
    if (!currentUser) {
        return <SignInPrompt />;
    }
    
    const [name, setName] = useState(currentUser.name);
    const [email, setEmail] = useState(currentUser.email);
    const [existingPassword, setExistingPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordSet, setPasswordSet] = useState(false);
    
    const { doRequest, errors } = useRequest({
        url: '/api/users/change-password',
        method: 'post',
        body: {
            name,
            email,
            existingPassword,
            newPassword,
            confirmPassword
        },
        // onSuccess: () => Router.push('/')
        onSuccess: () => setPasswordSet(true)
    });
    
    const onSubmit = async (event) => {
        event.preventDefault();
        await doRequest();
    };
    
    return (
      <div className="mt-12 sm:mx-auto sm:w-full sm:max-w-md mb-28">
          <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
              <form className="space-y-6" action="#" method="POST" onSubmit={onSubmit}>
                  <h1 className="mb-4 text-xl">User Profile</h1>
                  <div className="form-group">
                      <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                          Name
                      </label>
                      <div className="mt-2">
                          <input
                            id="name"
                            name="name"
                            type="text"
                            autoComplete="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                      </div>
                  </div>
                  <div className="form-group">
                      <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                          Email address
                      </label>
                      <div className="mt-2">
                          <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                      </div>
                  </div>
                  <div className="form-group">
                      <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                          Existing Password
                      </label>
                      <div className="mt-2">
                          <input
                            id="existingPassword"
                            name="existingPassword"
                            type="password"
                            autoComplete="current-password"
                            value={existingPassword}
                            onChange={(e) => setExistingPassword(e.target.value)}
                            required
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                      </div>
                  </div>
                  <div className="form-group">
                      <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                          New Password
                      </label>
                      <div className="mt-2">
                          <input
                            id="newPassword"
                            name="newPassword"
                            type="password"
                            autoComplete="new-password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                      </div>
                  </div>
                  <div className="form-group">
                      <label htmlFor="confirmPassword" className="block text-sm font-medium leading-6 text-gray-900">
                          Confirm New Password
                      </label>
                      <div className="mt-2">
                          <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            autoComplete="confirm-password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                      </div>
                  </div>
                  
                  <div>
                      <button
                        type="submit"
                        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                          Update Profile
                      </button>
                  </div>
                  
                  {errors && (
                    <Notification icon={<IconX size={rem(20)} />} color="red" title="Bummer!">
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
                  
                  {passwordSet && (
                    <Notification
                      icon={IconCheck}
                      color="teal"
                      mt="md"
                      title="Success!"
                      onClose={() => {
                      }}>
                        Your password is updated!
                    </Notification>
                  
                  )}
              
              </form>
          </div>
      </div>
    );
};

export default changePassword;
