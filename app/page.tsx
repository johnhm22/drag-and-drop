import DropZone from './components/DropZone';

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col p-24 border border-red-500'>
      <h1 className='text-cyan-500 text-xl ml-10 border border-blue-600'>
        Upload files....
      </h1>
      <DropZone className='mt-10 p-16 border border-green-400 ml-56' />
    </main>
  );
}
