import { IOrderRes } from 'src/types/api/order'
import axiosService from './axios-service'

const API = '/api/v1'

const ENDPOINT = 'orders'
const URL = `${API}/${ENDPOINT}`

const orderAPI = {
  getAllInvoices: async () => {
    const response = await axiosService.get<IResponseSuccess<IOrderRes[]>>(URL)

    return response.data.data
  }
}
export default orderAPI
