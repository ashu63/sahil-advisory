import type { Guide } from '../types'
import { GUIDES_A } from './index-a'
import { GUIDES_B } from './index-b'

// Newest first within the hub; stable order otherwise.
export const GUIDE_LIST: Guide[] = [...GUIDES_A, ...GUIDES_B]
