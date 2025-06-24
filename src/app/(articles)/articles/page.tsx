'use client'

import { useState, useEffect } from 'react'
import useItemsPerPage from '@/hooks/useItemsPerPage'
import fetchArticles from "../fetchArticles"
import ArticleSection from "../ArticlesSection"
import PaginationControls from "@/components/PaginationControls"
import { Article } from '@/types/articles'

export default function AllArticles({ 
  searchParams 
}: { 
  searchParams: { page?: string } 
}) {
  const itemsPerPage = useItemsPerPage(4) // Значение по умолчанию
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  
  const currentPage = Number(searchParams?.page) || 1

  useEffect(() => {
    fetchArticles()
      .then(setArticles)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div>Загрузка...</div>

  const paginatedArticles = articles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <div>
      <ArticleSection
        title="Все статьи"
        articles={paginatedArticles}
      />
      
      {articles.length > itemsPerPage && (
        <PaginationControls
          totalItems={articles.length}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
        />
      )}
    </div>
  )
}