import React, { ComponentProps, ReactNode } from 'react';

import Navbar from './Navbar';

const NavbarLayout: React.FC<{
  children: ReactNode;
  navbarProps?: ComponentProps<typeof Navbar>;
}> = ({ children, navbarProps = {} }) => (
  <>
    <Navbar {...navbarProps} />
    {children}
  </>
);

export default NavbarLayout;
