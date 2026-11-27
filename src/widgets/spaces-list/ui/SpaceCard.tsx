import { useState } from 'react'
import { Badge, Button } from '@/shared/ui'
import { EquipmentTag } from '@/entities/space'
import type { Space } from '@/entities/space'
export interface SpaceCardProps { space: Space; onBook?: () => void }
export function SpaceCard({ space, onBook }: SpaceCardProps) {
  const [failedPhoto, setFailedPhoto] = useState(false)
  return <article className="rounded-3xl bg-white p-4">
    <div className="relative overflow-hidden rounded-2xl bg-[#e9eaed]">
      <img src={!failedPhoto && space.photoUrl ? space.photoUrl : '/assets/space-placeholder.svg'} alt={space.photoUrl ? space.name : ''} onError={() => setFailedPhoto(true)} className="h-[170px] w-full object-cover" />
      <Badge variant={space.status === 'free' ? 'success' : 'brand'} withDot className="absolute left-3 top-3 text-[14px]">{space.statusLabel}</Badge>
    </div>
    <h3 className="mt-3 text-[22px] font-bold">{space.name}</h3>
    <div className="mt-2 flex flex-wrap gap-2">{space.equipment.map((eq, i) => <EquipmentTag key={eq.icon + ':' + i} icon={eq.icon} label={eq.label} />)}</div>
    <Button fullWidth size="lg" onClick={onBook} className="mt-4">Забронировать</Button>
  </article>
}
