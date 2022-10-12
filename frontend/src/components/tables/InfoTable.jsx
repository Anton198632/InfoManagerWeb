import Table from 'react-bootstrap/Table';
import { useSelector, useDispatch } from 'react-redux';
import './InfoTable.css'
import { updateInfoNotice, sortInfo,  } from '../../redux/actions';
import sortUpImg from '../../imgs/sort-up.png'
import sortDownImg from '../../imgs/sort-down.png'
import { useEffect, useState } from 'react';
import * as Names from '../../settings/consts'
import useInfoManagerService from '../../services/InfoManagerServise';

const InfoTable = (props) => {

  const {informations, currentInfoKey} = useSelector(state=>state);
  const dispatch = useDispatch();
  const [selectedRow, setSelectedRow] = useState(0);
  const {updateNotice} = useInfoManagerService();

  const onBlurNotice =(e)=>{
    const val = e.target.value;
    const rowN = e.target.parentElement.parentElement.getAttribute('data-key')
    dispatch(updateInfoNotice(rowN, val));
    updateNotice(currentInfoKey, val);
  }

  useEffect(()=>{
    document.onkeydown = (e) => {
      
      let direct = 1;      
      if (e.key === 'ArrowUp')
        direct = -1;
      else if (e.key === 'ArrowDown')
        direct = 1;
      else 
        return

      e.preventDefault();
        
      const trList = document.querySelectorAll('.row-class');

      if (trList.length === 1)
        return;

      let nextRowIndex = selectedRow + direct;
      if (nextRowIndex < 1){
        nextRowIndex = trList.length - 1;
      }
      if (nextRowIndex === trList.length)
        nextRowIndex = 1

      let parent = trList[nextRowIndex];
      getInformationHandler(parent);

    }

  })

  useEffect(()=> {

    const table = document.querySelector('.left-pane');
    table.scrollTop = table.scrollHeight - table.clientHeight;


  }, [])



  const onClickHandler = (e) => {

    let parent = e.target.parentElement;
    getInformationHandler(parent);
  }

  const onDoubleClickHandler = (e) => {
    
    let parent = e.target.parentElement;
    const key = parent.getAttribute('data-key');
    getInformationHandler(parent);
    props.onEditInfo(key);

  }

  const getInformationHandler = (parent) => {

    const key = parent.getAttribute('data-key');
      if (key === null)
        return

      document.querySelectorAll('tr').forEach((item, i) => {
        if (!item.classList.contains('tb-header'))
            item.style.background = 'none';
        
        if (item.getAttribute('data-key') === key)
          setSelectedRow(i);
      })
      
      if (parent.nodeName === 'TD')
        parent = parent.parentElement;
      parent.style.background = '#0080002b'
      
      props.updateCurrentInfo(key);

  }

  const sortByField = (e) => {

    const tds = document.querySelector('th img')
      
    let isUp = true;
    let img = sortUpImg;
    if (e.target.querySelector('img')){
      if (e.target.querySelector('img').getAttribute('data-up') === 'true'){
        isUp = false;
        img = sortDownImg;
      }
    }
    e.target.insertAdjacentHTML("beforeend", `<img data-up="${isUp}" src="${img}" />`);

    if (tds)
        tds.remove();
      
    //dispatch(sortInfo(e.target.textContent, isUp));
    console.log(e.target.getAttribute('data-alias'));
    dispatch(sortInfo(e.target.getAttribute('data-alias'), isUp));

  }

  const rows = informations.map((item, i) => {
    return (
        <tr key={item.Key} 
            data-key={item.Key} 
            className='row-class' 
            onClick={onClickHandler}
            onDoubleClick={onDoubleClickHandler}>
          <td>{item.Key}</td>
          <td>{item.DateTime}</td>
          <td>{item.SourceType}</td>
          <td>{item.Operator}</td>
          <td>{item.Thema}</td>
          <td>{item.Offer}</td>
          <td data-key={item.Key} >
            <input type='text' 
              defaultValue={item.Notice}
              className='notice'
              onBlur={onBlurNotice}
              
              />
          </td>
        </tr>
    )
  })

  return (
     <div style={{}}> 
       <Table striped bordered hover size="sm" >
         <thead style={{position: 'sticky', top: '0'}} >
           <tr onClick={sortByField} className='row-class tb-header' style={{ borderWidth: '0px'}}>
             <th className='header' data-alias='№'>{Names.NUMBER}</th>
             <th className='header' data-alias='Date'>{Names.DATE}</th>
             <th className='header' data-alias='Source'>{Names.SOURCE}</th>
             <th className='header' data-alias='Operator'>{Names.OPERATOR}</th>
             <th className='header' data-alias='Thema'>{Names.THEMA}</th>
             <th className='header' data-alias='Added'>{Names.OFFER}</th>
             <th className='header' data-alias='Notice'>{Names.NOTICE}</th>
           </tr>
         </thead>
         <tbody>
          {rows}
         </tbody>
       </Table>
     </div>

  );
}

export default InfoTable;