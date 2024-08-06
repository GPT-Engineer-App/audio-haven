import { useState } from 'react';
import { Search, Headphones, Star, Flag, Play, Pause, SkipBack, SkipForward, Share2, Settings } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const PodcastCard = ({ title, author, tags, avatar }) => (
  <div className="bg-white p-4 rounded-lg shadow-md">
    <div className="flex mb-2">
      <img src={avatar} alt={author} className="w-30 h-10 object-cover mr-2" />
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-gray-600">{author}</p>
      </div>
    </div>
    <div className="flex flex-wrap mb-2">
      {tags.map((tag, index) => (
        <span key={index} className="bg-gray-200 text-xs px-2 py-1 rounded mr-1 mb-1">#{tag}</span>
      ))}
    </div>
    <div className="flex space-x-2">
      <Button variant="outline" size="sm">
        <Headphones className="w-4 h-4 mr-1" />
        Listen
      </Button>
      <Button variant="outline" size="sm">
        <Star className="w-4 h-4 mr-1" />
        Favorite
      </Button>
      <Button variant="outline" size="sm">
        <Flag className="w-4 h-4" />
      </Button>
    </div>
  </div>
);

const PodcastPlayer = ({ title, author, avatar }) => (
  <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <img src={avatar} alt={author} className="w-12 h-12 rounded-full mr-3" />
        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm text-gray-600">{author}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon"><SkipBack className="w-5 h-5" /></Button>
        <Button variant="ghost" size="icon"><Play className="w-5 h-5" /></Button>
        <Button variant="ghost" size="icon"><SkipForward className="w-5 h-5" /></Button>
        <Button variant="ghost" size="icon"><Star className="w-5 h-5" /></Button>
        <Button variant="ghost" size="icon"><Share2 className="w-5 h-5" /></Button>
        <Button variant="ghost" size="icon"><Settings className="w-5 h-5" /></Button>
      </div>
    </div>
    <div className="mt-2 bg-gray-200 rounded-full h-1">
      <div className="bg-blue-500 h-1 rounded-full w-1/3"></div>
    </div>
  </div>
);

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const trendingPodcasts = [
    { title: "Tech Talk", author: "Jane Doe", tags: ["technology", "news"], avatar: "/placeholder.svg" },
    { title: "Daily Digest", author: "John Smith", tags: ["news", "politics"], avatar: "/placeholder.svg" },
  ];

  const topRatedPodcasts = [
    { title: "Science Hour", author: "Dr. Brown", tags: ["science", "education"], avatar: "/placeholder.svg" },
    { title: "Comedy Central", author: "Laugh Co.", tags: ["comedy", "entertainment"], avatar: "/placeholder.svg" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Input
            type="text"
            placeholder="Search podcasts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Trending Podcasts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trendingPodcasts.map((podcast, index) => (
              <PodcastCard key={index} {...podcast} />
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Top Rated Podcasts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {topRatedPodcasts.map((podcast, index) => (
              <PodcastCard key={index} {...podcast} />
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Explore Topics</h2>
          <div className="flex flex-wrap gap-2">
            {["Technology", "News", "Politics", "Science", "Education", "Comedy", "Entertainment"].map((topic, index) => (
              <Button key={index} variant="outline">#{topic}</Button>
            ))}
          </div>
        </div>
      </div>

      <PodcastPlayer
        title="Currently Playing Podcast"
        author="Current Author"
        avatar="/placeholder.svg"
      />
    </div>
  );
};

export default Index;
