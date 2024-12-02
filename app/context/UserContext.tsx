'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  image?: string;
}

interface Group {
  _id: string;
  name: string;
  members: string[];
  budget: number;
  description: string;
  expenses: string[];
  invite_link: string;
}

interface Expense {
  _id: string;
  amount: number;
  category: string;
  date: string;
  description: string;
  group_id: string;
  name: string;
  contribution: number;
}

interface UserContextType {
  userDetails: User;
  userGroups: Group[];
  userFriends: User[];
  userContribution: number;
  userExpenses: Expense[];
  setUserGroups: React.Dispatch<React.SetStateAction<Group[]>>;
  setUserFriends: React.Dispatch<React.SetStateAction<User[]>>;
  setUserExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
  setUserContribution: React.Dispatch<React.SetStateAction<number>>;
}

// interface ApiResponse {
//   success: boolean;
//   groups: Group[];
// }
interface UserExpense {
  contribution: string | null;
  user_id: string;
  expense_id: string;
  _id: string;
};

const defaultUser: User = {
  _id: '01',
  firstName: 'Stranger',
  lastName: '',
  email: 'No email',
  image: '',
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data } = useSession();
  const [userDetails, setUserDetails] = useState<User>(defaultUser);
  const [userGroups, setUserGroups] = useState<Group[]>([]);
  const [userFriends, setUserFriends] = useState<User[]>([]);
  const [userExpenses, setUserExpenses] = useState<Expense[]>([]);
  const [userContribution, setUserContribution] = useState<number>(0);

  const sessionUserId = data?.user?.id;

  useEffect(() => {
    if (!sessionUserId || sessionUserId === '01') return;
    const fetchData = async () => {
      try {
        const [
          userResponse,
          allUsersResponse,
          groupsResponse,
          expensesResponse,
          expensesDetailsResponse,
        ] = await Promise.all([
          fetch(`/api/users?id=${sessionUserId}`),
          fetch(`/api/users`),
          fetch('/api/groups'),
          fetch(`/api/users/${sessionUserId}/viewExpenses`),
          fetch('api/expenses')
        ]);

        if (
          !userResponse.ok ||
          !allUsersResponse.ok ||
          !groupsResponse.ok ||
          !expensesResponse.ok ||
          !expensesDetailsResponse.ok
        ) {
          throw new Error('Failed to fetch one or more resources');
        }

        const userData = await userResponse.json();
        const allUsersData = await allUsersResponse.json();
        const groupsData = await groupsResponse.json();
        const expensesData = await expensesResponse.json();
        const expensesDetailsData = await expensesDetailsResponse.json();

        // console.log('userData', userData);
        // console.log('All users', allUsersData);
        // console.log('Groups', groupsData);
        // console.log('Expenses', expensesData);
        // console.log('Details', expensesDetailsData);

        const sessionUserFriendsIds = userData.user.friends;
        const sessionUserFriendsData = allUsersData.users.filter((user: User) =>
          sessionUserFriendsIds.includes(user._id)
        );
        const sessionUserGroups = groupsData.success
          ? groupsData.groups.filter((group: Group) =>
              group.members.includes(sessionUserId)
            )
          : [];
        
        //Calculate total amount of contributions of the session user
        const lifetimeContrubutionOfSessionUser =
          expensesData.userExpenses.reduce(
            (acc: string, { contribution }: UserExpense) => {
              return acc + (contribution || 0);
            },
            0
          );

        //get details of each expense of the session user:

        //make array of expense ids for easy search
              const userExpensesIds = expensesData.userExpenses.map(
                (expense: UserExpense) => expense.expense_id
              );
        //helper function
         const findUserContributionForCurrentExpense = (id: string) => {            
              const foundExpense = expensesData.userExpenses.find(
                (expense: UserExpense) => expense.expense_id === id
              );
              return foundExpense ? foundExpense.contribution : 0;
         };
        
        const userExpenseDetails = expensesDetailsData.expenses.filter((expense: Expense) => userExpensesIds.includes(expense._id))
            .map((expense: Expense) => {
              return {
                ...expense,
                contribution: findUserContributionForCurrentExpense(
                  expense._id
                ),
              };
            });
       
        setUserContribution(lifetimeContrubutionOfSessionUser);
        setUserDetails(userData.user);
        setUserGroups(sessionUserGroups);
        setUserFriends(sessionUserFriendsData);
        setUserExpenses(userExpenseDetails);
      }catch (error) {
          console.error('Error fetching one or more resources.')
        }
      
    }

    // const getSessionUserExpenses = async () => {
    //   try {
    //     const response = await fetch(
    //       `/api/users/${sessionUserId}/viewExpenses`
    //     );
    //     if (!response.ok) {
    //       throw new Error('Failed to fetch expenses.');
    //     }
    //     const { userExpenses } = await response.json();

    //     //get total contribution
    //     if (Array.isArray(userExpenses)) {
    //       const contribution = userExpenses.reduce((acc, currentItem) => {
    //         return acc + (currentItem.contribution || 0);
    //       }, 0);
    //       setUserContribution(contribution); //lifetime contribution

    //       //make array of expense ids for easy search
    //       const userExpensesIds = userExpenses.map(
    //         (expense) => expense.expense_id
    //       );

    //       //get all expenses and find user expenses among them because we need each expense details
    //       const result = await fetch('/api/expenses');
    //       if (!result.ok) {
    //         throw new Error('Failed to fetch all expenses.');
    //       }
    //       const { expenses }: { expenses: Expense[] } = await result.json();

    //       const findUserContributionForCurrentExpense = (id: string) => {
    //         if (Array.isArray(userExpenses)) {
    //           const foundExpense = userExpenses.find(
    //             (expense) => expense.expense_id === id
    //           );
    //           return foundExpense ? foundExpense.contribution : undefined;
    //         }
    //       };
    //       const userExpenseDetails: Expense[] = expenses
    //         .filter((expense) => userExpensesIds.includes(expense._id))
    //         .map((expense) => {
    //           return {
    //             ...expense,
    //             contribution: findUserContributionForCurrentExpense(
    //               expense._id
    //             ),
    //           };
    //         });

    //       setUserExpenses(userExpenseDetails);
    //     }
    //   } catch (error) {
    //     console.error('Error fetching expenses:', error);
    //   }
    // };

    // getSessionUserFriends();
    // getSessionUserGroups();
    // getSessionUserExpenses();
    fetchData();
  }, [sessionUserId]);

  return (
    <UserContext.Provider
      value={{
        userDetails,
        userGroups,
        userFriends,
        userExpenses,
        userContribution,
        setUserGroups,
        setUserFriends,
        setUserExpenses,
        setUserContribution,
      }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};
