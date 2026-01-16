import { NextResponse } from 'next/server';
import { RequestItem } from '../../types';

const mockItems: RequestItem[] = [
  // UI Actions
  {
    id: 'ui-1',
    name: 'Load Dashboard',
    description: 'Fetch dashboard data and metrics',
    category: 'ui',
    request: {
      method: 'GET',
      url: 'https://jsonplaceholder.typicode.com/users',
    },
  },
  {
    id: 'ui-2',
    name: 'Refresh Feed',
    description: 'Reload the main content feed',
    category: 'ui',
    request: {
      method: 'GET',
      url: 'https://jsonplaceholder.typicode.com/posts?_limit=5',
    },
  },
  {
    id: 'ui-3',
    name: 'Load Notifications',
    description: 'Fetch user notifications',
    category: 'ui',
    request: {
      method: 'GET',
      url: 'https://jsonplaceholder.typicode.com/comments?_limit=5',
    },
  },

  // API Actions
  {
    id: 'api-1',
    name: 'Get Users',
    description: 'Fetch all users from the API',
    category: 'api',
    request: {
      method: 'GET',
      url: 'https://jsonplaceholder.typicode.com/users',
    },
  },
  {
    id: 'api-2',
    name: 'Create Post',
    description: 'Create a new post via API',
    category: 'api',
    request: {
      method: 'POST',
      url: 'https://jsonplaceholder.typicode.com/posts',
      body: {
        title: 'New Post',
        body: 'This is the post content',
        userId: 1,
      },
    },
  },
  {
    id: 'api-3',
    name: 'Get Todos',
    description: 'Fetch todo items from API',
    category: 'api',
    request: {
      method: 'GET',
      url: 'https://jsonplaceholder.typicode.com/todos?_limit=5',
    },
  },
  {
    id: 'api-4',
    name: 'Update Profile',
    description: 'Update user profile data',
    category: 'api',
    request: {
      method: 'POST',
      url: 'https://jsonplaceholder.typicode.com/users',
      body: {
        name: 'Updated Name',
        email: 'updated@example.com',
      },
    },
  },

  // Payment Actions
  {
    id: 'pay-1',
    name: 'Check Balance',
    description: 'Retrieve current account balance',
    category: 'payment',
    request: {
      method: 'GET',
      url: 'https://jsonplaceholder.typicode.com/users/1',
    },
  },
  {
    id: 'pay-2',
    name: 'Process Payment',
    description: 'Submit a payment transaction',
    category: 'payment',
    request: {
      method: 'POST',
      url: 'https://jsonplaceholder.typicode.com/posts',
      body: {
        amount: 99.99,
        currency: 'GBP',
        description: 'Order payment',
      },
    },
  },
  {
    id: 'pay-3',
    name: 'Refund Order',
    description: 'Process a refund for an order',
    category: 'payment',
    request: {
      method: 'POST',
      url: 'https://jsonplaceholder.typicode.com/posts',
      body: {
        orderId: '12345',
        amount: 49.99,
        reason: 'Customer request',
      },
    },
  },
];

export async function GET() {
  return NextResponse.json(mockItems);
}
