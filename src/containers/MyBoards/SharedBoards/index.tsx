import React from 'react'

import { Contrast } from '@entur/layout'

import type { SharedBoardProps } from '../../../types'

import { NoSharedTavlerAvailable } from '../../Error/ErrorPages'

import SharedBoardCard from './SharedBoardCard'

const SharedBoards = ({ sharedBoards }: Props): JSX.Element => {
    if (!sharedBoards.length) {
        return <NoSharedTavlerAvailable />
    }

    return (
        <Contrast>
            <div className="my-boards__board-list">
                {sharedBoards.map((board: SharedBoardProps) => (
                    <SharedBoardCard
                        key={board.id}
                        id={board.id}
                        boardName={board.boardName}
                        sharedBy={board.sharedBy}
                        theme={board.theme}
                        dashboard={board.dashboard}
                    />
                ))}
            </div>
        </Contrast>
    )
}

interface Props {
    sharedBoards: SharedBoardProps[]
}

export default SharedBoards
