# CMN Frontend - AI Development Context

> 📘 **Purpose**: Project standards & patterns. AI must follow these rules to ensure type-safety and architectural consistency.

---

## 🛠️ Tech Stack

### Core

- **React 19.2.0** - UI Framework
- **TypeScript 5.9.3** - Type system (strict mode)
- **Vite 7.2.4** - Build tool & Dev server

### Routing & Navigation

- **react-router-dom 7.10.1** - Client-side routing

### State Management

- **React Context API** - Global state (Auth, Theme,...)
- **@tanstack/react-query 5.90.12** - Server state, caching, data fetching
- **react-hook-form 7.68.0** - Form state management

### HTTP & API

- **axios 1.13.2** - HTTP client
- API Base URL: `https://localhost:7052/api` (configurable via `.env`)

### UI & Styling

- **Tailwind CSS 4.1.17** - Utility-first CSS
- **heroicons** - Icon library

---

## 📁 Directory Structure & Roles

```
src/
├── components/          # Reusable React components
│
├── pages/              # Page components (route handlers)
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── HomePage.tsx
│   └── DashboardPage.tsx
│
├── hooks/              # Custom React hooks
│   ├── useAuth.ts      # From AuthContext
│   ├── useCampaigns.ts # Campaign-related hooks
│   ├── useOrders.ts    # Order management hooks
│
├── services/           # API service layer
│   ├── apiClient.ts       # Axios instance
│   ├── authService.ts     # Auth API calls
│   ├── productService.ts  # Product API calls
│   └── orderService.ts    # Order API calls
│
├── contexts/           # React Context providers
│   ├── AuthContext.tsx # Authentication state
│   ├── CartContext.tsx # Shopping cart state
│   └── ThemeContext.tsx
│
├── types/              # TypeScript definitions
│   └── models              
│       ├── product.ts      # Product-related types
│       ├── order.ts        # Order-related types
│   └── enums              
│   └── api              
│       ├── common.ts         # Auth-related types
│       ├── upload.ts     # Campaign & pricing tier types
│       ├── auth.ts      # Product-related types
│
├── lib/                # Third-party library configs
│   └── cloudinary.ts
│
├── utils/                    # Utility functions
│   ├── cloudinaryHelper.ts   # Get image, video url from cloudinary
│   ├── regex.ts         
│
├── App.tsx             # Root component with routing
├── main.tsx            # Entry point
└── index.css           # Global Tailwind imports
```

## 🚀 Workflow for Creating New Features

### Example: Creating "Campaigns" feature (Crowdfunding Campaign Management)

**Step 1: Create Types** (`src/types/models/campaign.ts`)

```typescript
export interface CreateCampaignRequest {
  name: string;
  description: string;
  originalPrice: number;
  targetQuantity: number;
  startDate: string;
  endDate: string;
}
```

**Step 2: Create Service** (`src/services/campaignService.ts`)

```typescript
import apiClient from './apiClient';

export const getCampaigns = async (): Promise<Response<Campaign[]>> => {
  const response = await apiClient.get<Response<Campaign[]>>('/campaigns');
  return response.data;
};
```

**Bước 3: Create React Query Hooks** (`src/hooks/useCampaigns.ts`)

```typescript
export const useCampaigns = () => {
  return useQuery({
    queryKey: ['campaigns'],
    queryFn: getProducts,
  });
};
```

**Bước 4: Create Components** (`src/components/features/campaigns/`)

- `CampaignList.tsx` - Display list
- `CampaignCard.tsx` - Card component
- `CreateCampaignForm.tsx` - Form create new

**Bước 5: Create Page** (`src/pages/CampaignsPage.tsx`)

```typescript
export default function CampaignsPage() {
  const { data, isLoading } = useCampaigns();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Active Campaigns</h1>
      <CampaignList campaigns={data?.data || []} />
    </div>
  );
}
```

**Step 6: Register Route** (in `App.tsx`)

```typescript
<Route path='/campaigns' element={<CampaignsPage />} />
```

---

## 📝 Styling Guidelines

### Tailwind CSS Conventions

- Use Tailwind utilities directly in JSX
- Group by: layout → spacing → colors → typography → effects

```typescript
<div className='flex items-center justify-between p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow'>
  <h2 className='text-lg font-semibold text-gray-900'>Title</h2>
  <button className='px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700'>
    Action
  </button>
</div>
```