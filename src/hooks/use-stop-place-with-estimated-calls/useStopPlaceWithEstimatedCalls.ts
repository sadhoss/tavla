import { useMemo } from 'react'
import { ApolloError } from '@apollo/client'
import {
    TransportMode,
    useStopPlaceWithEstimatedCallsQuery,
} from 'graphql-generated/journey-planner-v3'
import { xor } from 'lodash'
import { REFRESH_INTERVAL } from 'utils/constants'
import {
    StopPlaceWithEstimatedCalls,
    toStopPlaceWithEstimatedCalls,
} from './types'

interface UseStopPlaceWithEstimatedCalls {
    stopPlaceWithEstimatedCalls: StopPlaceWithEstimatedCalls | null
    loading: boolean
    error: ApolloError | undefined
}

interface Options {
    stopPlaceId: string
    timeRange?: number
    numberOfDeparturesPerLineAndDestinationDisplay?: number
    numberOfDepartures?: number
    hiddenStopModes?: { [stopPlaceId: string]: TransportMode[] }
}

function useStopPlaceWithEstimatedCalls({
    stopPlaceId,
    timeRange,
    numberOfDeparturesPerLineAndDestinationDisplay,
    numberOfDepartures,
    hiddenStopModes,
}: Options): UseStopPlaceWithEstimatedCalls {
    const whiteListedModes = useMemo(() => {
        // In API, empty list means to fetch departures for all modes
        if (!hiddenStopModes || !hiddenStopModes[stopPlaceId]) return []

        const TransportModeValues = Object.values(TransportMode)
        return xor(TransportModeValues, hiddenStopModes[stopPlaceId])
    }, [hiddenStopModes, stopPlaceId])

    const { data, loading, error } = useStopPlaceWithEstimatedCallsQuery({
        pollInterval: REFRESH_INTERVAL,
        variables: {
            id: stopPlaceId,
            timeRange,
            numberOfDeparturesPerLineAndDestinationDisplay,
            numberOfDepartures,
            whiteListedModes,
        },
    })

    const stopPlaceWithEstimatedCalls = useMemo(
        () => toStopPlaceWithEstimatedCalls(data?.stopPlace) ?? null,
        [data?.stopPlace],
    )

    return {
        stopPlaceWithEstimatedCalls,
        loading,
        error,
    }
}

export { useStopPlaceWithEstimatedCalls }