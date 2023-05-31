// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Imports
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TablePagination from '@mui/material/TablePagination'
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { toast } from 'react-hot-toast'
import Typography from '@mui/material/Typography'
import { Button, Dialog, DialogActions, DialogTitle, Grid } from '@mui/material'
import { useRouter } from 'next/router'
import { OrderStatus } from 'src/types/api/order'
import orderAPI from 'src/api/order-api'

interface Column {
  id: 'id' | 'customerName' | 'address' | 'totalPrice' | 'status'
  label: string
  minWidth?: number
  align?: 'right'
  format?: (value: number) => string
}

const columns: readonly Column[] = [
  { id: 'id', label: 'Order ID', minWidth: 100 },
  { id: 'customerName', label: 'Customer Name', minWidth: 150 },
  {
    id: 'address',
    label: 'Address',
    minWidth: 250

    // format: (value: number) => value.toLocaleString('en-US')
  },
  {
    id: 'totalPrice',
    label: 'Total Price (VND)',
    minWidth: 70,
    align: 'right',
    format: (value: number) => value.toLocaleString('en-US')
  },
  {
    id: 'status',
    label: 'Status Order',
    minWidth: 50,
    align: 'right'
  }
]

interface DataRow {
  id: string
  customerName: string
  address: string
  totalPrice: number
  status: OrderStatus
}

const TableOrder = () => {
  // ** States
  const [page, setPage] = useState<number>(0)
  const [rows, setRows] = useState<DataRow[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [totalProds, setTotalProds] = useState<number>(0)
  const [open, setOpen] = useState(false)
  const [seletedProd, setSelectedProd] = useState<string>()

  const router = useRouter()

  // const handleClose = () => {
  //   setOpen(false)
  // }

  // const handleClickOpen = (id: string) => () => {
  //   setOpen(true)
  //   setSelectedProd(id)
  // }

  // const handleChangePage = async (event: unknown, newPage: number) => {
  //   setPage(newPage)
  //   await handleGetProdPagination(newPage)
  // }

  const handleGetProdPagination = async () => {
    try {
      setLoading(true)
      const res = await orderAPI.getAllInvoices()
      console.log(res)
      setRows(
        res.map(prod => ({
          id: prod.shortId,
          customerName: prod.userId,
          address: prod.address,
          totalPrice: prod.total,
          status: prod.status
        }))
      )
      setLoading(false)
    } catch (error) {
      console.log('error: ', error)
      setLoading(false)
      toast.error((error as IResponseError).error)
    }
  }

  // const handleDelete = async () => {
  //   try {
  //     if (seletedProd) {
  //       await productAPI.deleteProduct(seletedProd)
  //       setOpen(false)
  //       setTotalProds(totalProds - 1)
  //       setRows(value => value.filter(prod => prod.action !== seletedProd))
  //       toast.success('Xóa thành công')
  //     }
  //   } catch (error) {
  //     toast.error('Xóa thất bại')
  //   }
  // }

  // const handleClickUpdate = (productId: string) => () => {
  //   router.push(`/product/update/${productId}`)
  // }

  useEffect(() => {
    handleGetProdPagination()
  }, [])

  return (
    <Grid item xs={12}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label='sticky table'>
          <TableHead>
            <TableRow>
              {columns.map(column => (
                <TableCell key={column.id} align={column.align} sx={{ minWidth: column.minWidth }}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length > 0 &&
              !loading &&
              rows.map(row => {
                return (
                  <TableRow hover role='checkbox' tabIndex={-1} key={row.id}>
                    {columns.map(column => {
                      const value = row[column.id]

                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === 'number' ? column.format(value) : value}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                )
              })}
          </TableBody>
        </Table>
        {rows.length === 0 && !loading && (
          <Typography color='text.secondary' sx={{ textAlign: 'center', mt: 4 }}>
            Không có đơn hàng
          </Typography>
        )}
        {loading && (
          <Typography color='text.secondary' sx={{ textAlign: 'center', mt: 4 }}>
            Đang tải dữ liệu...
          </Typography>
        )}
      </TableContainer>
    </Grid>
  )
}

export default TableOrder
