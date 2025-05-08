'use client';

import {useState} from 'react';
import {useFormContext} from 'react-hook-form';
import {Text} from '@mantine/core';

const FileUpload = ({label, id, helperText, accept, multiple, required}) => {
	const {
		register,
		formState: {errors}
	} = useFormContext();
	const [fileNames, setFileNames] = useState([]);
	
	const handleFileChange = (e) => {
		const files = Array.from(e.target.files);
		setFileNames(files.map((file) => file.name));
	};
	
	return (
		<div className="space-y-2">
			<label htmlFor={id} className="block text-sm font-medium text-gray-700">
				{label} {required && <span className="text-red-500">*</span>}
			</label>
			
			<div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
				<div className="space-y-1 text-center">
					<svg
						className="mx-auto h-12 w-12 text-gray-400"
						stroke="currentColor"
						fill="none"
						viewBox="0 0 48 48"
						aria-hidden="true"
					>
						<path
							d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
							strokeWidth={2}
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
					<div className="flex text-sm text-gray-600">
						<label
							htmlFor={id}
							className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
						>
							<span>Upload files</span>
							<input
								id={id}
								name={id}
								type="file"
								className="sr-only"
								accept={accept}
								multiple={multiple}
								onChange={handleFileChange}
								{...register(id)}
							/>
						</label>
						<p className="pl-1">or drag and drop</p>
					</div>
					<p className="text-xs text-gray-500">{accept?.split(',').join(', ')}</p>
				</div>
			</div>
			
			{fileNames.length > 0 && (
				<div className="mt-2">
					<Text size="sm" weight={500}>
						Selected files:
					</Text>
					<ul className="list-disc pl-5 mt-1">
						{fileNames.map((name, index) => (
							<li key={index} className="text-sm text-gray-600">
								{name}
							</li>
						))}
					</ul>
				</div>
			)}
			
			{helperText && <p className="mt-2 text-sm text-gray-500">{helperText}</p>}
			
			{errors[id] && <p className="mt-2 text-sm text-red-600">{errors[id].message}</p>}
		</div>
	);
};

export default FileUpload;
