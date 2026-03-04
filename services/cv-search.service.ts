import cvSearchAxiosInstance from '@/helpers/api/cvSearchAxiosInstance'
import { CV_SEARCH_ENDPOINTS } from '@/contants/urls'
import type {
  BulkUploadResponse,
  BatchStatusResponse,
  HybridSearchResponse,
} from '@/models/cv-search/cv-search.models'

class CvSearchService {
  async bulkUpload(files: File[]): Promise<BulkUploadResponse> {
    const formData = new FormData()
    files.forEach((file) => {
      formData.append('files', file)
    })

    const response = await cvSearchAxiosInstance.post<BulkUploadResponse>(
      CV_SEARCH_ENDPOINTS.BULK_UPLOAD,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    )
    return response.data
  }

  async getBatchStatus(batchId: string): Promise<BatchStatusResponse> {
    const response = await cvSearchAxiosInstance.get<BatchStatusResponse>(
      `${CV_SEARCH_ENDPOINTS.BATCH_STATUS}/${batchId}`
    )
    return response.data
  }

  async hybridSearch(query: string): Promise<HybridSearchResponse> {
    const response = await cvSearchAxiosInstance.post<HybridSearchResponse>(
      CV_SEARCH_ENDPOINTS.HYBRID_SEARCH,
      {
        query,
        final_top_n: 20,
      }
    )
    return response.data
  }
}

export const cvSearchService = new CvSearchService()
