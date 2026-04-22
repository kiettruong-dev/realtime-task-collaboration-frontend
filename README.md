# Frontend - Realtime Task Collaboration System

React + TypeScript frontend for realtime task collaboration system

## 🛠️ Tech Stack

- **Framework**: React 19.x
- **Language**: TypeScript
- **Build Tool**: Vite 8.x
- **State Management**: TanStack Query 5.x (React Query)
- **WebSocket**: Socket.io-client 4.x
- **HTTP Client**: Axios
- **UI Library**: Ant Design 6.x
- **Routing**: React Router 7.x
- **Styling**: CSS + Ant Design theme

## Installation

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0

### Setup

```bash
# 1. Install dependencies
pnpm install

# 2. Create .env file
# VITE_BASE_URL=http://localhost:3000
# VITE_CRYPTO_KEY=your_crypto_key_here

# 3. Run development server
pnpm run dev
```

## Project Structure

```
src/
├── pages/                        # Page components
│   ├── login/                    # Login page
│   ├── register/                 # Register page
│   ├── workspace/                # Workspace pages
│   └── task/                     # Task board
│       ├── task_page.tsx
│       ├── components/
│       │   ├── task_board.tsx    # Main kanban board
│       │   ├── task_column.tsx   # Column (TODO, IN_PROGRESS, DONE)
│       │   ├── task_card.tsx     # Individual task card
│       │   └── create_task.tsx   # Create task form
│       └── modals/
│           ├── edit_task_modal.tsx
│           └── conflict_task_modal.tsx
│
├── api/                          # API clients
│   ├── axios.ts                  # Axios instance with interceptors
│   ├── url.ts                    # API endpoint URLs
│   ├── auth.ts                   # Auth API (register, login, profile)
│   ├── task.ts                   # Task API (CRUD)
│   ├── workspace.ts              # Workspace API (CRUD)
│   └── index.ts
│
├── socket/                       # WebSocket management
│   └── socket.ts                 # Socket.io client + reconnection logic
│
├── hooks/                        # Custom React hooks
│   ├── useAuth.ts                # Auth state + mutations
│   ├── useTask.ts                # Task queries + mutations
│   ├── useWorkspace.ts           # Workspace queries
│   ├── useTaskSocket.ts          # Listen realtime task events
│   ├── useSocketStatus.ts        # Track WebSocket connection status
│   └── useBroadcastChannel.ts    # Multi-tab synchronization
│
├── types/                        # TypeScript interfaces
│   ├── auth.ts
│   ├── task.ts
│   ├── workspace.ts
│   ├── common.ts
│   └── index.ts
│
├── components/
│   └── ProtectedRoute.tsx        # Route protection component
│
├── configs/                      # Configuration
│   ├── index.ts
│   └── theme.ts                  # Ant Design theme
│
├── constants/                    # Constants
│   ├── common.ts
│   ├── keys/                     # React Query keys
│   └── index.ts
│
├── utils/
│   └── token.ts                  # JWT token management
│
├── assets/                       # Images, icons, static files
├── App.tsx                       # Root component with routing
├── provider.tsx                  # Providers (QueryClient, ConfigProvider)
├── main.tsx                      # Entry point
└── index.css                     # Global styles
```

## Key Features

### Authentication

- Register & login forms
- JWT token management
- Protected routes with ProtectedRoute component
- Automatic token handling
- Logout with WebSocket disconnect

### Workspace Management

- Create new workspace
- List user's workspaces with pagination
- Invite users by email
- View workspace member list
- Role-based access (OWNER, MEMBER)

### Task Management

- Create tasks in workspace
- View tasks in kanban board (3 columns: TODO, IN_PROGRESS, DONE)
- Update task status (drag-and-drop or status button)
- Edit task title and description
- Delete task
- Task pagination support

### Real-time Synchronization

- WebSocket connection with JWT authentication
- Listen to task_created, task_updated, task_deleted events
- Automatic UI update on real-time events
- Error handling (CONFLICT, FORBIDDEN)
- Socket connection status indicator

### Multi-tab Support

- BroadcastChannel API for cross-tab communication
- When task changes in one tab, other tabs update automatically
- Logout synced across all tabs in same browser

### Socket Management

- Auto-reconnection with exponential backoff (5 attempts)
- Connection status tracking via useSocketStatus hook
- Graceful error handling
- Token verification on connection

## Custom Hooks Documentation

### useAuth()

```typescript
const {
  user, // Current user data { id, email, createdAt }
  queryMe, // User query object (isLoading, isError, error)
  loginMutation, // Login mutation hook
  registerMutation, // Register mutation hook
  logoutMutation, // Logout mutation hook
  handleTokenExpiration, // Function to handle token expiration
} = useAuth();
```

### useTask(workspaceId)

```typescript
const {
  data, // Array of tasks
  useTasks, // Query hook for tasks
  useCreateTask, // Mutation hook for create
  useUpdateTask, // Mutation hook for update
  useDeleteTask, // Mutation hook for delete
} = useTask(workspaceId);
```

