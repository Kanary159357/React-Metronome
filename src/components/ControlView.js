import styled from 'styled-components'

const ControlViewBlock = styled.div`
    height: 40vh;
    margin-top:-32px;
    width: 100%;
    background: #BDDDBF;
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
    user-select: none;
`
const ControlSlider = styled.input`
   -webkit-appearance: none;  
  appearance: none;
  width: 50%; 
  height: 25px; 
  background: #7EA285; 
  outline: none; 
  opacity: 0.7; 
  -webkit-transition: .2s; 
  transition: opacity .2s;
  &:hover{
    background: #97ba9e;
  }
  ::-webkit-slider-thumb{
    -webkit-appearance: none;
  appearance: none;
  width: 25px;
  height: 25px;
  background: #D9EDDE;
  cursor: pointer;
  }
  ::-moz-range-thumb {
  width: 25px;
  height: 25px;
  background: #D9EDDE;
  cursor: pointer;
}
`


const StartButton = styled.button`
  width: 50%;
  height: 50px;
  background: #465D52;
  border:0;
  &:focus, &:active{
    padding:0;
    outline: none;
  }
  &:hover{
    background:#354a40;
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
          min = "2"
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