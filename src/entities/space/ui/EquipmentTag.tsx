import { Monitor, Wifi, PenLine, Users } from 'lucide-react'
import type { SpaceEquipment } from '../model/types'

const iconMap = {
  projector: Monitor,
  wifi: Wifi,
  whiteboard: PenLine,
  table: Users,
}

export function EquipmentTag({ icon, label }: SpaceEquipment) {
  const Icon = iconMap[icon]

  return (
    <div className="inline-flex items-center gap-1.5 bg-[#eeedfc] px-3 py-1.5 rounded-full">
      <Icon size={12} className="text-[#6867e9] shrink-0" strokeWidth={2} />
      <span className="text-[13px] font-medium text-[#1f1a3d]">{label}</span>
    </div>
  )
}
