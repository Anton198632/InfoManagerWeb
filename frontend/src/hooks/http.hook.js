import { useCallback, useState } from "react"


export const useHttp = () => {

    const [process, setProcess] = useState('waiting')

    const request = useCallback((async (dataType, url, method='GET', body=null,
        headers={ 'Content-Type': 'application/json', }) =>{

        setProcess(`loading_${dataType}`);

        try{
            const response = await fetch(url, {method, body, headers}) 

            if (!response.ok){
                throw new Error(`Error: cound not feach ${url}, status: ${response.statusText}`);
            }

            const data = await response.json();
            return data;

        } catch(e){
            console.log(e.message);

            setProcess(`error_${dataType}`);

            throw e;
        }
    }))


    return {request, process, setProcess};
}