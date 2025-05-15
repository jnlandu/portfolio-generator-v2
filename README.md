# PortfolioAI

<img alt="MIT License" src="https://img.shields.io/badge/License-MIT-blue.svg">

A professional portfolio generator that uses AI to create personalized portfolio websites from your resume or LinkedIn profile. Built with Next.js, Tailwind CSS, and powered by advanced AI.

![PortfolioAI Screenshot](path/to/screenshot.png)

## Features

- **Multiple Input Methods**: Generate from resume text, LinkedIn profile, or manual entry
- **AI-Powered Generation**: Create professional portfolios with just a few clicks
- **Resume Parsing**: Upload PDFs or text files directly
- **LinkedIn Integration**: Use LinkedIn data export or profile URL
- **Customization**: Refine your portfolio with an AI chat assistant
- **Responsive Design**: All generated portfolios are mobile-friendly
- **Publishing**: Share your portfolio with a custom URL

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Groq API key for AI generation
- (Optional) LinkedIn data export for best results

### Installation

1. Clone the repository
2. Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```
3. Create a `.env.local` file with your API keys:
    ```
    GROQ_API_KEY=your_api_key_here
    NEXT_PUBLIC_APP_URL=http://localhost:3000
    ```
4. Start the development server:
    ```bash
    npm run dev
    # or
    yarn dev
    ```
5. Open http://localhost:3000 in your browser

## Usage

### Resume Upload

1. Upload your resume as a PDF or text file, or paste the content directly
2. Click "Generate Portfolio"
3. Review and customize your portfolio

### LinkedIn Data

#### Option 1: LinkedIn Profile URL (Limited)

1. Enter your LinkedIn profile URL (e.g., https://linkedin.com/in/yourprofile)
2. Click "Generate Portfolio"
3. Note that this method has limitations due to LinkedIn restrictions

#### Option 2: LinkedIn Data Export (Recommended)

1. Download your LinkedIn data:
    - Go to LinkedIn → Settings & Privacy → Data Privacy
    - Under "Get a copy of your data" select "Want something in particular?" and check "Profile"
    - Download the data when available
2. Upload the CSV or JSON file from the export
3. Click "Generate Portfolio"

### Manual Entry

1. Enter your personal and professional details manually
2. Fill in at least your name, title, and one job experience
3. Click "Generate Portfolio"

## Customizing Your Portfolio

Use the AI chat assistant to refine your portfolio with commands like:

- "Make the design more colorful"
- "Use a dark theme"
- "Add a contact form section"
- "Make the colors more vibrant"

## Publishing Your Portfolio

1. Click the "Publish" button in the portfolio preview
2. Enter a title and customize your URL slug
3. Choose visibility options (public, unlisted, private)
4. Optionally add a custom domain
5. Click "Publish Portfolio"

## Configuration

The application uses the following environment variables:

- `GROQ_API_KEY`: Your API key for Groq
- `NEXT_PUBLIC_APP_URL`: (Optional) Your application URL for production

## Troubleshooting

### Model Availability

If you encounter model availability errors, the application will automatically try alternative models. If issues persist, verify your Groq API key has access to one of these models:

- llama-3-8b-instruct
- mixtral-8x7b-32768
- llama-2-70b-chat
- gemma-7b-it

### LinkedIn Integration

Due to LinkedIn's restrictions, direct profile scraping has limitations:

- For best results, use the LinkedIn data export option
- The profile URL method uses a placeholder approach with limited information

## Technical Details

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **AI Generation**: Groq API with various LLM models
- **PDF Parsing**: React-PDF with pdf.js
- **Rate Limiting**: Simple in-memory implementation 

- **Deployment**: Vercel (recommended) or any Node.js hosting provider
- **Database**: Supabase for user data and portfolio storage
- **Authentication**: Supabase Auth for user management
- **Storage**: Supabase Storage for file uploads
- **Icons**: Lucide Icons for UI elements
- **UI Components**: Headless UI for accessible components
- **Custom Code Injection**: Add custom CSS and JavaScript for advanced customization
- **Dynamic Content**: Add interactive elements like 3D models and before/after sliders
- **White-labeling**: Remove branding and customize the experience for clients
- **Analytics**: Track visits and engagement on your portfolio


- **Publishing Controls**: Publish, unpublish, or make your portfolio private
- **Custom Domain**: Use your own domain for the portfolio
- **Custom URL Slug**: Customize the URL slug for your portfolio
- **Customizable Themes**: Choose from multiple themes or create your own
- **Custom Fonts**: Use custom fonts for your portfolio
- **Custom Colors**: Customize the colors of your portfolio
- **Custom CSS**: Add custom CSS for advanced styling
- **Custom JavaScript**: Add custom JavaScript for advanced functionality
- **Custom HTML**: Add custom HTML for advanced customization


## Contributing
We welcome contributions! Please fork the repository and submit a pull request with your changes.
## Roadmap
- [ ] Add more AI models for generation
- [ ] Improve PDF parsing for better resume extraction
- [ ] Add more customization options for portfolios
- [ ] Implement user authentication and authorization
- [ ] Add analytics for portfolio visits and engagement
- [ ] Improve error handling and user feedback
- [ ] Add more themes and templates for portfolios
- [ ] Improve performance and loading times
- [ ] Add more documentation and examples
- [ ] Add more tests and improve test coverage
- [ ] Add more deployment options and configurations
- [ ] Add more integrations with other services and APIs
- [ ] Add more features and enhancements based on user feedback
- [ ] Improve the user interface and user experience
## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Groq for the AI generation API
- Tailwind CSS for the styling framework
- React PDF for PDF parsing
- Headless UI for accessible UI components
- Lucide Icons for the beautiful icons

---
Built with ❤️ by Jeremie.