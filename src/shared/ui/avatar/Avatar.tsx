import type { HTMLAttributes } from 'react'

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  name: string
  size?: 'sm' | 'md' | 'lg'
}

export function Avatar({ name, size = 'md', className = '', ...props }: AvatarProps) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('') || '?'

  const sizeStyles = {
    sm: 'size-9 text-sm',
    md: 'size-12 text-lg',
    lg: 'size-16 text-xl',
  }[size]

  return (
    <div
      className={`inline-flex items-center justify-center rounded-full bg-[#a9a7ef] text-[#1f1a3d] font-semibold select-none ${sizeStyles} ${className}`.trim()}
      {...props}
    >
      {initials}
    </div>
  )
}
