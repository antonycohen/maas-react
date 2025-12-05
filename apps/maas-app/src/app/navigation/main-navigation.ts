import { BookOpen, Bot, Settings2, SquareTerminal } from 'lucide-react';

export const mainNavigation = [
  {
    title: 'Home',
    url: '/',
    icon: SquareTerminal
  },
  {
    title: 'Users',
    url: '/users',
    icon: SquareTerminal
  },
  {
    title: 'Models',
    url: '#',
    icon: Bot,
    items: [
      {
        title: 'Genesis',
        url: '#',
      },
      {
        title: 'Explorer',
        url: '#',
      },
      {
        title: 'Quantum',
        url: '#',
      },
    ],
  },
  {
    title: 'Documentation',
    url: '#',
    icon: BookOpen,
    items: [
      {
        title: 'Introduction',
        url: '#',
      },
      {
        title: 'Get Started',
        url: '#',
      },
      {
        title: 'Tutorials',
        url: '#',
      },
      {
        title: 'Changelog',
        url: '#',
      },
    ],
  },
  {
    title: 'Settings',
    url: '#',
    icon: Settings2,
    items: [
      {
        title: 'General',
        url: '#',
      },
      {
        title: 'Team',
        url: '#',
      },
      {
        title: 'API Settings',
        url: '#',
      },
      {
        title: 'Limits',
        url: '#',
      },
    ],
  },
]
