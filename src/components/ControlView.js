import styled from 'styled-components'

const ControlViewBlock = styled.div`
    height: 40vh;
    margin-top:-32px;
    width: 100%;
    background: yellowgreen;
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
`
const ControlSlider = styled.input`
   -webkit-appearance: none;  
  appearance: none;
  width: 50%; 
  height: 25px; 
  background: #d3d3d3; 
  outline: none; 
  opacity: 0.7; 
  -webkit-transition: .2s; 
  transition: opacity .2s;
  &:hover{
    background: #d4d4d4;
  }
  ::-webkit-slider-thumb{
    -webkit-appearance: none;
  appearance: none;
  width: 25px;
  height: 25px;
  background: #4CAF50;
  cursor: pointer;
  }
  ::-moz-range-thumb {
  width: 25px;
  height: 25px;
  background: #4CAF50;
  cursor: pointer;
}
`

const StartButton = styled.button`
  width: 50%;
  height: 50px;
  background: green;
  border:0;
  &:focus, &:active{
    padding:0;
    outline: none;
  }
  color: white;
  font-size: 36px;
`
const ControlView = ({beats,bpm, setBPM, setBeats, isPlaying, handlePlayToggle})=>{

    return(
        <ControlViewBlock>
               <StartButton onClick={handlePlayToggle}>
        {isPlaying? "STOP" : "START"}
      </StartButton>
                  {bpm} Bpm
          <ControlSlider
          type= "range"
          min = "40"
          max= "240"
          value={bpm}
          onChange={e=>setBPM(e.target.value)}/>
          {beats} Beats
          <ControlSlider
          type= "range"
          min = "1"
          max= "8"
          value={beats}
          onChange={e=>{
            setBeats(e.target.value);    
            }
          }/>
        </ControlViewBlock>
    )
}

export default ControlView;