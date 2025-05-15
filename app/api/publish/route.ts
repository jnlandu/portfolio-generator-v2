import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { title, slug, visibility, domain, code, metadata } = body;
    
    // Validate required fields
    if (!title || !slug || !visibility || !code) {
      return NextResponse.json({ 
        success: false, 
        message: "Missing required fields" 
      }, { status: 400 });
    }
    
    // Validate slug format
    const slugRegex = /^[a-z0-9-]+$/;
    if (!slugRegex.test(slug)) {
      return NextResponse.json({ 
        success: false, 
        message: "Slug can only contain lowercase letters, numbers, and hyphens" 
      }, { status: 400 });
    }
    
    // Check if slug is available
    // In a real implementation, you would check against your database
    const slugAvailable = await checkSlugAvailability(slug);
    if (!slugAvailable) {
      return NextResponse.json({ 
        success: false, 
        message: "This URL is already taken. Please choose another one." 
      }, { status: 409 });
    }
    
    // Check domain if provided
    if (domain) {
      const domainValid = validateDomain(domain);
      if (!domainValid) {
        return NextResponse.json({ 
          success: false, 
          message: "Invalid domain format" 
        }, { status: 400 });
      }
    }
    
    // In a real implementation, you would:
    // 1. Save the portfolio to your database
    // 2. Deploy the static HTML to your hosting provider
    // 3. Set up custom domain if provided
    
    // Simulate portfolio publishing
    const portfolioUrl = `https://portfolioai.com/${slug}`;
    
    // Return success response
    return NextResponse.json({
      success: true,
      message: "Portfolio successfully published",
      data: {
        title,
        url: portfolioUrl,
        customDomain: domain ? `https://${domain}` : null,
        visibility,
        publishedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error("Error publishing portfolio:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Failed to publish portfolio" 
    }, { status: 500 });
  }
}

// Helper function to check if a slug is available
async function checkSlugAvailability(slug: string): Promise<boolean> {
  // In a real implementation, you would check against your database
  // For demo purposes, simulate availability check
  return true;
}

// Helper function to validate domain format
function validateDomain(domain: string): boolean {
  const domainRegex = /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
  return domainRegex.test(domain);
}