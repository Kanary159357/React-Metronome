import styled from 'styled-components';
import BeatView from './BeatView';
import ControlView from './ControlView'
const TemplateBlock = styled.div`
    width:100%;
    height:100%;
    position:fixed;
    background: tomato;
`
const PageTemplate = () => {
    return <TemplateBlock>
        <BeatView/>
        <ControlView/>
        </TemplateBlock>
}


export default PageTemplate;