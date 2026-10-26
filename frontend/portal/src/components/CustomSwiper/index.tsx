import React from 'react'
import { Autoplay, Pagination } from 'swiper/modules'
import { Swiper, SwiperProps } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'

const CustomSwiper = ({ children, ...rest }: SwiperProps) => (
  <Swiper modules={[Pagination, Autoplay]} {...rest}>{children}</Swiper>
)

export default CustomSwiper
