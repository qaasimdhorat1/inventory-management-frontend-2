import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import App from './App';

test('App renders without crashing', () => {
  render(<App />);
});

test('unauthenticated user sees sign in page', () => {
  render(<App />);
  const signIn = screen.getByText(/sign in to your account/i);
  expect(signIn).toBeInTheDocument();
});

test('register link is visible on login page', () => {
  render(<App />);
  const registerLink = screen.getByText(/register here/i);
  expect(registerLink).toBeInTheDocument();
});

test('sign in button is present', () => {
  render(<App />);
  const signInBtn = screen.getByRole('button', { name: /sign in/i });
  expect(signInBtn).toBeInTheDocument();
});

test('username and password inputs are present', () => {
  render(<App />);
  const inputs = screen.getAllByRole('textbox');
  const passwordInput = document.querySelector('input[type="password"]');
  expect(inputs.length).toBeGreaterThanOrEqual(1);
  expect(passwordInput).toBeTruthy();
});