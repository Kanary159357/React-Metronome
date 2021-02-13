import React, {useState, useEffect,useRef, useReducer} from 'react'
import './App.css';
import styled from 'styled-components'

const Box = styled.div`
  width: 100px;
  height: 100px;
  background: ${props=>props.on ? "yellow": "tomato"};
  border-radius:50%;
`

function createContext(){
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  const audioCtx = new AudioCtx();

	return audioCtx;
}

let settings = {
	isPlaying: false,
	bpm: 88,
	beats: 4,
	currentBeat: -1
};


let audioCtx = undefined;
let nextBeatTime = 0;
let timerID;
let lookahead = 10.0;
let scheduleAheadTime = 0.025;
const notesInQueue = [];

let audioBuffers = [];

const getNextNoteTime = (currTime, bpm,beats)=>{
  const secondPerBeat = 60.0/ bpm/beats*4;
  return currTime+secondPerBeat;
}

function scheduleNote(currentBeat,  time){
  const numNotes = notesInQueue.length;
  if(numNotes){
    const lastScheduleNote = notesInQueue[numNotes-1].note;
    if(lastScheduleNote===currentBeat){
    return;
    }
  }
  notesInQueue.push({currentBeat, time});
  if(currentBeat === 0){
    playSoundAtTime(audioBuffers[1], time);
  }else{
    playSoundAtTime(audioBuffers[0], time);

  }
}

const playSoundAtTime = (buffer, time)=>{
  const sampleSource = audioCtx.createBufferSource();
  const gainNode = audioCtx.createGain();
  sampleSource.buffer = buffer;
  gainNode.gain.value = 1;

  sampleSource.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  sampleSource.start(time);
};

function setupSamples(){
  audioCtx = createContext();

  const samples = ['nnb.wav', 'nb.wav'];
  const promises = samples.map(async (sample) => {
		const response = await fetch(`${process.env.PUBLIC_URL}/sounds/${sample}`);
		const arrayBuffer = await response.arrayBuffer();
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
  if(prevBeat>= beats-1 || prevBeat==-1){
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
  const [arr, setArr] = useState([{},{},{},{}]);
  const start = async()=>{
    if(!audioCtx){
      const buffers = await setupSamples();
      audioBuffers = buffers;
    }

    nextBeatTime = audioCtx.currentTime;
    return;
  }


  useEffect(()=>{
    function scheduler(){
      const currentTime = audioCtx.currentTime;
      while(nextBeatTime< currentTime + scheduleAheadTime){
        const beatIndex= nextBeat(currentBeatRef.current,beats);
        scheduleNote(beatIndex, nextBeatTime);
        nextBeatTime = getNextNoteTime(currentTime,bpm,beats);
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
      setTimeout(pollForBeat, 1000/60);
    }
    if(isPlayingRef.current){
      scheduler();
      pollForBeat();
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

  useEffect(()=>{
    let newdata = [];
    for(var i = 0; i < beats; i++)
   newdata.push({});
    setArr(newdata);    
  },[beats])
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
          {beats} Beats
          <input
          type= "range"
          min = "2"
          max= "8"
          value={beats}
          onChange={e=>{
            setBeats(e.target.value);    
            }
          }/>

          {arr.map((_,i)=>
            <Box key={i} on={currentBeat==i}/>
          )}

      <button onClick={handlePlayToggle}>
        {isPlaying? "stop" : "start"}
      </button>
      <br/>
    </div>
  );
}

export default App;
