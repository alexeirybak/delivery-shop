'use client'

import { useState, useEffect } from 'react'

export default function useItemsPerPage(defaultValue = 4) {
  const [itemsPerPage, setItemsPerPage] = useState(defaultValue)

  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(window.innerWidth < 768 ? 2 : 4)
    }
    
    handleResize() // Инициализация
    window.addEventListener('resize', handleResize)
    
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return itemsPerPage
}