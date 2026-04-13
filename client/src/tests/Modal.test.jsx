import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Modal from '../components/ui/Modal'

test('no renderiza nada si isOpen es false', () => {
  render(<Modal isOpen={false} onClose={() => {}} title="Mi Modal" />)
  expect(screen.queryByText('Mi Modal')).not.toBeInTheDocument()
})

test('muestra el título si isOpen es true', () => {
  render(<Modal isOpen={true} onClose={() => {}} title="Mi Modal" />)
  expect(screen.getByText('Mi Modal')).toBeInTheDocument()
})

test('renderiza los children', () => {
  render(
    <Modal isOpen={true} onClose={() => {}} title="Test">
      <p>Contenido del modal</p>
    </Modal>
  )
  expect(screen.getByText('Contenido del modal')).toBeInTheDocument()
})

test('llama onClose al hacer click en ×', async () => {
  const onClose = vi.fn()
  render(<Modal isOpen={true} onClose={onClose} title="Test" />)
  await userEvent.click(screen.getByText('×'))
  expect(onClose).toHaveBeenCalledTimes(1)
})
