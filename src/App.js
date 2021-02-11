import React, {useState, useEffect,useRef, useReducer} from 'react'
import './App.css';
import styled from 'styled-components'
import tick1 from './nnb.wav'
import tick2 from './tick.mp3'

const Box = styled.div`
  width: 100px;
  height: 100px;
  background: ${props=>props.on ? "yellow": "tomato"};
`

function App() {
  const [bpm, setBpm] = useState(180);
  const [play, setPlay] = useState(false);
  const sound = new Audio(tick1);
  const sound1= new Audio(tick2);
  const [beat, setBeat] = useState(4);
  const [worker, setWorker] = useState();
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  useEffect(() => {
    const WorkerInstance= new Worker(`${process.env.PUBLIC_URL}/Worker.js`);
    setWorker(WorkerInstance);
    return ()=>{
      WorkerInstance.terminate();
      console.log('terminate');
    }
  },[]);

  useEffect(() => {
    if(worker){
        worker.onmessage = ({data}) =>{
          if(data="tick"){
            countRef.current = countRef.current+1;
            setCount(countRef.current);
              sound.play();
            }
        };
        worker.postMessage({message:"interval", interval: 60/bpm/beat*4*1000});
}
}, [worker, bpm,beat])

  useEffect(()=>{
    console.log(count);
  },[count]);

  const playPause =()=>{
      worker.postMessage({message: !play ? "start": "stop"});
    setPlay(!play);
  }



  return (
    <div>
      {bpm} Bpm
      <br/>
      {beat} beat
      <br/>
        <input
          type= "range"
          min = "60"
          max= "200"
          value={bpm}
          onChange={e=>setBpm(e.target.value)}/>
          <br/>
          <input 
          type="range"
          min="1"
          max="8"
          value={beat}
          onChange={e=>setBeat(e.target.value)}/>
      <button onClick={playPause}>
        {play? "stop" : "start"}
      </button>
      <br/>
    </div>
  );
}

export default App;
