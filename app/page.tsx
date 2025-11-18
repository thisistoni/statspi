export const dynamic = 'force-dynamic'
export const revalidate = 0

import { SystemInfo } from './system-info'

export default function Home() {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-6 text-foreground">My Raspberry Pi</h1>
      <SystemInfo />
    </main>
  )
}
