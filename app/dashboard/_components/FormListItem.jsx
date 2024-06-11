import { Button } from '@/components/ui/button'
import { Edit, Share2, Trash } from 'lucide-react'
import Link from 'next/link'
import { RWebShare } from "react-web-share";
import React from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useUser } from '@clerk/nextjs'
import { db } from '@/configs'
import { JsonForms, userResponses } from '@/configs/schema'
import { and , eq } from 'drizzle-orm'
import { toast } from 'sonner'


function FormListItem({ jsonForm, formRecord, refreshData }) {

  const { user } = useUser();
  const onDeleteForm = async() => {
    await db.delete(userResponses)
    .where(eq(userResponses.formRef, formRecord.id));

    const result = await db.delete(JsonForms)
    .where(and(eq(JsonForms.id, formRecord.id), eq(JsonForms.createdBy, user?.primaryEmailAddress?.emailAddress)));

    if(result) {
      toast.success("Form Deleted Successfully!!!!!!!!!")
      refreshData()
    }
  }

  return (
    <div className='border shadow-sm rounded-lg p-4'>
      <div className='flex justify-between'>
        <div></div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Trash className='h-5 w-5 text-red-600 cursor-pointer hover:scale-105 transition-all'/>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your form from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDeleteForm()}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <h2 className='text-lg text-black font-semibold'>{jsonForm?.formTitle}</h2>
      <h2 className='text-sm text-gray-500'>{jsonForm?.formSubheading}</h2>
      <hr className='my-4'/>
      <div className='flex justify-between'>
        <RWebShare
          data={{
            text: jsonForm?.formSubheading + " , Build your form in seconds with AI Form Builder",
            url: process.env.NEXT_PUBLIC_BASE_URL + '/aiform/' + formRecord?.id,
            title: jsonForm?.formTitle,            
          }} onClick={() => console.log("shared successfully!")}
        >
          <Button variant="outline" size="sm" className='flex gap-2 items-center'> <Share2 className='h-5 w-5'/> Share</Button>
        </RWebShare>
          <Link href={'/edit-form/' + formRecord?.id}>
            <Button size="sm" className='flex gap-2 items-center'> <Edit className='h-5 w-5' /> Edit</Button>
          </Link>
      </div>
  </div>
  )
}

export default FormListItem