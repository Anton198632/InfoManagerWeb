
import {Transition} from 'react-transition-group'
import {Formik, Form, Field, ErrorMessage,} from 'formik'
import * as Yup  from 'yup'
import './ModalWindow.css'
import useInfoManagerService from '../../services/InfoManagerServise'

import * as Names from '../../settings/consts'


export const ModalWindow = (props) => {

    const {addNewInformation, uploadFiles, deleteInformation} = useInfoManagerService();

    const duration = 300;

    const setValue = (field) => {
        return props.editInfo !== null ? props.editInfo.data[0][field] : '';
    }

    const defaultStyle = {
        background: '#8080804f',
        transition: `all ${duration}ms ease-in-out`,
        opacity: 0,
        visibility: 'hidden'
    }

    const transitionStyle = {
        entering: {opacity: 1, visibility: 'visible'},
        entered: {opacity: 1, visibility: 'visible'},
        exiting: {opacity: 0, visibility: 'hidden'},
        exited: {opacity: 0, visibility: 'hidden'},
    };

    const initialVals = () => {
        return { 
            Offer: setValue('Offer'),
            Operator: setValue('Operator'),
            Thema: setValue('Thema'),
            SourceType: setValue('SourceType'),
            Data: setValue('Data'),
            WithApplication: "",
            Notice: setValue('Notice')
        }
    }

    const validationSchema = {
        Offer: Yup.string().min(4, Names.ERROR_MIN_4).required(Names.ERROR_REQUIERD),
        Operator: Yup.string().min(4, Names.ERROR_MIN_4).required(Names.ERROR_REQUIERD),
        Thema: Yup.string().required(Names.ERROR_REQUIERD),
        SourceType: Yup.string().required(Names.ERROR_REQUIERD),
        Data: Yup.string().required(Names.ERROR_REQUIERD),

    }

    const onUploadFiles = (key) => {
        const input = document.querySelector('input[type="file"]')
        const data = new FormData()

        for (let i=0; i<input.files.length; i++){
            data.append('files', input.files[i]);
        }
        data.append('key', key);

        return uploadFiles(data)
    }

    const onSubmit = (values) => {

        let key = document.querySelector('.form[data-edit-key]').getAttribute('data-edit-key');
        key = key !== ''? parseInt(key): -1;

        const formDataJSON = JSON.stringify({
            ...values,
            DateTime: new Date(),
            Key: key
        }, null, 2)


        addNewInformation(formDataJSON)
        .then(data => { 
           return onUploadFiles(data.key)
        })
        .then(data => {
            props.refreshInfoList();
            props.onClose(false);
            setTimeout(() => {
                
            } , duration);
        })
        .catch(error=>{
        console.log(error);
        })

        
    }

    const onCloseFormAfterSubmit = (formik) => {
        props.onClose(false);
        setTimeout(() => {
            
            formik.setFieldValue('Data', '');
            formik.setFieldValue('WithApplication', '');
            
        }, duration);
  
    }

    const onCloseForm = (formik) => {
        props.onClose(false);
        setTimeout(() => {formik.resetForm()}, duration);
  
    }

    const onDelete = (formik) => {
        let key = document.querySelector('.form[data-edit-key]').getAttribute('data-edit-key');
        deleteInformation(key).then(data => {
            props.onClose(false);
            props.refreshInfoList();
        })

        

    }

    

    return (
        <Transition
            in={props.show}
            timeout={duration} >
                {
                    state => (
                        <div className="modal d-block" style={
                            {...defaultStyle, ...transitionStyle[state]}
                        }>
                            <div style={{ margin: '2em 10em'}} >
                                <div className="modal-content">
                                    <Formik
                                        initialValues={initialVals()}
                                        enableReinitialize={true}
                                        validationSchema = {Yup.object(validationSchema)}
                                        onSubmit={(values) => {onSubmit(values)}} 
                                        >
                                        {formik => (
                                        <Form className='form' data-edit-key={setValue('Key')}>
                                            <div className="modal-header">
                                            <h5 className="modal-title">
                                                {props.editInfo === null? Names.ADD_INFORMATION_FORM_HEADER : Names.EDIT_INFORMATION_FORM_HEADER}
                                                </h5>
                                            <button onClick={() => {onCloseForm(formik)}} type='button' className="btn-close" aria-label='Close'></button>
                                            </div>
                                            <div className="modal-body">

                                                <label htmlFor='Offer'>{Names.OFFER} *</label>
                                                <Field id='Offer' name='Offer' type='text' className='form-control' />
                                                <ErrorMessage className='error' name='Offer' component='div'/>

                                                <label htmlFor='Operator'>{Names.OPERATOR} *</label>
                                                <Field id='Operator' name='Operator' type='text' className='form-control' />
                                                <ErrorMessage className='error' name='Operator' component='div'/>

                                                <label htmlFor='Thema'>{Names.THEMA} *</label>
                                                <Field id='Thema' name='Thema' type='text' className='form-control' />
                                                <ErrorMessage className='error' name='Thema' component='div'/>

                                                <label htmlFor='SourceType'>{Names.SOURCE} *</label>
                                                <Field id='SourceType' name='SourceType' type='text' className='form-control' /> 
                                                <ErrorMessage className='error' name='SourceType' component='div'/>

                                                <label htmlFor='Data'>{Names.INFORMATION} *</label>
                                                <Field id='Data' name='Data' as='textarea' className='form-control'/>
                                                <ErrorMessage className='error' name='Data' component='div'/>

                                                <label htmlFor='WithApplication'>{Names.ATTACHMENTS}</label>
                                                <Field id='WithApplication' name='WithApplication' type='file' multiple  className='form-control' />
                                                <ErrorMessage className='error' name='WithApplication' component='div'/>

                                                <label htmlFor='Notice'>{Names.NOTICE}</label>
                                                <Field id='Notice' name='Notice' type='text' className='form-control' />
                                                <ErrorMessage className='error' name='Notice' component='div'/>


                                            </div>
                                            <div className="modal-footer">
                                                {props.editInfo !== null?(<div>
                                                    <button onClick={() => {onDelete();}} type='button'
                                                     className="btn btn-danger">{Names.DELETE}</button>
                                                </div>): null}
                                                <div>
                                                    <button type='submit' onClick={() => onCloseFormAfterSubmit(formik)} className="btn btn-success">
                                                        {props.editInfo === null? Names.ADD : Names.UPDATE}
                                                    </button>
                                                    <button onClick={() => {onCloseForm(formik)}} type='button' className="btn btn-secondary">{Names.CLOSE}</button>
                                                </div>
                                                
                                            </div>
                                        </Form>
                                        )}
                                    </Formik>
                                </div>

                            </div>

                        </div>
                    )
                
                }
            </Transition>
    )
}