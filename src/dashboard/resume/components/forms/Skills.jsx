import React, { useContext, useEffect, useState } from 'react'
import { ResumeInfoContext } from '../../../../context/ResumeInfoContext';
import { Input } from '../../../../components/ui/input';
import { Rating, RoundedStar } from '@smastrom/react-rating';
import '@smastrom/react-rating/style.css';
import { LoaderCircle } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { useParams } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast"
import GlobalApi from '../../../../../service/GlobalApi';

export default function Skills({ enableNext }) {
    const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
    const [loading, setLoading] = useState(false);
    const params = useParams();
    const { toast } = useToast();
    const myStyles = {
        itemShapes: RoundedStar,
        activeFillColor: '#ffb700',
        inactiveFillColor: 'lightgrey'
    }
    const [skillsList, setSkillsList] = useState([
        {
            name:'',
            rating: 0,
        }
    ]);
    useEffect(()=>{
        resumeInfo?.skills.length>0 && setSkillsList(resumeInfo?.skills);
    },[]);
    useEffect(()=>{
        setResumeInfo(
            {
                ...resumeInfo,
                skills: skillsList
            })
    }, [skillsList]);
    const handleInputChange = (index, name, value) => {
        const newInput = skillsList.slice();
        newInput[index][name] = value;
        setSkillsList(newInput);
    };
    const handleAddSkill = () => {
        setSkillsList([
            ...skillsList, 
            {name:'', rating: 0},
        ]);
    };
    const handleRemove = () =>{
        setSkillsList(skillsList => skillsList.slice(0, -1));
    };
    const onSave = async ()=>{
        setLoading(true);
        const data = {
            data: {
                skills: skillsList.map((id)=>({
                    name: id?.name,
                    rating: id?.rating
                }))
            }
        }
        try {
            const resp = await GlobalApi.UpdateResume(params?.resumeId, data);
            if(resp){
                enableNext(true);
                console.log('Skills updated successfully: ', resp);
                toast({
                    title: 'Saved',
                    description: 'Skills have been updated.',
                });
            }else {
                toast({
                    title:'Error',
                    description: `Failed to update skills. ${resp?.message}`,
                })
            }
        } catch (error) {
            console.error('Error saving skills: ', error.message);
        } finally {
            setLoading(false);
        }
    }
    return (
        <div>
            <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4'>
                <h2 className='font-bold text-lg'> Skills </h2>
                <p>Add your skills</p>
            </div>
            <div className='mt-5'>
                {skillsList.map((item, index)=>(
                    <div key={index} className='flex justify-between border p-3 rounded-lg mt-3'>  
                        <div>
                            <label>Skill name</label>
                            <Input name="name" defaultValue={item?.name} onChange={(e) => handleInputChange(index, 'name', e.target.value)}/> 
                        </div>
                        <Rating style={{ maxWidth: 150 }} itemStyles={myStyles} value={item?.rating} onChange={(event) => handleInputChange(index, 'rating', event)} />
                    </div>
                ))}
            </div>
            <div className='flex justify-between mt-5'>
                <div className='flex gap-3'>
                    <Button variant='outline' className='text-primary' size='sm' onClick={handleAddSkill}> + Add Skill</Button>
                    <Button variant='outline' className='text-primary' size='sm' onClick={handleRemove}> - Remove</Button>
                </div>
                <Button disabled={loading} onClick={onSave}>
                    {loading ? <LoaderCircle className='animate-spin' size={20} /> : 'Save'}
                </Button>
            </div>
        </div>
    )
}
