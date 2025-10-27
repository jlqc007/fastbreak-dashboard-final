// app/login/page.tsx
import AuthForm from '@/components/auth/AuthForm'

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <AuthForm />
      </div>
    </main>
  )
}
