export interface SpaceEquipment {
  icon: 'projector' | 'wifi' | 'whiteboard' | 'table'
  label: string
}

export interface Space {
  id: string | number
  name: string
  capacity: number
  status: 'free' | 'busy' | 'closed'
  statusLabel: string
  photoUrl?: string
  equipment: SpaceEquipment[]
}
