import React, {useState, useEffect,useRef, useReducer} from 'react'
import './App.css';
import styled from 'styled-components'
import ControlView from './components/ControlView';
import BeatView from './components/BeatView';

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

const Wrapper = styled.div`
  position:fixed;
  width:100%;
  height: 100%;
  top:0;
  left: 0;
`

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
	const isPlayingRef = useRef(settings.isPlaying);
	const [currentBeat, setCurrentBeat] = useState(settings.currentBeat);
	const currentBeatRef = useRef(settings.currentBeat); 
	const [bpm, setBPM] = useState(settings.bpm);
	const [beats, setBeats] = useState(settings.beats);
  const [arr, setArr] = useState([{},{},{},{}]);
  const [worker, setWorker] = useState();
  const [prev,setPrev] = useState(80);
  const prevRef = useRef(prev);
  const workerRef = useRef(worker);
  const start = async()=>{
    if(!audioCtx){
      const buffers = await setupSamples();
      audioBuffers = buffers;
    }
    nextBeatTime = audioCtx.currentTime;
    return;
  }

  const scheduler = ()=>{
    const currentTime = audioCtx.currentTime;
    while(nextBeatTime< currentTime + scheduleAheadTime){
      const beatIndex= nextBeat(currentBeatRef.current,beats);
      scheduleNote(beatIndex, nextBeatTime);
      nextBeatTime = getNextNoteTime(currentTime,bpm,beats);
    }
  }

  const pollForBeat = ()=>{
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

  useEffect(()=>{
      if(worker){
        if(isPlayingRef.current){
        pollForBeat();
        worker.onmessage = function(e) {
          if (e.data == "tick") {
              scheduler();
          }
          else
              console.log("message: " + e.data);
        };
        worker.postMessage({"interval":lookahead});
        }
      } 
 
  },[isPlaying, beats, bpm]);


  useEffect(()=>{
    const WorkerInstance = new Worker(`${process.env.PUBLIC_URL}/Worker.js`);
    workerRef.current = WorkerInstance;
    setWorker(workerRef.current);
    return ()=>{
      WorkerInstance.terminate();
    }
  },[])

  useEffect(()=>{
    function handleTapKey(event){
      if(event.keyCode===13){
        event.preventDefault();
      TapTempo();
      }
      if(event.keyCode===32){
        event.preventDefault();
      handlePlayToggle();
      }
    }
    document.addEventListener('keydown', handleTapKey);
    return ()=>{
      document.removeEventListener('keydown',handleTapKey);
    }
  })

  const stopAndRest = ()=>{
    notesInQueue.splice(0);
    worker.postMessage("stop");
    currentBeatRef.current = -1;
    setCurrentBeat(currentBeatRef.current);
  };

  const TapTempo = ()=>{
    var d = new Date();
    var temp = parseInt(d.getTime(), 10);
    var bpmValue= Math.ceil(60000/(temp-prevRef.current));
    setBPM(bpmValue>240 ? 240 : bpmValue);
    prevRef.current = temp;
    setPrev(prevRef.current);
  }

  const handlePlayToggle = async()=>{
    if(isPlaying){
    stopAndRest();
    }
    else{
      try{
        worker.postMessage("start");
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
    <Wrapper>
     <BeatView currentBeat= {currentBeat} arr={arr} setBPM={setBPM} TapTempo={TapTempo}/>
     <ControlView beats={beats} bpm={bpm} setBeats={setBeats} setBPM={setBPM} handlePlayToggle={handlePlayToggle} isPlaying={isPlaying}/>
    </Wrapper>
  );
}

export default App;
