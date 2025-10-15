# Authentication Guide

This guide explains how to work with protected resources in both the frontend (Next.js) and backend (NestJS).

## Table of Contents
- [Backend: Creating Protected Routes](#backend-creating-protected-routes)
- [Frontend: Making Authenticated API Requests](#frontend-making-authenticated-api-requests)
- [Extending JWT Authentication to Other Modules](#extending-jwt-authentication-to-other-modules)
- [Complete Example](#complete-example)

---

## Backend: Creating Protected Routes

### Step 1: Import Required Guards

In your controller, import the `JwtAuthGuard`:

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';
```

### Step 2: Apply Guard to Routes

Use the `@UseGuards()` decorator to protect your routes:

```typescript
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ✅ Protected Route - Requires JWT Token
  @UseGuards(JwtAuthGuard)
  @Get('protected')
  getProtectedResource() {
    return {
      message: 'This is a protected resource',
      data: 'Only authenticated users can see this',
    };
  }

  // ✅ Public Route - No authentication required
  @Get('public')
  getPublicResource() {
    return {
      message: 'This is a public resource',
    };
  }
}
```

### Step 3: Access User Data in Protected Routes

The JWT strategy automatically adds the user data to the request object:

```typescript
import { Request } from '@nestjs/common';

@UseGuards(JwtAuthGuard)
@Get('profile')
getProfile(@Request() req) {
  // Access authenticated user data
  return {
    userId: req.user.id,
    message: `Welcome ${req.user.name}!`,
  };
}
```

### Protecting All Routes in a Controller

To protect all routes in a controller, add the guard at the controller level:

```typescript
@Controller('users')
@UseGuards(JwtAuthGuard)  // All routes in this controller are protected
export class UserController {
  @Get()
  findAll() {
    // Protected
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    // Protected
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    // Protected
  }
}
```

---

## Frontend: Making Authenticated API Requests

### Option 1: Using Authenticated API Client (Recommended)

The project includes an authenticated API client that automatically adds JWT tokens to requests.

#### Step 1: Import the Authenticated API Client

```typescript
import { authApi } from "@/lib/authenticated-api";
```

#### Step 2: Make API Calls

The client automatically retrieves the JWT token from the session and adds it to the request headers.

**GET Request:**
```typescript
async function fetchProtectedData() {
  try {
    const data = await authApi.get<{ message: string }>("/auth/protected");
    console.log(data); // { message: "Protected" }
  } catch (error) {
    console.error("Error:", error);
  }
}
```

**POST Request:**
```typescript
async function createResource() {
  try {
    const data = await authApi.post<{ id: number }>("/api/resources", {
      name: "My Resource",
      description: "Resource description",
    });
    console.log("Created:", data);
  } catch (error) {
    console.error("Error:", error);
  }
}
```

**PUT Request:**
```typescript
async function updateResource(id: number) {
  try {
    const data = await authApi.put<{ success: boolean }>(`/api/resources/${id}`, {
      name: "Updated Name",
    });
    console.log("Updated:", data);
  } catch (error) {
    console.error("Error:", error);
  }
}
```

**DELETE Request:**
```typescript
async function deleteResource(id: number) {
  try {
    await authApi.delete(`/api/resources/${id}`);
    console.log("Deleted successfully");
  } catch (error) {
    console.error("Error:", error);
  }
}
```

### Option 2: Using Regular API Client with Manual Token

If you need to manually pass the token:

```typescript
import { api } from "@/lib/api";
import { getSession } from "@/actions/session";

async function fetchWithManualToken() {
  const session = await getSession();
  const token = session?.user.accessToken;

  if (!token) {
    throw new Error("Not authenticated");
  }

  const response = await api.get("/auth/protected", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}
```

---

## Extending JWT Authentication to Other Modules

By default, JWT authentication is configured in the `AuthModule`. To use JWT authentication in other modules (like `UserModule`, `PostsModule`, etc.), follow these steps:

### Step 1: Export Auth Providers from AuthModule

Make sure your `AuthModule` exports the necessary providers:

```typescript
// auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { EmailModule } from 'src/email/email.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStratergy } from 'src/stratergies/local.stratergy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from './config/jwt.config';
import { JwtStratergy } from 'src/stratergies/jwt.stratergies';

@Module({
  imports: [
    UserModule,
    EmailModule,
    PassportModule,
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStratergy, JwtStratergy],
  exports: [JwtModule, PassportModule, JwtStratergy], // 👈 Export these
})
export class AuthModule {}
```

### Step 2: Import AuthModule in Your Target Module

```typescript
// user/user.module.ts
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { AuthModule } from 'src/auth/auth.module'; // 👈 Import AuthModule

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    AuthModule, // 👈 Add AuthModule to imports
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
```

### Step 3: Protect Routes and Validate User Ownership

Now you can use `JwtAuthGuard` in your UserController and ensure users can only access their own data:

```typescript
// user/user.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // ✅ Get current user's profile (Protected)
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    // req.user contains the authenticated user data from JWT
    return this.userService.findById(req.user.id);
  }

  // ✅ Get user by ID (Protected - Only allow users to access their own data)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    // Validate that the user is accessing their own data
    if (req.user.id.toString() !== id) {
      throw new ForbiddenException('You can only access your own profile');
    }
    return this.userService.findById(id);
  }

  // ✅ Update user profile (Protected - Only the user can update their own data)
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req,
  ) {
    // Validate ownership
    if (req.user.id.toString() !== id) {
      throw new ForbiddenException('You can only update your own profile');
    }
    return this.userService.update(id, updateUserDto);
  }

  // ✅ Delete user account (Protected - Only the user can delete their own account)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    // Validate ownership
    if (req.user.id.toString() !== id) {
      throw new ForbiddenException('You can only delete your own account');
    }
    return this.userService.remove(id);
  }
}
```

### Step 4: Create Frontend API Functions

Create a dedicated API file for user operations:

```typescript
// lib/user-api.ts
import { authApi } from "./authenticated-api";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
}

