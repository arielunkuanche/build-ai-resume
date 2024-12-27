import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { ResumeInfoContext } from '../../../../context/ResumeInfoContext';
import { useToast } from "@/hooks/use-toast"
import { Input } from '../../../../components/ui/input';
import { Button } from '../../../../components/ui/button';
import { LoaderCircle } from 'lucide-react';
import RichTextEditorEdu from '../RichTextEditorEdu';
import GlobalApi from '../../../../../service/GlobalApi';


function Education({ enableNext }) {
    const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
    const [loading, setLoading] = useState(false);
    const params = useParams();
    const { toast } = useToast(); 
    const formEducation = {
        universityName:'',
        startDate:'',
        endDate:'',
        degree:'',
        major:'',
        project:'',
        description:'',
    };
    const [educationList, setEducationList] = useState([
        formEducation
    ]);
    useEffect(()=>{
        resumeInfo?.education.length>0&&setEducationList(resumeInfo?.education);
        //console.log('Resume info in Education: ', educationList);
    },[]);
    useEffect(()=>{
        //console.log('Education list: ', educationList);
        setResumeInfo({
            ...resumeInfo,
            education: educationList
        });
    },[educationList]);
    const handleInputChange = (index, e)=> {
        const newInput = educationList.slice();
        const { name, value}  = e.target;
        newInput[index][name] = value;
        //console.log('New input in education form: ', newInput);
        setEducationList(newInput);
    };
    const handleRichTextEditorChange = (index, e, name) => {
        const newEntry = educationList.slice();
        newEntry[index][name] = e.target.value;
        console.log('New entry in rich text editor: ', newEntry);
        setEducationList(newEntry);
    };
    const handleAddEducation = () => {  
        setEducationList([...educationList, formEducation]);
    };
    const handleRemove = () => {
        setEducationList(educationList.slice(0,-1))
    };
    const onSave = async () => {
        setLoading(true);
        const data = {
            data: {
                education : educationList.map((id) => ({
                    universityName: id.universityName,
                    degree: id.degree,
                    major: id.major,
                    startDate: id.startDate,
                    endDate: id.endDate,
                    project: id.project,
                    description: id.description
                }))
            }
        }
        try {
            //console.log('Data in Education: ', data);
            const resp = await GlobalApi.UpdateResume(params?.resumeId, data);
            if(resp){
                //console.log('Resume education updated: ', resp, resp.data);
                enableNext(true);
                toast({
                    title: 'Saved',
                    description: 'Education has been updated.',
                });
            }else {
                toast({
                    title: 'Error',
                    description: `Error saving education ${resp.message}`,
                })
            }
        } catch (error) {
            console.error('Error saving education: ', error.message);
        } finally {
            setLoading(false);
        }
    };
    return (
        <div>
            <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4'>
                <h2 className='font-bold text-lg'> Education </h2>
                <p>Add your education background</p>
            </div>
            <div>
                    {educationList?.map((item, index) => (
                        <div key={index}>
                            <div className='grid grid-cols-2 border p-3 my-5 rounded-lg gap-3'> 
                                <div className='col-span-2'>
                                    <label>University</label>
                                    <Input name="universityName" defaultValue={item?.universityName} onChange={(e) => handleInputChange(index, e)}/>
                                </div>
                                <div>
                                    <label>Degree</label>
                                    <Input name="degree" defaultValue={item?.degree} onChange={(e) => handleInputChange(index, e)}/>
                                </div>
                                <div>
                                    <label>Major</label>
                                    <Input name="major" defaultValue={item?.major} onChange={(e) => handleInputChange(index, e)}/>
                                </div>
                                <div className='col-span-2'>
                                    <label>Type in project keywords can improve AI accuracy(Optional)</label>
                                    <Input name="project" onChange={(e) => handleInputChange(index, e)}/>
                                </div>
                                <div>
                                    <label>Start date</label>
                                    <Input type="date" name="startDate" defaultValue={item?.startDate} onChange={(e) => handleInputChange(index, e)}/>
                                </div>
                                <div>
                                    <label>End date</label>
                                    <Input type="date" name="endDate" defaultValue={item?.endDate} onChange={(e) => handleInputChange(index, e)}/>
                                </div>
                                <div className='col-span-2'>
                                    {/* <Input name="description" defaultValue={item?.description} onChange={(e) => handleInputChange(index, e)}/> */}
                                    <RichTextEditorEdu index={index} defaultValue={item?.description} onRichTextEditorChange={(e)=>handleRichTextEditorChange(index, e, 'description')}/>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className='flex justify-between'>
                    <div className='flex gap-3'>
                        <Button variant='outline' className='text-primary' size='sm' onClick={handleAddEducation}> + Add Education</Button>
                        <Button variant='outline' className='text-primary' size='sm' onClick={handleRemove}> - Remove</Button>
                    </div>
                    <Button disabled={loading} onClick={onSave}>
                        {loading ? <LoaderCircle className='animate-spin' size={20} /> : 'Save'}
                    </Button>
                </div>
        </div>
    )
}

export default Education