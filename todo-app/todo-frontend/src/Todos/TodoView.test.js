import React from 'react';
import { render, screen, waitFor} from '@testing-library/react';
import axios from '../util/apiClient'; // You might need to mock axios
import TodoView from './TodoView';

// Mock axios (example, you might need to adjust this based on your axios usage)
jest.mock('../util/apiClient', () => ({
  get: jest.fn(),
  post: jest.fn(),
  delete: jest.fn(),
  put: jest.fn(),
}));

describe('TodoView', () => {
  test('renders the component', async () => {
    axios.get.mockResolvedValue({ data: [] });

    render(<TodoView />);

    // Wait for the initial data fetch
    await waitFor(() => expect(axios.get).toHaveBeenCalledWith('/todos'));

    // Ensure that the "Todos" header is rendered
    expect(screen.getByText('Todos')).toBeInTheDocument();

  });
});
