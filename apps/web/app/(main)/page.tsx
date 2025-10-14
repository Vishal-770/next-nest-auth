import { getSession } from "@/actions/session";

export default async function HomePage() {
  const session = await getSession();

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-6 p-6">
      <div className="text-center">
        {session ? (
          <>
            <h1 className="text-4xl font-bold mb-4">
              Welcome back, {session.user.name}!
            </h1>
            <p className="text-muted-foreground text-lg mb-8">
              You are logged in successfully.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mt-8">
              <div className="p-6 border rounded-lg">
                <h3 className="font-semibold mb-2">Dashboard</h3>
                <p className="text-sm text-muted-foreground">
                  View your account dashboard
                </p>
              </div>
              <div className="p-6 border rounded-lg">
                <h3 className="font-semibold mb-2">Settings</h3>
                <p className="text-sm text-muted-foreground">
                  Manage your account settings
                </p>
              </div>
              <div className="p-6 border rounded-lg">
                <h3 className="font-semibold mb-2">Profile</h3>
                <p className="text-sm text-muted-foreground">
                  Update your profile information
                </p>
              </div>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-4xl font-bold mb-4">Welcome to Auth App</h1>
            <p className="text-muted-foreground text-lg mb-8">
              A secure authentication system built with Next.js and NestJS
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mt-8">
              <div className="p-6 border rounded-lg">
                <h3 className="font-semibold mb-2">🔐 Secure Authentication</h3>
                <p className="text-sm text-muted-foreground">
                  Email verification and secure password handling
                </p>
              </div>
              <div className="p-6 border rounded-lg">
                <h3 className="font-semibold mb-2">🚀 Modern Stack</h3>
                <p className="text-sm text-muted-foreground">
                  Built with Next.js, NestJS, and TypeScript
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
