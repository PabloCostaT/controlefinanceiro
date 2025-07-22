import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AddMemberForm } from '../components/add-member-form'

describe('AddMemberForm', () => {
  test('does not submit when name is empty', async () => {
    const onAddMember = jest.fn()
    render(<AddMemberForm onAddMember={onAddMember} />)
    await userEvent.click(screen.getByRole('button', { name: /adicionar membro/i }))
    expect(onAddMember).not.toHaveBeenCalled()
  })

  test('submits valid data', async () => {
    const onAddMember = jest.fn()
    render(<AddMemberForm onAddMember={onAddMember} />)

    await userEvent.type(screen.getByLabelText(/nome/i), 'Ana')
    await userEvent.type(screen.getByLabelText(/email/i), 'ana@example.com')
    await userEvent.click(screen.getByRole('button', { name: /adicionar membro/i }))

    expect(onAddMember).toHaveBeenCalledWith({ name: 'Ana', email: 'ana@example.com' })
  })
})
