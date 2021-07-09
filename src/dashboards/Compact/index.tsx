import React, { useState, useEffect } from 'react'
import { WidthProvider, Responsive, Layouts, Layout } from 'react-grid-layout'

import { useLongPress } from 'use-long-press/dist'

import RearrangeModal, { Item } from '../../components/RearrangeModal'

import {
    useBikeRentalStations,
    useStopPlacesWithDepartures,
    useScooters,
} from '../../logic'
import DashboardWrapper from '../../containers/DashboardWrapper'
import ResizeHandle from '../../assets/icons/ResizeHandle'

import {
    getFromLocalStorage,
    saveToLocalStorage,
} from '../../settings/LocalStorage'

import { useSettingsContext } from '../../settings'

import { DEFAULT_ZOOM } from '../../constants'
import { usePrevious } from '../../utils'

import DepartureTile from './DepartureTile'
import BikeTile from './BikeTile'
import MapTile from './MapTile'

import './styles.scss'

const ResponsiveReactGridLayout = WidthProvider(Responsive)

function isMobileWeb(): boolean {
    return (
        typeof window.orientation !== 'undefined' ||
        navigator.userAgent.indexOf('IEMobile') !== -1
    )
}

function getDataGrid(
    index: number,
    maxWidth: number,
): { [key: string]: number } {
    return {
        w: 1,
        maxW: maxWidth,
        minH: 1,
        h: 4,
        x: index % maxWidth,
        y: 0,
    }
}

function sameTileContent(
    newTileOrder: Item[],
    storedTileOrder: Item[] | undefined,
): boolean {
    if (!storedTileOrder) return false
    return newTileOrder.sort().join(',') === storedTileOrder.join(',')
}

const BREAKPOINTS = {
    lg: 1200,
    md: 996,
    sm: 768,
    xs: 480,
    xxs: 0,
}

const COLS: { [key: string]: number } = {
    lg: 4,
    md: 3,
    sm: 1,
    xs: 1,
    xxs: 1,
}

