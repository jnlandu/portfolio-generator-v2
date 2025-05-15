import { NextRequest, NextResponse } from "next/server";
import { Groq } from "groq-sdk";

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, currentCode } = body;
    
    if (!message || !currentCode) {
      return NextResponse.json({ 
        success: false, 
        message: 'Both message and currentCode are required' 
      }, { status: 400 });
    }
    
    // Call the AI to update the portfolio based on the user's request
    const result = await updatePortfolioWithAI(message, currentCode);
    
    return NextResponse.json({ 
      success: true, 
      code: result.updatedCode,
      message: result.aiMessage
    });
  } catch (error) {
    console.error('Error in update API:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Error updating portfolio',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

// Function to update portfolio HTML using Groq
async function updatePortfolioWithAI(userMessage: string, currentCode: string) {
  try {
    // Create a prompt that explains what we want the AI to do
    const prompt = `
      I have a portfolio website with the following HTML/Tailwind CSS code:

      \`\`\`html
      ${currentCode}
      \`\`\`

      The user has requested the following change:
      "${userMessage}"

      Please update the HTML/CSS code to implement this request. 
      
      Important guidelines:
      1. Only make changes that align with the user's request
      2. Maintain the existing structure and styling patterns
      3. Do not remove any critical elements or content
      4. Return ONLY the modified HTML without any explanations
      5. Ensure the modified code is complete and valid HTML
      6. Preserve all Tailwind CSS classes or enhance them as needed
      7. Keep all JavaScript functionality intact

      Return only the updated HTML code.
    `;

    // Call the Groq API
    const completion = await groq.chat.completions.create({
      model: "llama3-70b-8192",
      messages: [
        {
          role: "system",
          content: "You are an expert web developer specializing in HTML, CSS, and Tailwind CSS. Your task is to update portfolio website code based on user requests."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3, // Lower temperature for more deterministic output
      max_tokens: 4000,
    });

    // Extract the response content
    const responseContent = completion.choices[0].message.content;
    
    // Extract HTML from the response - the AI might wrap the code in markdown code blocks
    let updatedCode = responseContent || "";
    
    // Extract code from markdown code blocks if present
    const htmlMatch = updatedCode.match(/```(?:html)?([\s\S]*?)```/);
    if (htmlMatch && htmlMatch[1]) {
      updatedCode = htmlMatch[1].trim();
    }
    
    // Generate a friendly message about the changes
    const changeDescription = generateChangeDescription(userMessage);
    
    return {
      updatedCode,
      aiMessage: changeDescription
    };
  } catch (error) {
    console.error("Groq API error:", error);
    throw new Error("Failed to update portfolio with AI");
  }
}

// Function to generate a friendly message describing the changes made
function generateChangeDescription(userMessage: string): string {
  // Real implementation would analyze the request and generate a specific message
  // For now, we'll create a template-based response
  
  const templates = [
    `I've updated your portfolio based on your request to "${userMessage}". The changes have been applied while maintaining the overall design.`,
    `Your portfolio has been modified to ${userMessage.toLowerCase()}. Take a look at the preview to see how it looks!`,
    `I've made the requested changes to ${userMessage.toLowerCase()}. The updated design should reflect what you asked for.`,
    `Your portfolio has been updated! I've implemented your request to "${userMessage}" while preserving your existing content and style.`
  ];
  
  // Select a random template
  const randomIndex = Math.floor(Math.random() * templates.length);
  return templates[randomIndex];
}