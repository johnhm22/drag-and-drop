import DropZone from './components/DropZone';

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col p-24'>
      <h1 className='text-cyan-500 text-xl'>Upload files....</h1>
      <DropZone className='mt-10 p-16 ml-56 bg-cyan-100 bg-opacity-40' />
    </main>
  );
}
