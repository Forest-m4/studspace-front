import type { HTMLAttributes } from 'react'
import { cn } from '@/shared/lib'

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  name: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap = {
  sm: 'size-9 text-sm',
  md: 'size-12 text-lg',
  lg: 'size-16 text-xl',
} as const

export function Avatar({ name, size = 'md', className, ...props }: AvatarProps) {
  const initials =
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase() ?? '')
      .join('') || '?'

  return (
    <div
      className={cn(
        'inline-flex items-center justify-center rounded-full bg-[#a9a7ef] text-[#1f1a3d] font-semibold select-none',
        sizeMap[size],
        className,
      )}
      {...props}
    >
      {initials}
    </div>
  )
}
