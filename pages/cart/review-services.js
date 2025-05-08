import ReviewServices from '@/components/Cart/ReviewServices';
import {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import {getLogger} from '@/utils/logger/logger';

const logger = getLogger('ReviewStep');

const ReviewServicesPage = () => {
	const router = useRouter();
	const [service, setService] = useState(null);
	
	useEffect(() => {
		logger.info(`useEffect [ReviewServicesPage]: `);
		
		if (router.query.service) {
			setService(JSON.parse(router.query.service));
		}
	}, [router.query.service]);
	
	return <ReviewServices service={service}/>;
};

export default ReviewServicesPage;
