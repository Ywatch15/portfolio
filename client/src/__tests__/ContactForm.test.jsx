/* eslint-env jest */
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ContactForm from '../components/ContactForm.jsx'

// Mock API
jest.mock('../utils/api.js', () => ({
  postContact: jest.fn().mockResolvedValue({ stored: false })
}))

describe('ContactForm', () => {
  test('shows inline validation errors', async () => {
    render(<ContactForm />)
    fireEvent.click(screen.getByRole('button', { name: /send message/i }))
    expect(await screen.findByText(/please enter your name/i)).toBeInTheDocument()
  })

  test('submits successfully', async () => {
    render(<ContactForm />)
    fireEvent.change(screen.getByPlaceholderText(/your full name/i), { target: { value: 'Jane' } })
    fireEvent.change(screen.getByPlaceholderText(/you@example.com/i), { target: { value: 'jane@example.com' } })
    fireEvent.change(screen.getByPlaceholderText(/how can i help/i), { target: { value: 'Hi there' } })
    fireEvent.click(screen.getByRole('button', { name: /send message/i }))

    await waitFor(() => {
      expect(screen.getByText(/thanks/i)).toBeInTheDocument()
    })
  })
})
