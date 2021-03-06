import React from 'react'
import styled from 'styled-components';
import MinImg from '../icons/min.png'
import CloseImg from '../icons/close.png'
const electron = window.require('electron');
const remote = electron.remote;

const TitleBar = styled.header`
  display:block;
  position:relative;
  height:32px;
  width:100%;
  top:0;
  left:0;
  background:red;

  .drag{
    width:100%;
    height:100%;
    -webkit-app-region: drag;
  }
`

const Control = styled.div`
   display:grid;
   grid-template-columns:repeat(2,46px);
   position: absolute;
   top:0;
   right:0;
   height:100%;
   -webkit-app-region: no-drag;
`
const AppTitle = styled.div`
  display:flex;
  align-items:center;
  overflow:hidden;
  margin-left: 8px;
  font-size:12px;
  line-height:1.5;
  height:32px;
  color: white;
`

const ControlButton = styled.div`
       grid-row:1/span 1;
       display:flex;
       justify-content:center;
       align-items:center;
       width: 100%;
       height:100%;
       &:hover{
        background:yellow;
       }
`


const AppHeader = ()=>{
  const MinClick = ()=>{
    console.log(remote.getCurrentWindow());
   remote.getCurrentWindow().minimize();
  }
  const CloseClick = ()=>{
    remote.getCurrentWindow().close();
  }
    return(
        <TitleBar>
        <div className="drag">
          <AppTitle>
              안녕
          </AppTitle>
          <Control>
            <ControlButton onClick = {MinClick}>
                <img src={MinImg}/>
            </ControlButton>
            <ControlButton onClick = {CloseClick}>
                <img src={CloseImg}/>
            </ControlButton>
          </Control>
        </div>
      </TitleBar>
    )
}

export default AppHeader;