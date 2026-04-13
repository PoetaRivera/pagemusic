import { render } from '@testing-library/react'
import Spinner from '../components/ui/Spinner'

test('renderiza el elemento spinner', () => {
  const { container } = render(<Spinner />)
  expect(container.querySelector('.animate-spin')).toBeInTheDocument()
})

test('está envuelto en un contenedor flex centrado', () => {
  const { container } = render(<Spinner />)
  const wrapper = container.firstChild
  expect(wrapper).toHaveClass('flex', 'justify-center', 'items-center')
})