### useTaskSocket(workspaceId, handlers)

```typescript
useTaskSocket(workspaceId, {
  onCreate: (task) => {}, // Task created handler
  onUpdate: (task) => {}, // Task updated handler
  onDelete: (taskId) => {}, // Task deleted handler
  onConflict: (error) => {}, // Conflict error handler
});
```

### useSocketStatus()

```typescript
const isConnected = useSocketStatus(); // Returns true | false
```

### useBroadcastChannel(channel, onMessage)

```typescript
useBroadcastChannel("workspace:uuid", (message) => {
  // Handle broadcast message from other tabs
});

// Send message to other tabs
sendBroadcastMessage("workspace:uuid", {
  type: "task_created",
  data: taskData,
});
```

## Running

### Development

```bash
# Start dev server with HMR
pnpm run dev

# Server runs at http://localhost:5173
```

### Production

```bash
# Build for production
pnpm run build

# Preview production build locally
pnpm run preview

# Built files are in dist/ folder
```

### Linting

```bash
# Run ESLint
pnpm run lint
```

## Environment Variables

```env
# Backend API URL
VITE_BASE_URL=http://localhost:3000

# Request timeout in milliseconds
VITE_API_TIMEOUT=30000
```

## Component Architecture

### Page Components

- **LoginPage**: Login form with email/password
- **RegisterPage**: User registration form
- **WorkspacePage**: Workspace list and management
- **TaskPage**: Main task board for workspace

### Task Board Components

- **TaskBoard**: Container component
  - Uses useTask, useTaskSocket, useBroadcastChannel hooks
  - Manages local task state
  - Handles create, update, delete operations
  - Shows WebSocket connection status indicator
  - Renders 3 columns (TODO, IN_PROGRESS, DONE)

- **TaskColumn**: Column component
  - Displays tasks filtered by status
  - Supports drag-and-drop (if implemented)

- **TaskCard**: Individual task card
  - Shows title, description, metadata
  - Click to edit modal
  - Drag to change status

- **CreateTask**: Form to create new task
  - Input validation
  - Submit handler

### Modal Components

- **EditTaskModal**: Modal for editing task details
- **ConflictTaskModal**: Modal for handling update conflicts

## State Management

### Server State (TanStack Query)

- useQuery: GET requests (tasks, workspaces, user profile)
- useMutation: POST, PATCH, DELETE requests
- Automatic caching and refetching
- Error handling and retries

### Local State (useState)

- UI state (modal open/close, form values)
- Loading states
- Selected items

### Real-time State

- Socket events update TanStack Query cache
- BroadcastChannel syncs across tabs
- Automatic UI refresh on data changes

## API Interceptors

### Request Interceptor

- Automatically adds JWT token from localStorage
- Sets Content-Type: application/json header

### Response Interceptor

- Catches 401 Unauthorized errors
- Redirects to login if token expired
- Displays error messages to user

## Error Handling

### API Errors

- 401 Unauthorized: Redirect to login
- 403 Forbidden: Show permission denied message
- 409 Conflict: Task updated by other user - show modal
- Other errors: Display generic error message

### WebSocket Errors

- task_error event: Show error modal with details
- CONFLICT: User must reload data from server
- FORBIDDEN: User lacks permission

### Network Errors

- WebSocket automatically reconnects (5 attempts)
- Shows disconnected indicator
- User can manually retry operations

## Testing

```bash
# Run tests
pnpm run test

# Watch mode
pnpm run test:watch

# Coverage report
pnpm run test:cov
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Requires WebSocket support
- Requires BroadcastChannel API (for multi-tab sync)

## References

- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Vite Documentation](https://vitejs.dev/)
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Socket.io Client Docs](https://socket.io/docs/v4/client-api/)
- [Ant Design Documentation](https://ant.design/)
- [React Router Docs](https://reactrouter.com/)
- [Axios Documentation](https://axios-http.com/)

## Best Practices

1. **Use custom hooks**: Leverage useAuth, useTask, useTaskSocket for business logic
2. **Error handling**: Always show user feedback for failed operations
3. **Loading states**: Display loading spinner during async operations
4. **Validation**: Validate form inputs client-side before submission
5. **Accessibility**: Use Ant Design a11y features
6. **Performance**: Memoize components, optimize re-renders
7. **Code organization**: Keep components focused and reusable

---

**Last Updated**: April 22, 2026
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
globalIgnores(['dist']),
{
files: ['**/*.{ts,tsx}'],
extends: [
// Other configs...
// Enable lint rules for React
reactX.configs['recommended-typescript'],
// Enable lint rules for React DOM
reactDom.configs.recommended,
],
languageOptions: {
parserOptions: {
project: ['./tsconfig.node.json', './tsconfig.app.json'],
tsconfigRootDir: import.meta.dirname,
},
// other options...
},
},
])

```

```
