'use client'
import SubsTableItem from '@/Components/AdminComponents/SubsTableItem'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';

const page = () => {

  const [emails,setEmails] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEmails = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/email');
      console.log("Fetched emails:", response.data.emails);
      setEmails(response.data.emails || []);
    } catch (error) {
      console.error("Error fetching emails:", error);
      toast.error("Failed to load emails");
    } finally {
      setLoading(false);
    }
  }

  const deleteEmail = async (mongoId) =>{
    try {
      const response = await axios.delete('/api/email',{
        params:{
          id:mongoId
        }
      })
      if (response.data.success) {
        toast.success(response.data.msg);
        fetchEmails();
      }
      else{
        toast.error("Error deleting email");
      }
    } catch (error) {
      console.error("Error deleting email:", error);
      toast.error("Failed to delete email");
    }
  }

  useEffect(()=>{
    fetchEmails();
  },[])

  if (loading) {
    return (
      <div className='flex-1 pt-5 px-5 sm:pt-12 sm:pl-16'>
        <h1>All Subscriptions</h1>
        <div className="flex justify-center items-center h-64">
          <div className="text-xl">Loading emails...</div>
        </div>
      </div>
    );
  }

  return (
    <div className='flex-1 pt-5 px-5 sm:pt-12 sm:pl-16'>
      <h1>All Subscriptions ({emails.length})</h1>
      {emails.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-xl text-gray-500">No email subscriptions found</div>
        </div>
      ) : (
        <div className='relative max-w-[600px] h-[80vh] overflow-x-auto mt-4 border border-gray-400 scollbar-hide'>
          <table className='w-full text-sm text-gray-500'>
            <thead className='text-xs text-left text-gray-700 uppercase bg-gray-50 '>
              <tr>
                <th scope='col' className='px-6 py-3'>
                  Email Subscription
                </th>
                <th scope='col' className='hidden sm:block px-6 py-3'>
                  Date
                </th>
                <th scope='col' className='px-6 py-3'>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {emails.map((item,index)=>{
                  return <SubsTableItem 
                    key={index} 
                    mongoId={item._id} 
                    deleteEmail={deleteEmail} 
                    email={item.email} 
                    date={item.createdAt || item.date}
                  />;
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default page
