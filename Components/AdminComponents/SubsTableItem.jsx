import React from 'react'

const SubsTableItem = ({email,mongoId,deleteEmail,date}) => {
    
    const formatDate = (dateString) => {
        try {
            const emailDate = new Date(dateString);
            return emailDate.toDateString();
        } catch (error) {
            return "Unknown Date";
        }
    };

  return (
    <tr className='bg-white border-b text-left'>
      <th scope='row' className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap'>
        {email?email:"No Email"}
      </th>
      <td className='px-6 py-4 hidden sm:block'>{formatDate(date)}</td>
      <td className='px-6 py-4 cursor-pointer hover:text-red-600' onClick={()=>deleteEmail(mongoId)}>x</td>
    </tr>
  )
}

export default SubsTableItem
