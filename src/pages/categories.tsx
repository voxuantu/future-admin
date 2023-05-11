import React, { useEffect, ElementType, useState, ChangeEvent } from 'react'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import { useAppDispatch, useAppSelector } from '../store/hook'
import { selectCategories } from '../redux/reducer/category-slice'
import { createCategory, getCategories } from '../redux/action/category-actions'
import Image from 'next/image'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Button, { ButtonProps } from '@mui/material/Button'
import { Plus, Pencil, TrashCan, Toaster } from 'mdi-material-ui'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import CardContent from '@mui/material/CardContent'
import { FormHelperText, TextField } from '@mui/material'
import { styled } from '@mui/material/styles'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'

const ImgStyled = styled('img')(({ theme }) => ({
  width: 120,
  height: 120,
  marginRight: theme.spacing(6.25),
  borderRadius: theme.shape.borderRadius
}))

const ButtonStyled = styled(Button)<ButtonProps & { component?: ElementType; htmlFor?: string }>(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    textAlign: 'center'
  }
}))

interface FormValue {
  name: string
  image: string
}

export default function Categories() {
  const dispatch = useAppDispatch()
  const categories = useAppSelector(selectCategories)

  const [imgSrc, setImgSrc] = useState<string>('/images/default.png')
  const [imageFile, setImageFile] = useState<File>()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset
  } = useForm<FormValue>({
    defaultValues: {
      name: '',
      image: ''
    }
  })

  const onChangeImage = (file: ChangeEvent) => {
    const reader = new FileReader()
    const { files } = file.target as HTMLInputElement
    if (files && files.length !== 0) {
      reader.onload = () => setImgSrc(reader.result as string)

      reader.readAsDataURL(files[0])

      setImageFile(files[0])
    }
  }

  const handleFetchCategories = () => {
    try {
      dispatch(getCategories()).unwrap()
    } catch (error) {
      console.log('error: ', error)
    }
  }

  const onSubmit = async (value: FormValue) => {
    try {
      setIsSubmitting(true)
      const formData = new FormData()
      formData.append('name', value.name)
      formData.append('file', imageFile as File)

      await dispatch(createCategory(formData)).unwrap()

      reset()
      setImgSrc('/images/default.png')
      toast.success('Create category successfully.')
      setIsSubmitting(false)
    } catch (error) {
      setIsSubmitting(false)
      toast.error((error as IResponseError).error || 'Can not create category.')
    }
  }

  const onEditButonClick = (category: ICategory) => () => {
    setImgSrc(category.image)
    setValue('name', category.name)
    setValue('image', category.image)
  }

  useEffect(() => {
    handleFetchCategories()
  }, [])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title='Categories'
            titleTypographyProps={{ variant: 'h6' }}
            action={
              <Button variant='contained'>
                <Plus sx={{ marginRight: 2 }} /> Add
              </Button>
            }
          />
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label='simple table'>
              <TableHead>
                <TableRow>
                  <TableCell>Image</TableCell>
                  <TableCell align='right'>Name</TableCell>
                  <TableCell align='right'>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categories.length > 0 &&
                  categories.map(row => (
                    <TableRow
                      key={row._id}
                      sx={{
                        '&:last-of-type td, &:last-of-type th': {
                          border: 0
                        }
                      }}
                    >
                      <TableCell component='th' scope='row'>
                        <Image src={row.image} width={150} height={150} />
                      </TableCell>
                      <TableCell align='right'>{row.name}</TableCell>
                      <TableCell align='right'>
                        <Box>
                          <IconButton onClick={onEditButonClick(row)} color='primary' sx={{ marginRight: 2 }}>
                            <Pencil />
                          </IconButton>
                          <IconButton color='error'>
                            <TrashCan />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Add Category' titleTypographyProps={{ variant: 'h6' }} />
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={5}>
                <Grid item xs={12}>
                  <Controller
                    name='name'
                    control={control}
                    rules={{ required: { value: true, message: 'Please fill out name of category' } }}
                    render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
                      <TextField
                        error={invalid}
                        helperText={error?.message}
                        fullWidth
                        label='Name'
                        value={value}
                        onChange={onChange}
                        placeholder='Leonard Carter'
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sx={{ marginTop: 4.8, marginBottom: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <ImgStyled src={imgSrc} alt='Profile Pic' />
                    <Box>
                      <ButtonStyled component='label' variant='contained' htmlFor='account-settings-upload-image'>
                        Upload New Photo
                        <Controller
                          name='image'
                          control={control}
                          rules={{ required: { value: true, message: 'Please chose an image.' } }}
                          render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
                            <>
                              <input
                                hidden
                                type='file'
                                value={value}
                                onChange={e => {
                                  onChange(e)
                                  onChangeImage(e)
                                }}
                                accept='image/png, image/jpeg'
                                id='account-settings-upload-image'
                              />
                            </>
                          )}
                        />
                      </ButtonStyled>
                    </Box>
                  </Box>
                  {errors.image && <FormHelperText error={true}>{errors.image.message}</FormHelperText>}
                </Grid>
                <Grid item xs={12}>
                  <Button disabled={isSubmitting} type='submit' variant='contained' size='large'>
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}
