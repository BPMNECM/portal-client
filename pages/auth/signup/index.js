import React, { useState } from 'react';
import Router from 'next/router';
import Link from 'next/link';
import { Center, Flex, Notification, rem, Text, Title } from '@mantine/core';
import useRequest from '@/hooks/use-request';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { IconX } from '@tabler/icons-react';

const SignUpIndex = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    const { doRequest, errors } = useRequest({
        url: '/api/users/signup',
        method: 'post',
        body: {
            name: `${firstName} ${lastName}`,
            email,
            password,
            confirmPassword
        },
        onSuccess: () => Router.push('/')
    });
    
    const onSubmit = async (event) => {
        event.preventDefault();
        await doRequest();
    };
    
    return (
      <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8 mb-12">
          <Title ta="center">Welcome!</Title>
          <Text ta="center">Create your account to continue</Text>
          <div className="mt-20 sm:mx-auto sm:w-full sm:max-w-[500px]">
              <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
                  <form className="space-y-6" action="#" method="POST" onSubmit={onSubmit}>
                      <Flex direction={{ base: 'column', sm: 'row' }} gap={{ base: 'md' }}>
                          <div className="form-group">
                              <label htmlFor="firstName" className="block text-sm font-medium leading-6 text-gray-900">
                                  First name
                                  <span className="asterisk"> *</span>
                              </label>
                              <div className="mt-2">
                                  <input
                                    id="firstName"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    required
                                    className="block w-[200px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                  />
                              </div>
                          </div>
                          <div className="form-group">
                              <label htmlFor="lastName" className="block text-sm font-medium leading-6 text-gray-900">
                                  Last name
                                  <span className="asterisk"> *</span>
                              </label>
                              <div className="mt-2">
                                  <input
                                    id="lastName"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    required
                                    className="block w-[200px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                  />
                              </div>
                          </div>
                      </Flex>
                      <div className="form-group">
                          <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                              Email address
                              <span className="asterisk"> *</span>
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
                              Password
                              <span className="asterisk"> *</span>
                          </label>
                          <div className="relative">
                              <input
                                id="password"
                                placeholder="Enter your password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              />
                              <button
                                onClick={() => setShowPassword(!showPassword)}
                                type="button"
                                className="absolute top-2 right-2"
                              >
                                  {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                              </button>
                          </div>
                      </div>
                      <div className="form-group">
                          <label htmlFor="confirmPassword"
                                 className="block text-sm font-medium leading-6 text-gray-900">
                              Confirm Password
                              <span className="asterisk"> *</span>
                          </label>
                          <div className="relative">
                              <input
                                id="confirmPassword"
                                placeholder="Confirm your password"
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              />
                              <button
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                type="button"
                                className="absolute top-2 right-2"
                              >
                                  {showConfirmPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                              </button>
                          </div>
                      </div>
                      
                      {/*{errors}*/}
                      
                      {errors && (
                        <Notification icon={<IconX size={rem(20)} />} color="red" title="User Registration Failed">
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
                              Sign Up
                          </button>
                      </div>
                  </form>
                  <Center mt="md">
                      <Text
                        size="sm"
                        component={Link}
                        href="/auth/signin"
                      >
                          Already have an account? Sign in
                      </Text>
                  </Center>
              </div>
          </div>
      </div>
    );
};

export default SignUpIndex;
