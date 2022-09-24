import { useHttp } from "../hooks/http.hook";
import { IS_DEBUG } from "../settings/settings";

const useInfoManagerService = () => {
    
    const {request, process, setProcess} = useHttp();

    let address = `http://${window.location.hostname}:${window.location.port}`;
    if (IS_DEBUG)
        address = 'http://localhost:8000'
    

    const getInfoList = async () => {
        const res = await request('infoList',`${address}/getInfoList`)
        return res;
    }

    const deleteInformation = async (key) => {
        const res = await request('infoList',`${address}/deleteInformation?key=${key}`)
        return res;
    }

    const updateNotice = async (key, notice) => {
        const res = await request('infoList',`${address}/updateNotice?key=${key}&notice=${notice}`);
        return res;
    }

    const getInfoData = async (key) => {
        const res = await request('infoData',`${address}/getInfoData?key=${key}`)
        return res;
    }

    const getInfoByWord = async (word, period, key=-1, stateType='infoList') => {
        const res = await request(stateType,`${address}/getInfoByWord?word=${word}&period=${period}&key=${key}`)
        return res;
    }

    const addNewInformation = async (newInformation) => {
        const res = await request('infoList', `${address}/addNewInformation`, 'POST', newInformation);
        return res;
    }

    const uploadFiles = async (file) => {
        const res = await request('infoList', `${address}/uploadFiles`, 'POST', file, {});
        return res;
    }

    const downloadAttachment = (key) => {

        let link = document.createElement("a");
        link.href = `${address}/getAttachment?key=${key}`
        document.body.appendChild(link); // Required for FF
        link.click();
    }

    return {
        getInfoList, 
        getInfoData, 
        getInfoByWord, 
        addNewInformation,
        uploadFiles,
        downloadAttachment,
        updateNotice,
        deleteInformation,
        
        process,
        setProcess}
}

export default useInfoManagerService;