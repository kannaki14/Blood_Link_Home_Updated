import { createBrowserRouter } from 'react-router';
import Splash from './pages/Splash';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import DonateBlood from './pages/DonateBlood';
import FindBlood from './pages/FindBlood';
import DonorDetails from './pages/DonorDetails';
import ForgotPassword from './pages/ForgotPassword';
import RegistrationSuccess from './pages/RegistrationSuccess';
import DonationSuccess from './pages/DonationSuccess';

export const router = createBrowserRouter([
  { path: '/', Component: Splash },
  { path: '/login', Component: Login },
  { path: '/register', Component: Register },
  { path: '/home', Component: Home },
  { path: '/donate', Component: DonateBlood },
  { path: '/find', Component: FindBlood },
  { path: '/donor/:id', Component: DonorDetails },
  { path: '/forgot-password', Component: ForgotPassword },
  { path: '/registration-success', Component: RegistrationSuccess },
  { path: '/donation-success', Component: DonationSuccess },
  { path: '/donation-request-success', Component: DonationSuccess },
]);
