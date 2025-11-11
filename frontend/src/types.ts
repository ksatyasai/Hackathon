export type Role = 'Viewer' | 'Contributor' | 'Manager' | 'Admin'

export interface User {
  id: string
  email: string
  roles: Role[]
}

export interface DocumentMeta {
  id: string
  title: string
  type: string
  size: number
  ownerEmail?: string
  createdAt: string
  updatedAt: string
  tags?: string[]
}

export interface DocumentSummary {
  docId: string
  summary: string
  keywords: string[]
}
