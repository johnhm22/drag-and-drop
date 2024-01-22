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
    (acceptedFiles: File[], fileRejections: RejectedFile[]) => {
      // Do something with the files
      if (acceptedFiles.length) {
        setFiles((prevFiles) => [
          ...prevFiles,
          ...acceptedFiles.map((file) =>
            Object.assign(file, { preview: URL.createObjectURL(file) })
          ),
        ]);
        console.log('accpetedFiles', acceptedFiles);
      }
      if (fileRejections?.length) {
        setRejectedFiles((prevFiles) => [...prevFiles, ...fileRejections]);
      }
    },
    []
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
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
      className='flex items-start w-2/5 place-content-between mb-5'
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!files.length) return;
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('file', file);
    });
    formData.append('upload_preset', 'dragdrop');

    const URL = process.env.NEXT_PUBLIC_CLOUDINARY_URL!;

    const data = await fetch(URL, {
      method: 'POST',
      body: formData,
    }).then((res) => res.json());

    console.log('data', data);
    setFiles([]);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div {...getRootProps({ className: className })}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag 'n' drop some files here, or click to select files</p>
        )}
      </div>
      {/* <p className='font-light italic'>Test section</p>
      <label htmlFor='fileInput'>Select files</label>
      <input
        type='file'
        id='fileInput'
        multiple
        accept='.jpeg, .png, .jpg'
        onChange={(e) => console.log(e.target.files)}
      ></input>
      <p className='font-light italic'>End of test section</p> */}
      <div className='flex flex-row justify-between my-5'>
        <h3 className='text-cyan-500 text-xl'>Preview</h3>
        <button
          type='submit'
          className='rounded-md font-light bg-slate-100 text-sm px-4 h-1/2 border border-slate-300'
        >
          Upload files to Cloud
        </button>
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
    </form>
  );
};

export default DropZone;
