import { getSession } from "@/actions/session";
import { authApi } from "@/lib/auth-api";
import React from "react";

export default async function Dashboard() {
  const session = await getSession();
  console.log(session);
  let protectedData = null;
  let error = null;

  // Call protected route if user is logged in
  // Token is automatically added via authenticated API client
  if (session?.user.accessToken) {
    try {
      protectedData = await authApi.getProtected();
    } catch (err) {
      error =
        err instanceof Error ? err.message : "Failed to fetch protected data";
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="space-y-4">
        {/* User Info */}
        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">User Information</h2>
          {session ? (
            <div className="space-y-2">
              <p>
                <strong>Name:</strong> {session.user.name}
              </p>
              <p>
                <strong>Email:</strong> {session.user.email}
              </p>
              <p>
                <strong>ID:</strong> {session.user.id}
              </p>
            </div>
          ) : (
            <p>Not logged in</p>
          )}
        </div>

        {/* Protected Route Test */}
        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Protected Route Test</h2>
          {protectedData ? (
            <div className="p-4 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-700">
                ✅ Protected route accessed successfully!
              </p>
              <p className="text-sm mt-2">
                <strong>Response:</strong> {protectedData.message}
              </p>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-700">
                ❌ Failed to access protected route
              </p>
              <p className="text-sm mt-2">
                <strong>Error:</strong> {error}
              </p>
            </div>
          ) : (
            <p className="text-muted-foreground">No session found</p>
          )}
        </div>
      </div>
    </div>
  );
}
