# Preach It Enterprise - Complete Shipping System

A comprehensive shipping and logistics management system built with React, TypeScript, Tailwind CSS, and Supabase.

## Features

### Frontend Features
- **Responsive Design**: Mobile-first design with dark/light theme support
- **Multi-language Support**: English, Chinese, French, and Japanese
- **Real-time Tracking**: Track shipments with detailed event history
- **Quote System**: Request quotes for different shipping services
- **Contact Management**: Contact form with message management
- **Admin Dashboard**: Complete admin interface for managing operations

### Backend Features
- **Supabase Integration**: PostgreSQL database with real-time capabilities
- **Row Level Security**: Secure data access with proper authentication
- **Contact Management**: Store and manage customer inquiries
- **Tracking System**: Complete shipment tracking with event history
- **User Management**: Admin user system with role-based access
- **Dashboard Analytics**: Real-time statistics and activity monitoring

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Authentication, Real-time)
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Deployment**: Ready for Netlify/Vercel

## Getting Started

### Prerequisites
- Node.js 18+ 
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd pie-shipping
```

2. Install dependencies:
```bash
npm install
```

3. Set up Supabase:
   - Create a new Supabase project
   - Run the SQL migrations in the `supabase/migrations` folder
   - Copy your Supabase URL and anon key

4. Create environment file:
```bash
cp .env.example .env
```

5. Update `.env` with your Supabase credentials:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

6. Start the development server:
```bash
npm run dev
```

## Database Schema

The system includes the following main tables:

- **pie_contact_messages**: Customer contact form submissions
- **pie_tracking**: Shipment tracking information
- **pie_tracking_events**: Detailed tracking event history
- **pie_admin_users**: Admin user accounts
- **pie_settings**: System configuration
- **pie_quotes**: Quote requests and management

## Admin Access

Default admin credentials:
- Email: admin@preachitenterprise.com
- Password: admin123

## Features Overview

### Public Features
1. **Homepage**: Hero section with company overview
2. **Services**: Ocean freight, air freight, land transport, warehousing
3. **Quote Request**: Multi-step form for service quotes
4. **Shipment Tracking**: Real-time tracking with event history
5. **About**: Company information and statistics
6. **Contact**: Contact form with company details

### Admin Features
1. **Dashboard**: Statistics and recent activity overview
2. **Message Management**: View, respond to, and manage contact messages
3. **Tracking Management**: Create, update, and manage shipments
4. **User Management**: Admin user account management
5. **Settings**: System configuration options

### Technical Features
1. **Responsive Design**: Works on all device sizes
2. **Dark/Light Theme**: User preference with system detection
3. **Multi-language**: Support for 4 languages
4. **Real-time Updates**: Live data synchronization
5. **Secure Authentication**: Row-level security with Supabase
6. **Type Safety**: Full TypeScript implementation

## API Services

The application includes several service modules:

- **contactService**: Handle contact form submissions and management
- **trackingService**: Manage shipment tracking and events
- **authService**: Handle admin authentication
- **dashboardService**: Provide dashboard statistics and activity

## Deployment

The application is ready for deployment on:

- **Netlify**: Static site hosting with serverless functions
- **Vercel**: Full-stack deployment with edge functions
- **Any static host**: Build and deploy the static files

Build for production:
```bash
npm run build
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact:
- Email: info@preachitenterprise.com
- Phone: +1 (555) 123-4567

---

Built with ❤️ by the Preach It Enterprise team.