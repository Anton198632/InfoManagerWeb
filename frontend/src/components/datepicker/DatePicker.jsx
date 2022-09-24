import React from "react";
import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-daterangepicker/daterangepicker.css';
import { Form } from "react-bootstrap";

import {period} from '../../redux/actions';
import { useSelector, useDispatch } from "react-redux";
import './DatePicker.css'

const DatePicker = (props) => {

    const {fromDate, toDate} = useSelector(state => state.period)
    const dispatch = useDispatch();

    const onChangePeriod = (e) => {
        dispatch(period(e.target.value));
        props.onSearch();
    }


     return (
            <DateRangePicker
                initialSettings={{ 
                    startDate: fromDate, //new Date().getDate() ,
                    endDate: toDate, //new Date().getDate(),
                    "autoApply": true,
                    locale: {
                        format: 'DD.MM.YYYY', // формат даты
                        "daysOfWeek": [
                            "Пн",
                            "Вт",
                            "Ср",
                            "Чт",
                            "Пт",
                            "Сб",
                            "Вс"
                        ],
                        "monthNames": [
                            "Январь",
                            "Февраль",
                            "Март",
                            "Апрель",
                            "Май",
                            "Июнь",
                            "Июль",
                            "Август",
                            "Сентябрь",
                            "Октябрь",
                            "Ноябрь",
                            "Декабрь"
                        ],
                    },
                }}
                onApply={onChangePeriod}
                
                >
                <input type='text' id={props.id} onChange={onChangePeriod} 
                    className='form-control date-picker-input' />
            </DateRangePicker>
    )

}


export default DatePicker;