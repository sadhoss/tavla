'use client'
import { Dropdown } from '@entur/dropdown'
import { TextField, Checkbox } from '@entur/form'
import { Paragraph, Label, Heading2 } from '@entur/typography'
import { useOrganizations } from 'app/(admin)/hooks/useOrganizations'
import { getFormFeedbackForField } from 'app/(admin)/utils'
import { HiddenInput } from 'components/Form/HiddenInput'
import { SubmitButton } from 'components/Form/SubmitButton'
import { useState } from 'react'
import { useFormState } from 'react-dom'
import { createBoard } from './actions'
import { FormError } from '../FormError'

function NameAndOrganizationSelector() {
    const [state, action] = useFormState(createBoard, undefined)

    const { organizations, selectedOrganization, setSelectedOrganization } =
        useOrganizations()

    const [isPersonal, setIsPersonal] = useState<boolean>(false)

    const disableOrg = isPersonal || organizations().length == 0

    return (
        <form action={action} className="md:px-10">
            <Heading2>Velg navn og organisasjon for tavlen</Heading2>
            <Paragraph className="!mb-4">
                Gi tavlen et navn og legg den til i en organisasjon. Velger du
                en organisasjon vil alle i organisasjonen ha tilgang til tavlen.
            </Paragraph>
            <Label>Gi tavlen et navn</Label>
            <TextField
                size="medium"
                label="Navn"
                id="name"
                name="name"
                maxLength={50}
                required
                {...getFormFeedbackForField('name', state)}
            />

            <div className="mt-4">
                <Label>Legg til i en organisasjon</Label>
                <Dropdown
                    items={organizations}
                    label="Dine organisasjoner"
                    selectedItem={isPersonal ? null : selectedOrganization}
                    onChange={setSelectedOrganization}
                    clearable
                    aria-required="true"
                    className="mb-4"
                    disabled={disableOrg}
                    {...getFormFeedbackForField('organization', state)}
                />
                <Checkbox
                    checked={disableOrg}
                    onChange={() => {
                        setSelectedOrganization(null)
                        setIsPersonal(!isPersonal)
                    }}
                    name="personal"
                >
                    Privat tavle
                </Checkbox>
                <HiddenInput
                    id="organization"
                    value={selectedOrganization?.value.id}
                />
            </div>
            <div className="mt-4">
                <FormError {...getFormFeedbackForField('general', state)} />
            </div>

            <div className="flex flex-row mt-8 justify-start">
                <SubmitButton variant="primary" className="max-sm:w-full">
                    Opprett tavle
                </SubmitButton>
            </div>
        </form>
    )
}

export { NameAndOrganizationSelector }