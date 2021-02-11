import styled from 'styled-components'

const CircleBlock = styled.div`
    width: 5em;
    height: 5em;
    border-radius: 50%;
    background: ${props=>props.on ? "tomato" : "yellow"};
`

const BeatBall =  ({on}) =>{
    return <CircleBlock on = {on}/>
}

export default BeatBall;