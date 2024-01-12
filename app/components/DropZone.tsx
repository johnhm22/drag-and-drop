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

const DropZone = ({ className }: { className: string }) => {
  const [files, setFiles] = useState<File[]>([]);
  // const [rejectedFiles, setRejectedFiles] = useState<File[]>([]);

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
      // if (fileRejections?.length) {
      //   console.log('fileRejections added');
      //   setRejectedFiles((prevFiles) => [...prevFiles, ...fileRejections]);
      // }
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
  });

  //   const acceptedFileItems = acceptedFiles.map((file) => (
  //     <li key={file.name}>
  //       {file.name} - {file.size} bytes
  //       <Image
  //         src={file.preview}
  //         width={100}
  //         height={100}
  //         alt='file image'
  //         onLoad={() => {
  //           URL.revokeObjectURL(file.preview);
  //         }}
  //       />
  //       <button
  //         className='rounded-md bg-red-500 text-white px-1 mt-2'
  //         onClick={() => removeFile(file.name)}
  //       >
  //         Remove
  //       </button>
  //     </li>
  //   ));

  // const rejectedFileItems = fileRejections.map(({ file, errors }) => (
  //   <li key={file.path}>
  //     {file.path} - {file.size} bytes
  //     <ul>
  //       {errors.map((error) => (
  //         <li key={error.code}>
  //           {error.message}
  //           <button
  //             className='rounded-md bg-red-500 text-white px-1 mt-2'
  //             onClick={() => removeRejectedFile(file.name)}
  //           >
  //             Remove
  //           </button>
  //         </li>
  //       ))}
  //     </ul>
  //   </li>
  // ));

  const removeFile = (fileName: string) => {
    console.log(fileName);
    setFiles(files.filter((file) => fileName !== file.name));
  };

  // const removeRejectedFile = (fileName: string) => {
  //   setRejectedFiles(rejectedFiles.filter((file) => fileName !== file.name));
  // };

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
        <div className='flex flex-col gap-10'>
          <h2>Accepted files:</h2>
          <ul>
            {/* {acceptedFiles.map((file) => ( */}
            {files.map((file) => (
              <li key={file.name}>
                {file.name} - {file.size} bytes
                <Image
                  src={file.preview}
                  width={100}
                  height={100}
                  alt='file image'
                  onLoad={() => {
                    URL.revokeObjectURL(file.preview);
                  }}
                />
                <button
                  className='rounded-md bg-red-500 text-white px-1 mt-2'
                  onClick={() => removeFile(file.name)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
        {/* <div>
          <h2>Rejected files:</h2>
          <ul>{rejectedFileItems}</ul>
        </div> */}
      </div>
    </>
  );
};

export default DropZone;

/* <ul>
        {files.map((file) => (
          <li key={file.name}>
            {file.name}
            <Image
              src={file.preview}
              width={100}
              height={100}
              alt='file image'
              onLoad={() => {
                URL.revokeObjectURL(file.preview);
              }}
            />
            <button
              className='rounded-md bg-red-500 text-white px-1 mt-2'
              onClick={() => removeFile(file.name)}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      */
