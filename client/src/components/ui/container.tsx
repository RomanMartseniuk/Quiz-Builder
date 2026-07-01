import { cn } from '@/lib/utils'
import React from 'react'

export const Container = ({className='', children}: {className?:string, children: React.ReactNode}) => {
  return (
    <div className={cn('container m-auto', className)}>{children}</div>
  )
}
