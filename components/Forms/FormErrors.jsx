export const FormErrors = ({errors}) => {
	
	return (
		<div style={{color: 'red', marginTop: '1em'}}>
			{Array.isArray(errors.services) ? (
				errors.services.map((serviceError, index) => {
					if (!serviceError) return null;
					
					const fieldErrors = Object.keys(serviceError).map(field => (
						<div key={field}>
							<strong>{`Service ${index + 1}: `}</strong> {serviceError[field].message}
						</div>
					));
					
					return (
						<div key={index}>
							{fieldErrors}
						</div>
					);
				})
			) : (
				<p>Each service must have all required fields filled with non-empty values</p>
			)}
		</div>
	);
};
