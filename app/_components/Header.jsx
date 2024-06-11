"use client"
import React, { useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { SignInButton, UserButton, useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

function Header() {
  const {user, isSignedIn} = useUser();
  const path = usePathname();
  useEffect(() => {
    console.log(path);
  }, [])

  return !path.includes('aiform') && (
    <>
      <div className='p-3 px-5 border-b shadow-sm'>
        <div className='flex justify-between items-center'>
          <Link href={'/'}>
            <Image src={'/logo.svg'} alt="logo" width={180} height={50} className='h-auto w-auto' priority/>
          </Link>
          
          {isSignedIn ? 
            <div className='flex items-center gap-5'>
              <Link href={'/dashboard'}>
                <Button variant='outline'>Dashboard</Button>
              </Link>
              <UserButton />
            </div> :
            <SignInButton>
              <Button>Get started</Button>
            </SignInButton>
          }
        </div>
      </div>
    </>
  )
}

export default Header