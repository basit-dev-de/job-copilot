# Job Copilot

Job Copilot is a powerful job application automation tool that helps streamline your job search process. Built with React, TypeScript, and Vite, it offers a seamless experience for finding, tracking, and applying to jobs that match your skills and preferences.

## Features

- **Smart Job Search**: Aggregates job listings from multiple platforms (LinkedIn, Indeed, Glassdoor)
- **AI-Powered Matching**: Analyzes job descriptions to identify matches with your skills
- **Application Automation**: Auto-fills application forms to save you time
- **Cover Letter Generation**: Creates customized cover letters with AI
- **Application Tracking**: Keeps track of all your job applications in one place
- **Local Storage**: All data is stored locally in your browser for privacy

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/job-copilot.git
cd job-copilot
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Build for production:

```bash
npm run build
```

## Tech Stack

- **Frontend**: React, TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Storage**: Local Storage (via localforage)
- **Automation**: Puppeteer (simulated in this demo)
- **API Integration**: Axios for API requests

## Project Structure

```
src/
├── assets/           # Images, icons, etc.
├── components/       # Reusable UI components
│   ├── common/       # Buttons, inputs, etc.
│   ├── dashboard/    # Dashboard components
│   ├── jobSearch/    # Job search components
│   ├── settings/     # Settings components
│   └── onboarding/   # Onboarding components
├── contexts/         # React contexts
├── services/         # API services
│   ├── linkedinApi.ts
│   ├── indeedScraper.ts
│   ├── aiFilter.ts
│   ├── autoFill.ts
│   └── n8nService.ts
├── hooks/            # Custom React hooks
├── types/            # TypeScript types
├── utils/            # Utility functions
├── pages/            # Application pages
│   ├── Dashboard.tsx
│   ├── JobSearch.tsx
│   ├── ApplicationTracker.tsx
│   ├── Settings.tsx
│   └── Onboarding.tsx
├── App.tsx           # Main application component
├── main.tsx          # Entry point
└── index.css         # Global styles
```

## Usage Notes

### Browser Automation

This demo includes simulated browser automation. In a real implementation, you would need to:

1. Set up Puppeteer or a similar automation library
2. Create a browser extension or local server to handle the automation
3. Implement proxy rotation to avoid rate limiting
4. Add human-like behavior patterns to avoid detection

### Platform Integration

The demo simulates job platform APIs. In a real implementation, you would need to:

1. Sign up for LinkedIn API access (if available) or implement a scraper
2. Create scrapers for Indeed, Glassdoor, and other platforms
3. Implement proper error handling and rate limiting
4. Regularly update scrapers to match website changes

## Privacy & Security

Job Copilot stores all data locally in your browser using IndexedDB (via localforage). No data is sent to a server, ensuring your privacy. Your resume, personal information, and job applications remain on your device.

## Customization

You can customize the application by:

1. Adding new job platforms in the `services` directory
2. Modifying the AI matching algorithm in `aiFilter.ts`
3. Customizing the UI components in the `components` directory
4. Adding new features to the dashboard or application tracker

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- This project is a demonstration of modern web technologies
- No actual scraping or automation is performed in this demo
- In a production environment, make sure to respect the terms of service of job platforms