export const userApi = {
  // Get current user's profile
  getProfile: async (): Promise<UserProfile> => {
    return authApi.get<UserProfile>("/user/profile");
  },

  // Get user by ID
  getUserById: async (id: string): Promise<UserProfile> => {
    return authApi.get<UserProfile>(`/user/${id}`);
  },

  // Update user profile
  updateProfile: async (
    id: string,
    data: UpdateUserDto
  ): Promise<UserProfile> => {
    return authApi.patch<UserProfile>(`/user/${id}`, data);
  },

  // Delete user account
  deleteAccount: async (id: string): Promise<void> => {
    await authApi.delete(`/user/${id}`);
  },
};
```

### Step 5: Use in Frontend Components

**Server Component Example:**

```typescript
// app/profile/page.tsx
import { userApi } from "@/lib/user-api";

export default async function ProfilePage() {
  let profile = null;
  let error = null;

  try {
    profile = await userApi.getProfile();
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to fetch profile";
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>
      <div className="space-y-2">
        <p><strong>Name:</strong> {profile.name}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Verified:</strong> {profile.verified ? "Yes" : "No"}</p>
        <p><strong>Member since:</strong> {new Date(profile.createdAt).toLocaleDateString()}</p>
      </div>
    </div>
  );
}
```

**Client Component with Edit Functionality:**

```typescript
// components/profile-editor.tsx
"use client";

import { useState } from "react";
import { userApi } from "@/lib/user-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ProfileEditorProps {
  userId: string;
  initialName: string;
}

