import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Card,
  Box,  
  Table,
  Stack,
  Paper,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Button,
  TextField,
  Modal,
  IconButton,
  TableContainer,
  TablePagination,
  Popover,
  MenuItem,
  Select,
  InputLabel,
} from '@mui/material';
import { filter } from 'lodash';
import { useParams } from 'react-router-dom';

import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';

import {createBlog,deleteBlog,updateBlog, getBlog } from '../service/Blog.service';

import Scrollbar from '../components/scrollbar/Scrollbar';

import Iconify from '../components/iconify';
import { getCategory } from '../service/category.service';
import { commentofblog } from '../service/commentservice';

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
const TABLE_HEAD = [
  { id: 'comment', label: 'Comment', alignRight: false },
  { id: 'like', label: 'Likes', alignRight: false },
  { id: 'userId.name', label: 'User', alignRight: false },
  { id: 'userId.profile_image', label: 'User Image', alignRight: false },
//   { id: 'categories', label: 'Categories', alignRight: false },
  { id: '_id' },
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {

  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {

    return filter(array, (_user) => _user.comment.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}
export default function CommentPage() {
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [selected, setSelected] = useState([]);
  const [filterName, setFilterName] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [id, setid] = useState('');
  const [order, setOrder] = useState('asc');
  const [update, setupdate] = useState(true)
  const [orderBy, setOrderBy] = useState('service');
  // const handleOpen = () => setOpen(true);
  const [category,setcategory] = useState([])
  const [data, setdata] = useState([])
  const [payload, setpayload] = useState('')
  const [categorypayload, setcategorypayload] = useState('Category')


  const [image, setimage] = useState(null
  )
  const [oldimage, setoldimage] = useState(
    ''

  )

  const handleOpen2Menu = () => {
    console.log(id)
    const filterd = data.filter((i)=>{return i._id===id})
    setpayload(filterd[0].title)
    setcategorypayload(filterd[0].categories[0].name)
    setimage(filterd[0].featureImg)

    
    setOpen2(true) 
  setupdate(true)}
  const handleAddService = () => {
    setOpen2(true)
    setupdate(false)
  }
const [total,settotal] = useEffect(0)
  const {id} = useParams()
  const getdata = async () => {
    settotal(data.total)
    const data = await commentofblog(id,page,rowsPerPage);

    setdata(data.data);
    
    const categorydata  = await getCategory()
    console.log(categorydata)
    setcategory(categorydata.allCategory)

  };
  useEffect(() => {
    getdata();
  }, []);
  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }

    setSelected(newSelected);
  };
  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };



  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - total) : 0;

  const filteredUsers = applySortFilter(data, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;



  const handledeleteBlog = async () => {
    
    if (id !== "") {
      await deleteBlog(id);

    } else {
      selected.map(async (i) => {

        await deleteBlog(i);
      })

    }
    setPage(1)

    handleCloseMenu()
    getdata();
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const [imagePayload, setimagePayload] = useState(null)
  const handleUploadClick = (e) => {
    setimagePayload(e.target.files[0])
    const reader = new FileReader();

    reader.onload = () => {
      setimage(reader.result);
    };

    reader.readAsDataURL(e.target.files[0]);

  }
  
  const handleOpenMenu = (event) => {
    if (event.currentTarget.value === "new") {
      setupdate(false)
    } else {

    //   setid(event.currentTarget.value);
      setpayload((data.filter((e) => e._id === event.currentTarget.value))[0].service)
      setoldimage((data.filter((e) => e._id === event.currentTarget.value))[0].image)
    }
    setOpen(event.currentTarget);
  };
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = data.map((n) => n._id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const updateService = async () => {
    // const formData = new FormData();
    // formData.append("service", payload);
    // formData.append("file", imagePayload);


    await updateBlog(id, { service: payload });
    setPage(1)
    getdata();
    handleCloseMenu()
  }
  const addService = async () => {    
    const formData = new FormData();
    formData.append("titles", payload);
    formData.append("categories", categorypayload);
    formData.append("featureImg", imagePayload);
    await createBlog(formData);
    getdata();
    handleCloseMenu()   
  }

  const handleCloseMenu = () => {
    // setid('');
    setpayload('')
    setimage(null)
    setoldimage(null)
    setOpen(false);
    setOpen2(false);
  };
  return (
    <>
      <Container>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Comments
        </Typography>
        <Container>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h4" gutterBottom>
              Comments
            </Typography>

            {/* <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={
              handleAddService
            } value="new">
              Add Blog
            </Button> */}
          </Stack>

          <Card>
            <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} handledeleteUser={handledeleteBlog} />

            <Scrollbar>
              <TableContainer sx={{ minWidth: 800 }}>
                <Table>
                  <UserListHead

                    headLabel={TABLE_HEAD}
                    rowCount={data.length}
                    numSelected={selected.length}
                    onSelectAllClick={handleSelectAllClick}
                    order={order}
                    orderBy={orderBy}
                    onRequestSort={handleRequestSort}

                  />

                  <TableBody>
                    {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                      // const { _id, name, role, status, company, avatarUrl, isVerified } = row;
                      const selectedUser = selected.indexOf(row._id) !== -1;
                      return (
                        <TableRow hover key={row._id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                          <TableCell padding="checkbox">
                            <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, row._id)} />
                          </TableCell>

                         
                          <TableCell component="th" scope="row" padding="none">
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Typography variant="subtitle2" noWrap>
                                {row.comment}
                              </Typography>
                            </Stack>
                          </TableCell>
                          {/* <TableCell component="th" scope="row" padding="none">
                            <Stack direction="row" alignItems="center" spacing={2}>

                              <Box
                                sx={{ width: 150, height: 150 }}
                                component="img"
                                alt={row.title}
                                src={row.featureImg}
                              />

                            </Stack>
                          </TableCell> */}
                          <TableCell component="th" scope="row" padding="none">
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Typography variant="subtitle2" noWrap>
                                {row.like?row.like.length:0}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell component="th" scope="row" padding="none">
                            
                              <Typography variant="subtitle2" noWrap>
                                {row.userId?row.userId.name:""}
                              </Typography>
                            
                          </TableCell>
<TableCell component="th" scope="row" padding="none">
                            <Stack direction="row" alignItems="center" spacing={2}>

                              <Box
                                sx={{ width: 150, height: 150 }}
                                component="img"
                                alt={row.userId.name}
                                src={row.userId.profile_pic}
                              />

                            </Stack>
                          </TableCell>
                          


                          
                          {/* <TableCell align="left">
                          <Label color={(status === 'banned' && 'error') || 'success'}>{sentenceCase(status)}</Label>
                        </TableCell> */}

                          {/* <TableCell align="right">
                            <IconButton size="large" color="inherit" onClick={handleOpenMenu} value={row?._id}>
                              <Iconify icon={'eva:more-vertical-fill'} />
                            </IconButton>
                          </TableCell> */}
                        </TableRow>
                      );
                    })}
                    {emptyRows > 0 && (
                      <TableRow style={{ height: 53 * emptyRows }}>
                        <TableCell colSpan={6} />
                      </TableRow>
                    )}
                  </TableBody>

                  {isNotFound && (

                    <TableBody>
                      <TableRow>
                        <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                          <Paper
                            sx={{
                              textAlign: 'center',
                            }}
                          >
                            <Typography variant="h6" paragraph>
                              Not found
                            </Typography>

                            <Typography variant="body2">
                              No results found for &nbsp;
                              <strong>&quot;{filterName}&quot;</strong>.
                              <br /> Try checking for typos or using complete words.
                            </Typography>
                          </Paper>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  )}
                </Table>
              </TableContainer>
            </Scrollbar>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={
                parseInt(total/rowsPerPage,10)*rowsPerPage <total?parseInt(total/rowsPerPage,10)+1:parseInt(total/rowsPerPage,10)

              }
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Card>
        </Container>
        <Modal
          open={open2}
          onClose={handleCloseMenu}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              {update ? "Update Blog" : "Add Blog"}
            </Typography>
            <Stack direction="row" alignItems="center" justifyContent="space-around" mb={5}>

              <TextField name="title" label="Title" onChange={(e) => setpayload(e.target.value)} value={payload} />{' '}
            </Stack>
            <Stack direction="row" alignItems="center" justifyContent="space-around" mb={5}>
            
            <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          value={categorypayload}
          onChange={(e)=>{
            setcategorypayload(e.target.value)
          }}
          label="Category"
          name="Category"

        >
          <MenuItem value="">Select Category</MenuItem>
          {
          category?.map((item)=>{

          return  <MenuItem value={item._id}>{item.name}</MenuItem>
          })
        }

          
        </Select>
              
            </Stack>
            <Stack direction="row" alignItems="center" justifyContent="space-around" mb={5}>
              {oldimage && !image && <img alt={payload} src={oldimage} className="blogimg"/>}
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
              <Button onClick={update ? updateService : addService}>{update ? "Update" : "Add"}</Button>
            </Stack>
          </Box>
        </Modal>
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
        <MenuItem>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} onClick={handleOpen2Menu} />
          Edit
        </MenuItem>

        <MenuItem sx={{ color: 'error.main' }}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} onClick={handledeleteBlog} />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}
