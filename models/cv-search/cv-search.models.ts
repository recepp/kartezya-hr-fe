export interface SkillNode {
  name: string
  proficiency: string
  years_of_experience: number
}

export interface CompanyNode {
  name: string
  position: string
  is_current: boolean
}

export interface FusedCandidateResponse {
  rank: number
  name: string
  person_id: string
  current_position: string
  seniority: string
  total_experience_years: number
  skills: SkillNode[]
  communities: string[]
  community: string
  companies: CompanyNode[]
  fusion_score: number
  llm_score: number
  vector_score: number
  bm25_score: number
  graph_score: number
  llm_reasoning: string
}

export interface HybridSearchConfig {
  topK: number
  finalTopN: number
  bm25Weight: number
  vectorWeight: number
  graphWeight: number
  useCommunityFilter: boolean
  communityThreshold: number
}

export interface HybridSearchResponse {
  candidates: FusedCandidateResponse[]
  total_found: number
  processing_time: string
  method: string
  query: string
  config?: HybridSearchConfig
}

export interface BulkUploadJobResult {
  job_id?: number
  filename: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  error?: string
}

export interface BulkUploadResponse {
  batch_id: string
  results: BulkUploadJobResult[]
  message?: string
}

export interface BatchStatusResponse {
  batch_id: string
  total: number
  completed: number
  failed: number
  pending: number
  results: BulkUploadJobResult[]
}
