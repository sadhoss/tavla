import React, { Dispatch, SetStateAction } from 'react'

import { Heading3, Paragraph } from '@entur/typography'
import { GridContainer, GridItem } from '@entur/grid'
import { PrimaryButton, SecondaryButton } from '@entur/button'
import { ModalType } from '..'

import sikkerhetBom from '../../../../assets/images/sikkerhet_bom.png'
import retinaSikkerhetBom from '../../../../assets/images/sikkerhet_bom@2x.png'

interface Props {
    setModalType: Dispatch<SetStateAction<ModalType>>
    loginDescription?: string
}

const defaultLoginDescription =
    'For å låse tavlas redigeringsrettigheter til en konto, må du være innlogget.'

const LoginOptions = ({
    setModalType,
    loginDescription = defaultLoginDescription,
}: Props): JSX.Element => {
    return (
        <div>
            <div className="centered">
                <img src={sikkerhetBom} srcSet={`${retinaSikkerhetBom} 2x`} />
            </div>
            <Heading3 margin="bottom">Logg inn for å fortsette</Heading3>
            <Paragraph style={{ textAlign: 'center' }}>
                {loginDescription}
            </Paragraph>
            <GridContainer spacing="small">
                <GridItem small={12}>
                    <PrimaryButton
                        width="fluid"
                        onClick={(): void => setModalType('LoginEmailModal')}
                    >
                        Logg inn med e-post
                    </PrimaryButton>
                </GridItem>
                <GridItem small={12}>
                    <SecondaryButton
                        width="fluid"
                        onClick={(): void => setModalType('SignupModal')}
                    >
                        Lag en ny konto
                    </SecondaryButton>
                </GridItem>
            </GridContainer>
        </div>
    )
}

export default LoginOptions
