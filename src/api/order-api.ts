import axiosService from './axios-service'

const API = process.env.API_URL

const ENDPOINT = 'orders'
const URL = `${API}/${ENDPOINT}`

const orderAPI = {
  getRevenueOfCurrentYear: async () => {
    const response = await axiosService.get<IResponseSuccess<number>>(`${URL}/revenue-current-year`)

    return response.data.data
  }
}

export default orderAPI
