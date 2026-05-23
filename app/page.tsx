// app/page.tsx
import { redirect } from 'next/navigation'

export default function Home() {
  redirect('/register-dark')
  
  // Этот код не выполнится
  return null
}