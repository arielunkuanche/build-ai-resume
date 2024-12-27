import React, { useEffect, useState } from 'react';
import Header from '../../../components/custom/Header';
import { Button } from '../../../components/ui/button';
import PreviewSection from '../../../dashboard/resume/components/PreviewSection';
import { ResumeInfoContext } from '../../../context/ResumeInfoContext';
import GlobalApi from '../../../../service/GlobalApi';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { RWebShare } from "react-web-share";
import { Download, LoaderCircle, MoveLeft, Share } from 'lucide-react';

function ViewResume() {
    const [resumeInfo, setResumeInfo] = useState();
    const params = useParams();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false); 
    const navigation = useNavigate();
    useEffect(()=>{
        GetResumeInfo();
    },[]);

    const GetResumeInfo = async() => {
        try {
            setLoading(true);
            const resp = await GlobalApi.GetResumeById(params?.resumeId);
            if(resp){
                console.log('Get resume by id in view resume: ', resp.data.data);
                setResumeInfo(resp.data.data);
            } else {
                toast({
                    title:'Error',
                    description: 'Error in finding individual resume',
                })
            }
        } catch (error) {
            console.log('Error getting resume by id: ', error.message);
        } finally {
            setLoading(false);
        }
    };
    const handleDownload = () => {
        console.log('Download resume');
        window.print();
    };
    return (
        <ResumeInfoContext.Provider value={{resumeInfo, setResumeInfo}}>
            <div id='view-resume'>
                <Header />
                <div className='my-5 mx-10 md:mx-30 lg:mx-40'>
                    <h2 className='text-center text-2xl font-medium'>Now you can review your AI generated resume</h2>
                    <p className='text-center text-gray-600'>You can download and share your resume</p>
                    <div className='flex justify-between px-44 my-10'>
                        <Button onClick={()=>navigation('/dashboard/resume/'+ params.resumeId + '/edit')}> <MoveLeft />Back</Button>
                        <Button onClick={handleDownload}><Download /> Download</Button>
                        <RWebShare 
                            data={{
                                text: 'Check out my AI generated resume',
                                url: import.meta.env.VITE_BASE_URL + '/my-resume/' + params?.resumeId + '/view',
                                title: params?.firstName + '' + params?.lastName + ' AI Resume',
                            }}>
                            <Button><Share />Share</Button>
                        </RWebShare>
                    </div>
                </div>
            </div>
            <div id='print-resume' className='my-10 mx-10 md:mx-30 lg:mx-40'>
                {loading ? <div className='flex justify-center items-center h-96'><LoaderCircle className='animate-spin' size={50} /></div> : <PreviewSection />}
            </div>
        </ResumeInfoContext.Provider>
    )
}

export default ViewResume