"use client"
import { db } from '@/configs'
import { JsonForms } from '@/configs/schema'
import { useUser } from '@clerk/nextjs'
import { and, eq } from 'drizzle-orm'
import { ArrowLeft, Share2, SquareArrowOutUpRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import FormUi from '../_components/FormUi'
import { toast } from "sonner"
import Controller from '../_components/Controller'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { RWebShare } from 'react-web-share'

function EditForm({params}) {

  const { user } = useUser();
  const [jsonForm, setJsonForm] = useState([]);
  const router = useRouter();
  const [updateTrigger, setUpdateTrigger] = useState();
  const [record, setRecord] = useState([]);
  const [selectedTheme, setSelectedTheme] = useState('light');
  const [selectedBackground, setSelectedBackground] = useState();
  const [selectedStyle, setSelectedStyle] = useState();

  const GetFormData = async () => {
    const result = await db.select().from(JsonForms)
    .where(and(eq(JsonForms.id, params?.formId), eq(JsonForms.createdBy, user?.primaryEmailAddress?.emailAddress)));

    setRecord(result[0]);
    setJsonForm(JSON.parse(result[0].jsonform));
    setSelectedBackground(result[0].background);
    setSelectedTheme(result[0].theme);
    setSelectedStyle(JSON.parse(result[0].style));
  }

  useEffect(() => {
    user && GetFormData();
  }, [user]);
  
  const onFieldUpdate = (value, index) => {
    jsonForm.formFields[index].label = value.label;
    jsonForm.formFields[index].placeholder = value.placeholder;
    setUpdateTrigger(Date.now())
  }

  const updateJsonFormInDb = async () => {
    const result = await db.update(JsonForms)
    .set({
      jsonform: jsonForm
    }).where(and(eq(JsonForms.id, record.id), eq(user?.primaryEmailAddress?.emailAddress, JsonForms.createdBy)));

    toast.success("Field Updated Successfully!!!!!!!!!");
    console.log(result);
  }

  useEffect(() => {
    if (updateTrigger)
      {
        setJsonForm(jsonForm);
        updateJsonFormInDb();
      }
  }, [updateTrigger]);

  const deleteField = (indexToRemove) => {
    const result = jsonForm.formFields.filter((field, index) => index !== indexToRemove);
    console.log(result);
    jsonForm.formFields = result;
    setUpdateTrigger(Date.now())
  }

  const updateControllerFields = async (value, columnName) => {
    const result = await db.update(JsonForms).set({
      [columnName]: value
    }).where(and(eq(JsonForms.id, record.id), eq(user?.primaryEmailAddress?.emailAddress, JsonForms.createdBy)));

    toast.success("Theme Updated Successfully!!!!!!!!!");
  }

  return (
    <>
      <div className='p-10'>
        <div className='flex justify-between items-center'>
          <h2 className='flex gap-2 items-center my-5 cursor-pointer hover:font-bold hover transition-all' onClick={() => router.back()}>
            <ArrowLeft /> Back
          </h2>
          <div className='flex gap-2'>
            <Link href={'/aiform/'+record?.id} target='_blank'>
              <Button className='flex gap-2'><SquareArrowOutUpRight className='h-5 w-5' /> Live Preview</Button>
            </Link>
            <RWebShare
              data={{
                text: jsonForm?.formSubheading + " , Build your form in seconds with AI Form Builder",
                url: process.env.NEXT_PUBLIC_BASE_URL + '/aiform/' + record?.id,
                title: jsonForm?.formTitle,
              }} onClick={() => console.log("shared successfully!")}
            >
              <Button className='flex gap-2 bg-green-600 hover:bg-green-700'><Share2 className='h-5 w-5' /> Share</Button>
            </RWebShare>
          </div>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
          <div className='p-5 border rounded-lg shadow-md'>
            <Controller 
              selectedTheme={(value) => 
                {
                  updateControllerFields(value, 'theme')
                  setSelectedTheme(value)
                }
              } 
              selectedBackground={(value) => 
                {
                  updateControllerFields(value, 'background')
                  setSelectedBackground(value)
                }
              }

              selectedStyle={(value) => 
                {
                  updateControllerFields(value, 'style')
                  setSelectedStyle(value)
                }
              }

              setSignInEnable={(value)=>
                {
                  updateControllerFields(value, 'enabledSignIn')
                }
              }
            />
          </div>
          <div className='md:col-span-2 border rounded-lg p-5 flex items-center justify-center' style={{background: selectedBackground}}>
            <FormUi 
              jsonForm={jsonForm} 
              onFieldUpdate={onFieldUpdate} 
              deleteField={(index) => deleteField(index)} 
              selectedTheme={selectedTheme}
              selectedStyle={selectedStyle}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default EditForm