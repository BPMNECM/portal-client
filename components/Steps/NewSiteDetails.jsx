import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import {useOrderStore} from '@/store/useOrderStore';
import {showNotification} from '@mantine/notifications';
import BtnFunction from '@/components/Forms/Button';
import {IconCheck, IconX} from '@tabler/icons-react';
import {rem} from '@mantine/core';
import Wizard from '@/components/Forms/Wizard';
import {getLogger} from '@/utils/logger/logger';

const logger = getLogger('NewSiteDetails');

const NewSiteDetails = ({secondStep, countries}) => {
	const [countryOptions, setCountryOptions] = useState(countries || []);
	const router = useRouter();
	const xIcon = <IconX style={{width: rem(20), height: rem(20)}}/>;
	
	// Zustand store and state
	const {
		setSelectedCountry,
		setSelectedSite,
		setSiteOptions,
		setChassisOptions,
		setData
	} = useOrderStore();
	
	const [country, setCountry] = useState(secondStep.country || '');
	const [siteCode, setSiteCode] = useState(secondStep.site || '');
	const [isLoadingSites, setIsLoadingSites] = useState(false);
	
	useEffect(() => {
		if (secondStep.country) {
			setCountry(secondStep.country);
		}
		if (secondStep.site) {
			setSiteCode(secondStep.site);
		}
	}, [secondStep]);
	
	const handleCountryChange = (selectedCountry) => {
		setCountry(selectedCountry);
		setSelectedCountry(selectedCountry);
		setSiteCode('');
		setSiteOptions([]);
		setChassisOptions([]);
	};
	
	const handleSiteChange = (selectedSite) => {
		setSiteCode(selectedSite);
		setSelectedSite(selectedSite);
	};
	
	const onSubmit = async () => {
		if (!country || !siteCode) {
			showNotification({
				icon: <IconX/>,
				color: 'red',
				title: 'Validation Error',
				message: 'Country and Site are required!',
				position: 'top-center',
				withCloseButton: true
			});
			return;
		}
		
		setData({
			step: 2,
			data: {
				...secondStep,
				country,
				site: siteCode
			}
		});
		
		showNotification({
			icon: <IconCheck/>,
			color: 'blue',
			title: 'Success!',
			message: 'New Site Details saved successfully!',
			position: 'top-center',
			withCloseButton: true
		});
		
		await router.push('/form/review-step');
	};
	
	return (
		<div className="px-24 -mb-8">
			<Wizard activeStep={1}/>
			
			<div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
				<div>
					<h2 className="text-base font-semibold text-gray-700">New Site Details</h2>
					<p className="mt-1 text-sm leading-6 text-gray-600">Provide details for the new site.</p>
				</div>
				<div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
					<div className="px-4 py-6 sm:p-8">
						<label htmlFor="country" className="block text-sm font-medium leading-6 text-gray-900">
							Country
						</label>
						<select
							id="country"
							value={country}
							onChange={(e) => handleCountryChange(e.target.value)}
							className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
						>
							<option value="" disabled>Select Country</option>
							{secondStep.countryOptions.map((option) => (
								<option key={option.id} value={option.value}>
									{option.description}
								</option>
							))}
						</select>
						
						<label htmlFor="site" className="block text-sm font-medium leading-6 text-gray-900 mt-4">
							Site
						</label>
						<select
							id="site"
							value={siteCode}
							onChange={(e) => handleSiteChange(e.target.value)}
							className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
						>
							<option value="" disabled>Select Site</option>
							{secondStep.siteOptions.map((option) => (
								<option key={option.id} value={option.value}>
									{option.code}
								</option>
							))}
						</select>
					</div>
				</div>
			</div>
			
			<div className="flex items-center justify-between border-t border-gray-900/10 px-4 py-12 sm:px-2">
				<button type="button" className="text-sm font-semibold leading-6 text-gray-900">
					Back
				</button>
				<BtnFunction type="button" onClick={onSubmit}>
					Next
				</BtnFunction>
			</div>
		</div>
	);
};

export default NewSiteDetails;
