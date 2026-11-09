import { SpaceCard } from './SpaceCard'
import type { Space } from '@/entities/space'

export interface SpacesListSectionProps {
  spaces: Space[]
  onBook?: (spaceId: Space['id']) => void
}

export function SpacesListSection({ spaces, onBook }: SpacesListSectionProps) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center px-1">
        <h2 className="text-[20px] font-bold text-[#1f1a3d] leading-7 flex-1">Помещения</h2>
      </div>
      {spaces.map((space) => (
        <SpaceCard
          key={space.id}
          space={space}
          onBook={() => onBook?.(space.id)}
        />
      ))}
    </section>
  )
}
