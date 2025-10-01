import React from 'react'
import BlogEditor from '../../../components/Write/BlogEditor'
import { fetchAllCategories } from '@/utils/blog-helper'

const WriteBlog = async () => {
    const categories = await fetchAllCategories();
    return (
        <div>
            <BlogEditor categories={categories} />
        </div>
    )
}

export default WriteBlog
