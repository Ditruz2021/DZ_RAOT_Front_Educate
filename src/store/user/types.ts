export interface CreateUserPayload {
  firstname: string
  lastname: string
  username: string
  email: string
  isActive: boolean
  roleId: number
}

export interface EditUserPayload extends CreateUserPayload {
  id: number | null
  roleName?: string
}

export type ApiUser = Partial<CreateUserPayload> & {
  id?: number
  userId?: number
  fullName?: string
  name?: string
  role?: string
  roleName?: string
  status?: string
  isActive?: boolean
  currentPlan?: string
  avatar?: string
}

// นำ Type ที่ขาดมารวมไว้ที่นี่
export interface UserProperties {
  id: number
  fullName: string
  company: string
  role: string
  username: string
  country: string
  contact: string
  email: string
  currentPlan: string
  status: string
  avatar: string
}

export interface UserParams {
  q?: string
  options?: any
}