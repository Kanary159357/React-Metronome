import styled from 'styled-components';
import BeatBall from './BeatBall';
const BeatViewBlock = styled.div`
    width:100%;
    height: 60%;
    background: white;
    display:flex;
    justify-content:space-around;
    align-items:center;
`

const BeatView = () =>{
    return <BeatViewBlock>
        <BeatBall/>
        </BeatViewBlock>
}

export default BeatView;