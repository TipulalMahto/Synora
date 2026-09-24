// Central role registry — keeps the login modal, route guards and navbar
// pointed at the same paths/labels instead of duplicating them everywhere.
export const ROLES = [
  { key: 'citizen', icon: '👤', name: 'Citizen' },
  { key: 'government', icon: '🏛️', name: 'Government Admin' },
  { key: 'university', icon: '🎓', name: 'HEI / University' },
  { key: 'industry', icon: '🏭', name: 'Industry / CSR' },
]

export const ROLE_PATH = {
  citizen: '/CitizenPortal',
  government: '/GovtAdmin',
  university: '/University',
  industry: '/Industry',
}

export const ROLE_LABEL = {
  citizen: 'Citizen Portal',
  government: 'Government Dashboard',
  university: 'HEI / University Portal',
  industry: 'Industry & CSR Portal',
}

export function pathForRole(role) {
  return ROLE_PATH[role] || '/'
}
