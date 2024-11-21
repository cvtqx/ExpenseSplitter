import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { format } from 'date-fns';
import React from 'react';

interface Expense {
    _id: string;
    group_id: string;
    is_paid: boolean;
    name: string;
    category: string;
    description: string;
    contribution: number;
    amount: number;
    date: string;
}

const ExpenseCard = ({ expense }: {expense: Expense}) => {
  return (
    <Card className='bg-pampas w-full sm:w-64 mt-8 transition-transform transform hover:scale-105 hover:shadow'>
      <CardHeader>
        <h3 className='text-lg font-bold'>{expense.name}</h3>
        <p className='text-gray-500'>{expense.category}</p>
      </CardHeader>
      <CardContent>
        <p>Description: {expense.description}</p>
        <p className='font-medium text-lg text-purple'>
          You paid: ${expense.contribution.toFixed(2)}
        </p>
        <p className='font-bold'>Total bill was: ${expense.amount}</p>
        <p className='text-sm text-gray-400'>
          Date of expense: {format(new Date(expense.date), 'MMMM dd, yyyy')}
        </p>
      </CardContent>
      <CardFooter className='flex justify-between'>
        <Button
          className='bg-green-300 text-white'
          type='button'>
          View Details
        </Button>
        <Button
          className='bg-red text-white'
          type='button'>
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}

export default ExpenseCard;

