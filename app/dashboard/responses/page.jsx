'use client'
import { db } from '@/configs'
import { JsonForms } from '@/configs/schema'
import { useUser } from '@clerk/nextjs'
import { eq } from 'drizzle-orm'
import React, { useEffect, useState } from 'react'
import FormListItemResp from './_components/FormListItemResp'

function Responses() {

    const { user } = useUser();
    const [formList, setFormList] = useState();
    const getFormList = async () => {
        const result = await db.select().from(JsonForms)
        .where(eq(JsonForms.createdBy, user?.primaryEmailAddress?.emailAddress))

        setFormList(result)
    }

    useEffect(() => {
        user && getFormList()
    }, [user])

  return formList && (
    <div className='p-10'>
        <h2 className='font-bold text-3xl flex items-center justify-between'>Responses</h2>

        <div className='grid grid-cols-2 lg:grid-cols-3 gap-5'>
            {formList && formList?.map((form, index) => (
                <div key={index}>
                   <FormListItemResp 
                        formRecord={form}
                        jsonForm={JSON.parse(form.jsonform)}
                    /> 
                </div>
                
            ))}
        </div>
    </div>
  )
}

export default Responses