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
import CloseIcon from '@mui/icons-material/Close'
import { toast } from 'react-hot-toast'
import Typography from '@mui/material/Typography'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, styled } from '@mui/material'
import { useRouter } from 'next/router'
import orderAPI from 'src/api/order-api'
import moment from 'moment'

interface Column {
  id: 'id' | 'customerName' | 'address' | 'totalPrice' | 'status' | 'orderDate'
  label: string
  minWidth?: number
  align?: 'right'
  format?: (value: number | string) => string
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
    id: 'orderDate',
    label: 'Date Order',
    minWidth: 100
  },
  {
    id: 'totalPrice',
    label: 'Total Price (VND)',
    minWidth: 70,
    align: 'right',
    format: (value: number | string) => value.toLocaleString('en-US')
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
  orderDate: string
  status: string
}
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2)
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(4)
  }
}))

export interface DialogTitleProps {
  id: string
  children?: React.ReactNode
  onClose: () => void
}

function BootstrapDialogTitle(props: DialogTitleProps) {
  const { children, onClose, ...other } = props

  return (
    <DialogTitle sx={{ m: 6, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label='close'
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 0,
            top: 0,
            color: theme => theme.palette.grey[500]
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  )
}
interface props {
  value: string
}

const TableOrder = ({ value }: props) => {
  // ** States
  const [page, setPage] = useState<number>(0)
  const [rows, setRows] = useState<DataRow[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [totalProds, setTotalProds] = useState<number>(0)
  const [open, setOpen] = useState(false)
  const [seletedProd, setSelectedProd] = useState<string>('')

  const router = useRouter()

  const handleClose = () => {
    setOpen(false)
  }
  const handleUpdateStatus = async (status: string) => {
    setOpen(false)
    const res = await orderAPI.updateStatusInvoice(seletedProd, status)
    console.log(res)
    setTimeout(() => router.reload(), 1000)
    toast.success('transfer to delivery success!!')
  }

  const handleClickOpen = (id: string) => () => {
    setOpen(true)

    setSelectedProd(id)
    console.log(id)
  }

  const handleChangePage = async (event: unknown, newPage: number) => {
    setPage(newPage)
    await handleGetProdPagination(newPage)
  }

  const handleGetProdPagination = async (page: number) => {
    try {
      setLoading(true)
      const res = await orderAPI.getAllInvoices(10, page)
      console.log(res)
      setRows(
        res.map(prod => ({
          id: prod.shortId,
          customerName: prod.userId,
          address: prod.address,
          totalPrice: prod.total,
          orderDate: prod.dateCreated,
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

  const handleGetInvoiceFollowDatePagination = async (page: number) => {
    try {
      setLoading(true)
      const res = await orderAPI.getInvoiceFollowDate(10, page)
      console.log(res)
      setRows(
        res.map(prod => ({
          id: prod.shortId,
          customerName: prod.userId,
          address: prod.address,
          totalPrice: prod.total,
          orderDate: prod.dateCreated,
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

  useEffect(() => {
    switch (value) {
      case 'none':
        handleGetProdPagination(0)
        break
      case 'date':
        handleGetInvoiceFollowDatePagination(0)
        console.log('a')
        break
      default:
        handleGetProdPagination(0)
    }
  }, [value])

  return (
    <Grid container>
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
                    <TableRow hover role='checkbox' tabIndex={-1} key={row.id} onClick={() => handleClickOpen(row.id)}>
                      {columns.map(column => {
                        const value = row[column.id]

                        if (column.id === 'status') {
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {column.format && typeof value === 'number' ? column.format(value) : value}
                              <IconButton onClick={handleClickOpen(row.id)} aria-label='edit' color='primary'>
                                <EditIcon />
                              </IconButton>
                            </TableCell>
                          )
                        } else
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
        <TablePagination
          rowsPerPageOptions={[10]}
          component='div'
          count={totalProds}
          rowsPerPage={10}
          page={page}
          onPageChange={handleChangePage}
        />
      </Grid>
      <Grid item xs={12}>
        <BootstrapDialog onClose={handleClose} aria-labelledby='customized-dialog-title' open={open}>
          <BootstrapDialogTitle id='customized-dialog-title' onClose={handleClose}>
            Cập nhật trạng thái đơn hàng!
          </BootstrapDialogTitle>
          <DialogContent>aaaa</DialogContent>
          <DialogActions>
            <Button variant='contained' onClick={() => handleUpdateStatus('delivering')} autoFocus>
              Delivering
            </Button>
            <Button variant='contained' color='error' onClick={() => handleUpdateStatus('completed')}>
              Completed
            </Button>
          </DialogActions>
        </BootstrapDialog>
      </Grid>
    </Grid>
  )
}

export default TableOrder
