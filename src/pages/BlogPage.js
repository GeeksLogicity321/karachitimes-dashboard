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
  Input,
  Chip,
  OutlinedInput
} from '@mui/material';
import CheckIcon from "@mui/icons-material/Check";
import CancelIcon from "@mui/icons-material/Cancel";
import { filter } from 'lodash';
import { Link } from 'react-router-dom';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';

import { createBlog, deleteBlog, updateBlog, getBlog, getBlogById } from '../service/Blog.service';

import Scrollbar from '../components/scrollbar/Scrollbar';

import Iconify from '../components/iconify';
import { getCategory } from '../service/category.service';

const defaultFonts = [
  "Arial",
  "Comic Sans MS",
  "Courier New",
  "Impact",
  "Georgia",
  "Tahoma",
  "Trebuchet MS",
  "Verdana",
];

const sortedFontOptions = [
  "Logical",
  "Salesforce Sans",
  "Garamond",
  "Sans-Serif",
  "Serif",
  "Times New Roman",
  "Helvetica",
  ...defaultFonts,
].sort();

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  width: '70%',
  right: 'auto',
  bottom: 'auto',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  overflow: "scroll"
};
const TABLE_HEAD = [
  { id: 'title', label: 'Title', alignRight: false },
  { id: 'featureImg', label: 'image', alignRight: false },
  { id: 'views', label: 'Views', alignRight: false },
  { id: 'commentCount', label: 'Comments', alignRight: false },
  { id: 'categories', label: 'Categories', alignRight: false },
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

    return filter(array, (_user) => _user.title.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}
export default function BlogPage() {
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [selected, setSelected] = useState([]);
  const [filterName, setFilterName] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [id, setid] = useState('');
  const [order, setOrder] = useState('asc');
  const [update, setupdate] = useState(true)
  const [orderBy, setOrderBy] = useState('service');
  // const handleOpen = () => setOpen(true);
  const [category, setcategory] = useState([])
  const [data, setdata] = useState([])
  const [payload, setpayload] = useState('')
  const [categorypayload, setcategorypayload] = useState([])
  const [values, setValues] = useState([]);
  const [text, setText] = useState({
    ctype: "text",
    content: "",
  });
  const [hashtags, sethashtags] = useState([])
  const [image, setimage] = useState(null
  )
  const [total, settotal] = useState(0)

  const [oldimage, setoldimage] = useState(
    ''

  )

  const handleKeyUp = (e) => {
    console.log(e.keyCode);
    if (e.keyCode === 32) {
      setValues((oldState) => [...oldState, e.target.value]);
      sethashtags("");
    }
  };
  const handleDelete = (item, index) => {
    const arr = [...values]
    arr.splice(index, 1)
    setValues(arr)
  }
  const handleOpen2Menu = async () => {
    const updateddata = (await getBlogById(id)).cleanBlogData
    console.log(updateddata)
    setpayload(updateddata.title)
    setoldimage(updateddata.featureImg)
    setText({
      ctype: updateddata.data[0].ctype,
      content: updateddata.data[0].content
    })
    console.log(updateddata.hashtags.map((i) => { return i.name }))
    setValues(updateddata.hashtags.map((i) => { return i.name }))


    setcategorypayload(updateddata.categories.map((i) => { return i.name }))

    setOpen2(true)
    setupdate(true)
  }
  const handleAddService = () => {
    setOpen2(true)
    setupdate(false)
  }

  const getdata = async () => {
    const data = await getBlog(page, rowsPerPage);
    settotal(data.total)
    setdata(data.data);
    const categorydata = await getCategory()
    console.log(categorydata)
    setcategory(categorydata.allCategory)

  };
  useEffect(() => {
    getdata();
  }, [page]);
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
    setPage(0)

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

  const handleOpenMenu = async (event) => {
    if (event.currentTarget.value === "new") {
      setupdate(false)
    } else {

      setid(event.currentTarget.value);

    }
    console.log(event.currentTarget)
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


  const addBlog = async () => {
    const formData = new FormData();
    formData.append("titles", payload);
    category.filter((item) => {
      return categorypayload.includes(item.name)
    }).map((i, ind) => {
      formData.append(`categories[${ind}]`, i._id);
      return i

    })

    if (imagePayload) {
      formData.append("featureImg", imagePayload);
    }

    formData.append("data", JSON.stringify([text]));

    formData.append("hashtags", `${values.join(",")}`);

    await createBlog(id, formData);
    getdata();
    handleCloseMenu()
  }

  const handleCloseMenu = () => {
    setid('');
    setpayload('')
    setimage(null)
    setcategorypayload([])
    setText(
      {
        ctype: "text",
        content: "",
      }
    )
    setValues([])
    setoldimage(null)
    setOpen(false);
    setOpen2(false);
  };
  return (
    <>
      <Container>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Blogs
        </Typography>
        <Container>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h4" gutterBottom>
              Blogs
            </Typography>

            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={
              handleAddService
            } value="new">
              Add Blog
            </Button>
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
                    from="blog"

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
                                {row.title}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell component="th" scope="row" padding="none">
                            <Stack direction="row" alignItems="center" spacing={2}>

                              <Box
                                sx={{ width: 150, height: 150 }}
                                component="img"
                                alt={row.title}
                                src={row.featureImg}
                              />

                            </Stack>
                          </TableCell>
                          <TableCell component="th" scope="row" padding="none">
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Typography variant="subtitle2" noWrap>
                                {row.views ? row.views : 0}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell component="th" scope="row" padding="none">

                            <Typography variant="subtitle2" noWrap>
                              {
                                row.commentCount !== 0 ? (

                                  <Link to={`/dashboard/comment/${row._id}`}>
                                    {row.commentCount}
                                  </Link>
                                ) : (
                                  0
                                )
                              }
                            </Typography>

                          </TableCell>

                          <TableCell component="th" scope="row" padding="none">

                            <Typography variant="subtitle2" noWrap>
                              {row.categories.map((item) => { return item.name }).join(",")}
                            </Typography>

                          </TableCell>



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
              count={
                parseInt(total / rowsPerPage, 10) * rowsPerPage < total ? (parseInt(total / rowsPerPage, 10) + 1) : parseInt(total / rowsPerPage, 10)
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
            <Stack direction="row" alignItems="center" justifyContent="space-around" mb={5} className="mb">

              <TextField name="title" label="Title" onChange={(e) => setpayload(e.target.value)} value={payload} />{' '}


            </Stack>
            <Stack direction="row" alignItems="center" justifyContent="space-around" mb={5} className="mb">
              {values.map((item, index) => (
                <Chip size="small" onDelete={() => handleDelete(item, index)} label={item} />
              ))}
              <Input
                value={hashtags}
                onChange={(e) => sethashtags(e.target.value)}
                onKeyDown={handleKeyUp}
              />
            </Stack>

            <Stack direction="row" alignItems="center" justifyContent="space-around" mb={5} className="mb">


              <SunEditor lang="en" name="my-editor"

                setContents={text.content}
                onChange={(e) =>
                  setText({
                    ...text,
                    content: e,
                  })
                }
                setOptions={{
                  buttonList: [
                    ["undo", "redo"],
                    ["font", "fontSize"],
                    // ['paragraphStyle', 'blockquote'],
                    [
                      "bold",
                      "underline",
                      "italic",
                      "strike",
                      "subscript",
                      "superscript",
                    ],
                    ["fontColor", "hiliteColor"],
                    ["align", "list", "lineHeight"],
                    ["outdent", "indent"],

                    ["table", "horizontalRule", "link", "image", "video"],
                    // ['math'] //You must add the 'katex' library at options to use the 'math' plugin.
                    // ['imageGallery'], // You must add the "imageGalleryUrl".
                    // ["fullScreen", "showBlocks", "codeView"],
                    ["preview", "print"],
                    ["removeFormat"],

                    // ['save', 'template'],
                    // '/', Line break
                  ], // Or Array of button list, eg. [['font', 'align'], ['image']]
                  defaultTag: "div",

                  showPathLabel: false,
                  font: sortedFontOptions,
                }} />
            </Stack>


            <Stack direction="row" alignItems="center" justifyContent="space-around" mb={5} className="mb">

              <Select
                multiple
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={categorypayload}
                onChange={(e) =>
                  setcategorypayload(e.target.value)
                }
                label="Category"
                name="Category"
                input={<OutlinedInput label="Multiple Select" />}
                renderValue={(selected) => (
                  <Stack gap={1} direction="row" flexWrap="wrap">
                    {selected.map((value) => (
                      <Chip
                        key={value}
                        label={value}
                        onDelete={() =>
                          setcategorypayload(
                            categorypayload.filter((item) => item !== value)
                          )
                        }
                        deleteIcon={
                          <CancelIcon
                            onMouseDown={(event) => event.stopPropagation()}
                          />
                        }
                      />
                    ))}
                  </Stack>
                )}
              >

                {
                  category?.map((item) => {
                    return <MenuItem key={`${item._id}`} value={`${item.name}`}
                      sx={{ justifyContent: "space-between" }}
                    >{item.name}
                      {categorypayload.includes(item.name) ? <CheckIcon color="info" /> : null}
                    </MenuItem>
                  })
                }


              </Select>

            </Stack>
            <Stack direction="row" alignItems="center" justifyContent="space-around" mb={5} className="mb">
              {oldimage && !image && <img alt={payload} src={oldimage} className="blogimg" />}
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


            <Stack direction="row" alignItems="center" justifyContent="space-around" mb={5} className="mb">
              <Button onClick={addBlog}>{update ? "Update" : "Add"}</Button>
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
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} onClick={() => handledeleteBlog()} />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}
