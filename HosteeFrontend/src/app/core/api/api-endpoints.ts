export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    ME: '/auth/me'
  },
  ROOMS: {
    GET_ALL: '/rooms',
    GET_BY_ID: (id: string) => `/rooms/${id}`,
    CREATE: '/rooms',
    UPDATE: (id: string) => `/rooms/${id}`,
    DELETE: (id: string) => `/rooms/${id}`,
    UPDATE_STATUS: (id: string) => `/rooms/${id}/status`
  },
  RESERVATIONS: {
    GET_ALL: '/reservations',
    GET_BY_ID: (id: string) => `/reservations/${id}`,
    CREATE: '/reservations',
    UPDATE: (id: string) => `/reservations/${id}`,
    DELETE: (id: string) => `/reservations/${id}`,
    UPDATE_STATUS: (id: string) => `/reservations/${id}/status`
  },
  GUESTS: {
    GET_ALL: '/guests',
    GET_BY_ID: (id: string) => `/guests/${id}`,
    CREATE: '/guests',
    UPDATE: (id: string) => `/guests/${id}`,
    DELETE: (id: string) => `/guests/${id}`
  },
  HOUSEKEEPING: {
    GET_ALL: '/housekeeping',
    UPDATE_STATUS: (roomId: string) => `/housekeeping/${roomId}/status`,
    ASSIGN_CLEANER: (roomId: string) => `/housekeeping/${roomId}/assign`
  },
  DASHBOARD: {
    METRICS: '/dashboard/metrics',
    OCCUPANCY: '/dashboard/occupancy',
    REVENUE: '/dashboard/revenue'
  },
  REPORTS: {
    REVENUE: '/reports/revenue',
    OCCUPANCY: '/reports/occupancy',
    EXPORTS: '/reports/export'
  }
};
