'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

interface Video {
  video_id: string
  title: string
  description?: string
  url: string
  points_reward: number
  views: number
}

export default function Videos() {
  const router = useRouter()
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [watching, setWatching] = useState<string | null>(null)

  useEffect(() => {
    const userId = localStorage.getItem('user_id')

    if (!userId) {
      router.push('/auth/login')
      return
    }

    // Fetch videos from backend
    fetchVideos()
  }, [router])

  const fetchVideos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/videos')
      const data = response.data

      if (data.success && data.videos) {
        setVideos(data.videos)
      } else {
        // Use mock videos if API fails
        setVideos(MOCK_VIDEOS)
      }
    } catch (error) {
      console.log('Using mock videos')
      setVideos(MOCK_VIDEOS)
    } finally {
      setLoading(false)
    }
  }

  const handleWatchVideo = async (videoId: string) => {
    setWatching(videoId)

    try {
      const userId = localStorage.getItem('user_id')

      const response = await axios.post(
        `http://localhost:5000/api/videos/${videoId}/watch`,
        { user_id: userId }
      )

      if (response.data.points_awarded) {
        alert(`Watched! +${response.data.points_awarded} points`)
      }
    } catch (error) {
      console.error('Error watching video:', error)
    } finally {
      setWatching(null)
    }
  }

  if (loading) {
    return (
      <main className="matrix-bg min-h-screen flex items-center justify-center">
        <div className="neon-green text-2xl">LOADING VIDEOS...</div>
      </main>
    )
  }

  return (
    <main className="matrix-bg min-h-screen">
      <header className="border-b border-green-500 py-6">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
          <h1 className="text-4xl neon-green font-bold">EDUCATIONAL VIDEOS</h1>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-2 border border-green-500 text-green-500 rounded hover:bg-green-500/10"
          >
            BACK
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {videos.map((video) => (
            <div
              key={video.video_id}
              className="bg-black border-2 border-green-500 neon-glow rounded-lg overflow-hidden hover:border-green-300 transition"
            >
              {/* Video Thumbnail */}
              <div className="bg-gray-900 h-48 flex items-center justify-center border-b border-green-500">
                <div className="text-center">
                  <div className="text-4xl mb-2">🎬</div>
                  <p className="text-green-500 text-sm">VIDEO PLAYER</p>
                </div>
              </div>

              {/* Video Info */}
              <div className="p-6">
                <h3 className="text-xl neon-green font-bold mb-2">
                  {video.title}
                </h3>

                {video.description && (
                  <p className="text-gray-400 text-sm mb-4">{video.description}</p>
                )}

                <div className="flex justify-between items-center mb-4">
                  <div>
                    <span className="text-yellow-500 font-bold">
                      +{video.points_reward} POINTS
                    </span>
                  </div>
                  <div className="text-gray-500 text-sm">{video.views} views</div>
                </div>

                <button
                  onClick={() => handleWatchVideo(video.video_id)}
                  disabled={watching === video.video_id}
                  className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded transition disabled:opacity-50"
                >
                  {watching === video.video_id ? 'WATCHING...' : 'WATCH VIDEO'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

const MOCK_VIDEOS = [
  {
    video_id: 'vid1',
    title: 'Introduction to Decentralized Governance',
    description: 'Learn the basics of DAO governance and voting',
    url: 'https://youtube.com/watch?v=governance',
    points_reward: 50,
    views: 234,
  },
  {
    video_id: 'vid2',
    title: 'How Blockchain Voting Works',
    description: 'Understanding secure voting mechanisms',
    url: 'https://youtube.com/watch?v=blockchain-voting',
    points_reward: 75,
    views: 156,
  },
  {
    video_id: 'vid3',
    title: 'Treasury Management Best Practices',
    description: 'Optimal fund allocation strategies',
    url: 'https://youtube.com/watch?v=treasury',
    points_reward: 100,
    views: 98,
  },
  {
    video_id: 'vid4',
    title: 'Smart Contracts Explained',
    description: 'Deep dive into smart contract automation',
    url: 'https://youtube.com/watch?v=smart-contracts',
    points_reward: 125,
    views: 145,
  },
]
