import clsx from 'clsx';
import UnstyledLink from './UnstyledLink';

export default function CustomLink({children, className = '', ...rest}) {
	return (
		<UnstyledLink
			{...rest}
			className={clsx(
				'inline-flex items-center animated-underline text-indigo-600',
				className
			)}
		>
			{children}
		</UnstyledLink>
	);
}
