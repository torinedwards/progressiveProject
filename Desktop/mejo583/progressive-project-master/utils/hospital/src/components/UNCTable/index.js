import Table from "../Table";
import uncDRG from "../../data/unc/drg";
/** DukeTable presents the dukeDRG data
 * in a tabulator table.
 */
class UNCTable extends Table {
    tableData = uncDRG;
    columns = [
      {title: "Code", field: "drg_code"},
      {title: "Description", field: "drg_description"},
      {title: "Price", field: "avg_price"},
    ];
    tableHeader = "UNC DRG";
}

export default UNCTable
;
