import { NextRequest, NextResponse } from "next/server";
import { Groq } from "groq-sdk";
import { rateLimit } from "@/lib/rate-limit"; // You'll need to create this

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Configuration
const MAX_RESUME_LENGTH = 10000; // Limit resume text length to prevent abuse
const GENERATION_TIMEOUT = 60000; // 60 seconds

export async function POST(request: NextRequest) {
  // Rate limiting (create this middleware in lib/rate-limit.ts)
  try {
    const { success, limit, remaining } = await rateLimit.check(
      request.ip || "anonymous"
    );

    if (!success) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Rate limit exceeded. Please try again later."
        },
        { 
          status: 429,
          headers: {
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
          }
        }
      );
    }
  } catch (error) {
    console.error("Rate limiting error:", error);
    // Continue if rate limiting fails - don't block users due to internal errors
  }

  try {
    // Parse request body with error handling
    const body = await request.json().catch(() => ({}));
    const { resumeText, linkedInUrl, linkedInData } = body;
    
    // Validate input - need either resume text or LinkedIn URL
    if (!resumeText && !linkedInUrl) {
      return NextResponse.json({ 
        success: false, 
        message: "Either resume text or LinkedIn URL is required" 
      }, { status: 400 });
    }
    
    // Additional validation
    if (resumeText && resumeText.length > MAX_RESUME_LENGTH) {
      return NextResponse.json({ 
        success: false, 
        message: `Resume text exceeds maximum length of ${MAX_RESUME_LENGTH} characters` 
      }, { status: 400 });
    }
    
    if (linkedInUrl && !isValidLinkedInUrl(linkedInUrl)) {
      return NextResponse.json({ 
        success: false, 
        message: "Invalid LinkedIn URL format" 
      }, { status: 400 });
    }
    
    let profileData;
    
    // Process LinkedIn URL if provided
    if ((linkedInUrl || linkedInData) && !resumeText) {
      try {
        profileData = await fetchLinkedInProfile(linkedInUrl);
        
         if (linkedInData) {
          // Use the directly uploaded LinkedIn data
          profileData = linkedInData;
        } else {
          // Use the URL-based approach (with limitations)
          profileData = await fetchLinkedInProfile(linkedInUrl);
        }
        
        if (!profileData) {
          throw new Error("Failed to extract LinkedIn profile data");
        }
      } catch (error) {
        console.error("LinkedIn profile fetch error:", error);
        return NextResponse.json({ 
          success: false, 
          message: "Could not extract profile from LinkedIn URL. Please try pasting your resume text instead.",
          error: error instanceof Error ? error.message : "Unknown error"
        }, { status: 422 });
      }
    } else {
      // Use the provided resume text
      profileData = { resumeText };
    }
    
    // Generate portfolio with timeout
    let portfolioContent;
    try {
      // Create a promise that times out after GENERATION_TIMEOUT
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Portfolio generation timed out")), GENERATION_TIMEOUT);
      });
      
      portfolioContent = await Promise.race([
        generatePortfolioWithAI(profileData),
        timeoutPromise
      ]) as any;
    } catch (error) {
      if (error instanceof Error && error.message.includes("timed out")) {
        return NextResponse.json({ 
          success: false, 
          message: "Portfolio generation timed out. Please try with shorter text or fewer details."
        }, { status: 408 });
      }
      
      throw error; // Re-throw for general error handling
    }
    
    // Return successful response with generated portfolio
    return NextResponse.json({ 
      success: true, 
      code: portfolioContent.html,
      metadata: portfolioContent.metadata
    });
  } catch (error) {
    console.error("Error in generate API:", error);
    
    // Determine if it's a Groq API error
    if (error instanceof Error && error.message.includes("Groq API")) {
      return NextResponse.json({ 
        success: false, 
        message: "Error connecting to AI service. Please try again later.",
        error: error.message
      }, { status: 503 });
    }
    
    // General error response
    return NextResponse.json({ 
      success: false, 
      message: "Error generating portfolio",
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

// Validate LinkedIn URL format
function isValidLinkedInUrl(url: string): boolean {
  try {
    const linkedInUrlPattern = /^https:\/\/(www\.)?linkedin\.com\/in\/[\w\-_.]+\/?$/i;
    return linkedInUrlPattern.test(url);
  } catch {
    return false;
  }
}

// Function to extract profile data from LinkedIn URL
async function fetchLinkedInProfile(linkedInUrl: string) {
  // In production, you should use a proper LinkedIn API client or a service like Proxycurl
  
  try {
    /*
    // PRODUCTION IMPLEMENTATION EXAMPLE with Proxycurl (uncomment and replace with your actual integration)
    const response = await fetch('https://nubela.co/proxycurl/api/v2/linkedin', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.PROXYCURL_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url: linkedInUrl }),
    });
    
    if (!response.ok) {
      throw new Error(`LinkedIn API returned ${response.status}`);
    }
    
    const data = await response.json();
    return transformLinkedInData(data);
    */
    
    // For demo purposes, return placeholder data
    // In production, remove this and use the actual API integration above
    console.log(`DEVELOPMENT MODE: Using placeholder data for LinkedIn URL: ${linkedInUrl}`);
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
    throw new Error(`LinkedIn profile extraction failed: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

// Function to transform LinkedIn API data to our format (for production use)
function transformLinkedInData(apiData: any) {
  try {
    // Map the API response to our internal format
    return {
      name: `${apiData.first_name} ${apiData.last_name}`,
      title: apiData.headline || "",
      about: apiData.summary || "",
      experience: (apiData.experiences || []).map((exp: any) => ({
        title: exp.title || "",
        company: exp.company || "",
        duration: `${exp.starts_at?.year || ""}-${exp.ends_at?.year || "Present"}`,
        description: exp.description || ""
      })),
      education: (apiData.education || []).map((edu: any) => ({
        institution: edu.school || "",
        degree: edu.degree_name || "",
        years: `${edu.starts_at?.year || ""}-${edu.ends_at?.year || ""}`
      })),
      skills: apiData.skills?.map((skill: any) => skill.name) || []
    };
  } catch (error) {
    console.error("Error transforming LinkedIn data:", error);
    throw new Error("Failed to process LinkedIn profile data");
  }
}

// Function to generate portfolio HTML using Groq
async function generatePortfolioWithAI(profileData: any) {
  try {
    const prompt = createAIPrompt(profileData);
    
    const completion = await groq.chat.completions.create({
      model: "meta-llama/llama-4-maverick-17b-128e-instruct",
      messages: [
        {
          role: "system",
          content: "You are a professional web developer specializing in creating portfolio websites. Create a modern, responsive portfolio website using HTML and Tailwind CSS based on the profile information provided. Include sections for about, experience, skills, projects, and contact. Make sure the generated code is complete, valid HTML that can be rendered directly in a browser. Include only the HTML code without any markdown formatting."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 4000,
    });
    
    if (!completion?.choices?.[0]?.message?.content) {
      throw new Error("Groq API returned empty response");
    }
    
    const responseContent = completion.choices[0].message.content;
    
    // Extract HTML from the response
    const htmlMatch = responseContent.match(/```html([\s\S]*?)```/);
    const extractedHTML = htmlMatch ? htmlMatch[1].trim() : responseContent;
    
    // Sanitize and validate HTML (basic check)
    const sanitizedHTML = sanitizeHTML(extractedHTML);
    
    if (!isValidHTML(sanitizedHTML)) {
      console.warn("Generated HTML may be incomplete or invalid");
    }
    
    // Extract metadata from the portfolio
    const metadata = extractMetadata(sanitizedHTML, profileData);
    
    return {
      html: sanitizedHTML,
      metadata
    };
  } catch (error) {
    console.error("Groq API error:", error);
    throw new Error(`Failed to generate portfolio with AI: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

// Basic HTML sanitization
function sanitizeHTML(html: string): string {
  // This is a very basic implementation
  // In production, consider using a proper HTML sanitizer like DOMPurify
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "") // Remove script tags
    .trim();
}

// Basic HTML validation
function isValidHTML(html: string): boolean {
  // Check if the HTML has basic structure
  const hasHtmlTag = /<html/i.test(html);
  const hasBodyTag = /<body/i.test(html);
  const hasClosingTags = /<\/html>/i.test(html) && /<\/body>/i.test(html);
  
  return hasHtmlTag && hasBodyTag && hasClosingTags;
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
      7. Contact section with a form
      8. Navigation menu
      
      Important:
      - Return complete, valid HTML with DOCTYPE, html, head, and body tags
      - Use only Tailwind CSS classes for styling (no custom CSS)
      - Make it responsive for mobile and desktop
      - Use semantic HTML elements
      - Don't include JavaScript functionality for the contact form
      
      Return the complete HTML document (DOCTYPE, html, head, body tags).
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
      7. Contact section with a form
      8. Navigation menu
      
      Important:
      - Return complete, valid HTML with DOCTYPE, html, head, and body tags
      - Use only Tailwind CSS classes for styling (no custom CSS)
      - Make it responsive for mobile and desktop
      - Use semantic HTML elements
      - Don't include JavaScript functionality for the contact form
      
      Return the complete HTML document (DOCTYPE, html, head, body tags).
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
      skills: profileData.skills,
      source: "linkedin"
    };
  }
  
  // Otherwise, try to extract basic info from the HTML
  try {
    let name = "";
    let title = "";
    let skills: string[] = [];
    
    // Extract name (try h1 first, then other heading elements)
    const nameMatch = html.match(/<h1[^>]*>(.*?)<\/h1>/i) || 
                      html.match(/<h2[^>]*>(.*?)<\/h2>/i) ||
                      html.match(/<h3[^>]*>(.*?)<\/h3>/i);
    
    if (nameMatch) {
      name = nameMatch[1].replace(/<[^>]*>/g, '').trim();
    }
    
    // Extract title (look for h2 near the name or elements with specific classes)
    const titleMatch = html.match(/<h2[^>]*>(.*?)<\/h2>/i) ||
                       html.match(/class="[^"]*title[^"]*"[^>]*>(.*?)<\//i) ||
                       html.match(/class="[^"]*profession[^"]*"[^>]*>(.*?)<\//i) ||
                       html.match(/class="[^"]*role[^"]*"[^>]*>(.*?)<\//i);
    
    if (titleMatch && titleMatch[1] !== name) {
      title = titleMatch[1].replace(/<[^>]*>/g, '').trim();
    }
    
    // Extract skills (look for common patterns in skills sections)
    const skillsSection = html.match(/<section[^>]*>(?:.*?)<h[1-3][^>]*>(?:.*?)skills(?:.*?)<\/h[1-3]>(.*?)<\/section>/is);
    
    if (skillsSection) {
      const skillItems = skillsSection[1].match(/<li[^>]*>(.*?)<\/li>/g) ||
                         skillsSection[1].match(/<div[^>]*class="[^"]*skill[^"]*"[^>]*>(.*?)<\/div>/g) ||
                         skillsSection[1].match(/<span[^>]*class="[^"]*skill[^"]*"[^>]*>(.*?)<\/span>/g);
      
      if (skillItems) {
        skills = skillItems.map(item => item.replace(/<[^>]*>/g, '').trim())
                           .filter(Boolean)
                           .slice(0, 10); // Limit to 10 skills
      }
    }
    
    return {
      name: name || "Portfolio Owner",
      title: title || "Professional",
      skills: skills,
      source: "resume",
      generatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error("Error extracting metadata:", error);
    // Fallback to basic metadata if extraction fails
    return {
      name: "Portfolio Owner",
      title: "Professional",
      skills: [],
      source: "resume",
      generatedAt: new Date().toISOString()
    };
  }
}

// For rate limiting, create a file at /lib/rate-limit.ts with implementation
// Example implementation using a simple in-memory store:
/*
import { LRUCache } from 'lru-cache';

const rateLimit = {
  tokenCache: new LRUCache({
    max: 500,
    ttl: 60 * 1000, // 1 minute
  }),
  
  check: async (ip: string) => {
    const limit = 5; // 5 requests per minute
    const current = rateLimit.tokenCache.get(ip) || 0;
    
    if (current >= limit) {
      return { success: false, limit, remaining: 0 };
    }
    
    rateLimit.tokenCache.set(ip, current + 1);
    return { success: true, limit, remaining: limit - current - 1 };
  }
};

export { rateLimit };
*/