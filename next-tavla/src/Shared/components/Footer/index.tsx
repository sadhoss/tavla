import Image from 'next/image'
import EnturLogoWhite from 'assets/logos/Tavla-white.svg'
import EnturLogoBlue from 'assets/logos/Tavla-blue.svg'
import { TBoard, TTheme } from 'types/settings'
import { defaultFontSize, getFontScale } from 'Board/scenarios/Board/utils'

function Footer({
    board,
    logo,
    orgFooter,
}: {
    board: TBoard
    logo?: boolean
    orgFooter?: string
}) {
    if (!logo && !board.footer?.footer && !orgFooter) return null

    const EnturLogo = getLogo(board?.theme ?? 'dark')

    return (
        <footer className="flex flex-row justify-between min-h-[4vh] items-center gap-em-2">
            <div
                className={`truncate text-primary ${
                    getFontScale(board.meta?.fontSize) || defaultFontSize(board)
                }`}
            >
                {orgFooter && board.footer?.override !== true
                    ? orgFooter
                    : board.footer?.footer}
            </div>
            {logo && (
                <Image
                    src={EnturLogo}
                    alt="Entur logo"
                    className="object-contain w-[70px] h-[20px] md:w-[200px] md:h-[40px]"
                />
            )}
        </footer>
    )
}

export function getLogo(theme: TTheme) {
    if (theme === 'light') return EnturLogoBlue
    return EnturLogoWhite
}

export { Footer }
