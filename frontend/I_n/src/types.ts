export interface Sound {
  _id?: string
  title: string
  description: string
  url: string
  category: string
  tags: string[]
  createdAt?: string
}

export interface Service {
  _id?: string
  name: string
  description: string
  category: string
  price: number
  active: boolean
  createdAt?: string
}

export interface Paginated<T> {
  items: T[]
  total: number
  limit: number
}
