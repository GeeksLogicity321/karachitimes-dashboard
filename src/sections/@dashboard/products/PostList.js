import PropTypes from 'prop-types';
// @mui
import { Grid } from '@mui/material';
import ShopPostCard from './PostCard';
// import ShoppostCard from './postCard';

// ----------------------------------------------------------------------

PostList.propTypes = {
  posts: PropTypes.array.isRequired,
  handleOpenMenu:PropTypes.func
};

export default function PostList({ jobs, handleOpenMenu,...other  }) {
  return (
    <Grid container spacing={3} {...other}>
      {jobs.map((post) => (
        <Grid key={post._id} item xs={12} sm={6} md={3}>
          
          <ShopPostCard post={post} handleOpenMenu={handleOpenMenu} />
        </Grid>
      ))}
    </Grid>
  );
}
