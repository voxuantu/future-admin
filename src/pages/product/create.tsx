// ** MUI Imports
import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import Button, { ButtonProps } from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import Grid from '@mui/material/Grid'
import InputAdornment from '@mui/material/InputAdornment'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import { styled } from '@mui/material/styles'

// ** Anothers Imports
import React, { ChangeEvent, ElementType, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

interface FormValue {
    name: string,
    thumbnail: any,
    images: any,
    price: number,
    quantity: number,
    category: IOption[],
    description: string
}

const ButtonStyled = styled(Button)<ButtonProps & { component?: ElementType; htmlFor?: string }>(({ theme }) => ({
    [theme.breakpoints.down('sm')]: {
        width: '100%',
        textAlign: 'center'
    }
}))

const ImgStyled = styled('img')(({ theme }) => ({
    width: 120,
    height: 120,
    borderRadius: theme.shape.borderRadius,
    objectFit: 'cover'
}))

const categories: IOption[] = [
    {
        label: 'loại sản phẩm 1',
        value: '123'
    },
    {
        label: 'loại sản phẩm 2',
        value: '124'
    },
    {
        label: 'loại sản phẩm 3',
        value: '125'
    }
]

export default function CreateProductForm() {
    // ** state
    const [thumbnailFile, setThumbnailFile] = useState<File>()
    const [thumbnail, setThumbnail] = useState<string>('/images/default-img.png')
    const [imgFiles, setImgFiles] = useState<File[]>([])
    const [imgSrc, setImgSrc] = useState<string[]>(['/images/default-img.png'])


    // ** react-hook-form
    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm<FormValue>({
        defaultValues: {
            thumbnail: 'undefined',
            images: '',
            name: '',
            description: '',
        }
    })

    const onChangeThumbnail = (file: ChangeEvent) => {
        const { files } = file.target as HTMLInputElement
        if (files && files.length !== 0) {
            setThumbnail(URL.createObjectURL(files[0]))
            setThumbnailFile(files[0])
        }
    }

    const onChangeImgs = (file: ChangeEvent) => {
        const { files } = file.target as HTMLInputElement
        const rawFiles: File[] = []
        const urlFiles: string[] = []

        if (files && files.length !== 0) {
            for (let i = 0; i < files.length; i++) {
                const file = files[i]
                rawFiles.push(file)
                urlFiles.push(URL.createObjectURL(file))
            }

            setImgFiles(rawFiles)
            setImgSrc(urlFiles)
        }
    }

    const onSubmit = (value: FormValue) => {
        console.log("value: ", value);
    }

    return (
        <Card>
            <CardHeader title='Tạo sản phẩm' titleTypographyProps={{ variant: 'h6' }} />
            <Divider sx={{ margin: 0 }} />
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent>
                    <Grid container spacing={5}>
                        <Grid item xs={12}>
                            <FormLabel style={{ fontWeight: 500 }} error={errors.thumbnail?.message ? true : false}>
                                Ảnh đại diện cho sản phẩm
                            </FormLabel>
                            <Box sx={{ display: 'flex', columnGap: '20px', alignItems: 'center', marginTop: '20px' }}>
                                <ImgStyled src={thumbnail} alt='product picture' />
                                <Box>
                                    <ButtonStyled component='label' variant='contained' htmlFor='thumbnail-upload-image'>
                                        Tải ảnh lên
                                        <Controller
                                            name='thumbnail'
                                            control={control}
                                            rules={{ required: { value: true, message: 'Vui lòng chọn ảnh đại diện cho sản phẩm' } }}
                                            render={({ field: { onChange, value } }) => (
                                                <input
                                                    hidden
                                                    type='file'
                                                    value={value}
                                                    onChange={e => {
                                                        onChange(e)
                                                        onChangeThumbnail(e)
                                                    }}
                                                    accept='image/png, image/jpeg'
                                                    id='thumbnail-upload-image'
                                                />
                                            )}
                                        />
                                    </ButtonStyled>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <FormLabel style={{ fontWeight: 500 }} error={errors.images?.message ? true : false}>
                                Các ảnh khác
                            </FormLabel>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center', marginTop: '20px' }}>
                                {imgSrc.map((img) => <ImgStyled key={img} src={img} alt='product picture' />)}
                                <Box>
                                    <ButtonStyled component='label' variant='contained' htmlFor='another-upload-image'>
                                        Tải ảnh lên
                                        <Controller
                                            name='images'
                                            control={control}
                                            rules={{ required: { value: true, message: 'Vui lòng chọn ảnh' } }}
                                            render={({ field: { onChange, value } }) => (
                                                <input
                                                    type='file'
                                                    multiple
                                                    hidden
                                                    accept='image/png, image/jpeg'
                                                    value={value}
                                                    onChange={e => {
                                                        onChange(e)
                                                        onChangeImgs(e)
                                                    }}
                                                    id='another-upload-image'
                                                />
                                            )}
                                        />
                                    </ButtonStyled>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Controller
                                name={'name'}
                                rules={{
                                    required: { value: true, message: 'Nhập tên sản phẩm' }
                                }}
                                control={control}
                                render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
                                    <TextField
                                        fullWidth
                                        error={invalid}
                                        helperText={error?.message}
                                        label='Tên sản phẩm'
                                        placeholder='sản phẩm A'
                                        value={value}
                                        onChange={onChange}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Controller
                                name={'quantity'}
                                defaultValue={100}
                                rules={{
                                    required: { value: true, message: 'Nhập số lượng sản phẩm' },
                                    min: { value: 1, message: 'Số lượng phải lớn hơn 1' }
                                }}
                                control={control}
                                render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
                                    <TextField
                                        fullWidth
                                        error={invalid}
                                        helperText={error?.message}
                                        label='Số lượng'
                                        value={value}
                                        onChange={onChange}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Controller
                                name={'price'}
                                defaultValue={1000}
                                rules={{
                                    required: { value: true, message: 'Nhập giá tiền sản phẩm' },
                                    min: { value: 1000, message: 'Giá tiền phải lớn hơn 1000 VND' }
                                }}
                                control={control}
                                render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
                                    <TextField
                                        fullWidth
                                        error={invalid}
                                        helperText={error?.message}
                                        label='Giá tiền'
                                        InputProps={{
                                            startAdornment: <InputAdornment position='start'>VND</InputAdornment>
                                        }}
                                        value={value}
                                        onChange={onChange}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Controller
                                name={'category'}
                                rules={{ required: { value: true, message: 'Chọn loại sản phẩm' } }}
                                control={control}
                                render={({ field: { onChange }, fieldState: { error, invalid } }) => (
                                    <Autocomplete
                                        disablePortal
                                        id='category'
                                        isOptionEqualToValue={(option, value) => option.value === value.value}
                                        options={categories}
                                        sx={{ width: '100%' }}
                                        renderInput={params => (
                                            <TextField {...params} error={invalid} helperText={error?.message} label='Sản phẩm' />
                                        )}
                                        onChange={(e, value) => {
                                            onChange(value)

                                            return value
                                        }}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Controller
                                name={'description'}
                                rules={{
                                    required: { value: true, message: 'Nhập mô tả sản phẩm' }
                                }}
                                control={control}
                                render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
                                    <TextField
                                        fullWidth
                                        error={invalid}
                                        helperText={error?.message}
                                        multiline
                                        rows={4}
                                        label='Mô tả'
                                        placeholder='Mô tả sản phẩm A'
                                        value={value}
                                        onChange={onChange}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button size='large' type='submit' sx={{ mr: 2 }} variant='contained'>
                                Lưu
                            </Button>
                        </Grid>
                    </Grid>

                </CardContent>
            </form>
        </Card>
    )
}
