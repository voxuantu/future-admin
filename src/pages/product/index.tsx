// ** MUI Imports
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
// ** Anothers Imports
import React from 'react'
import TableBasic from '../../views/tables/TableBasic'
import { useRouter } from 'next/router'

export default function Products() {
    const router = useRouter()
    const handleClickCreateProd = () => {
        router.push('/product/create')
    }

    return (
        <Grid container spacing={6}>
            <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant='h5'>Bảng sản phẩm</Typography>
                    <Button onClick={handleClickCreateProd} variant='contained'>Tạo sản phẩm</Button>
                </Box>
            </Grid>
            <Grid item xs={12}>
                <Card>
                    <TableBasic />
                </Card>
            </Grid>
        </Grid>
    )
}
