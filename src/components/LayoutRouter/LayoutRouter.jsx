import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../Header/Header'
import PopularMovies from '../PopularMovies/PupularMovies'
const LayoutRouter = () => {
  return (
    <div>
        <Header />
        <PopularMovies/>
        <Outlet/>
    </div>
  )
}

export default LayoutRouter