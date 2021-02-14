import styled from 'styled-components';
import {useState} from 'react'
import BeatBall from './BeatBall';
const BeatViewBlock = styled.div`
    width:100%;
    height: 60%;
    background: #f7f7f7;
    display:flex;
    justify-content:space-around;
    align-items:center;
`
const Box = styled.div`
width: 75px;
height: 75px;
background: ${props=>props.on ? "#ffa069": "tomato"};
border-radius:50%;
`
const TapButton = styled.div`
  top: 0;
  lefT: 0;
  width: 100px;
  height:100px;
  position: absolute;
  background: coral;
  font-size: 48px;
  display:flex;
  justify-content:center;
  align-items:center;
  color: #fff;
  border-radius: 0 0 25px;
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