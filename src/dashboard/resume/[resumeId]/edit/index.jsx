import React, { useState } from 'react'
import { useEffect } from 'react';
import { useParams } from 'react-router-dom'
import FormSection from '../../components/FormSection';
import PreviewSection from '../../components/PreviewSection';
import example from '../../../../data/example';
import { ResumeInfoContext } from '../../../../context/ResumeInfoContext';
import GlobalApi from '../../../../../service/GlobalApi';
import { useToast } from "@/hooks/use-toast"
import { LoaderCircle } from 'lucide-react';

function EditResume() {
    // use react-router-dom's useParams hook to get the resumeId from the URL
    // as we defined in the route path the resumeId is a dynamic parameter
    // so the params here is an object contained the property: resumeId, any dynamic parameter defined in the route path
    const params = useParams();
    const { toast } = useToast();
    const [resumeInfo, setResumeInfo] = useState();
    const [loading, setLoading] = useState(false);  
    useEffect(()=>{
        // console.log('Dynamic resumeId: ', params.resumeId)
        // setResumeInfo(example);
        GetResumeInfo();
    }, []);
    // instead of using the example data, below function is to fetch the resume data from the Strapi API
    const GetResumeInfo = async() => {
        setLoading(true);
        try {
            const resp = await GlobalApi.GetResumeById(params?.resumeId);
            // console.log('Get resume by id response: ', resp);
            if(resp){
                setResumeInfo(resp.data.data);
            }else{
                toast({
                    title:'Error',
                    description:`Error in finding individual resume: ${resp.message}`,
                })
            }
        } catch (error) {
            console.log('Error getting resume by id: ', error.message);
        } finally {
            setLoading(false);
        }
    };
    return (
        // wrap the components with the context provider to pass the resumeInfo object state to the children
        <ResumeInfoContext.Provider value={{resumeInfo, setResumeInfo}}>
            <div className='grid grid-cols-1 md:grid-cols-2 p-10 gap-10'>
                {/* from section */}
                <FormSection />
                {/* preview section */}
                { loading ? 
                <div className='flex justify-center items-center h-full'> 
                    <LoaderCircle className='animate-spin' size={40} /> 
                </div> : 
                <PreviewSection /> }
            </div>
        </ResumeInfoContext.Provider>
    )
}

export default EditResume