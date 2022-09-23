import './App.css';
import InfoTable from './components/tables/InfoTable';
import 'bootstrap/dist/css/bootstrap.min.css';
import useInfoManagerService from './services/InfoManagerServise';
import { useEffect, useState } from 'react';
import SearchBar from './components/search-bar/SearchBar';
import Skeleton from '@mui/material/Skeleton'

import {useDispatch} from 'react-redux'
import {updateInfoList, updateCurrentInfoState} from './redux/actions'

import {  ReflexContainer,  ReflexSplitter,  ReflexElement} from 'react-reflex'
import 'react-reflex/styles.css'

import vertImg from './imgs/vertical.png';
import horImg from './imgs/horizontal.png';
import fSizeUp from './imgs/font-size-up.png';
import fSizeDown from './imgs/font-size-down.png';

import React from 'react'
import InfoContainer from './components/info-container/InfoContainer';
import { ModalWindow } from './components/modal-window/ModalWindow';

import * as Names from './settings/consts';





function App(props) {

  const [showModal, setShowModal] = useState(false);
  const [editInfo, setEditInfo] = useState(null);
  const [fontSize, setFontSize] = useState(1);

  const [orientation, setOrientation] = useState('vertical');
  const {getInfoList, getInfoByWord, getInfoData, process, setProcess} = useInfoManagerService();
  const dispatch = useDispatch();

  
  
  //const {connect} = useWebSocketService(addNewInfoToList);

  useEffect(() => {  
    refreshInfoList();
    props.websocketConnect();
    props.setMessageHandler(addNewInfoToList);
  }, [])   

  const search = (word, period) => {
    getInfoByWord(word, period).then(data=>{
      dispatch(updateInfoList(data.data))

      setTimeout(()=> {
        setProcess(`confirmed_infoList`);
      }, 1000)

    }).catch(error=>{
      console.log(error);
    });
  }  
  
  const addNewInfoToList = (newKey) => {

    const period = document.querySelector("#period").value;
    const word = document.querySelector("#search-text").value;
    
  
    if (newKey)
        console.log(word, period, newKey);
  }



  const refreshInfoList = () => {
    getInfoList().then(data=>{
      dispatch(updateInfoList(data.data))

      setTimeout(()=> {
        setProcess(`confirmed_infoList`);
      }, 1000)

    }).catch(error=>{
      console.log(error);
    })
  }


  const skeletonsTable = new Array(10).fill(0).map((item, i)=> (
    <Skeleton key={i}
      style={{height: '2em', margin: '0px 10px 0px 10px'}} />
    ));


  const setContentTable = (process) => {
    switch (process){
        case 'waiting':
        case 'loading_infoList':
            return (<>{skeletonsTable}</>)
          
        default:
          return (
            <InfoTable onEditInfo={onEditInfo}  updateCurrentInfo={updateCurrentInfo}/>
          )
      }
  }

  const setInfoContent = (process) => {
    switch (process){
      case 'waiting':
      case 'loading_infoData':
          return (<>{skeletonsTable}</>)
        
      default:
        return (
          <InfoContainer/>
        )
    }
  }

  const updateCurrentInfo = (key) => {
    getInfoData(key)
      .then((data)=>{

        const {Key, Data, WithApplication} = data.data[0];

        setProcess('confirmed_infoData');
        dispatch(updateCurrentInfoState(Key, Data, WithApplication!=='no'));
      })
      .catch(error=>{
      console.log(error);
    })


  }

  const onOrientationToggle = (e) => {
      if (orientation === 'vertical'){
        setOrientation('horizontal');
        e.target.src = vertImg;
      } else {
        setOrientation('vertical');
        e.target.src = horImg;
      }

  }

  
  const onEditInfo = (key) => {

    getInfoData(key)
      .then((data)=>{
        setProcess('confirmed_infoData');
        setEditInfo(data);
        setShowModal(true);
      })
      .catch(error=>{
      console.log(error);
    })
  }

  const onFontResize = (increment) => {
    let newFontSize = fontSize+increment;
    if (newFontSize>0.5 && newFontSize<2){
      setFontSize(newFontSize);
      const tableBody = document.querySelector('.table')
      tableBody.style.fontSize = `${newFontSize}rem`;
    }
    



  }

  return (
    <div className="App" style={{display: 'flex', flexFlow: 'column', height: '100vh', position: 'relative'}}>
      
        <SearchBar search={search} />
        
        <div className='settings-view'>
          <img src={horImg} onClick={onOrientationToggle} alt='orientation'/>
          <img src={fSizeUp} onClick={()=>onFontResize(0.1)} alt='font-size up'/>
          <img src={fSizeDown} onClick={()=>onFontResize(-0.1)} alt='font-size down'/>
        </div>

        <ReflexContainer orientation={orientation} style={{ borderTop: '1px solid gray'}} >
  
                  <ReflexElement className="left-pane section">
                    <div className="pane-content">
                      {setContentTable(process)}
                      <div style={{textAlign: 'left', paddingLeft: '1em', paddingBottom: '1em'}}>
                        <button type='button' className='btn btn-warning'
                        onClick={() => {
                          setEditInfo(null);
                          setShowModal(true);
                        }}>{Names.ADD}</button>
                      </div>
                      
                    </div>
  
                  </ReflexElement>
  
                  <ReflexSplitter />
  
                  <ReflexElement className="right-pane section">
                    {setInfoContent(process)}
                  </ReflexElement>
  
  
        </ReflexContainer>

        <ModalWindow editInfo={editInfo} 
          show={showModal} 
          onClose={setShowModal} 
          refreshInfoList={() => refreshInfoList()}/>

        
    </div>

  );
}






export default App;
