import clsx from 'clsx';
import React, {useCallback, useEffect, useState} from 'react';
import {Controller, useFormContext} from 'react-hook-form';
import {useDropzone} from 'react-dropzone';
import {PhotoIcon} from '@heroicons/react/24/solid';
import {FilePreview} from './FilePreview';

export default function DropzoneInput({
										  accept,
										  helperText = '',
										  id,
										  label,
										  maxFiles = 1,
										  validation,
										  readOnly
									  }) {
	const {
		control,
		getValues,
		setValue,
		setError,
		clearErrors,
		watch,
		formState: {errors}
	} = useFormContext();
	
	const [files, setFiles] = useState(getValues(id) || []);
	
	const onDrop = useCallback(
		(acceptedFiles, rejectedFiles) => {
			if (rejectedFiles && rejectedFiles.length > 0) {
				setValue(id, files ? [...files] : null);
				setError(id, {
					type: 'manual',
					message: rejectedFiles && rejectedFiles[0].errors[0].message
				});
			} else {
				const acceptedFilesPreview = acceptedFiles.map(file =>
					Object.assign(file, {
						preview: URL.createObjectURL(file)
					})
				);
				
				setFiles(
					files
						? [...files, ...acceptedFilesPreview].slice(0, maxFiles)
						: acceptedFilesPreview
				);
				
				setValue(
					id,
					files
						? [...files, ...acceptedFiles].slice(0, maxFiles)
						: acceptedFiles,
					{
						shouldValidate: true
					}
				);
				
				console.log('onDrop - acceptedFiles: ', files);
				clearErrors(id);
			}
		},
		[clearErrors, files, id, maxFiles, setError, setValue]
	);
	
	useEffect(() => {
		return () => {
			files.forEach(file => URL.revokeObjectURL(file.preview));
			console.log('useEffect :', files);
		};
	}, [files]);
	
	const deleteFile = (e, file) => {
		e.preventDefault();
		const newFiles = [...files];
		
		newFiles.splice(newFiles.indexOf(file), 1);
		
		if (newFiles.length > 0) {
			setFiles(newFiles);
			setValue(id, newFiles, {
				shouldValidate: true,
				shouldDirty: true,
				shouldTouch: true
			});
		} else {
			setFiles([]);
			setValue(id, null, {
				shouldValidate: true,
				shouldDirty: true,
				shouldTouch: true
			});
		}
	};
	
	const {getRootProps, getInputProps} = useDropzone({
		onDrop,
		accept,
		maxFiles,
		maxSize: 2000000
	});
	
	return (
		<div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
			<label htmlFor={id}
				   className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
				{label} </label>
			<div className="mt-2 sm:col-span-2 sm:mt-0">
				{readOnly && !(files?.length > 0) ? (
					<div
						className="py-3 pl-3 pr-4 text-sm border border-gray-300 divide-y divide-gray-300 rounded-md">
						No file uploaded
					</div>
				) : files?.length >= maxFiles ? (
					<ul className="mt-1 border border-gray-300 divide-y divide-gray-300 rounded-md">
						{files.map((file, index) => (
							<FilePreview
								key={index}
								readOnly={readOnly}
								file={file}
								deleteFile={deleteFile}
							/>
						))}
					</ul>
				) : (
					<Controller
						control={control}
						name={id}
						rules={validation}
						render={controllerProps => (
							<>
								<div
									className="flex max-w-xl justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10"
									{...getRootProps()}
									{...controllerProps}>
									
									<div className="sm:grid sm:grid-cols-1 sm:items-start sm:gap-4 sm:py-6">
										
										<div className="text-center">
											<PhotoIcon
												className="mx-auto h-12 w-12 text-gray-300"
												aria-hidden="true"/>
											
											<input {...getInputProps()} />
											<div
												className={clsx(
													'text-center',
													errors[id]
														? 'border-red-500 group-focus:border-red-500'
														: 'group-focus:border-primary-500'
												)}>
												
												<div className="my-5 space-y-2 text-center">
													<p className="relative cursor-pointer  font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2
											         focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">
														Upload a file or drag and drop
													</p>
													<p className="text-xs text-gray-500">{`${maxFiles -
													(files?.length || 0)} file(s) remaining`}</p>
												</div>
											</div>
										</div>
									</div>
								</div>
								
								<div className="mt-1">
									{helperText !== '' && (
										<p className="text-sm text-gray-500">{helperText}</p>
									)}
									{errors[id] && (
										<p className="text-sm text-red-500">{errors[id].message}</p>
									)}
								</div>
								
								{!readOnly && !!files?.length && (
									<ul className="mt-1 border border-gray-300 divide-y divide-gray-300 rounded-md">
										{files.map((file, index) => (
											<FilePreview
												key={index}
												readOnly={readOnly}
												file={file}
												deleteFile={deleteFile}
											/>
										))}
									</ul>
								)}
							</>
						)}
					/>
				)}
			
			</div>
		</div>
	);
}
