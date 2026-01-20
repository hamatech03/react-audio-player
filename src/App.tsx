import { useState, useRef } from "react"

function App() {
  //Hooks
  //audio
  const audioRef = useRef<HTMLAudioElement | null>(null);

  //再生or停止
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  //現在の再生時間
  const [currentTime, setCurrentTime] = useState<number>(0);

  //曲の長さ
  const [duration, setDuration] = useState<number>(0);

  //再生ボタン
  const handlePlay = () => {

    //audioRef.currentがnullのときtrue判定になりreturnが実行される。
    if(!audioRef.current) return;

    audioRef.current.play();
    setIsPlaying(true);
  }

  //停止ボタン
  const handlePause = () => {
    if(!audioRef.current) return;

    audioRef.current.pause();
    setIsPlaying(false);
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
    <div>
      <h1>music-player</h1>
      <p>make by Ichiro Hamasaki</p>
    </div>

      <audio ref={audioRef} 
      src="/music/(01)_master_128kbps.mp3" 
      onTimeUpdate={handleTimeUpdate}
      onLoadedMetadata={handleLoadedMetadata}/>

      <div>
        <input type="range" 
        min={0} 
        max={duration || 0} 
        step={0.1}
        value={currentTime} 
        onChange={handleSeek}/>
      </div>

      <p>
        {formatTime(currentTime)} / {formatTime(duration)} (残り {formatTime(remainingTime)})
      </p>

    <div>
      <button onClick={handlePlay} disabled={isPlaying}>再生</button>
      <button onClick={handlePause} disabled={!isPlaying}>停止</button>
    </div>

    </>
  )
}

export default App
