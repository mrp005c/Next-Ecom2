import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div className='w-full h-fit min-h-[calc(100vh-120px)] flex-center flex-col gap-3 bg-accent'>
      <h2 className='text-2xl font-bold '>Page Not Found</h2>
      <p>Could not find requested resource</p>
      <Link href="/" className='primary-btn text-background font-bold'>Return Home</Link>
    </div>
  )
}