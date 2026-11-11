import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/shared/lib'

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'success' | 'brand' | 'subtle' | 'warning'
  withDot?: boolean
  children: ReactNode
}

const variantMap = {
  success: 'bg-[#2e9e6b] text-white',
  brand: 'bg-[#6867e9] text-white',
  subtle: 'bg-[#eeedfc] text-[#1f1a3d]',
  warning: 'bg-[#fef3c7] text-[#92400e]',
} as const

const dotColorMap = {
  success: 'bg-white',
  brand: 'bg-white',
  subtle: 'bg-[#6867e9]',
  warning: 'bg-[#f59e0b]',
} as const

export function Badge({
  variant = 'subtle',
  withDot = false,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[13px] font-medium',
        variantMap[variant],
        className,
      )}
      {...props}
    >
      {withDot && <span className={cn('size-2 rounded-full shrink-0', dotColorMap[variant])} />}
      <span>{children}</span>
    </div>
  )
}
