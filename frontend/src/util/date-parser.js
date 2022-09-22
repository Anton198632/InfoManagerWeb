export const periodParse = (text) => {
    const nD = text.split(' - ')

    if (nD.length === 2) {
        const [fDay, fMonth, fYear] = nD[0].split('.');
        const [tDay, tMonth, tYear] = nD[1].split('.');
        return {
            fromDate: new Date(fYear, fMonth-1, fDay),
            toDate: new Date(tYear, tMonth-1, tDay)}
        
    } else {
        return null
    }
} 