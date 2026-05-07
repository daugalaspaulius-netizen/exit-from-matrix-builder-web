'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface TreasuryTransaction {
  id: string
  date: string
  type: 'in' | 'out'
  amount: number
  description: string
  status: 'completed' | 'pending' | 'rejected'
}

export default function Treasury() {
  const router = useRouter()
  const [transactions, setTransactions] = useState<TreasuryTransaction[]>([])

  useEffect(() => {
    const userId = localStorage.getItem('user_id')

    if (!userId) {
      router.push('/auth/login')
      return
    }

    // Mock transactions
    const mockTransactions: TreasuryTransaction[] = [
      {
        id: 'tx1',
        date: '2025-12-20',
        type: 'in',
        amount: 50000,
        description: 'Initial treasury contribution',
        status: 'completed',
      },
      {
        id: 'tx2',
        date: '2025-12-19',
        type: 'out',
        amount: 12500,
        description: 'Development budget - Backend work',
        status: 'completed',
      },
      {
        id: 'tx3',
        date: '2025-12-18',
        type: 'out',
        amount: 8500,
        description: 'Community rewards Q4',
        status: 'completed',
      },
      {
        id: 'tx4',
        date: '2025-12-17',
        type: 'in',
        amount: 25000,
        description: 'Proposal passed: New feature funding',
        status: 'pending',
      },
      {
        id: 'tx5',
        date: '2025-12-16',
        type: 'out',
        amount: 5000,
        description: 'Infrastructure costs',
        status: 'completed',
      },
    ]

    setTransactions(mockTransactions)
  }, [router])

  const totalIn = transactions
    .filter((t) => t.type === 'in' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalOut = transactions
    .filter((t) => t.type === 'out' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0)

  const balance = totalIn - totalOut

  return (
    <main className="matrix-bg min-h-screen">
      <header className="border-b border-green-500 py-6">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
          <h1 className="text-4xl neon-green font-bold">TREASURY</h1>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-2 border border-green-500 text-green-500 rounded hover:bg-green-500/10"
          >
            BACK
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Treasury Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-black border-2 border-green-500 neon-glow rounded-lg p-6">
            <div className="text-sm neon-green opacity-70 mb-2">INFLOWS</div>
            <div className="text-3xl neon-green font-bold">{totalIn} EUR</div>
            <div className="text-xs text-gray-400 mt-2">Total funds received</div>
          </div>

          <div className="bg-black border-2 border-red-500 neon-glow rounded-lg p-6">
            <div className="text-sm text-red-500 opacity-70 mb-2">OUTFLOWS</div>
            <div className="text-3xl text-red-400 font-bold">{totalOut} EUR</div>
            <div className="text-xs text-gray-400 mt-2">Total funds spent</div>
          </div>

          <div className="bg-black border-2 border-yellow-500 neon-glow rounded-lg p-6">
            <div className="text-sm opacity-70 mb-2" style={{ color: '#ffaa00' }}>
              BALANCE
            </div>
            <div className="text-3xl font-bold" style={{ color: '#ffaa00' }}>
              {balance} EUR
            </div>
            <div className="text-xs text-gray-400 mt-2">Available funds</div>
          </div>
        </div>

        {/* Transactions */}
        <div>
          <h2 className="text-2xl neon-green font-bold mb-6">TRANSACTION HISTORY</h2>

          <div className="space-y-4">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="bg-black border-2 border-green-500 rounded-lg p-6 flex items-center justify-between"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <span
                      className={`font-bold px-3 py-1 rounded text-sm ${
                        tx.type === 'in'
                          ? 'bg-green-900/30 text-green-500'
                          : 'bg-red-900/30 text-red-500'
                      }`}
                    >
                      {tx.type === 'in' ? 'IN' : 'OUT'}
                    </span>
                    <span className="text-gray-400">{tx.date}</span>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        tx.status === 'completed'
                          ? 'bg-green-900/20 text-green-500'
                          : tx.status === 'pending'
                          ? 'bg-yellow-900/20 text-yellow-500'
                          : 'bg-red-900/20 text-red-500'
                      }`}
                    >
                      {tx.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-white font-semibold">{tx.description}</p>
                </div>

                <div
                  className={`text-2xl font-bold ${
                    tx.type === 'in' ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {tx.type === 'in' ? '+' : '-'}{tx.amount} EUR
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
