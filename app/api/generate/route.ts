import axios from "axios";
import { Groq } from "groq-sdk";

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { resumeText, linkedInUrl } = req.body;
    
    // Validate input - need either resume text or LinkedIn URL
    if (!resumeText && !linkedInUrl) {
      return res.status(400).json({ 
        success: false, 
        message: 'Either resume text or LinkedIn URL is required' 
      });
    }
    
    let profileData;
    
    // Process LinkedIn URL if provided
    if (linkedInUrl && !resumeText) {
      try {
        // Extract LinkedIn profile data using an API
        // Note: This is a placeholder. In production, you would use a proper LinkedIn API
        // or a scraping service with appropriate permissions
        const linkedInData = await fetchLinkedInProfile(linkedInUrl);
        profileData = linkedInData;
      } catch (error) {
        console.error('LinkedIn profile fetch error:', error);
        return res.status(400).json({ 
          success: false, 
          message: 'Could not extract profile from LinkedIn URL' 
        });
      }
    } else {
      // Use the provided resume text
      profileData = { resumeText };
    }
    
    // Generate portfolio using Groq
    const portfolioContent = await generatePortfolioWithAI(profileData);
    
    res.status(200).json({ 
      success: true, 
      code: portfolioContent.html,
      metadata: portfolioContent.metadata
    });
  } catch (error) {
    console.error('Error in generate API:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error generating portfolio',
      error: error instanceof Error ? error.message : String(error)
    });
  }
}

// Function to extract profile data from LinkedIn URL
async function fetchLinkedInProfile(linkedInUrl: string) {
  // In a production environment, you would use a proper LinkedIn API client
  // This is a simplified placeholder
  
  try {
    // This is where you would integrate with a LinkedIn API or service
    // For demo purposes, we'll return placeholder data
    return {
      name: "LinkedIn User",
      title: "Professional from LinkedIn",
      about: "This profile was extracted from LinkedIn",
      experience: [
        { 
          title: "Senior Developer",
          company: "Tech Company",
          duration: "2020-Present",
          description: "Led development of key projects"
        }
      ],
      education: [
        {
          institution: "University",
          degree: "Computer Science",
          years: "2014-2018"
        }
      ],
      skills: ["JavaScript", "React", "Node.js"]
    };
  } catch (error) {
    console.error("LinkedIn fetch error:", error);
    throw new Error("Failed to fetch LinkedIn profile");
  }
}

// Function to generate portfolio HTML using Groq
async function generatePortfolioWithAI(profileData: any) {
  try {
    const prompt = createAIPrompt(profileData);
    
    const completion = await groq.chat.completions.create({
      model: "llama3-70b-8192",  // Using Llama 3 70B model from Groq
      messages: [
        {
          role: "system",
          content: "You are a professional web developer specializing in creating portfolio websites. Create a modern, responsive portfolio website using HTML and Tailwind CSS based on the profile information provided. Include sections for about, experience, skills, projects, and contact."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 4000,
    });
    
    const responseContent = completion.choices[0].message.content;
    
    // Extract HTML from the response
    const htmlMatch = responseContent?.match(/```html([\s\S]*?)```/);
    const extractedHTML = htmlMatch ? htmlMatch[1].trim() : responseContent;
    
    // Extract metadata (name, title, etc.) from the portfolio
    const metadata = extractMetadata(extractedHTML!, profileData);
    
    return {
      html: extractedHTML,
      metadata
    };
  } catch (error) {
    console.error("Groq API error:", error);
    throw new Error("Failed to generate portfolio with AI");
  }
}

// Function to create prompt for AI based on profile data
function createAIPrompt(profileData: any) {
  if (profileData.resumeText) {
    return `
      Create a portfolio website using the following resume information:
      
      ${profileData.resumeText}
      
      The portfolio should include:
      1. A modern, professional design using Tailwind CSS
      2. A hero section with name, title, and brief introduction
      3. About section with professional summary
      4. Experience section listing work history
      5. Skills section highlighting technical abilities
      6. Projects section (inferred from experience)
      7. Contact section
      
      Return ONLY the HTML with embedded Tailwind CSS classes.
    `;
  } else {
    // Create prompt from structured LinkedIn data
    return `
      Create a portfolio website for a professional with the following details:
      
      Name: ${profileData.name}
      Title: ${profileData.title}
      About: ${profileData.about}
      
      Experience:
      ${profileData.experience.map((exp: any) => 
        `- ${exp.title} at ${exp.company} (${exp.duration}): ${exp.description}`
      ).join('\n')}
      
      Education:
      ${profileData.education.map((edu: any) => 
        `- ${edu.degree} from ${edu.institution} (${edu.years})`
      ).join('\n')}
      
      Skills: ${profileData.skills.join(', ')}
      
      The portfolio should include:
      1. A modern, professional design using Tailwind CSS
      2. A hero section with name, title, and brief introduction
      3. About section with professional summary
      4. Experience section listing work history
      5. Skills section highlighting technical abilities
      6. Projects section (inferred from experience)
      7. Contact section
      
      Return ONLY the HTML with embedded Tailwind CSS classes.
    `;
  }
}

// Function to extract metadata from generated HTML
function extractMetadata(html: string, profileData: any) {
  // If we already have structured data, use it
  if (!profileData.resumeText) {
    return {
      name: profileData.name,
      title: profileData.title,
      skills: profileData.skills
    };
  }
  
  // Otherwise, try to extract basic info from the HTML
  let name = "";
  let title = "";
  
  // Simple regex extraction - in production, you might want more robust parsing
  const nameMatch = html.match(/<h1[^>]*>(.*?)<\/h1>/i);
  if (nameMatch) name = nameMatch[1].replace(/<[^>]*>/g, '').trim();
  
  const titleMatch = html.match(/<h2[^>]*>(.*?)<\/h2>/i);
  if (titleMatch) title = titleMatch[1].replace(/<[^>]*>/g, '').trim();
  
  return {
    name,
    title,
    generatedFromResume: true
  };
}