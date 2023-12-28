import PropTypes from 'prop-types';
// @mui
import { Box, Card, Link, Typography, Stack, IconButton, Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';
// utils
import { fCurrency } from '../../../utils/formatNumber';
// components
import Label from '../../../components/label';
import { ColorPreview } from '../../../components/color-utils';

import Iconify from '../../../components/iconify/Iconify';

// ----------------------------------------------------------------------

const StyledpostImg = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
});

// ----------------------------------------------------------------------

ShopPostCard.propTypes = {
  post: PropTypes.object,
};
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
export default function ShopPostCard({ post, handleOpenMenu }) {
  const { name, description, img, _id, lowerPrice, higherPrice } = post;

  return (
    <Card>
      <Box sx={{ pt: '100%', position: 'relative' }}>
        {/* {status && (
          <Label
            variant="filled"
            color={(status === 'sale' && 'error') || 'info'}
            sx={{
              zIndex: 9,
              top: 16,
              right: 16,
              position: 'absolute',
              textTransform: 'uppercase',
            }}
          >
            {status}
          </Label>
        )} */}

        {
          img.split(".")[img.split(".").length - 1] !== "mp4" ? (

            <StyledpostImg alt={_id} src={img} />
          ) : (

            <video controls className='videoplayer'>
              <source src={img} type="video/mp4" />
              <track kind="captions" label="English" default />


            </video>
          )
        }
      </Box>

      <Stack spacing={2} sx={{ p: 3 }}>
        
          <Typography variant="h4" noWrap sx={{ fontSize: 18, fontStyle: "bold" }}>

            {name}
            <IconButton size="large" color="inherit" onClick={handleOpenMenu} value={post?._id}>
            <Iconify icon={'eva:more-vertical-fill'} />
          </IconButton>
          </Typography>


        

        <Typography variant="p" noWrap sx={{ fontSize: 18, fontStyle: "bold" }}>
          

          {description.substring(0,20)}
          

        </Typography>
        

          



      
      </Stack>
    </Card>
  );
}
