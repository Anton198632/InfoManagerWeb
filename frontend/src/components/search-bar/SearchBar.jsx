import { Button, Form } from "react-bootstrap";
import DatePicker from "../datepicker/DatePicker"
import React from "react";
import { useDispatch } from "react-redux";
import { setSearchWord } from "../../redux/actions";
import * as Names from '../../settings/consts'


const SearchBar = (props) => {

    const dispatch = useDispatch()

    const search = () => {

        const word = document.querySelector('#search-text').value;
        const period = document.querySelector('#period').value;
        dispatch(setSearchWord(word));
        props.search(word, period);
    }

    return (
        <div style={{
            display: 'flex',
            ustifyContent: 'flex-end',
            padding: '20px',
            background: '#d4ead4',
            
        }}>

            <div style={{marginRight: '10px'}}>
                <DatePicker id='period' />
            </div>

            <div>
                <Form.Control type='text' placeholder={Names.SEARCH} id='search-text'/>
            </div>

            <div style={{marginLeft: '10px'}}>
                <Button variant="success" onClick={search} >{Names.FIND}</Button>
            </div>
            
        </div>
    )


}

export default SearchBar;