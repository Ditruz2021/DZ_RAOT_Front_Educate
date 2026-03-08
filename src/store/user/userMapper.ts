import type { ApiUser, EditUserPayload, UserProperties } from './types'

export const roleIdToNameMap: Record<number, string> = { 1: 'admin', 2: 'user' }
export const roleNameToIdMap: Record<string, number> = { admin: 1, user: 2 }

const splitName = (fullName: string) => {
  const [firstname = '', ...rest] = fullName.trim().split(' ')
  return { firstname, lastname: rest.join(' ').trim() }
}

export const mapApiUserToEditUserPayload = (user: ApiUser, fallbackId?: number): EditUserPayload => {
  const fullName = user.name || user.fullName || ''
  const nameParts = splitName(fullName)
  const normalizedRoleName = (user.roleName || user.role || '').toLowerCase()
  const roleId = user.roleId || roleNameToIdMap[normalizedRoleName] || 5

  return {
    id: user.userId || user.id || fallbackId || null,
    firstname: user.firstname || nameParts.firstname,
    lastname: user.lastname || nameParts.lastname,
    username: user.username || '',
    email: user.email || '',
    isActive: typeof user.isActive === 'boolean' ? user.isActive : user.status === 'active',
    roleId,
    roleName: user.roleName || roleIdToNameMap[roleId],
  }
}

export const mapApiUserToUserProperties = (user: ApiUser, index: number): UserProperties => {
  const firstName = user.firstname?.trim() || ''
  const lastName = user.lastname?.trim() || ''
  const fullName = user.name || user.fullName || `${firstName} ${lastName}`.trim() || user.username || 'Unknown'
  const role = (user.role || user.roleName || '').toLowerCase() || roleIdToNameMap[user.roleId || 0] || 'subscriber'
  const status = user.status || (typeof user.isActive === 'boolean' ? (user.isActive ? 'active' : 'inactive') : 'inactive')

  return {
    id: user.userId || user.id || index + 1,
    fullName,
    company: '-',
    role,
    username: user.username || '-',
    country: '-',
    contact: '-',
    email: user.email || '-',
    currentPlan: user.currentPlan || '-',
    status,
    avatar: user.avatar || '',
  }
}