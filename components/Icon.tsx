import React from 'react'
import {
  Home,
  NotebookText,
  List,
  Box,
  Car,
  Wallet,
  Fuel,
  BarChart3,
} from 'lucide-react'

type IconName =
  | 'home'
  | 'journal'
  | 'catalog'
  | 'parts'
  | 'vehicle'
  | 'expenses'
  | 'fuel'
  | 'reports'

export function Icon({ name, className, size = 24 }: { name: IconName; className?: string; size?: number }) {
  const props = { className, size, strokeWidth: 1.75 }
  switch (name) {
    case 'home':     return <Home {...props} />
    case 'journal':  return <NotebookText {...props} />
    case 'catalog':  return <List {...props} />
    case 'parts':    return <Box {...props} />
    case 'vehicle':  return <Car {...props} />
    case 'expenses': return <Wallet {...props} />
    case 'fuel':     return <Fuel {...props} />
    case 'reports':  return <BarChart3 {...props} />
    default:         return null
  }
}