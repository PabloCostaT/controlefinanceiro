import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RecurringExpensesForm } from '../components/recurring-expenses-form'

const members = [{ id: '1', name: 'John' }]
const projects: any[] = []

describe('RecurringExpensesForm', () => {
  test('shows validation errors when required fields missing', async () => {
    const onAdd = jest.fn()
    render(<RecurringExpensesForm members={members} projects={projects} onAddRecurringExpense={onAdd} />)

    await userEvent.click(screen.getByRole('button', { name: /adicionar/i }))
    await userEvent.click(screen.getByRole('button', { name: /criar despesa fixa/i }))
    expect(await screen.findByText(/Nome é obrigatório/)).toBeInTheDocument()
    expect(onAdd).not.toHaveBeenCalled()
  })

  test('submits valid recurring expense', async () => {
    const onAdd = jest.fn()
    render(<RecurringExpensesForm members={members} projects={projects} onAddRecurringExpense={onAdd} />)

    await userEvent.click(screen.getByRole('button', { name: /adicionar/i }))

    await userEvent.type(screen.getByLabelText(/nome da despesa/i), 'Netflix')
    await userEvent.type(screen.getByLabelText(/valor/i), '25')

    // select responsible
    await userEvent.click(screen.getByLabelText(/responsável/i))
    await userEvent.click(screen.getByRole('option', { name: /john/i }))

    // select category
    await userEvent.click(screen.getByLabelText(/categoria/i))
    await userEvent.click(screen.getByRole('option', { name: /casa/i }))

    // choose split member
    await userEvent.click(screen.getByRole('checkbox'))

    await userEvent.click(screen.getByRole('button', { name: /criar despesa fixa/i }))

    expect(onAdd).toHaveBeenCalledWith({
      name: 'Netflix',
      amount: 25,
      dueDay: 1,
      responsibleId: '1',
      category: 'casa',
      splitBetween: ['1'],
      projectId: undefined,
      isActive: true,
      notes: undefined,
    })
  })
})
