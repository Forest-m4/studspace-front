export interface SpaceEquipment {
  icon: 'projector' | 'wifi' | 'whiteboard' | 'table'
  label: string
}

export interface Space {
  id: string | number
  name: string
  capacity: number
  status: 'free' | 'busy'
  statusLabel: string
  equipment: SpaceEquipment[]
}
