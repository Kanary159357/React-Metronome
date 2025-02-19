import styled from 'styled-components';
import {useState} from 'react'
import BeatBall from './BeatBall';
const BeatViewBlock = styled.div`
    width:100%;
    height: 60vh;
    background: #FEF3C8;
    display:flex;
    justify-content:space-around;
    align-items:center;
`
const Box = styled.div`
width: 75px;
height: 75px;
background: ${props=>props.on ? "#FBAB6F": "#EC8953"};
border-radius:50%;
`
const TapButton = styled.div`
  top: 0;
  left: 0;
  width: 10%;
  height:10%;
  position: absolute;
  background: #EC8953;
  font-size: 1.5em;
  display:flex;
  justify-content:center;
  align-items:center;
  color: #fff;
  user-select:none;
  border-radius: 0 0 15px;
`

const BeatView = ({arr, currentBeat, TapTempo}) =>{
    return <BeatViewBlock>
      <TapButton onClick= {TapTempo} >Tap</TapButton>
           {arr.map((_,i)=>
            <Box key={i} on={currentBeat==i ? 1: 0}/>
          )}
        </BeatViewBlock>
}

export default BeatView;