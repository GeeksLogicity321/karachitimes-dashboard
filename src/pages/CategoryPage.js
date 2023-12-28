import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
// @mui
import { Container, MenuItem, Popover, 
  Button,
  TextField,
  Modal,Stack, Typography, Box, Switch, Pagination } from '@mui/material';

import { useNavigate } from 'react-router-dom';
import Iconify from '../components/iconify/Iconify';

import { Categoryeadd, Categoryeupdate, Categorydelete, getCategory } from '../service/category.service';
import { PostList, ProductFilterSidebar, ProductSort, ProductCartWidget } from '../sections/@dashboard/products';


// ----------------------------------------------------------------------

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  width: '50%',
  
  right: 'auto',
  bottom: 'auto',
  transform: 'translate(-50%, -50%)',

  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};
export default function CategoryPage() {
  
  const [page, setpage] = useState(1);
  const [id, setid] = useState('');
  const [open, setOpen] = useState(null);
  const [deletedpost, setdeletepost] = useState(false);
  const [open2, setOpen2] = useState(false)
  const [update, setupdate] = useState(false)
  
  const [jobs, setjobs] = useState([]);
  const [payload, setpayload] = useState('')
  const [imagePayload, setimagePayload] = useState(null)
  const [image, setimage] = useState(null
  )
  const [oldimage, setoldimage] = useState('')

  const [description, setdescription] = useState('')
  const [total,settotal] = useState(0)

  const handledeletePost = async () => {
    const deletedata = await Categorydelete(id);
    handleCloseMenu()

    getdata();
  };
 
  const getdata = async () => {
    const resp = await getCategory(page,);
    settotal(resp.total)
    setjobs(resp.allCategory)
    // if (deletedpost) {
    //   setjobs(
    //     resp.data.filter((item) => {
    //       return item.isDeleted === true;
    //     })
    //   );
    // } else {
    //   setjobs(
    //     resp.data.filter((item) => {
    //       return item.isDeleted === false;
    //     })
    //   );
    // }
  };
  useEffect(() => {
    getdata();
  }, [deletedpost,page]);
  const updateCategory = async () => {
    // const formData = new FormData();
    // formData.append("service", payload);
    // formData.append("file", imagePayload);

    const formData = new FormData();
    formData.append("name", payload);
    formData.append("description", description);

    formData.append("attachArtwork", imagePayload);
    await Categoryeupdate(id, formData);
    setpage(1)
    getdata();
    handleCloseMenu()
  }
  const addCategory = async () => {
    const formData = new FormData();
    formData.append("name", payload);
    formData.append("description", description);

    formData.append("attachArtwork", imagePayload);


    await Categoryeadd(formData);
    getdata();

    handleCloseMenu()

  }

  const handleAddService = () => {
    setOpen2(true)
    setupdate(false)
  }

  const handleUploadClick = (e) => {
    setimagePayload(e.target.files[0])
    const reader = new FileReader();

    reader.onload = () => {
      setimage(reader.result);
    };

    reader.readAsDataURL(e.target.files[0]);

  }

  const handleOpenMenu = (event) => {

    setid(event.currentTarget.value);
    setOpen(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setid('');
    setpayload("")
    setdescription("")
    setimage(null)
    setOpen(null);
    setOpen2(null)
  };
  const handleChange = (e) => {
    setpage(e.target.innerText);
  };
  const handleEditCategory =()=>{
    
    const editdata = jobs.filter((item)=>{
      return item._id===id
    })[0]
    
    setpayload(editdata.name)
    setdescription(editdata.description)
    setoldimage(editdata.img)
    setOpen2(true)
    setupdate(true)


  }
  return (
    <>
      <Helmet>
        <title>Category </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" sx={{ mb: 5 }}>
            Category
          </Typography>
          {/* <Box component={'div'}>
            <Typography variant="p" gutterBottom>
              Deleted jobs
            </Typography>
            <Switch
              checked={deletedpost}
              onChange={() => {
                setdeletepost(!deletedpost);
              }}
              inputProps={{ 'aria-label': 'controlled' }}
            />
          </Box> */}
        </Stack>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Category
          </Typography>

          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={
            handleAddService
          } value="new">
            Add Category
          </Button>
        </Stack>


        <PostList jobs={jobs} handleOpenMenu={handleOpenMenu} />
        <Pagination sx={{ float: "right", mt: 1 }} count={total/ 10 === parseInt(total / 10, 10) * 10 ? total/ 10 : (parseInt(total / 10, 10) + 1)} shape="rounded" page={page} onChange={handleChange} />
        {/* <ProductCartWidget /> */}
      </Container>
      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem onClick={handleEditCategory} >
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem sx={{ color: 'error.main' }} onClick={handledeletePost} >
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} onClick={handledeletePost} />
          Delete
        </MenuItem>
      </Popover>
      <Modal
        open={open2}
        onClose={handleCloseMenu}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {update ? "Update Category" : "Add Category"}
          </Typography>
          <Stack direction="row" alignItems="center" justifyContent="space-around" mb={5}>

            <TextField name="title" label="Title" onChange={(e) => setpayload(e.target.value)} value={payload} />{' '}
          </Stack>
          <Stack direction="row" alignItems="center" justifyContent="space-around" mb={5}>

            <TextField name="description" label="Description" onChange={(e) => setdescription(e.target.value)} value={description} />{' '}
          </Stack>
          <Stack direction="row" alignItems="center" justifyContent="space-around" mb={5}>
            {oldimage && !image && <img alt={payload} src={oldimage} />}
            {image && <img alt={payload} src={image} />}

            <Button variant="contained" component="span">

              <input
                accept="image/*"
                id="contained-button-file hidden-file-input"
                multiple
                type="file"
                onChange={handleUploadClick}
              />
            </Button>
          </Stack>


          <Stack direction="row" alignItems="center" justifyContent="space-around" mb={5}>
            <Button onClick={update ? updateCategory : addCategory}>{update ? "Update" : "Add"}</Button>
          </Stack>
        </Box>
      </Modal>
    </>
  );
}
