import { generateGeminiResponse } from '@/utils/generateGeminiResponse'
import React from 'react'

const page = async () => {
    let response = "Loading..."
    response = await generateGeminiResponse("Explain the theory of relativity in simple terms.")
    return (
        <div>
            <h1>Gemini Response</h1>
            <p>{response}</p>
        </div>
    )
}

export default page
