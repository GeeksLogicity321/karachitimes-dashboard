import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';

import { useEffect, useState } from 'react';
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
  Box,
  Switch,
  Modal,
  TextField,
} from '@mui/material';
// components

import { useNavigate } from 'react-router-dom';

import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
// mock
// import USERLIST from '../_mock/user';
import { deleteUser, getUsers, updateUser } from '../service/user.service';


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
const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'email', label: 'Email', alignRight: false },
  { id: 'savedBloged', label: 'Saved Blogs', alignRight: false },
  { id: 'bio', label: 'Bio', alignRight: false },
  { id: 'phone', label: 'Phone', alignRight: false },

  { id: 'profile_pic', label: 'Image', alignRight: false },

  // { id: 'service', label: 'Service', alignRight: false },
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
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}
function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string?.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}




export default function UserPage() {
  const navigate = useNavigate();
  const [id, setid] = useState('');
  const [open, setOpen] = useState(null);
  const [data, setdata] = useState([]);

  const [Userdelete, setdeletedUser] = useState(false);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');
  const [Open2, setOpen2] = useState(false)
  const [orderBy, setOrderBy] = useState('name');
  const [selected, setSelected] = useState([]);

  const [name, setName] = useState("");
  const [email, setemail] = useState("");
  const [bio, setbio] = useState("");
  const [phone, setphone] = useState("");

  const [total,settotal] = useState(0)


  const [filterName, setFilterName] = useState('');
  const [update, setupdate] = useState(false)
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleOpenMenu = (event) => {
    setid(event.currentTarget.value);
    setOpen(event.currentTarget);
  };
  const handledeleteUser = async () => {
    if (id) {
      await deleteUser(id);
    }
    if (selected.length > 0) {
      selected.map(async (it) => {

        await deleteUser(it);
      })
    }

    setSelected([])
    getdata();
  };

  const handleCloseMenu = () => {
    setid('');
    setOpen(null);
    setOpen2(false)
  };
  const userUpdate = async () => {
    await updateUser(id, {  name, email,bio,phone_number:phone })
    handleCloseMenu()
    getdata()
  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = data.map((n) => n._id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };
  const handleOpen2Menu = () => {
    console.log(id)

    const filterd = data.filter((i) => { return i._id === id })
    setName(filterd[0].name)
    setemail(filterd[0].email)
    setbio(filterd[0].bio)
    setphone(filterd[0].phone_number)

    setupdate(true)

    setOpen2(true)

  }
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

  const handleChangePage = (event, newPage) => {
    console.log(newPage)
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - total) : 0;

  const filteredUsers = applySortFilter(data, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;
  // const userdata = useSelector((state) => state.userListState);
  const getdata = async () => {
    const resp = await getUsers(page,rowsPerPage);


    if (resp.success === true) {
      setdata(resp.AllUser)
settotal(resp.total)
      // if (Userdelete) {
      //   setdata(
      //     resp.AllUser.filter((item) => {
      //       return item.isDeleted === true;
      //     }).map((item2)=>{
      //       item2.service=item2.service.map((item3)=>{
      //      return    item3.service
      //       }).join(', ')
      //       return item2
      //     })
      //   );
      // } else {

      //   setdata(
      //     resp.AllUser.filter((item) => {
      //       return item.isDeleted === false;
      //     }).map((item2)=>{
      //       item2.service=item2.service.map((item3)=>{
      //         return item3.service
      //       }).join(', ')
      //       return item2
      //     })
      //   );
      // }
    }
    // console.log("userdata",userdata)
    console.log("data", data)

  };
  useEffect(() => {
    getdata();

  }, [Userdelete,page]);

  return (
    <>
      <Helmet>
        <title> User </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            User
          </Typography>
          {/* <Box component={'div'}>
            <Typography variant="p" gutterBottom>
              Deleted Users
            </Typography>
            <Switch
              checked={Userdelete}
              onChange={() => {
                setdeletedUser(!Userdelete);
              }}
              inputProps={{ 'aria-label': 'controlled' }}
            />
          </Box> */}
          {/* <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
            New User
          </Button> */}
        </Stack>

        <Card>
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} handledeleteUser={handledeleteUser} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                {/* <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={total}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                /> */}
                <TableBody>
                  {filteredUsers.map((row) => {
                    // const { _id, name, role, status, company, avatarUrl, isVerified } = row;
                    const selectedUser = selected.indexOf(row._id) !== -1;

                    return (
                      <TableRow hover key={row._id}  role="checkbox" selected={selectedUser}>
                        
                        <TableCell padding="checkbox">
                          <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, row._id)} />
                        </TableCell>


                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography variant="subtitle2" noWrap>
                              {row.name}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography variant="subtitle2" noWrap>
                              {row.email}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography variant="subtitle2" noWrap>
                              {row.savedBloged ? row.savedBloged.length : 0}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography variant="subtitle2" noWrap>
                              {row.bio ? row.bio : "-"}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography variant="subtitle2" noWrap>
                              {row.phone_number ? row.phone_number : "-"}
                            </Typography>
                          </Stack>
                        </TableCell>


                        <TableCell align="left">{row.savedBloged ? row.savedBloged.length : 0}</TableCell>
                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>

                            <Box
                              sx={{ width: 150, height: 150 }}
                              component="img"
                              alt={row.title}
                              src={row.profile_pic}
                            />
                          </Stack>
                        </TableCell>
                        {/* 

                        <TableCell align="left">{row.isCompleteProfile ? 'Complete' : 'Pending'}</TableCell>

                        <TableCell align="left">{row.service}</TableCell> */}

                        {/* <TableCell align="left">
                          <Label color={(status === 'banned' && 'error') || 'success'}>{sentenceCase(status)}</Label>
                        </TableCell> */}

                        <TableCell align="right">
                          <IconButton size="large" color="inherit" onClick={handleOpenMenu} value={row?._id}>
                            <Iconify icon={'eva:more-vertical-fill'} />
                          </IconButton>
                        </TableCell>
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
            count={total}

            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
        <Modal
          open={Open2}
          onClose={handleCloseMenu}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              {update ? "Update User" : "Add User"}
            </Typography>
            <Stack direction="row" alignItems="center" justifyContent="space-around" mb={5}>

              <TextField name="title" label="Name" onChange={(e) => setName(e.target.value)} value={name} />{' '}
            </Stack>
            <Stack direction="row" alignItems="center" justifyContent="space-around" mb={5}>

              <TextField name="email" label="Email" onChange={(e) => setemail(e.target.value)} value={email} />{' '}
            </Stack>
             <Stack direction="row" alignItems="center" justifyContent="space-around" mb={5}>

              <TextField name="bio" label="Bio" onChange={(e) => setbio(e.target.value)} value={bio} />{' '}
            </Stack>
             <Stack direction="row" alignItems="center" justifyContent="space-around" mb={5}>

              <TextField name="phone" label="Phone" onChange={(e) => setphone(e.target.value)} value={phone} />{' '}
            </Stack>




            <Stack direction="row" alignItems="center" justifyContent="space-around" mb={5}>
              <Button onClick={update ? userUpdate : handleCloseMenu}>{update ? "Update" : "Add"}</Button>
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
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} onClick={handledeleteUser} />
          Delete
        </MenuItem>
      </Popover>




    </>
  );
}
