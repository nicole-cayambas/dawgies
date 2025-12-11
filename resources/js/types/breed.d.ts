export interface Breed {
  name: string
  description?: string
  image?: string
}

export type BreedsPagination = {
  data: Breed[]
  current_page: number
  last_page: number
  total: number
  per_page: number
  from: number | null
  to: number | null
}

export type BreedLikesState = {
    [breedName: string]: { count: number; liked: boolean };
};