export function ProfileEditor({ userId, initialName }: ProfileEditorProps) {
  const [name, setName] = useState(initialName);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await userApi.updateProfile(userId, { name });
      setMessage("✅ Profile updated successfully!");
    } catch (error) {
      setMessage(`❌ ${error instanceof Error ? error.message : "Failed to update"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleUpdate} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-2">
          Name
        </label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
        />
      </div>
      
      <Button type="submit" disabled={loading}>
        {loading ? "Updating..." : "Update Profile"}
      </Button>

      {message && (
        <p className={message.includes("✅") ? "text-green-600" : "text-red-600"}>
          {message}
        </p>
      )}
    </form>
  );
}
```

### Step 6: Apply to Any Module

You can apply this same pattern to any module in your application:

**Example: Posts Module**

```typescript
// posts/posts.module.ts
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    AuthModule, // 👈 Import AuthModule
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}

// posts/posts.controller.ts
@Controller('posts')
export class PostsController {
  // Only authenticated users can create posts
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createPostDto: CreatePostDto, @Request() req) {
    return this.postsService.create({
      ...createPostDto,
      authorId: req.user.id, // Set author from authenticated user
    });
  }

  // Only the post author can update their post
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @Request() req,
  ) {
    const post = await this.postsService.findOne(id);
    
    if (post.authorId !== req.user.id) {
      throw new ForbiddenException('You can only edit your own posts');
    }
    
    return this.postsService.update(id, updatePostDto);
  }
}
```

### Key Points for Module Extension

1. ✅ **Export from AuthModule**: Always export `JwtModule`, `PassportModule`, and `JwtStratergy`
2. ✅ **Import in Target Module**: Import `AuthModule` in any module that needs JWT authentication
3. ✅ **Use JwtAuthGuard**: Apply `@UseGuards(JwtAuthGuard)` to protect routes
4. ✅ **Access User Data**: Use `@Request() req` to access `req.user.id`, `req.user.name`, etc.
5. ✅ **Validate Ownership**: Always check that users can only access/modify their own resources
6. ✅ **Use Proper Exceptions**: Throw `ForbiddenException` for authorization errors
7. ✅ **Frontend Integration**: Use the `authApi` client which automatically handles JWT tokens

---

## Complete Example

### Backend: Protected User Profile Endpoint

```typescript
// user.controller.ts
import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    const userId = req.user.id;
    const profile = await this.userService.findById(userId);
    
    return {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      createdAt: profile.createdAt,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('dashboard')
  async getDashboard(@Request() req) {
    const userId = req.user.id;
    const stats = await this.userService.getDashboardStats(userId);
    
    return {
      message: `Welcome ${req.user.name}!`,
      stats,
    };
  }
}
```

### Frontend: Fetching Protected Data in a Server Component

```typescript
// app/profile/page.tsx
import { authApi } from "@/lib/authenticated-api";

interface UserProfile {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

export default async function ProfilePage() {
  let profile: UserProfile | null = null;
  let error: string | null = null;

  try {
    profile = await authApi.get<UserProfile>("/user/profile");
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to fetch profile";
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!profile) {
    return <div>No profile data</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <div className="space-y-2">
        <p><strong>Name:</strong> {profile.name}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Member since:</strong> {new Date(profile.createdAt).toLocaleDateString()}</p>
      </div>
    </div>
  );
}
```

### Frontend: Fetching Protected Data in a Client Component

```typescript
// components/dashboard-stats.tsx
"use client";

import { useEffect, useState } from "react";
import { authApi } from "@/lib/authenticated-api";

interface DashboardData {
  message: string;
  stats: {
    totalPosts: number;
    totalViews: number;
  };
}

export function DashboardStats() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await authApi.get<DashboardData>("/user/dashboard");
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!data) return null;

  return (
    <div className="p-6 border rounded-lg">
      <h2 className="text-xl font-bold mb-4">{data.message}</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Total Posts</p>
          <p className="text-2xl font-bold">{data.stats.totalPosts}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Total Views</p>
          <p className="text-2xl font-bold">{data.stats.totalViews}</p>
        </div>
      </div>
    </div>
  );
}
```

---

## Using with React Query (TanStack Query)

For better state management and caching:

```typescript
"use client";

import { useQuery } from "@tanstack/react-query";
import { authApi } from "@/lib/authenticated-api";

interface UserProfile {
  id: number;
  name: string;
  email: string;
}

export function ProfileComponent() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["profile"],
    queryFn: () => authApi.get<UserProfile>("/user/profile"),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>{data?.name}</h2>
      <p>{data?.email}</p>
    </div>
  );
}
```

---

## API Type Definitions

Create type definitions for your API responses:

```typescript
// lib/types/api.ts
export interface ProtectedResponse {
  message: string;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

export interface DashboardStats {
  totalPosts: number;
  totalViews: number;
  totalComments: number;
}
```

Then use them in your API calls:

```typescript
import { authApi } from "@/lib/authenticated-api";
import type { UserProfile } from "@/lib/types/api";

const profile = await authApi.get<UserProfile>("/user/profile");
```

---

## Error Handling

The authenticated API client automatically handles errors. Common error scenarios:

### 401 Unauthorized
- Token is missing or invalid
- User needs to log in again

### 403 Forbidden
- User is authenticated but doesn't have permission
- Check user roles/permissions on backend

### Example Error Handling:

```typescript
try {
  const data = await authApi.get("/protected-resource");
  console.log(data);
} catch (error) {
  if (error instanceof Error) {
    if (error.message.includes("Unauthorized")) {
      // Redirect to login
      router.push("/auth/login");
    } else {
      // Show error message
      console.error("Error:", error.message);
    }
  }
}
```

---

## Best Practices

### Backend
1. ✅ Always use `@UseGuards(JwtAuthGuard)` for protected routes
2. ✅ Validate user permissions in addition to authentication
3. ✅ Return appropriate HTTP status codes (401, 403, 404, etc.)
4. ✅ Don't expose sensitive data in error messages
5. ✅ Use DTOs for request/response validation

### Frontend
1. ✅ Use the `authenticated-api` client for all protected resources
2. ✅ Handle loading, error, and success states properly
3. ✅ Redirect to login on 401 errors
4. ✅ Use TypeScript interfaces for API responses
5. ✅ Implement proper error boundaries
6. ✅ Use React Query for better caching and state management

---

## Troubleshooting

### "Unauthorized" Error
- Check if user is logged in
- Verify JWT token exists in session
- Check token expiration time

### Token Not Being Sent
- Ensure you're using the `authenticated-api` client
- Verify `getSession()` is returning the token
- Check browser console for errors

### Backend Not Validating Token
- Ensure JWT secret matches between frontend and backend
- Verify `JwtStratergy` is properly configured
- Check that `JwtAuthGuard` is applied to the route

---

## Summary

- **Backend**: Use `@UseGuards(JwtAuthGuard)` to protect routes
- **Frontend**: Use `authApi.get/post/put/delete()` for authenticated requests
- **Token**: Automatically handled via session cookies
- **Type Safety**: Define interfaces for all API responses

For more examples, check the `/apps/web/app/(main)/dashboard/page.tsx` file.
