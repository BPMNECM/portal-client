import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import { useForm } from 'react-hook-form';
import useRequest from '@/hooks/use-request';
import { Center, Notification, Paper, rem, Text, Title } from '@mantine/core';
import Surface from '@/components/Surface';
import classes from './page.module.css';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { IconX } from '@tabler/icons-react';
import Cookies from 'js-cookie';
import { getLogger } from '@/utils/logger/logger';

const logger = getLogger('Portal [SignIn]:');

const SignInIndex = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    
    // Check for token and redirect if already signed in
    useEffect(() => {
        const refreshToken = Cookies.get('refreshToken');
        logger.info(`Portal [SignIn] - useEffect refreshToken - ${refreshToken} `);
        
        if (refreshToken) {
            Router.push('/');
        }
    }, []);
    
    const { doRequest, errors } = useRequest({
        url: '/api/users/signin',
        method: 'post',
        body: { email, password },
        onSuccess: (data) => {
            const { user, token } = data;
            logger.info(`Portal [SignIn] - useRequest for user ${user} and access token - ${token} `);
            
            // Store the access token in session storage
            if (typeof window !== 'undefined') {
                window.sessionStorage.setItem('accessToken', token);
            }
            // Cookies.set('token', token, { expires: rememberMe ? 1 : undefined });
            
            if (!user.isVerified) {
                Router.push('/auth/email-verification/resend-email');
            } else {
                Router.push('/');
            }
        }
    });
    
    const methods = useForm({ mode: 'onSubmit' });
    const { handleSubmit, formState } = methods;
    
    const onSubmit = async (data, event) => {
        event.preventDefault();
        await doRequest();
    };
    
    return (
      <div className="flex min-h-full mb-60">
          <div
            className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
              <div className="mt-16 w-full max-w-sm lg:w-96">
                  <Title ta="center">Welcome back!</Title>
                  <Text ta="center">Sign in to your account to continue</Text>
                  
                  <Surface component={Paper} className={classes.card}>
                      <div className="mt-6">
                          <form className="space-y-6" onSubmit={handleSubmit((data, event) => onSubmit(data, event))}>
                              <div>
                                  <label htmlFor="email"
                                         className="block text-sm font-medium leading-6 text-gray-900">
                                      Email
                                      <span className="asterisk"> *</span>
                                  </label>
                                  <div className="mt-2">
                                      <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                      />
                                  </div>
                              </div>
                              
                              <div className="space-y-1">
                                  <label htmlFor="password"
                                         className="block text-sm font-medium leading-6 text-gray-900">
                                      Password
                                      <span className="asterisk"> *</span>
                                  </label>
                                  <div className="relative mt-2">
                                      <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                      />
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setShowPassword(!showPassword);
                                        }}
                                        className="absolute top-2 right-2"
                                        disabled={formState.isSubmitting}>
                                          {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                                      </button>
                                  </div>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                  <div className="flex items-center">
                                      <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                      />
                                      <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                          Remember me
                                      </label>
                                  </div>
                                  
                                  <div className="text-sm">
                                      <a href="/auth/forgot-password/"
                                         className="font-medium text-indigo-600 hover:text-indigo-500">
                                          Forgot your password?
                                      </a>
                                  </div>
                              </div>
                              
                              {errors && (
                                <Notification icon={<IconX size={rem(20)} />} color="red" title="User Login Failed">
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
                              
                              <div>
                                  <button
                                    type="submit"
                                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                  >
                                      Sign in
                                  </button>
                              </div>
                          </form>
                          <Center mt="md">
                              <Text fz="sm" ta="center" component={Link} href="/auth/signup">
                                  Do not have an account yet? Create account
                              </Text>
                          </Center>
                      </div>
                  </Surface>
              </div>
          </div>
          <div className="relative hidden w-0 flex-1 lg:block">
              <img
                className="absolute inset-0 min-h-max w-full object-cover"
                src="https://www.company.com.au/content/dam/shared-component-assets/tecom/articles/company-broadcast-services-delivers-the-future-of-remote-production-with-its-new-media-production-platform/updatedhero.png"
                alt=""
              />
          </div>
      </div>
    );
};

export default SignInIndex;


/**
 Sign-In Process:
 *    •	User Sign-In: When the user signs in, the frontend makes a POST request to the /api/users/signin endpoint.
 *    •	Response Handling:
 *    •	Access Token (JWT): Received in the response body and stored in the session storage.
 *    •	Refresh Token: Set in an HTTP-only cookie by the backend.
 Token Retrieval:
 *    •	Check for Refresh Token: During initial load or when the user revisits the app, the frontend checks for a
 *      refreshToken in cookies.
 *    •	Redirect if Signed In: If a refreshToken is found, the user is redirected to the main app.
 */
