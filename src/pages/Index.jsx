import { useState, useRef, useEffect } from 'react';
import { Search, Headphones, Star, Flag, Play, Pause, SkipBack, SkipForward, Share2, Settings, Volume2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { FacebookShareButton, TwitterShareButton, LinkedinShareButton } from 'react-share';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

const PodcastCard = ({ title, author, tags, avatar, audioSrc, onPlay, onFavorite, isFavorite }) => (
  <div className="bg-white p-4 rounded-lg shadow-md h-[200px] flex flex-col relative">
    <Button variant="ghost" size="sm" className="absolute top-1 right-1 text-gray-400">
      <Flag className="w-4 h-4" />
    </Button>
    <div className="flex mb-2">
      <img src={avatar} alt={author} className="w-10 h-10 object-cover mr-2" />
      <div className="overflow-hidden">
        <h3 className="font-semibold whitespace-nowrap overflow-x-auto text-ellipsis">{title}</h3>
        <p className="text-sm text-gray-600">{author}</p>
      </div>
    </div>
    <div className="mb-2 overflow-x-auto whitespace-nowrap">
      {tags.map((tag, index) => (
        <span key={index} className="inline-block bg-gray-200 text-xs px-2 py-1 rounded mr-1 mb-1">#{tag}</span>
      ))}
    </div>
    <div className="mt-auto flex justify-end space-x-2">
      <Button variant="outline" size="sm" onClick={() => onPlay({ title, author, avatar, audioSrc })}>
        <Play className="w-4 h-4 mr-1" />
        Play
      </Button>
      <Button variant="outline" size="sm" onClick={onFavorite}>
        <Star className={`w-4 h-4 mr-1 ${isFavorite ? 'text-yellow-500 fill-yellow-500' : ''}`} />
        {isFavorite ? 'Favorited' : 'Favorite'}
      </Button>
    </div>
  </div>
);

const PodcastPlayer = ({ currentPodcast, onClose, onFavorite, isFavorite, onShare, onSettings }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  if (!currentPodcast) return null;

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <img src={currentPodcast.avatar} alt={currentPodcast.author} className="w-12 h-12 rounded-full mr-3" />
          <div>
            <h3 className="font-semibold">{currentPodcast.title}</h3>
            <p className="text-sm text-gray-600">{currentPodcast.author}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={onFavorite}>
            <Star className={`w-5 h-5 ${isFavorite ? 'text-yellow-500 fill-yellow-500' : ''}`} />
          </Button>
          <Button variant="ghost" size="icon" onClick={onShare}>
            <Share2 className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onSettings}>
            <Settings className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </Button>
        </div>
      </div>
      <AudioPlayer
        autoPlay
        src={currentPodcast.audioSrc}
        onPlay={handlePlay}
        onPause={handlePause}
        showJumpControls={true}
        layout="stacked"
        customProgressBarSection={[
          "CURRENT_TIME",
          "PROGRESS_BAR",
          "DURATION",
        ]}
        customControlsSection={[
          "MAIN_CONTROLS",
          "VOLUME_CONTROLS",
        ]}
      />
    </div>
  );
};

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPodcast, setCurrentPodcast] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [timbre, setTimbre] = useState(50);
  const [prosody, setProsody] = useState(50);
  const [voiceType, setVoiceType] = useState('male');
  const [showCaptions, setShowCaptions] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef(null);

  const trendingPodcasts = [
    { title: "Tech Talk", author: "Jane Doe", tags: ["technology", "news"], avatar: "/placeholder.svg", audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
    { title: "Daily Digest", author: "John Smith", tags: ["news", "politics"], avatar: "/placeholder.svg", audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  ];

  const topRatedPodcasts = [
    { title: "Science Hour", author: "Dr. Brown", tags: ["science", "education"], avatar: "/placeholder.svg", audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
    { title: "Comedy Central", author: "Laugh Co.", tags: ["comedy", "entertainment"], avatar: "/placeholder.svg", audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" },
  ];

  const handlePlay = (podcast) => {
    setCurrentPodcast(podcast);
    setIsPlaying(true);
  };

  const handleFavorite = (podcast) => {
    setFavorites(prevFavorites => {
      if (prevFavorites.some(fav => fav.title === podcast.title)) {
        return prevFavorites.filter(fav => fav.title !== podcast.title);
      } else {
        return [...prevFavorites, podcast];
      }
    });
  };

  const handleShare = () => {
    setIsShareModalOpen(true);
  };

  const handleSettings = () => {
    setIsSettingsModalOpen(true);
  };

  const handleClosePlayer = () => {
    setCurrentPodcast(null);
    setIsPlaying(false);
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  return (
    <div className="min-h-screen bg-gray-100 p-4 pb-32">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {trendingPodcasts.map((podcast, index) => (
              <PodcastCard
                key={index}
                {...podcast}
                onPlay={handlePlay}
                onFavorite={() => handleFavorite(podcast)}
                isFavorite={favorites.some(fav => fav.title === podcast.title)}
              />
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Top Rated Podcasts</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {topRatedPodcasts.map((podcast, index) => (
              <PodcastCard
                key={index}
                {...podcast}
                onPlay={handlePlay}
                onFavorite={() => handleFavorite(podcast)}
                isFavorite={favorites.some(fav => fav.title === podcast.title)}
              />
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

      {currentPodcast && (
        <PodcastPlayer
          currentPodcast={currentPodcast}
          onClose={handleClosePlayer}
          onFavorite={() => handleFavorite(currentPodcast)}
          isFavorite={favorites.some(fav => fav.title === currentPodcast.title)}
          onShare={handleShare}
          onSettings={handleSettings}
        />
      )}

      <Dialog open={isShareModalOpen} onOpenChange={setIsShareModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share this podcast</DialogTitle>
            <DialogDescription>
              Share this podcast on your favorite social media platforms.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center space-x-4">
            <FacebookShareButton url={window.location.href}>
              <Button variant="outline">Facebook</Button>
            </FacebookShareButton>
            <TwitterShareButton url={window.location.href}>
              <Button variant="outline">Twitter</Button>
            </TwitterShareButton>
            <LinkedinShareButton url={window.location.href}>
              <Button variant="outline">LinkedIn</Button>
            </LinkedinShareButton>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isSettingsModalOpen} onOpenChange={setIsSettingsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Podcast Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Playback Speed</label>
              <Slider
                value={[playbackSpeed]}
                onValueChange={(value) => setPlaybackSpeed(value[0])}
                max={2}
                min={0.5}
                step={0.1}
              />
              <span className="text-sm text-gray-500">{playbackSpeed}x</span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Timbre</label>
              <Slider
                value={[timbre]}
                onValueChange={(value) => setTimbre(value[0])}
                max={100}
                step={1}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Prosody</label>
              <Slider
                value={[prosody]}
                onValueChange={(value) => setProsody(value[0])}
                max={100}
                step={1}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Voice Type</label>
              <Select value={voiceType} onValueChange={setVoiceType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select voice type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="captions"
                checked={showCaptions}
                onCheckedChange={setShowCaptions}
              />
              <label
                htmlFor="captions"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Show Captions
              </label>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