const EnturDashboard = ({ history }: Props): JSX.Element | null => {
    const [settings] = useSettingsContext()
    const [breakpoint, setBreakpoint] = useState<string>('lg')
    const dashboardKey = history.location.key
    const [gridLayouts, setGridLayouts] = useState<Layouts | undefined>(
        getFromLocalStorage(dashboardKey),
    )

    const [tileOrder, setTileOrder] = useState<Item[] | undefined>(
        getFromLocalStorage(dashboardKey + 'compact-tile-order'),
    )

    const bikeRentalStations = useBikeRentalStations()

    const scooters = useScooters()

    let stopPlacesWithDepartures = useStopPlacesWithDepartures()

    if (stopPlacesWithDepartures) {
        stopPlacesWithDepartures = stopPlacesWithDepartures.filter(
            ({ departures }) => departures.length > 0,
        )
    }

    const numberOfStopPlaces = stopPlacesWithDepartures
        ? stopPlacesWithDepartures.length
        : 0
    const anyBikeRentalStations: number | null =
        bikeRentalStations && bikeRentalStations.length

    const bikeCol = anyBikeRentalStations ? 1 : 0
    const hasData = Boolean(
        bikeRentalStations?.length ||
            scooters?.length ||
            stopPlacesWithDepartures?.length,
    )
    const mapCol = hasData ? 1 : 0
    const totalItems = numberOfStopPlaces + bikeCol + mapCol

    const maxWidthCols = COLS[breakpoint]

    const prevNumberOfStopPlaces = usePrevious(numberOfStopPlaces)

    const [modalVisible, setModalVisible] = useState(false)

    useEffect(() => {
        let defaultTileOrder: Item[] = []
        if (stopPlacesWithDepartures) {
            if (stopPlacesWithDepartures.length == prevNumberOfStopPlaces) {
                return
            }
            defaultTileOrder = stopPlacesWithDepartures.map((item) => ({
                id: item.id,
                name: item.name,
            }))
        }
        if (anyBikeRentalStations) {
            defaultTileOrder = [
                ...defaultTileOrder,
                { id: 'city-bike', name: 'Bysykkel' },
            ]
        }
        if (hasData && settings?.showMap) {
            defaultTileOrder = [
                ...defaultTileOrder,
                { id: 'map', name: 'Kart' },
            ]
        }
        const storedOrder: Item[] | undefined = getFromLocalStorage(
            dashboardKey + 'compact-tile-order',
        )
        if (
            storedOrder &&
            storedOrder.length === defaultTileOrder.length &&
            sameTileContent(defaultTileOrder, storedOrder)
        ) {
            setTileOrder(storedOrder)
        } else {
            setTileOrder(defaultTileOrder)
        }
    }, [
        stopPlacesWithDepartures,
        prevNumberOfStopPlaces,
        anyBikeRentalStations,
        hasData,
        settings?.showMap,
        dashboardKey,
    ])

    const longPress = useLongPress(
        () => {
            setModalVisible(true)
        },
        { threshold: 1000 },
    )

    if (window.innerWidth < BREAKPOINTS.md) {
        if (!tileOrder) return null

        return (
            <DashboardWrapper
                className="compact"
                history={history}
                bikeRentalStations={bikeRentalStations}
                stopPlacesWithDepartures={stopPlacesWithDepartures}
                scooters={scooters}
            >
                <div className="compact__tiles" {...longPress}>
                    <RearrangeModal
                        itemOrder={tileOrder}
                        onTileOrderChanged={(item) => {
                            setTileOrder(item)
                            saveToLocalStorage(
                                dashboardKey + 'compact-tile-order',
                                item,
                            )
                        }}
                        modalVisible={modalVisible}
                        onDismiss={() => setModalVisible(false)}
                    />
                    {tileOrder.map((item) => {
                        if (item.id == 'map') {
                            return hasData && settings?.showMap ? (
                                <div key={item.id}>
                                    <MapTile
                                        scooters={scooters}
                                        stopPlaces={stopPlacesWithDepartures}
                                        bikeRentalStations={bikeRentalStations}
                                        walkTimes={null}
                                        latitude={
                                            settings?.coordinates?.latitude ?? 0
                                        }
                                        longitude={
                                            settings?.coordinates?.longitude ??
                                            0
                                        }
                                        zoom={settings?.zoom ?? DEFAULT_ZOOM}
                                    />
                                </div>
                            ) : (
                                []
                            )
                        } else if (item.id == 'city-bike') {
                            return bikeRentalStations &&
                                anyBikeRentalStations ? (
                                <div key={item.id}>
                                    <BikeTile stations={bikeRentalStations} />
                                </div>
                            ) : (
                                []
                            )
                        } else if (stopPlacesWithDepartures) {
                            const stopIndex =
                                stopPlacesWithDepartures.findIndex(
                                    (p) => p.id == item.id,
                                )
                            return (
                                <div key={item.id}>
                                    <DepartureTile
                                        stopPlaceWithDepartures={
                                            stopPlacesWithDepartures[stopIndex]
                                        }
                                    />
                                </div>
                            )
                        }
                    })}
                </div>
            </DashboardWrapper>
        )
    }

    return (
        <DashboardWrapper
            className="compact"
            history={history}
            bikeRentalStations={bikeRentalStations}
            stopPlacesWithDepartures={stopPlacesWithDepartures}
            scooters={scooters}
        >
            <div className="compact__tiles">
                <ResponsiveReactGridLayout
                    key={breakpoint}
                    breakpoints={BREAKPOINTS}
                    cols={COLS}
                    layouts={gridLayouts}
                    isResizable={!isMobileWeb()}
                    isDraggable={!isMobileWeb()}
                    onBreakpointChange={(newBreakpoint: string) => {
                        setBreakpoint(newBreakpoint)
                    }}
                    onLayoutChange={(
                        layout: Layout[],
                        layouts: Layouts,
                    ): void => {
                        if (numberOfStopPlaces > 0) {
                            setGridLayouts(layouts)
                            saveToLocalStorage(dashboardKey, layouts)
                        }
                    }}
                >
                    {(stopPlacesWithDepartures || []).map((stop, index) => (
                        <div
                            key={stop.id}
                            data-grid={getDataGrid(index, maxWidthCols)}
                        >
                            <ResizeHandle
                                size="32"
                                className="resizeHandle"
                                variant="light"
                            />
                            <DepartureTile
                                key={index}
                                stopPlaceWithDepartures={stop}
                            />
                        </div>
                    ))}
                    {bikeRentalStations && anyBikeRentalStations ? (
                        <div
                            key="city-bike"
                            data-grid={getDataGrid(
                                numberOfStopPlaces,
                                maxWidthCols,
                            )}
                        >
                            {!isMobileWeb() ? (
                                <ResizeHandle
                                    size="32"
                                    className="resizeHandle"
                                    variant="light"
                                />
                            ) : null}
                            <BikeTile stations={bikeRentalStations} />
                        </div>
                    ) : (
                        []
                    )}
                    {hasData && settings?.showMap ? (
                        <div
                            id="compact-map-tile"
                            key="map"
                            data-grid={getDataGrid(
                                totalItems - 1,
                                maxWidthCols,
                            )}
                        >
                            {!isMobileWeb() ? (
                                <ResizeHandle
                                    size="32"
                                    className="resizeHandle"
                                    variant="dark"
                                />
                            ) : null}

                            <MapTile
                                scooters={scooters}
                                stopPlaces={stopPlacesWithDepartures}
                                bikeRentalStations={bikeRentalStations}
                                walkTimes={null}
                                latitude={settings?.coordinates?.latitude ?? 0}
                                longitude={
                                    settings?.coordinates?.longitude ?? 0
                                }
                                zoom={settings?.zoom ?? DEFAULT_ZOOM}
                            />
                        </div>
                    ) : (
                        []
                    )}
                </ResponsiveReactGridLayout>
            </div>
        </DashboardWrapper>
    )
}

interface Props {
    history: any
}

export default EnturDashboard
