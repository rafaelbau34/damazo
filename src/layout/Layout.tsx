import Footer from 'app/components/ui/Footer';
import Navbar from 'app/components/ui/Navbar';
import React from 'react'

import {ReactNode} from "react";

interface LayoutProps {
    children: ReactNode;
}
const Layout = ({children}: LayoutProps) => {
  return (
    <>  
    <Navbar />
    <div className='mt-4 mb-4'>{children}</div>
    <Footer/>
    </>
  )
}

export default Layout