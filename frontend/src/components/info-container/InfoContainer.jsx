import { useSelector } from 'react-redux';
import './InfoContainer.css';
import copyImg from '../../imgs/copy.png'
import attachImg from '../../imgs/attachment.png'
import useInfoManagerService from '../../services/InfoManagerServise';

const InfoContainer = () => {

    const {currentInfo} = useSelector(state=> state);
    const {withAttachments} = useSelector(state=>state);
    const {currentInfoKey} = useSelector(state=>state);
    const {searchWord} = useSelector(state=> state);
    const {downloadAttachment} = useInfoManagerService();

    let dataP = []
    if (currentInfo)
        dataP = currentInfo.split('\n');
    const ps = dataP.map((item, i)=>{

        let text = item.split(searchWord);
        const selectedSearchText = text.map((item, i) => {
            return i==0? (item) : (<><span className={'search-word'}>{searchWord}</span>{item}</>)
        })

        return (
            <p key={i}><span className='paragraph'>{selectedSearchText}</span></p>
        )
    })


    const copyText = (containerid) => {
        var range = document.createRange();
        const node = document.querySelector(`#${containerid}`);
        range.selectNode(node);
        window.getSelection().removeAllRanges(); 
        window.getSelection().addRange(range); 
        document.execCommand("copy");
        window.getSelection().removeAllRanges();
        alert("Текст скопирован в буфер обмена");
    }

    const showAttachmentButton = () => {
        return { 
            visibility: (withAttachments? 'visible': 'hidden'),
        }
    }

    const onDownloadAttachment = () => {
        downloadAttachment(currentInfoKey);        
    }

    return (
        <div style={{}}>
            <div id='infoText' className="info-text">{ps}</div>
            <div className='float-button' onClick={() => copyText('infoText')}>
                <img  src={copyImg}/>
            </div>
            <div className='float-button attach-button'
                onClick={onDownloadAttachment}
                style={showAttachmentButton()} >
                <img  src={attachImg}/>
            </div>
            
        </div>
        
    )
}

export default InfoContainer;