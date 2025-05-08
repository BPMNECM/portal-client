import React, {Fragment} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/router'; // Use `next/router` for pathname
import {Disclosure, Menu, Transition} from '@headlessui/react';
import {Bars3Icon, BellIcon, XMarkIcon} from '@heroicons/react/24/outline';
import {getLogger} from '@/utils/logger/logger';
import {classNames, getInitials} from '@/utils/common-utils';
import {Avatar, Group} from '@mantine/core';

const logger = getLogger('Header');

const Header = ({currentUser}) => {
	const router = useRouter();
	const pathname = router?.pathname;
	logger.info('Header - currentUser: ' + currentUser?.name);
	
	const userNavigation = [
		{label: 'Profile', href: '/misc/change-password', current: pathname === '/misc/change-password'},
		{label: 'Admin Page', href: '/misc/admin-page', current: pathname === '/misc/admin-page'},
		{label: 'Settings', href: '/misc/csv-json', current: pathname === '/misc/csv-json'},
		{label: 'Sign out', href: '/auth/signout', current: pathname === '/auth/signout'}
	], navigation = [
		!currentUser && {label: 'Sign Up', href: '/auth/signup', current: pathname === '/auth/signup'},
		!currentUser && {label: 'Sign In', href: '/auth/signin', current: pathname === '/auth/signin'}
	], links = [
		currentUser && {label: 'Dashboard', href: '/', current: pathname === '/'},
		currentUser && {label: 'Orders', href: '/orders', current: pathname === '/orders'},
		currentUser && {
			label: 'Draft Orders',
			href: '#',
			current: pathname?.startsWith('/products'), // Use `pathname?.startsWith()` to avoid undefined errors
			children: [
				{label: 'Pending Submission', href: '/products', current: pathname === '/products'},
				{
					label: 'In Progress',
					href: '/drafts',
					current: pathname === '/drafts'
				}
			]
		},
		currentUser && {
			label: 'Create Order', href: '/form/first-step', current: pathname === '/form/first-step'
		}
	];
	
	return (
		<Fragment>
			<div className="min-h-full">
				<Disclosure as="nav" className="bg-gray-800">
					{({open}) =>
						<Fragment>
							<div className="mx-auto min-w-full px-4 sm:px-6 lg:px-8">
								<div className="relative flex h-16 items-center justify-between">
									<div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
										<Disclosure.Button
											className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
											<span className="sr-only">Open main menu</span>
											{open ? (
												<XMarkIcon className="block h-6 w-6" aria-hidden="true"/>
											) : (
												<Bars3Icon className="block h-6 w-6" aria-hidden="true"/>
											)}
										</Disclosure.Button>
									</div>
									<div
										className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
										<div className="flex flex-shrink-0 items-center">
											<img
												className="h-8 w-8 mr-3"
												src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
												//src="https://img-c.udemycdn.com/organization/W_70/298318_9eb0.png"
												alt="Company Limited"
											/>
											<Link href="/">
												<div className="block h-8 w-auto lg:hidden text-white">GMN Order Portal
												</div>
											</Link>
											<Link href="/">
												<div className="hidden h-8 w-auto lg:block text-white">GMN Order Portal
												</div>
											</Link>
										</div>
										{currentUser ?
											<div className="hidden md:block">
												<div className="ml-10 flex items-baseline space-x-4">
													{links.map((item) => (
														item && (
															item.children ? (
																<Menu as="div" key={item.label} className="relative">
																	<Menu.Button className={classNames(
																		item.current
																			? 'bg-gray-900 text-white'
																			: 'text-gray-300 hover:bg-gray-700 hover:text-white',
																		'rounded-md px-3 py-2 text-sm font-medium'
																	)}>
																		{item.label}
																	</Menu.Button>
																	<Transition
																		as={Fragment}
																		enter="transition ease-out duration-100"
																		enterFrom="transform opacity-0 scale-95"
																		enterTo="transform opacity-100 scale-100"
																		leave="transition ease-in duration-75"
																		leaveFrom="transform opacity-100 scale-100"
																		leaveTo="transform opacity-0 scale-95"
																	>
																		<Menu.Items
																			className="absolute left-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
																			{item.children.map((child) => (
																				<Menu.Item key={child.label}>
																					{({active}) => (
																						<Link href={child.href}>
																							<div className={classNames(
																								active ? 'bg-gray-100' : '',
																								'block px-4 py-2 text-sm text-gray-700'
																							)}>
																								{child.label}
																							</div>
																						</Link>
																					)}
																				</Menu.Item>
																			))}
																		</Menu.Items>
																	</Transition>
																</Menu>
															) : (
																<Link key={item.label} href={item.href}>
																	<div
																		className={classNames(
																			item.current
																				? 'bg-gray-900 text-white'
																				: 'text-gray-300 hover:bg-gray-700 hover:text-white',
																			'rounded-md px-3 py-2 text-sm font-medium'
																		)}
																		aria-current={item.current ? 'page' : undefined}
																	>
																		{item.label}
																	</div>
																</Link>
															)
														)
													))}
												</div>
											</div> : <div/>
										}
									</div>
									{currentUser ?
										<div
											className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
											<div
												className="flex justify-end p-4 text-gray-300 hover:bg-gray-700 hover:text-white text-sm">
												Welcome Back, {currentUser?.name}
											</div>
											<button
												type="button"
												className="rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
											>
												<span className="sr-only">View notifications</span>
												<BellIcon className="h-6 w-6" aria-hidden="true"/>
											</button>
											
											<Menu as="div" className="relative ml-3">
												<div>
													<Menu.Button
														className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
														<span className="sr-only">Open user menu</span>
														<Group>
															<Avatar
																radius="xl"
																color="initials"
																size="md"
															>
																{getInitials(currentUser?.name)}
															</Avatar>
														</Group>
													</Menu.Button>
												</div>
												<Transition
													as={Fragment}
													enter="transition ease-out duration-100"
													enterFrom="transform opacity-0 scale-95"
													enterTo="transform opacity-100 scale-100"
													leave="transition ease-in duration-75"
													leaveFrom="transform opacity-100 scale-100"
													leaveTo="transform opacity-0 scale-95"
												>
													<Menu.Items
														className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
														{userNavigation.map((item) => (
															<Menu.Item key={item.label}>
																{({active}) => (
																	<Link
																		href={item.href}
																		className={classNames(
																			active ? 'bg-gray-100' : '',
																			'block px-4 py-2 text-sm text-gray-700'
																		)}
																	>
																		{item.label}
																	</Link>
																)}
															</Menu.Item>
														))}
													</Menu.Items>
												</Transition>
											</Menu>
										</div>
										:
										<div className="hidden md:block">
											<div className="ml-10 flex items-baseline space-x-4">
												{navigation.map((item) => (
													item && (
														<Link key={item.label} href={item.href}>
															<div
																className={classNames(
																	item.current
																		? 'bg-gray-900 text-white'
																		: 'text-gray-300 hover:bg-gray-700 hover:text-white',
																	'rounded-md px-3 py-2 text-sm font-medium'
																)}
																aria-current={item.current ? 'page' : undefined}
															>
																{item.label}
															</div>
														</Link>
													)
												))}
											</div>
										</div>
									}
								</div>
							</div>
						</Fragment>
					}
				</Disclosure>
			</div>
		</Fragment>
	);
};

export default Header;
