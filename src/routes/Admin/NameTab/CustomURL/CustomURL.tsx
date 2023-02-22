import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import {
    copySettingsToNewId,
    setIdToBeDeleted,
    userIsOwner,
} from 'settings/firebase'
import { useUser } from 'settings/UserProvider'
import {
    Label,
    Paragraph,
    EmphasizedText,
    UnorderedList,
    ListItem,
} from '@entur/typography'
import { TextField } from '@entur/form'
import { SecondarySquareButton } from '@entur/button'
import { CheckIcon } from '@entur/icons'
import { Tooltip } from '@entur/tooltip'
import classes from '../NameTab.module.scss'

enum inputFeedback {
    ID_UNAVAILABLE = 'Ikke ledig: Denne Tavla-lenken er dessverre i bruk.',
    ID_SET = 'Din nye Tavla-lenke er nå opprettet!',
    EMPTY_STRING = 'Tomt felt: Tavle-lenken kan ikke være tom.',
    TOO_SHORT = 'For kort: Tavle-lenken må være på minst seks tegn.',
    NOT_OWNER = 'Du har ikke rettigheter til å endre tavlelenken.',
    NOTHING = '',
}

enum inputFeedbackType {
    SUCCESS = 'success',
    FAILURE = 'error',
    CLEAR = 'info',
}

const CustomURL = (): JSX.Element => {
    const user = useUser()

    const [customUrlInput, setCustomUrlInput] = useState('')
    const [feedbackMessage, setFeedbackMessage] = useState(
        inputFeedback.NOTHING,
    )
    const [feedbackMessageType, setFeedbackMessageType] = useState(
        inputFeedbackType.CLEAR,
    )

    const { documentId } = useParams<{ documentId: string }>()
    const [currentDoc, setCurrentDoc] = useState(documentId as string)

    const handleCustomUrlChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ): void => {
        if (event.currentTarget.value.match(/[^A-Za-z0-9_-]/g)) {
            event.currentTarget.value = event.currentTarget.value.replace(
                /[^A-Za-z0-9_-]/g,
                '',
            )
        }
        setCustomUrlInput(event.target.value)
        if (feedbackMessage) {
            setFeedbackMessage(inputFeedback.NOTHING)
            setFeedbackMessageType(inputFeedbackType.CLEAR)
        }
    }

    const tryAddCustomUrl = async () => {
        if (!customUrlInput) {
            handleFailedInputVisuals(inputFeedback.EMPTY_STRING)
            return
        } else if (customUrlInput.length < 6) {
            handleFailedInputVisuals(inputFeedback.TOO_SHORT)
            return
        }

        try {
            const isOwner = await userIsOwner(currentDoc, user?.uid)
            if (!isOwner) throw new Error()

            const successfulCopy = await copySettingsToNewId(
                customUrlInput,
                documentId ?? '',
            )
            if (successfulCopy) {
                setIdToBeDeleted(currentDoc)
                handleNewIdVisuals()
            } else {
                handleFailedInputVisuals(inputFeedback.ID_UNAVAILABLE)
            }
        } catch {
            handleFailedInputVisuals(inputFeedback.NOT_OWNER)
        }
    }

    const handleNewIdVisuals = () => {
        setFeedbackMessageType(inputFeedbackType.SUCCESS)
        setFeedbackMessage(inputFeedback.ID_SET)
        setCurrentDoc(customUrlInput)
        history.replaceState({}, '', customUrlInput)
        setCustomUrlInput('')
    }

    const handleFailedInputVisuals = (feedback: inputFeedback) => {
        setFeedbackMessageType(inputFeedbackType.FAILURE)
        setFeedbackMessage(feedback)
    }

    const Requirements = (): JSX.Element => (
        <>
            <Label>Krav til Tavla-lenke</Label>
            <UnorderedList>
                <ListItem>Tavla-lenken må bestå av minst seks tegn.</ListItem>
                <ListItem>
                    Tavla-lenken kan kun bestå av bokstaver, tall, understrek
                    «_» og bindestrek&nbsp;«-».
                </ListItem>
                <ListItem>
                    Tavla-lenken kan ikke inneholde æ, ø eller å.
                </ListItem>
            </UnorderedList>
        </>
    )

    return (
        <div className={classes.CustomURL}>
            <Paragraph>
                Her kan du lage en selvbestemt lenke til tavla di. Dette gjør
                det både lettere for deg óg andre å ha tilgang til tavla di.
            </Paragraph>
            <Paragraph>
                <EmphasizedText>
                    Obs, den gamle Tavla-lenken din vil slettes hvis du setter
                    en ny.
                </EmphasizedText>
            </Paragraph>
            <Requirements />
            <div className={classes.InputArea}>
                <Paragraph margin="none">tavla.entur.no/t/</Paragraph>
                <div className={classes.InputField}>
                    <TextField
                        label="Ønsket lenkeadresse"
                        value={customUrlInput}
                        onChange={handleCustomUrlChange}
                        onKeyDown={(
                            e: React.KeyboardEvent<HTMLInputElement>,
                        ) => {
                            if (e.key === 'Enter') tryAddCustomUrl()
                        }}
                        maxLength={80}
                        variant={feedbackMessageType}
                        feedback={feedbackMessage}
                    />
                </div>
                <div>
                    <Tooltip content="Sett Tavla-lenke" placement="top">
                        <SecondarySquareButton
                            onClick={tryAddCustomUrl}
                            aria-label="Sett Tavla-lenke"
                        >
                            <CheckIcon />
                        </SecondarySquareButton>
                    </Tooltip>
                </div>
            </div>
        </div>
    )
}

export { CustomURL }