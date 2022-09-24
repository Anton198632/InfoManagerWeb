import { infoSort } from "../util/array-sorter"

const fromDate = new Date()
fromDate.setDate(fromDate.getDate())

const initState = {
    period: {
        fromDate: fromDate,
        toDate: new Date()
    }, 
    informations: [],
    selectedRow: 0,
    currentInfo: null,
    currentInfoKey: -1,
    withAttachments: false,
    searchWord: null
}

const Reducer = (state = initState, action) => {

    switch (action.type){

        case 'PERIOD':
            
            return {...state, period: action.payload}

        case 'UPDATE_INFO_LIST':
            return {...state, informations: action.payload}

        case 'UPDATE_INFO_NOTICE':

            let infoCopy = {...state, informations: JSON.parse(JSON.stringify(state.informations)).map((item) => {
                
                if (item.Key == action.key){
                    return {...item, Notice: action.newNotice}
                } else {
                    return item
                }       
            })}
            return infoCopy

        case 'UPDATE_CURRENT_INFO':

            return {...state, 
                currentInfo: action.info, 
                withAttachments: action.withAttachments,
                currentInfoKey: action.key
            }

        case 'SET_SEARCH_WORD':
            return {...state, searchWord: action.word}
        
        case 'SORT_INFO':
            const infoSorted = infoSort(state.informations, action.field, action.isUp);
            return {...state, informations: infoSorted}
        
        default:
            return state

    }

}




export default Reducer;