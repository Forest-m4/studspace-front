import type { ButtonHTMLAttributes, ReactNode } from 'react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'accent' | 'secondary' | 'ghost' | 'outline' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  children: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  children,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors cursor-pointer select-none active:scale-[0.98]'
  
  const sizeStyles = {
    sm: 'h-9 px-3 text-sm rounded-xl',
    md: 'h-12 px-4 text-base rounded-2xl',
    lg: 'h-[52px] px-6 text-base font-semibold rounded-[14px]',
  }[size]

  const variantStyles = {
    primary: 'bg-[#6867e9] hover:bg-[#5b5ae0] text-white',
    accent: 'bg-[#d2f802] hover:bg-[#c2e600] text-[#1f1a3d] font-semibold',
    secondary: 'bg-[#eeedfc] hover:bg-[#e4e2fa] text-[#1f1a3d]',
    ghost: 'bg-transparent hover:bg-black/5 text-[#6867e9]',
    outline: 'bg-transparent border border-[#eeedf3] text-[#1f1a3d]',
    danger: 'bg-transparent hover:bg-red-50 text-red-500',
  }[variant]

  const widthStyle = fullWidth ? 'w-full' : ''

  return (
    <button
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${widthStyle} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  )
}
