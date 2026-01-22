# Priygop Admin Panel

Admin dashboard for managing blog posts for Priygop.

## Features

- 🔐 Admin authentication (basic implementation)
- 📝 Blog CRUD operations
- 🖼️ Image URL management
- 🔍 Search and pagination
- 📱 Responsive design

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router** - Routing
- **Zustand** - State management
- **Formik & Yup** - Form handling and validation
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **React Icons** - Icons

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 8.0.0
- Backend API running (priygop-user-backend)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:3000/api
```

3. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or the port shown in the terminal).

### Building for Production

```bash
npm run build
```

The production build will be in the `dist` directory.

## Project Structure

```
priygop-admin/
├── src/
│   ├── components/       # Reusable components
│   │   ├── shared/      # Shared UI components
│   │   └── ui/          # UI primitives
│   ├── contexts/        # React contexts
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Library utilities
│   ├── pages/           # Page components
│   ├── schemas/         # Validation schemas
│   ├── services/        # API services
│   ├── store/           # Zustand store
│   ├── types/           # TypeScript types
│   └── utils/           # Utility functions
├── public/              # Static assets
└── index.html           # HTML template
```

## API Endpoints

The admin panel connects to the backend API at `/api/admin/blogs`:

- `GET /api/admin/blogs` - List all blogs (with pagination and search)
- `GET /api/admin/blogs/:id` - Get single blog
- `POST /api/admin/blogs` - Create blog
- `PUT /api/admin/blogs/:id` - Update blog
- `DELETE /api/admin/blogs/:id` - Delete blog

## Notes

- Authentication is currently simplified (can be enhanced later)
- Image uploads use URL input (can be enhanced with file upload later)
- Rich text editor uses textarea (can be enhanced with CKEditor later)

