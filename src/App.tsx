import './App.css'
import { useState, useRef } from "react"
import { FaPlay, FaPause } from 'react-icons/fa';

function App() {
  //audio
  const audioRef = useRef<HTMLAudioElement | null>(null);

  //トラックリスト
  type Track = {
    id: number;
    title: string;
    src: string;
    loop: boolean;
  }

  const playlist: Track[] = [
    {
      id:1,
      title:"(01)",
      src: "/music/(01)_master_128kbps.mp3",
      loop: false,
    },
    {
      id:2,
      title:"サッカーゲームBGM (loop)",
      src: "/music/サッカーゲームBGMmaster_128kbps.mp3",
      loop: true,
    },
    {
      id:3,
      title:"チュートリアルBGM (loop)",
      src: "/music/チュートリアルmaster_128kbps.mp3",
      loop: true,
    },
    {
      id:4,
      title:"砂浜ステージBGM (loop)",
      src: "/music/砂浜ステージBGMmaster_128kbps.mp3",
      loop: true,
    },
    {
      id:5,
      title:"管理者ステージBGM (loop)",
      src: "/music/管理者ステージBGMmaster_128kbps.mp3",
      loop: true,
    },
    {
      id:6,
      title:"宇宙のボスのテーマBGM (loop)",
      src: "/music/宇宙のボスのテーマBGMmaster_128kbps.mp3",
      loop: true,
    },
    {
      id:7,
      title:"天空ステージBGM (loop)",
      src: "/music/天空ステージBGMmaster_128kbps.mp3",
      loop: true,
    },
  ]

  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const currentTrack = playlist[currentTrackIndex];

  //再生しているかor停止しているか
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  //現在の再生時間
  const [currentTime, setCurrentTime] = useState<number>(0);

  //曲の長さ
  const [duration, setDuration] = useState<number>(0);

  //再生ボタン
  const handleTogglePlay= () => {
    if(!audioRef.current) return;

    if(isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    }else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  }

  //楽曲が終了した後のリセットハンドル
  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);

    if(audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  }

  //再生時間更新
  const handleTimeUpdate = () => {
    if(!audioRef.current) return;

    setCurrentTime(audioRef.current.currentTime);
  }

  //曲の長さを取得
  const handleLoadedMetadata = () => {
    if(!audioRef.current) return;

    setDuration(audioRef.current.duration);
  }

  //シークバー操作
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(!audioRef.current) return;

    const time = Number(e.target.value);
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  }

  //曲を選択
  const handleSelectTrack = (index: number) => {
    if(!audioRef.current) return;

    setCurrentTrackIndex(index);
    setCurrentTime(0);
    setIsPlaying(false);

    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  }

  //秒を00:00表示に変換
  const formatTime  = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const second = Math.floor(time % 60);
    return `${minutes}:${second.toString().padStart(2,"0")}`;
  }

  //残り時間の計算
  const remainingTime = Math.max(duration - currentTime, 0);

  return (
    <>
    <header className='header'>
      <h1>music-player</h1>
      <p>make by Ichiro Hamasaki<br/>
      composer by Ichiro Hamasaki
      </p>
    </header>

      <audio ref={audioRef} 
      src={currentTrack.src} 
      loop={currentTrack.loop}
      onTimeUpdate={handleTimeUpdate}
      onLoadedMetadata={handleLoadedMetadata}
      onEnded={handleEnded} />

      <div className={`record ${isPlaying ? "spinning" : ""}`}>
        <img src="/images/meimg.png" alt="record" />
      </div>


        <div className='track-title'>
          {currentTrack.title}
        </div>


      <div>
        <input className='seek' type="range" 
        min={0} 
        max={duration || 0} 
        step={0.1}
        value={currentTime} 
        onChange={handleSeek}/>
      </div>

  <div className="time">
      <p>{formatTime(currentTime)}</p>

    <div className='toggleplay'>
      <button onClick={handleTogglePlay}>
        {isPlaying ? <FaPause /> : <FaPlay />}
      </button>
    </div>

      <p>-{formatTime(remainingTime)}</p>
  </div>


    <h3>playlist</h3>

    <div className='playlistInfoText'>
      <p>Select a song</p>
      <p>(mp3 - 128kbps)</p>
    </div>

    <div className='playlist-wrapper'>
      <ul className='playlist'>
        
        {playlist.map((track, index) => (
          <li key={track.id}>

            <button onClick={() => handleSelectTrack(index)}
              className={index === currentTrackIndex ? "active" : ""}>
                {track.title}
              </button>

          </li>
        ))}
      </ul>
    </div>

  <div className='links'>
    <h5>link</h5>
      <ul>
        <li><a href="https://soundcloud.com/c10lwmu39zjn" 
        target='_blank' rel="noopener noreferrer">soundcloud</a></li>
        
        <li><a href="https://github.com/hamatech03/react-audio-player"
        target='_blank' rel="noopener noreferrer">github</a></li>
      </ul>
  </div>

    </>
  )
}

export default App
