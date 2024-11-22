import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { format } from 'date-fns';
import React from 'react';
import { useUserContext } from '@/app/context/UserContext';
import { deleteExpense } from '@/lib/actions';

interface Expense {
  _id: string;
  group_id: string;
  is_paid?: boolean;
  name: string;
  category: string;
  description: string;
  contribution: number;
  amount: number;
  date: string;
}

const ExpenseCard = ({ expense }: { expense: Expense }) => {
  const { setUserExpenses, setUserContribution } = useUserContext();
  const { toast } = useToast();

  const deleteExpenseHandler = async () => {
    try {
      const success = await deleteExpense(expense._id, expense.group_id);
      if (success) {
        toast({
          description: 'Expense deleted successfully!',
        });

        setUserExpenses((prevExpenses) =>
          prevExpenses.filter((prevExpense) => prevExpense._id !== expense._id)
        );

        setUserContribution(
          (prevContribution) => prevContribution - expense.amount
        );
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem deleting an expense.',
        action: <ToastAction altText='Try again'>Try again</ToastAction>,
      });
    }
  };

  return (
    <Card className='bg-pampas w-64 min-w-64 mt-8 transition-transform transform hover:scale-105 hover:shadow'>
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
          type='button'
          onClick={deleteExpenseHandler}>
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ExpenseCard;
