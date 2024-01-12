'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';

type File = {
  path: string;
  preview: any;
  lastModified: string;
  lastModifiedDate: Date;
  name: string;
  size: number;
  type: string;
};

type RejectedFile = {
  file: File;
  errors: {
    message: string;
    code: string;
  }[];
};

const DropZone = ({ className }: { className: string }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [rejectedFiles, setRejectedFiles] = useState<RejectedFile[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: File[]) => {
      // Do something with the files
      if (acceptedFiles.length) {
        setFiles((prevFiles) => [
          ...prevFiles,
          ...acceptedFiles.map((file) =>
            Object.assign(file, { preview: URL.createObjectURL(file) })
          ),
        ]);

        //   setShareData((prevState) => [...(prevState || []), shareToAdd]);

        // setFiles( (prevFiles) => [...prevFiles, ...acceptedFiles.map((file) => ...file, { preview: URL.createObjectURL(file) } )  ] );
      }
      if (fileRejections?.length) {
        setRejectedFiles((prevFiles) => [...prevFiles, ...fileRejections]);
      }
    },
    []
  );

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    // acceptedFiles,
    // fileRejections,
  } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpeg'],
      'image/png': ['.png'],
    },
    maxSize: 1024 * 1000 * 5,
  });

  const acceptedFiles = files.map((file) => (
    <li
      key={file.name}
      className='flex items-start w-2/5 place-content-between'
    >
      <div className='flex flex-col gap-2 text-sm'>
        {file.name} - {file.size} bytes
        <Image
          src={file.preview}
          width={50}
          height={50}
          alt='file image'
          onLoad={() => {
            URL.revokeObjectURL(file.preview);
          }}
        />
      </div>
      <button
        className='rounded-md bg-red-500 text-white text-sm px-1 mr-10'
        onClick={() => removeFile(file.name)}
      >
        Remove
      </button>
    </li>
  ));

  const rejectedFileItems = rejectedFiles.map(({ file, errors }) => (
    <li key={file.path} className='text-sm mt-5 w-2/5 flex flex-col'>
      <div className='flex justify-between'>
        {file.path} - {file.size} bytes
        <button
          className='rounded-md bg-red-500 text-white text-sm px-1 mr-10'
          onClick={() => removeRejectedFile(file.name)}
        >
          Remove
        </button>
      </div>
      <ul>
        <div className='font-semibold'>Errors:</div>
        {errors.map((error) => (
          <li key={error.code}>{error.message}</li>
        ))}
      </ul>
    </li>
  ));

  const removeFile = (fileName: string) => {
    setFiles(files.filter((file) => fileName !== file.name));
  };

  const removeRejectedFile = (fileName: string) => {
    setRejectedFiles(
      rejectedFiles.filter((file) => fileName !== file.file.name)
    );
  };

  return (
    <>
      <div {...getRootProps({ className: className })}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag 'n' drop some files here, or click to select files</p>
        )}
      </div>
      <div>
        <div className='flex flex-col'>
          <h2 className='font-semibold'>Accepted files:</h2>
          <ul>{acceptedFiles}</ul>
        </div>
        <div className='mt-10'>
          <h2 className='font-semibold'>Rejected files:</h2>
          <ul>{rejectedFileItems}</ul>
        </div>
      </div>
    </>
  );
};

export default DropZone;
