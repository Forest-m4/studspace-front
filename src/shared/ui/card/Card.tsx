import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/shared/lib'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn('bg-white rounded-2xl shadow-sm border border-black/[0.03] overflow-hidden', className)}
      {...props}
    >
      {children}
    </div>
  )
}
