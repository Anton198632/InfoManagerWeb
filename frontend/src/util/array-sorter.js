export const infoSort = (infoList, field, isUp) => {
    infoList.sort(compareInformsByField(field, isUp));
    return [...infoList]
}


const compareInformsByField = (field, isUp) => {

    let fieldName = 'Key'

    switch(field){
        case '№':
            fieldName = 'Key';
            break;
        case 'Date':
            fieldName = 'DateTime';
            break;
        case 'Source':
            fieldName = 'SourceType';
            break;
        case 'Operator':
            fieldName = 'Operator';
            break;
        case 'Thema':
            fieldName = 'Thema';
            break;
        case 'Added':
            fieldName = 'Offer';
            break;
        case 'Notice':
            fieldName = 'Notice';
            break;
        default:
            fieldName = 'Key';
            break;
    }

    if (isUp)
        return (a, b) => (a[fieldName] > b[fieldName] ? 1 : -1)
    else 
        return (a, b) => (a[fieldName] > b[fieldName] ? -1 : 1)

}