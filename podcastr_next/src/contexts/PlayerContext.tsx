import { createContext, ReactNode, useContext, useState  } from 'react'

type Episode = {
    title:string,
    members:string,    
    thumbnail:string,
    duration:number,    
    url:string,
}

type PlayerContextData = {
    episodeList: Episode[];
    currentEpisodeIndex: number;
    isPlaying: boolean;
    hasNext: boolean;
    hasPrev: boolean;
    isLooping: boolean;
    isShuffling: boolean;

    play: (episode: Episode) => void;
    togglePlay: () => void;
    setPlayingState:(state: boolean)=>void;
    playList: (list: Episode[], index: number)=>void;
    playNext: ()=>void;
    playPrev: ()=>void;
    toggleLoop: ()=>void;
    toggleShuffle: ()=>void;
    clearPlayerState: ()=>void;

}

type PlayerContextProviderProps = {
    children: ReactNode;
}

export const PlayerContext = createContext({} as PlayerContextData)

export function PlayerContextProvider({children }: PlayerContextProviderProps) {
  const [episodeList, setEpisodeList] = useState([])
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLooping, setIsLooping] = useState(false)
  const [isShuffling, setIsShuffling] = useState(false)

  const hasPrev = currentEpisodeIndex>0
  const hasNext = isShuffling || currentEpisodeIndex+1 < episodeList.length

  function play (episode: Episode){
    setEpisodeList([episode])
    setCurrentEpisodeIndex(0)
    setIsPlaying(true)
  }

  function playList(list: Episode[], index: number){
    setEpisodeList(list)
    setCurrentEpisodeIndex(index)
    setIsPlaying(true)
  }

  function togglePlay(){
    setIsPlaying(!isPlaying)
  }

  function toggleLoop(){
      setIsLooping(!isLooping)
  }

  function toggleShuffle(){
    setIsShuffling(!isShuffling)
  }

  function setPlayingState(state: boolean){
    setIsPlaying(state)
  }
  function playNext(){
    if(isShuffling){
        const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length)
        setCurrentEpisodeIndex(nextRandomEpisodeIndex)
    }
    else{
        const nextEpisodeIndex = currentEpisodeIndex+1
        if(!hasNext) return
        setCurrentEpisodeIndex(nextEpisodeIndex)
    }
  }
  function playPrev(){
    if(hasPrev)  
        setCurrentEpisodeIndex(currentEpisodeIndex-1)
  }
  
  function clearPlayerState() {
      setEpisodeList([])
      setCurrentEpisodeIndex(0)
  }


    return (
        <PlayerContext.Provider value={{
            episodeList, 
            currentEpisodeIndex, 
            isPlaying, 
            isLooping,
            isShuffling,
            hasNext, 
            hasPrev,
            togglePlay, 
            toggleLoop,
            toggleShuffle,
            setPlayingState,
            play, 
            playList,
            playNext,
            playPrev,
            clearPlayerState,
        }}>
            {children}
        </PlayerContext.Provider>
    )
}

export const usePlayer = () => useContext(PlayerContext)


