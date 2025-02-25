import { CartesianGrid, XAxis, YAxis } from 'recharts'

import { theme } from '@island.is/island-ui/theme'
import type { Locale } from '@island.is/shared/types'
import { Chart, ChartComponent } from '@island.is/web/graphql/schema'

import {
  BASE_ACCORDION_HEIGHT,
  CHART_HEIGHT,
  DEFAULT_XAXIS_KEY,
} from '../constants'
import { ChartComponentType, ChartType } from '../types'
import { formatValueForPresentation } from './format'

const KNOWN_COMPONENT_TYPES: ChartComponentType[] = [
  ChartComponentType.line,
  ChartComponentType.bar,
  ChartComponentType.area,
  ChartComponentType.pie,
]

export const decideChartBase = (
  components: ChartComponent[],
): ChartType | null => {
  const typeLookup = components.reduce((lookup, current) => {
    if (KNOWN_COMPONENT_TYPES.includes(current.type as ChartComponentType)) {
      lookup[current.type as ChartComponentType] = true
    } else {
      console.error(`Unknown type, ${current.type}, found in chart components`)
    }

    return lookup
  }, {} as Record<ChartComponentType, boolean>)

  const types = Object.keys(typeLookup).map((type) =>
    type === ChartComponentType.pie ? ChartType.pie : type,
  )

  if (types.length === 0) {
    // No known types found in chart component
    // So we cant decide chart base
    return null
  } else if (types.length === 1) {
    // Only have one known type, return it
    return types[0] as ChartType
  } else if (types.includes('pie')) {
    // We have multiple types, and pie is one of them
    console.error(`Pie component can not be used with other component types`)
    return null
  }

  return ChartType.mixed
}

interface GetCartesianGridComponents {
  activeLocale: Locale
  chartUsesGrid: boolean
  slice: Chart
  tickFormatter: (value: unknown) => string
}

export const getCartesianGridComponents = ({
  activeLocale,
  chartUsesGrid,
  slice,
  tickFormatter,
}: GetCartesianGridComponents) => {
  if (!chartUsesGrid) {
    return null
  }

  const xAxisKey = slice.xAxisKey || DEFAULT_XAXIS_KEY

  return [
    <CartesianGrid
      stroke="rgb(0, 97, 255, 0.2)"
      strokeDasharray="4 4"
      vertical={false}
    />,
    <XAxis
      axisLine={{ stroke: theme.color.blue200 }}
      aria-hidden="true"
      dataKey={xAxisKey || undefined}
      tickFormatter={tickFormatter}
      style={{
        fontSize: theme.typography.baseFontSize,
        fontFamily: theme.typography.fontFamily,
      }}
      dy={theme.spacing.p2}
    />,
    <YAxis
      axisLine={{ stroke: theme.color.blue200 }}
      aria-hidden="true"
      type="number"
      style={{
        fontSize: theme.typography.baseFontSize,
        fontFamily: theme.typography.fontFamily,
      }}
      tickFormatter={(v) => formatValueForPresentation(activeLocale, v)}
    />,
  ]
}

export const calculateChartSkeletonLoaderHeight = (
  isCard: boolean,
  isExpanded: boolean,
) => {
  if (!isCard) {
    return CHART_HEIGHT
  }

  return isExpanded
    ? CHART_HEIGHT + BASE_ACCORDION_HEIGHT
    : BASE_ACCORDION_HEIGHT
}
