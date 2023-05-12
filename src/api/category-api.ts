import axiosService from './axios-service'

const API = process.env.API_URL

const ENDPOINT = 'categories'
const URL = `${API}/${ENDPOINT}`

const categoryApi = {
  getCategories: async () => {
    const response = await axiosService.get<IResponseSuccess<ICategory[]>>(URL)

    return response.data.data
  },

  create: async (body: FormData) => {
    const response = await axiosService.post<IResponseSuccess<ICategory>>(URL, body)

    return response.data.data
  }
}

export default categoryApi
