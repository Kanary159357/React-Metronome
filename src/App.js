import React, {useState, useEffect,useRef, useReducer} from 'react'
import './App.css';
import styled from 'styled-components'

const Box = styled.div`
  width: 100px;
  height: 100px;
  background: ${props=>props.on ? "yellow": "tomato"};
`

function createContext(){
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  const audioCtx = new AudioCtx();

  if (audioCtx.state === "suspended") {
		audioCtx.resume();
	}

	return audioCtx;
}

let defaultBeats= [{ volume: 100 }, { volume: 50 }, { volume: 25 }, { volume: 50 }];
let settings = {
	isPlaying: false,
	bpm: 88,
	beats: defaultBeats,
	currentBeat: -1
};


let audioCtx = undefined;
let nextBeatTime = 0;
let timerID;
let lookahead = 10.0;
let scheduleAheadTime = 0.025;
const notesInQueue = [];

let audioBuffers = [];

const getNextNoteTime = (currTime, bpm)=>{
  const secondPerBeat = 60.0/ bpm;
  return currTime+secondPerBeat;
}

function scheduleNote(currentBeat, volume,  time){
  const numNotes = notesInQueue.length;
  if(numNotes){
    const lastScheduleNote = notesInQueue[numNotes-1].note;
    if(lastScheduleNote===currentBeat){
    return;
    }
  }
  notesInQueue.push({currentBeat, time});
  if(currentBeat === 0){
    playSoundAtTime(audioBuffers[1], volume, time);
  }else{
    playSoundAtTime(audioBuffers[0], volume, time);

  }
}

const playSoundAtTime = (buffer, volume, time)=>{
  const sampleSource = audioCtx.createBufferSource();
  const gainNode = audioCtx.createGain();
  sampleSource.buffer = buffer;
  gainNode.gain.value = volume/100;

  sampleSource.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  sampleSource.start(time);
};

function setupSamples(){
  audioCtx = createContext();

  const samples = ['click.mp3', 'accent.mp3'];
  const promises = samples.map(async (sample) => {
		const response = await fetch(`${process.env.PUBLIC_URL}/sounds/${sample}`);
		const arrayBuffer = await response.arrayBuffer();
		// Using callbacks because promise syntax doesn't work in Safari (12/9/20)
		// https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/decodeAudioData#Older_callback_syntax
		return new Promise((resolve, reject) => {
			audioCtx.decodeAudioData(
				arrayBuffer,
				function (result) {
					resolve(result);
				},
				function (e) {
					reject(e);
				}
			);
		});
	});
	return Promise.all(promises); 
}

function nextBeat(prevBeat, beats){
  console.log(prevBeat);
  if(prevBeat>= beats.length-1 || prevBeat==-1){
    return 0;
  }else{
    return prevBeat+1;
  }
}

function App() {
	const [isPlaying, setPlaying] = useState(settings.isPlaying);
	const isPlayingRef = useRef(settings.isPlaying); // to handle stale closure issue
	const [currentBeat, setCurrentBeat] = useState(settings.currentBeat);
	const currentBeatRef = useRef(settings.currentBeat); // to handle stale closure issue
	const [bpm, setBPM] = useState(settings.bpm);
	const [beats, setBeats] = useState(settings.beats);

  const start = async()=>{
    if(!audioCtx){
      const buffers = await setupSamples();
      audioBuffers = buffers;
    }
    if(audioCtx.state==="suspended"){
      audioCtx.resume();
    }
    nextBeatTime = audioCtx.currentTime;
    console.log(nextBeatTime);
    return;
  }

  
  
  useEffect(()=>{
    function scheduler(){
      const currentTime = audioCtx.currentTime;
      while(nextBeatTime< currentTime + scheduleAheadTime){
        const beatIndex= nextBeat(currentBeatRef.current,beats);
        const volume = beats[beatIndex].volume;
        scheduleNote(beatIndex,volume, nextBeatTime);
        nextBeatTime = getNextNoteTime(currentTime,bpm);
      }
      timerID =setTimeout(scheduler, lookahead);
    }
    function pollForBeat(){
      const currentTime = audioCtx.currentTime;
      while(notesInQueue.length && notesInQueue[0].time<currentTime){
        currentBeatRef.current = notesInQueue[0].currentBeat;
        setCurrentBeat(currentBeatRef.current);
        notesInQueue.splice(0,1);
      }
      if(!isPlayingRef.current){
        return;
      }
      requestAnimationFrame(pollForBeat);
    }
    if(isPlayingRef.current){
      scheduler();
      requestAnimationFrame(pollForBeat);
    }
    return ()=>{
      clearTimeout(timerID);
    };

  },[isPlaying, beats, bpm]);

  const stopAndRest = ()=>{
    notesInQueue.splice(0);
    currentBeatRef.current = -1;
    setCurrentBeat(currentBeatRef.current);
  };

  const handlePlayToggle = async()=>{
    if(isPlaying)
    stopAndRest();
    else{
      try{
        await start();
      }catch (error){
        alert(error.message);
        return;
      }
    }
    isPlayingRef.current = !isPlayingRef.current;
    setPlaying(isPlayingRef.current);
  }
  return (
    <div>
      {bpm} Bpm
      <br/>
        <input
          type= "range"
          min = "60"
          max= "200"
          value={bpm}
          onChange={e=>setBPM(e.target.value)}/>
          <br/>
 
      <button onClick={handlePlayToggle}>
        {isPlaying? "stop" : "start"}
      </button>
      <br/>
    </div>
  );
}

export default App;
