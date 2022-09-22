
import { periodParse } from "../util/date-parser";

export const period = (newPeriod) => {

    return {type: 'PERIOD', payload: periodParse(newPeriod)}
}

export const updateInfoList = (infoList) => {
    return {type: 'UPDATE_INFO_LIST', payload: infoList}
}

export const updateInfoNotice = (id, newNotice) => {
    return {type: 'UPDATE_INFO_NOTICE', key: id, newNotice: newNotice}
}

export const updateCurrentInfoState = (key, info, withAttachments) => {
    return {type: 'UPDATE_CURRENT_INFO', 
    info: info, withAttachments: withAttachments, key: key}
}

export const setSearchWord = (word) => {
    return {type: 'SET_SEARCH_WORD', word}
}

export const sortInfo= (field, isUp) =>{
    return {type: 'SORT_INFO', field, isUp}
}

