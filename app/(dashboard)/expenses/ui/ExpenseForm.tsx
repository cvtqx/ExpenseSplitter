'use client';

import React, { useEffect, useState } from 'react';
import { useUserContext } from '../../../context/UserContext';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { GroupMembers } from './GroupMembers';
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';

interface Contribution {
  member_id: string;
  amount: number;
}

interface ExpenseFormData {
  expenseName: string;
  amount: number;
  category: string;
  description: string;
  groupId: string;
  receipt?: File;
  splitOption: string;
  isPaid: boolean;
  contributions: Contribution[];
}

const ExpenseForm: React.FC = () => {
  const { userDetails, userGroups, setUserExpenses, setUserContribution } =
    useUserContext();

  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    resetField,
    clearErrors,
    formState: { errors, isSubmitSuccessful },
  } = useForm<ExpenseFormData>({
    defaultValues: {
      expenseName: '',
      amount: undefined,
      category: '',
      description: '',
      groupId: undefined,
      receipt: undefined,
      splitOption: undefined,
      isPaid: false,
      contributions: [],
    },
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<string>();
  const [splitType, setSplitType] = useState<string>('equally');
  const [amount, setAmount] = useState<number>(0);
  const [category, setCategory] = useState<string>('');
  const [contributions, setContributions] = useState<
    { member_id: string; amount: number }[]
  >([]);
  
  const expenseCategories = [
    'Restaurant',
    'Groceries',
    'Rent',
    'Gas',
    'Utility bills',
    'Coffee',
    'Movies',
    'Clothing',
    'Internet & Cable',
    'Travel/Vacation',
    'Laundry',
    'Other',
  ];

  const handleCategorySelection = (category: string) => {
    clearErrors('category');
    setValue('category', category);
    setCategory(category);
  };

  const handleGroupIdSelection = (id: string) => {
    clearErrors('groupId');
    setValue('groupId', id);
    setSelectedGroupId(id);
  };

  const handleSplitTypeSelection = (type: string) => {
    setSplitType(type);
  };

  const amountChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearErrors('amount')
    const value = parseFloat(e.target.value);
    setAmount(value);
  };

  const handleContributionsChange = (
    contributions: { member_id: string; amount: number }[]
  ) => {
    setContributions(contributions);
  };

  const handleCancel = () => {
    reset();
    // Manually reset the Select component values using setValue
    setValue('category', null, { shouldValidate: true }); 
    resetField('groupId'); 
    resetField('splitOption');
    setCategory('');
    setSelectedGroupId('');
    setSelectedFile(null);
    setContributions([]);
    setAmount(0);
    setSplitType('equally');
  };

  const addNewExpenseToDatabase = async (data: ExpenseFormData) => {
    const formData = new FormData();
    formData.append('name', data.expenseName);
    formData.append('description', data.description);
    formData.append('amount', data.amount.toString());
    formData.append('category', data.category);
    formData.append('is_paid', data.isPaid.toString());
    formData.append('contributions', JSON.stringify(data.contributions));
    
    if (data.receipt) {
      formData.append('file', data.receipt);
    }

    try {
      const response = await fetch(
        `/api/groups/${selectedGroupId}/addExpense`,
        {
          method: 'POST',
          body: formData,
        }
      );
      if (!response.ok) {
        throw new Error('failed to create expense');
      }

      const result = await response.json();

      if (result.success) {
        const sessionuserContribution = contributions.find(
          (contribution) => contribution.member_id === userDetails._id
        );

        const newExpense = {
          ...result.expense,
          contribution: sessionuserContribution?.amount,
        };

        setUserExpenses((prevExpenses) => [newExpense, ...prevExpenses]);

        if (sessionuserContribution) {
          setUserContribution(
            (prevContribution) =>
              prevContribution + sessionuserContribution.amount
          );
        }
        toast({
          description: 'New expense created successfully!.',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem creating an expense.',
        action: <ToastAction altText='Try again'>Try again</ToastAction>,
      });
      console.error('Error creating expense', error);
    }
  };

  const onSubmit: SubmitHandler<ExpenseFormData> = async (data) => {
    if (!data) {
      return;
    }
    if (selectedFile) {
      data.receipt = selectedFile;
    }
    if (selectedGroupId) {
      data.groupId = selectedGroupId;
    }
    
    data.category = category;
    data.splitOption = splitType;
    data.isPaid =
      amount === contributions.reduce((total, c) => total + c.amount, 0);
    data.contributions = contributions;
    //await addNewExpenseToDatabase(data);
console.log('DATA', data)
     };

  //reset the form after submission
  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful]);

  return (
    <div className='p-4'>
      <h2 className='text-2xl font-semibold mb-4'>Add New Expense</h2>
      <form
        className='space-y-4'
        onSubmit={handleSubmit(onSubmit)}>
        <Input
          type='text'
          placeholder='Expense Name'
          {...register('expenseName', { required: true })}
          className={`${errors.expenseName && 'bg-paleRed border-red'}`}
        />
        {errors.expenseName && (
          <span className='text-red'>This field is required</span>
        )}
        <Input
          type='number'
          placeholder='Amount'
          {...register('amount', { required: true })}
          onChange={amountChangeHandler}
          className={`${errors.amount && 'bg-paleRed border-red'}`}
        />
        {errors.amount && (
          <span className='text-red'>This field is required</span>
        )}

        <Select
          {...register('category', { required: true })}
          onValueChange={(value) => {
            handleCategorySelection(value);
          }}>
          <SelectTrigger
            className={`${errors.category && 'bg-paleRed border-red'}`}>
            <SelectValue placeholder='Select a category' />
          </SelectTrigger>
          <SelectContent>
            {expenseCategories.map((category) => (
              <SelectItem
                key={category}
                value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && (
          <span className='text-red'>This field is required</span>
        )}
        <Textarea
          placeholder='Description'
          {...register('description')}
        />
        <Select
          {...register('groupId', { required: true })}
          onValueChange={(value) => {
            handleGroupIdSelection(value);
          }}>
          <SelectTrigger
            className={`${errors.groupId && 'bg-paleRed border-red'}`}>
            <SelectValue placeholder='Select a Group' />
          </SelectTrigger>
          <SelectContent>
            {userGroups.map((group) => (
              <SelectItem
                key={group._id}
                value={group._id}>
                {group.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.groupId && (
          <span className='text-red'>This field is required</span>
        )}

        <label className='flex items-center'>
          Upload receipt
          <Input
            type='file'
            accept='image/*'
            className='w-64 ml-4'
            {...register('receipt')}
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setSelectedFile(e.target.files[0]);
              }
            }}
          />
        </label>
        <Select
          {...register('splitOption')}
          onValueChange={handleSplitTypeSelection}>
          <SelectTrigger>
            <SelectValue placeholder='Select Split Option' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='equally'>Equally</SelectItem>
            <SelectItem value='custom'>Custom</SelectItem>
          </SelectContent>
        </Select>
        <GroupMembers
          groupId={selectedGroupId}
          splitType={splitType}
          amount={amount}
          onContributionsChange={handleContributionsChange}
        />
        <label className='flex items-center'>
          <input
            type='checkbox'
            {...register('isPaid')}
            className='mr-2'
          />
          Is Paid
        </label>
        <div className='flex justify-between'>
          <Button
            type='button'
            className='bg-red mr-2'
            onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            className='bg-green-300 text-white'
            type='submit'>
            Create expense
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ExpenseForm;
