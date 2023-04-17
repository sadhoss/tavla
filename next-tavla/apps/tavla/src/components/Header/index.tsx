import TavlaLogo from "@/assets/logos/Tavla-white.svg";
import Image from "next/image";
import classes from "./styles.module.css";

function Header() {
  return (
    <div className={classes.header}>
      <Image
        src={TavlaLogo}
        alt="Entur Tavla logo"
        width={117}
        height={20}
        className={classes.logo}
      />
      <p className="tag-text">Finn din rute på entur.no eller i Entur-appen</p>
    </div>
  );
}

export { Header };