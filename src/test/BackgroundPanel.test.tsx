import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import BackgroundPanel from '../Components/Common/BackgroundPanel';

describe('BackgroundPanel', () => {
  	it('должен рендерить children и footer', () => {
  	  	render(
  	  	  	<MemoryRouter>
  	  	  	  	<BackgroundPanel footer={<div>Footer content</div>}>
  	  	  	  	  	<div>Main content</div>
  	  	  	  	</BackgroundPanel>
  	  	  	</MemoryRouter>
  	  	);

  	  	expect(screen.getByText('Main content')).toBeInTheDocument();
  	  	expect(screen.getByText('Footer content')).toBeInTheDocument();
  	});

  	it('должен рендерить логотип', () => {
  	  	render(
  	  	  	<MemoryRouter>
  	  	  	  	<BackgroundPanel footer={null}>Content</BackgroundPanel>
  	  	  	</MemoryRouter>
  	  	);

  	  	expect(document.querySelector('.o-logo-icon')).toBeInTheDocument();
  	});
});
