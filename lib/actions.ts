export async function deleteExpense(expenseId: string, groupId: string) {
  try {
    const response = await fetch(
      `api/groups/${groupId}/expenses/${expenseId}/deleteExpense`,
      {
        method: 'DELETE',
      }
    );
    if (!response.ok) {
      throw new Error('failed to delete expense');
    }
    return true;
  } catch (error) {
    console.error('Error deleting expense', error);
    throw error;
  }
}
