import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AddExpenseForm } from '../components/add-expense-form'
import { useExpenses } from '../hooks/useExpenses'

jest.mock('../hooks/useExpenses')

describe('AddExpenseForm', () => {
  const mockAddExpense = jest.fn()

  beforeEach(() => {
    mockAddExpense.mockClear()
    ;(useExpenses as jest.Mock).mockReturnValue({
      members: [{ id: '1', name: 'John' }],
      projects: [],
      addExpense: mockAddExpense,
    })
  })

  test('requires mandatory fields', async () => {
    render(<AddExpenseForm />)
    await userEvent.click(screen.getByRole('button', { name: /adicionar despesa/i }))
    expect(mockAddExpense).not.toHaveBeenCalled()
  })

  test('submits valid expense', async () => {
    render(<AddExpenseForm />)
    await userEvent.type(screen.getByLabelText(/descrição/i), 'Almoço')
    await userEvent.type(screen.getByLabelText(/valor/i), '12')
    await userEvent.click(screen.getByRole('button', { name: /adicionar despesa/i }))
    expect(mockAddExpense).toHaveBeenCalled()
    const expense = mockAddExpense.mock.calls[0][0]
    expect(expense.description).toBe('Almoço')
    expect(expense.amount).toBe(12)
  })
})
