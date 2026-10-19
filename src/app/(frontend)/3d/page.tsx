import React from 'react'

import { DrawerPage } from '@/components/notebook/DrawerPage'

export const dynamic = 'force-dynamic'

export default function Page() {
  return <DrawerPage drawer="3d" />
}