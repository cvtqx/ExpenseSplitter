'use client';

import React from 'react'
import { useUserContext } from '../../../context/UserContext';
import ExpenseCard from './ExpenseCard';

const ExpensesDisplay = () => {
    const { userExpenses } =
        useUserContext();
    
    //sort expenses from most recent 
    const sortedExpenses = [...userExpenses].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  
   console.log('expenses', sortedExpenses)
  return (
    <div className='flex flex-wrap gap-4'>
      {sortedExpenses.map((expense) => (
        <ExpenseCard key={expense._id} expense={expense}  />
      ))}
    </div>
  );
}

export default ExpensesDisplay