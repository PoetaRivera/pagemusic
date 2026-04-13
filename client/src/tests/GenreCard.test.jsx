import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import GenreCard from '../components/catalog/GenreCard'

const genre = { id: 1, name: 'Rock', cover_url: null }

function renderCard(g = genre) {
  return render(
    <MemoryRouter>
      <GenreCard genre={g} />
    </MemoryRouter>
  )
}

test('muestra el nombre del género', () => {
  renderCard()
  expect(screen.getByText('Rock')).toBeInTheDocument()
})

test('el link apunta a /genre/:id', () => {
  renderCard()
  expect(screen.getByRole('link')).toHaveAttribute('href', '/genre/1')
})

test('muestra imagen si hay cover_url', () => {
  renderCard({ ...genre, cover_url: 'http://example.com/cover.jpg' })
  const img = screen.getByRole('img')
  expect(img).toHaveAttribute('src', 'http://example.com/cover.jpg')
  expect(img).toHaveAttribute('alt', 'Rock')
})

test('no muestra imagen si no hay cover_url', () => {
  renderCard()
  expect(screen.queryByRole('img')).not.toBeInTheDocument()
})
