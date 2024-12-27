import React, { useContext, useState } from 'react';
import { 
    BtnBold,
    BtnItalic,
    Editor,
    EditorProvider,
    Toolbar,
    BtnBulletList,
    BtnLink,
    BtnNumberedList,
    BtnUnderline,
    BtnUndo,
    BtnRedo,
    Separator,
} from 'react-simple-wysiwyg';
import { Button } from '../../../components/ui/button';
import { Combine, LoaderCircle } from 'lucide-react';
import { ResumeInfoContext } from '../../../context/ResumeInfoContext';
import { useToast } from "@/hooks/use-toast"
import { AIChatSession }  from '../../../../service/AIModal';


function RichTextEditorEdu({ onRichTextEditorChange, index, defaultValue }) {
    const [value, setValue] = useState(defaultValue);
    const prompt = 
        `Education major: {major}. 
        Education project: {project}. 

        Based on my education major and project, generate 2 strong, impactful bullet points for my resume. 
        - Highlight the technical skills, tools, and programming languages used.
        - Quantify achievements where possible (e.g., increase in speed, users served, efficiency gains, etc.).
        - Focus on the impact, outcomes, and technical achievements.

        Return the result as an unordered list (<ul>) with each bullet point wrapped inside a <li> tag. `;
    
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
    
    const generateSummaryFromAI = async () => {
        try {
            setLoading(true);
            const major = resumeInfo?.education[index]?.major;
            const project = resumeInfo?.education[index]?.project;
            if(!major){
                toast({
                    title: "Error",
                    description: "Please enter your major first.",
                    status: "error"
                });
                return;
            }
            const dynamicPrompt = prompt
                                    .replace('{major}', major)
                                    .replace('{project}', project || 'No specific project provided');
            console.log('Dynamic prompt in edu: ', dynamicPrompt);
            const result = await AIChatSession.sendMessage(dynamicPrompt);
            if(result){
                const response = result.response.text();
                console.log('AI generate edu response: ', response);
                const formattedResponse = response.replace(/^\[/, '') // Remove leading '['
                                                    .replace("\"", '') // Remove leading '"'
                                                    .replace(/\]/, '') // Remove trailing ']'
                                                    .replace(/^\s*"[^"]+":\s*"/, '') // Remove property name (e.g., "bullet_points":)
                                                    .replace(/"\s*$/, '') // Remove trailing '"'
                                                    .trim(); 
                setValue(formattedResponse);
                setResumeInfo({
                    ...resumeInfo,
                    education: resumeInfo.education.map((item, i) => {
                        if(i === index){
                            return {
                                ...item,
                                description: response.replace(/^\[/, '')
                                                    .replace("\"", '') 
                                                    .replace(/\]/, '') 
                                                    .replace(/^\s*"[^"]+":\s*"/, '') 
                                                    .replace(/"\s*$/, '') 
                                                    .trim() 
                            }
                        }
                        return item;
                    })
                })
            }else{
                console.error('Error generating edu description: ', result);
            }
        } catch (error) {
            console.error('Error generating from AI: ', error.message);
        } finally {
            setLoading(false);   
        }
    };
    return (
        <div>
            <div className='flex justify-between items-end mb-3'>
                <div>
                    <label className='font-bold text-primary'>Generate description</label>
                    <p className='text-xs text-primary'>Revise results based on your actual experience and keep the final take-away concise</p>
                </div>
                {/* here the Button has to explicitly indicate the type as a 'button' or else it will trigger the form submit action */}
                <Button type='button' className='border-primary text-primary flex gap-2' size='sm' variant='outlined' onClick={()=>generateSummaryFromAI()}> 
                    {loading ? <LoaderCircle className='animate-spin' size={20}/> : <Combine className='h-4 w-4'/> } Generate from AI 
                </Button>
            </div>
            <EditorProvider>
                <Editor 
                value={value} 
                onChange={(e)=>{
                    setValue(e.target.value);
                    onRichTextEditorChange(e);
                }}>
                    <Toolbar>
                        <BtnUndo />
                        <BtnRedo />
                        <BtnBold />
                        <BtnItalic />
                        <BtnUnderline />
                        <Separator />
                        <BtnNumberedList />
                        <BtnBulletList />
                        <BtnLink />
                    </Toolbar>
                </Editor>
            </EditorProvider>
        </div>
    
    )
}

export default RichTextEditorEdu