import React, { Component } from "react";
import * as d3 from "d3";
import dukeDRG from "../../data/duke/drg";
import uncDRG from "../../data/unc/drg";
import wakemedDRG from "../../data/wakemed/drg";

import "./styles.css";
/** makes bubblechart pieces and assigns data  */
class BubbleChart extends Component {
  el = React.createRef();
  width = 801;
  height = 600;
  /** makes bubblechart pieces and assigns data
   * @param {object} props
  */
  constructor(props) {
    super(props);

    this.dukeData = dukeDRG.map((r) => {
      r.name = "duke";
      r.key = r.name + r.drg_code;
      return r;
    });
    this.uncData = uncDRG.map((r) => {
      r.name = "unc";
      r.key = r.name + r.drg_code;
      return r;
    });
    this.wakemedData = wakemedDRG.map((r) => {
      r.name = "wakemed";
      r.key = r.name + r.drg_code;
      return r;
    });

    this.fullData = this.dukeData.concat(this.uncData, this.wakemedData);

    this.state = {
      showDuke: true,
      showUNC: true,
      showWakemed: true,
      data: this.fullData.slice(),
      selected: null,
    };
  }
  /** makes svg  */
  createSVG() {
    this.svg = d3
        .select(this.el)
        .append("svg")
        .attr("width", this.width)
        .attr("height", this.height)
        .attr("style", "border: thin red solid");
  }
  /** draws chart  */
  drawChart() {
    const data = this.state.data;

    data.sort((a, b) => parseInt(b.avg_price) - parseInt(a.avg_price));

    const hierarchalData = this.makeHierarchy(data);
    const packLayout = this.pack([this.width - 5, this.height - 5]);
    const root = packLayout(hierarchalData);

    const groups = this.svg
        .selectAll("g")
        .data(root.leaves(), (d) => d.data.key);

    if (data.length === 0) {
      groups.exit().remove();
      return;
    }

    const t = d3.transition().duration(800);

    groups
        .transition(t)
        .attr("transform", (d) => `translate(${d.x + 1},${d.y + 1})`);
    groups
        .select("circle")
        .attr("r", (d) => d.r);

    groups.exit().remove();

    const leaf = groups
        .enter()
        .append("g")
        .attr("transform", (d) => `translate(${d.x + 1},${d.y + 1})`)
        .classed("unc", (d) => d.data.name === "unc")
        .classed("duke", (d) => d.data.name === "duke")
        .classed("wakemed", (d) => d.data.name === "wakemed")
      ;

    leaf
        .append("circle")
        .attr("r", (d) => d.r)
        .attr("fill-opacity", 0.7)
        .on("click", this.bubbleClicked.bind(this));
  }
  /** handles styling
   * @return {any}
   * @param {object} size
  */
  pack(size) {
    return d3
        .pack()
        .size(size)
        .padding(3);
  }
  /** sorting
   * @return {any}
   * @param {int} data
   */
  makeHierarchy(data) {
    return d3.hierarchy({children: data}).sum((d) => d.avg_price);
  }
  /** helps organize and sort data
   * @param {any} newState
  */
  flterData(newState) {
    newState = {...this.state, ...newState};

    const newData = this.fullData.filter((r) => {
      return (
        (r.name === "duke" && newState.showDuke) ||
        (r.name === "unc" && newState.showUNC) ||
        (r.name === "wakemed" && newState.showWakemed)
      );
    });
    newState.selected = null;
    newState.data = newData;

    this.setState(newState);
  }
  /** show/hide  */
  toggleDuke() {
    this.filterData({showDuke: !this.state.showDuke});
  }
  /** show/hide  */
  toggleUNC() {
    this.filterData({showUNC: !this.state.showUNC});
  }
  /** show/hide  */
  toggleWakemed() {
    this.filterData({showWakemed: !this.state.showWakemed});
  }
  /** changes bubble state
   * @param {object} bubble
  */
  bubbleClicked(bubble) {
    this.setState({selected: bubble});
  }
  /** makes tooltip and aligns it
   * @return {any}
  */
  getTooltip() {
    const ttHeight = 200;
    const ttWidth = 300;
    const s = this.state.selected;

    if (s) {
      const bodyPos = document.body.getBoundingClientRect();
      const svgPos = d3.select(this.el)._groups[0][0].getBoundingClientRect();
      return (

        <div className="tooltip"
          style= {{
            left: svgPos.left + (s.x - ttWidth / 2) + 1.5,
            top: s.y + (svgPos.y - bodyPos.y) - ttHeight - s.r,
          }}>
          <div className="tooltip-content">
            <div className="flex-row">
              <div className="flex-item">
                <div className="header">hospital</div>
                <div className="value">{s.data.name}</div>
              </div>
              <div className="flex-item center-justified">
                <div className="header">average price</div>
                <div className="value">{s.data.avg_price}</div>
              </div>
              <div className="flex-item right-justified">
                <div className="header">code</div>
                <div className="value">{s.data.drg_code}</div>
              </div>
            </div>
            <div className="flex-row">
              <div className="flex-item">
                <div className="header">description</div>
                <div className="value">{s.data.drg_description.toLowerCase()}
                </div>
              </div>
            </div>
          </div>
          <div className="tooltip-tail"></div>

        </div>
      )
      ;
    } else {
      return <p>Nothing Selected</p>;
    }
  }
  /** draws chart */
  componentDidUpdate() {
    this.drawChart();
  }
  /** builds chart and creates svg bubbles */
  componentDidMount() {
    this.createSVG();
    this.drawChart();
  }

  /** renders checkboxes
   * @return {any} */
  render() {
    return (
      <div>
        <h2>BubbleChart</h2>
        <label htmlFor="duke-cb">
          <input
            id="duke-cb"
            type="checkbox"
            checked={this.state.showDuke}
            onChange={this.toggleDuke.bind(this)} />
          Duke
        </label>
        <br />
        <label htmlFor="unc-cb">
          <input
            id="unc-cb"
            type="checkbox"
            checked={this.state.showUNC}
            onChange={this.toggleUNC.bind(this)} />
          UNC
        </label>
        <br />
        <label htmlFor="wakemed-cb">
          <input
            id="wakemed-cb"
            type="checkbox"
            checked={this.state.showWakemed}
            onChange={this.toggleWakemed.bind(this)} />
          Wakemed
        </label>
        {this.getTooltip()}

        <div id="bubblechart" ref={(el) => (this.el = el)} />
      </div>
    );
  }
}


export default BubbleChart;
