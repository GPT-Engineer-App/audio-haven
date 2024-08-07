import { useState, useRef, useEffect } from 'react';
import { Search, Headphones, Star, Flag, Play, Pause, SkipBack, SkipForward, Share2, Settings, Volume2, VolumeX } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const VolumeControl = ({ volume, setVolume }) => {
  const [prevVolume, setPrevVolume] = useState(volume);

  const handleVolumeChange = (value) => {
    setVolume(value[0] / 100);
    if (value[0] > 0) {
      setPrevVolume(value[0] / 100);
    }
  };

  const toggleMute = () => {
    if (volume > 0) {
      setPrevVolume(volume);
      setVolume(0);
    } else {
      setVolume(prevVolume);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Button variant="ghost" size="sm" onClick={toggleMute} className="p-0">
        {volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
      </Button>
      <Slider
        value={[volume * 100]}
        max={100}
        step={1}
        onValueChange={handleVolumeChange}
        className="w-24"
      />
    </div>
  );
};
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { FacebookShareButton, TwitterShareButton, LinkedinShareButton } from 'react-share';

const PodcastCard = ({ title, author, tags, avatar, audioSrc, onPlay, onFavorite, isFavorite }) => {
  const handlePlay = () => {
    onPlay({ title, author, avatar, audioSrc });
    setTimeout(() => {
      const audioPlayer = document.querySelector('audio');
      if (audioPlayer) {
        audioPlayer.play().catch(error => console.error('Error playing audio:', error));
      }
    }, 0);
  };

  return (
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
        <Button variant="outline" size="sm" onClick={handlePlay}>
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
};

const PodcastPlayer = ({ currentPodcast, onClose, onFavorite, isFavorite, onShare, onSettings, onPrevTrack, onNextTrack }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef(null);

  useEffect(() => {
    if (!navigator.mediaSession || !currentPodcast) return;

    navigator.mediaSession.metadata = new MediaMetadata({
      title: currentPodcast.title || '',
      artist: currentPodcast.author || '',
      album: currentPodcast.tags ? currentPodcast.tags.join(', ') : '',
      artwork: [{ src: currentPodcast.avatar || '', sizes: '512x512', type: 'image/svg+xml' }]
    });

    navigator.mediaSession.setActionHandler('play', () => playTrack());
    navigator.mediaSession.setActionHandler('pause', () => pauseTrack());
    navigator.mediaSession.setActionHandler('previoustrack', () => onPrevTrack());
    navigator.mediaSession.setActionHandler('nexttrack', () => onNextTrack());

    return () => {
      navigator.mediaSession.setActionHandler('play', null);
      navigator.mediaSession.setActionHandler('pause', null);
      navigator.mediaSession.setActionHandler('previoustrack', null);
      navigator.mediaSession.setActionHandler('nexttrack', null);
    };
  }, [currentPodcast, onPrevTrack, onNextTrack]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('ended', handleTrackEnded);
    }
    return () => {
      if (audio) {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('ended', handleTrackEnded);
      }
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume;
    }
  }, [volume]);

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (audio) {
      setCurrentTime(audio.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    const audio = audioRef.current;
    if (audio) {
      setDuration(audio.duration);
    }
  };

  const handleTrackEnded = () => {
    onNextTrack();
  };

  const playTrack = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.play().catch(error => console.error('Error playing audio:', error));
      setIsPlaying(true);
      navigator.mediaSession.playbackState = "playing";
    }
  };

  const pauseTrack = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      setIsPlaying(false);
      navigator.mediaSession.playbackState = "paused";
    }
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      pauseTrack();
    } else {
      playTrack();
    }
  };

  const handleSeek = (newTime) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!currentPodcast) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center flex-1">
          <img src={currentPodcast.avatar} alt={currentPodcast.author} className="w-12 h-12 rounded-full mr-3" />
          <div>
            <h3 className="font-semibold">{currentPodcast.title}</h3>
            <p className="text-sm text-gray-600">{currentPodcast.author}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 flex-1 justify-center">
          <Button variant="ghost" size="icon" onClick={onPrevTrack}>
            <SkipBack className="w-6 h-6" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handlePlayPause}>
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={onNextTrack}>
            <SkipForward className="w-6 h-6" />
          </Button>
        </div>
        <div className="flex items-center space-x-2 flex-1 justify-end">
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
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 flex-1">
          <span className="text-sm whitespace-nowrap">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
          <Slider
            value={[currentTime]}
            max={duration}
            step={1}
            onValueChange={(value) => handleSeek(value[0])}
            className="flex-1"
          />
        </div>
        <VolumeControl volume={volume} setVolume={setVolume} />
      </div>
      <audio
        ref={audioRef}
        src={currentPodcast.audioSrc}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
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
  const [currentPodcastIndex, setCurrentPodcastIndex] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [timbre, setTimbre] = useState(50);
  const [prosody, setProsody] = useState(50);
  const [voiceType, setVoiceType] = useState('male');
  const [showCaptions, setShowCaptions] = useState(false);

  // Removed unused volumeSliderStyles effect

  const allPodcasts = [
    { title: "Tech Talk", author: "Jane Doe", tags: ["technology", "news"], avatar: "/placeholder.svg", audioSrc: "https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3" },
    { title: "Daily Digest", author: "John Smith", tags: ["news", "politics"], avatar: "/placeholder.svg", audioSrc: "https://assets.mixkit.co/music/preview/mixkit-hip-hop-02-738.mp3" },
    { title: "Science Hour", author: "Dr. Brown", tags: ["science", "education"], avatar: "/placeholder.svg", audioSrc: "https://assets.mixkit.co/music/preview/mixkit-dreaming-big-31.mp3" },
    { title: "Comedy Central", author: "Laugh Co.", tags: ["comedy", "entertainment"], avatar: "/placeholder.svg", audioSrc: "https://assets.mixkit.co/music/preview/mixkit-funny-circus-clowns-310.mp3" },
  ];

  const trendingPodcasts = allPodcasts.slice(0, 2);
  const topRatedPodcasts = allPodcasts.slice(2);

  const handlePlay = (podcast) => {
    const index = allPodcasts.findIndex(p => p.title === podcast.title);
    setCurrentPodcastIndex(index);
    setCurrentPodcast(podcast);
    // Delay playing until the next render cycle when the audio element is available
    setTimeout(() => {
      const audioPlayer = document.getElementById('audio-player');
      if (audioPlayer) {
        audioPlayer.play();
      }
    }, 0);
  };

  const handleTrackChange = (direction) => {
    const newIndex = direction === 'next'
      ? (currentPodcastIndex + 1) % allPodcasts.length
      : (currentPodcastIndex - 1 + allPodcasts.length) % allPodcasts.length;
    setCurrentPodcastIndex(newIndex);
    setCurrentPodcast(allPodcasts[newIndex]);
    setTimeout(() => {
      const audioPlayer = document.querySelector('audio');
      if (audioPlayer) {
        audioPlayer.play().catch(error => console.error('Error playing audio:', error));
      }
    }, 0);
  };

  const handlePrevTrack = () => handleTrackChange('prev');
  const handleNextTrack = () => handleTrackChange('next');

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
  };

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
          onPrevTrack={handlePrevTrack}
          onNextTrack={handleNextTrack}
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
                className="w-full"
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
