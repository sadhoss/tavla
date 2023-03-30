import { Tile } from "@/components/Tile";
import { TSettings } from "@/types/settings";
import classes from "./styles.module.css";

function Board({ settings }: { settings: TSettings }) {
  return (
    <div className={classes.board}>
      {settings.tiles.map((tile) => {
        return <Tile tileSpec={tile} />;
      })}
    </div>
  );
}

export { Board };