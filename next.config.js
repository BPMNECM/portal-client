const nextConfig = {
	output: 'export',
	reactStrictMode: true,
	trailingSlash: true,
	swcMinify: true,
	env: {
		NEXT_PUBLIC_SERVER_PORT: '3000',
		NEXT_PUBLIC_PINO_LOG_LEVEL: 'info',
		
		NEXT_PUBLIC_isLocal: 'false',
		NEXT_PUBLIC_custom_env: 'Production',  // Model or Production
		NEXT_PUBLIC_BASE_URL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
		NEXT_PUBLIC_DNA_HOST: ''
		
		// NEXT_PUBLIC_isLocal: 'true',
		// NEXT_PUBLIC_custom_env: 'local',
		// NEXT_PUBLIC_BASE_URL: 'http://localhost:3000',
		// NEXT_PUBLIC_DNA_HOST: 'http://localhost:4000'
	}
};

module.exports = nextConfig;

// SSR - BASE URL (Inter services communications using k8s ingress):
// 'http://SERVICENAME.NAMESPACE.svc.cluster.local'
// 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local'

// Client-side - BASE URL (Relative '/' path of the domain names):
// 'https://portal.gmn.media.aws.cloud.in.company.com.au'
// 'https://portal.gmn.media-nprd.aws.cloud.in.company.com.au'
// 'https://portal.dev'
