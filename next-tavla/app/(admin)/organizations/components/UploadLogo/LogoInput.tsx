'use client'
import { ChangeEventHandler, useRef, useState } from 'react'
import classes from './styles.module.css'
import { ImageIcon, UploadIcon } from '@entur/icons'
import { FormError } from 'app/(admin)/components/FormError'
import { TFormFeedback, getFormFeedbackForField } from 'app/(admin)/utils'
import { Label, Paragraph } from '@entur/typography'
import { PrimaryButton, SecondarySquareButton } from '@entur/button'

function LogoInput({ state }: { state: TFormFeedback | undefined }) {
    const [file, setFile] = useState('')
    const [fileName, setFileName] = useState<string>()
    const input = useRef(null)

    const clearLogo = () => {
        setFile('')
        setFileName(undefined)
    }

    const setLogo: ChangeEventHandler<HTMLInputElement> = (e) => {
        if (!e.target) return
        setFile(e.target.value)
        setFileName(e.target?.files?.item(0)?.name ?? 'Logo uten navn')
    }

    return (
        <div className="positionRelative">
            <Label htmlFor="logo" className={classes.upload}>
                <Filename fileName={fileName} />
                <input
                    ref={input}
                    className={classes.fileInput}
                    type="file"
                    name="logo"
                    accept="image/apng,image/jpeg,image/png,image/svg+xml,image/svg,image/webp"
                    id="logo"
                    aria-labelledby="logo"
                    onChange={setLogo}
                    onDragOver={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                    }}
                    value={file}
                    required
                    aria-required
                />
            </Label>

            <div className="mt-2">
                <FormError {...getFormFeedbackForField('file', state)} />
            </div>
            {file && (
                <div className="flexRow justifyBetween g-2 mt-2">
                    <SecondarySquareButton
                        className="w-100 justifyCenter"
                        onClick={clearLogo}
                        aria-label="Avbryt opplastning"
                    >
                        Avbryt
                    </SecondarySquareButton>
                    <PrimaryButton
                        type="submit"
                        aria-label="Last opp logo"
                        onSubmit={clearLogo}
                        className="w-100 justifyCenter"
                    >
                        Last opp logo
                    </PrimaryButton>
                </div>
            )}
        </div>
    )
}

function Filename({ fileName }: { fileName?: string }) {
    if (fileName)
        return (
            <div className="flexRow alignCenter g-2">
                <ImageIcon size={24} />
                {fileName}
            </div>
        )

    return (
        <div className="flexColumn mt-2 mb-2 weight500">
            <div className="flexRow g-2">
                <UploadIcon size={24} alt="" />
                <Paragraph margin="none">
                    Dra bilde eller klikk for å laste opp logo
                </Paragraph>
            </div>
            <Paragraph className={classes.fileSize} margin="none">
                Maksimal størrelse: 10 MB
                <br />
                Filtyper: APNG, JPEG, PNG, SVG, GIF, WEBP.
            </Paragraph>
        </div>
    )
}

export { LogoInput }