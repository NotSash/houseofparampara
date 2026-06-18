import Image from 'next/image'
import { cn } from '@/lib/utils'

export function SectionEyebrow({
  children,
  className,
  align = 'center',
}: {
  children: string
  className?: string
  align?: 'center' | 'left'
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-3',
        align === 'center' ? 'justify-center' : 'justify-start',
        className,
      )}
    >
      <span className="flourish-line" aria-hidden="true" />
      <span className="eyebrow whitespace-nowrap">{children}</span>
      <span className="flourish-line" aria-hidden="true" />
    </div>
  )
}

export function WaxSeal({
  size = 64,
  className,
}: {
  size?: number
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full bg-ivory shadow-warm-sm ring-1 ring-border',
        className,
      )}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <Image
        src="/images/emblem.png"
        alt=""
        width={size}
        height={size}
        className="h-full w-full rounded-full object-cover"
      />
    </span>
  )
}

export function SealDivider() {
  return (
    <div className="flex items-center justify-center gap-4 py-2">
      <span className="h-px w-16 bg-gradient-to-r from-transparent to-border sm:w-24" />
      <WaxSeal size={52} />
      <span className="h-px w-16 bg-gradient-to-l from-transparent to-border sm:w-24" />
    </div>
  )
}
