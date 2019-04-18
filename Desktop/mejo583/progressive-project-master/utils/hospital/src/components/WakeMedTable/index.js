import Table from "../Table";
import wakemedDRG from "../../data/wakemed/drg";
/** DukeTable presents the dukeDRG data
 * in a tabulator table.
 */
class WakeMed extends Table {
    tableData = wakemedDRG;
    columns = [
      {title: "Code", field: "drg_code"},
      {title: "Description", field: "drg_description"},
      {title: "Price", field: "avg_price"},
    ];
    tableHeader = "WakeMed University DRG";
}

export default WakeMed
;
