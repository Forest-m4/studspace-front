import { Button } from '@/shared/ui'
import { Badge } from '@/shared/ui'
import { EquipmentTag } from '@/entities/space'
import type { Space } from '@/entities/space'

export interface SpaceCardProps {
  space: Space
  onBook?: () => void
}

const SPACE_PLACEHOLDER_CLASS = 'bg-[#efecf7] flex items-center justify-center'

export function SpaceCard({ space, onBook }: SpaceCardProps) {
  const isFree = space.status === 'free'

  return (
    <article className="bg-white rounded-[20px] shadow-[0px_1px_1px_rgba(0,0,0,0.05)] overflow-hidden relative h-[345.5px]">
      <div className="absolute top-4 left-4 right-4 h-[170px] bg-[#efecf7] rounded-2xl overflow-hidden flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 80 60"
          className="w-20 opacity-30"
          aria-hidden="true"
        >
          <path d="M0 50 L80 50 L65 20 L45 40 L30 15 Z" fill="#a9a7ef" />
          <circle cx="20" cy="20" r="8" fill="#a9a7ef" />
        </svg>
        <Badge
          variant={isFree ? 'success' : 'brand'}
          withDot
          className="absolute top-3 left-3 backdrop-blur-sm text-[14px]"
        >
          {space.statusLabel}
        </Badge>
      </div>

      <div className="absolute top-[197px] left-4 right-4">
        <h3 className="text-[22px] font-bold text-[#1f1a3d] leading-[27.5px]">
          {space.name}
        </h3>
      </div>

      <div className="absolute top-[237px] left-4 right-4">
        <div className="flex flex-wrap gap-2">
          {space.equipment.map((eq) => (
            <EquipmentTag key={eq.icon} icon={eq.icon} label={eq.label} />
          ))}
        </div>
      </div>

      <div className="absolute top-[277px] left-4 right-4">
        <Button variant="primary" size="lg" fullWidth onClick={onBook}>
          Забронировать
        </Button>
      </div>
    </article>
  )
}
