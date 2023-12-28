import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox, Box } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
// import Typography from '../../../theme/overrides/Typography';
import { AdminLogin } from '../../../service/user.service';
import Iconify from '../../../components/iconify';


// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();
  // admin@admin.com
  // 123123
  const [email, setemail] = useState('admin@gmail.com');
  const [password, setpassword] = useState('password');
  const [error, seterror] = useState('');

  const [showPassword, setShowPassword] = useState(false);

  const handleClick = async () => {
    const resp = await AdminLogin({ email, password });
    console.log(resp)
    if (resp.success === false) {
      seterror(resp.message);
    } else {
      localStorage.setItem("token", resp.token);
      localStorage.setItem("user", resp.user);
      navigate('/dashboard', { replace: true });
    }
  };

  return (
    <>
      <Stack spacing={3} sx={{ my: 3 }}>
        <TextField name="email" label="Email address" onChange={(e) => setemail(e.target.value)}
          value={email}

        />

        <TextField
          name="password"
          label="Password"
          value={password}
          type={showPassword ? 'text' : 'password'}
          onChange={(e) => setpassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      {/* <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        <Checkbox name="remember" label="Remember me" />
        <Link variant="subtitle2" underline="hover">
          Forgot password?
        </Link>
      </Stack> */}
      <Box
        component="h3" sx={{ color: "red" }}>
        {error}
      </Box>
      {/* <h3 sx ={{color:"red"}} >{error}</h3> */}

      <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleClick}>
        Login
      </LoadingButton>
    </>
  );
}
