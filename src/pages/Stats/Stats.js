import React, { useState, useEffect } from "react";
import withAuth from "../../components/Auth/withAuth.js";
import { dateForDisplay, getNthDate } from "../../global/Functions.js";
import StatisticsDB from "../../global/StatisticsDB.js";
import Loader from "../../components/Loader/Loader.js";
import { ResponsiveLine } from "@nivo/line";
import "./Stats.css";

const nivoTheme = {
	"background": "#201e1e",
	"textColor": "#c7c7c7",
	"fontSize": 11,
	"axis": {
		"domain": {
			"line": {
				"stroke": "#777777",
				"strokeWidth": 1
			}
		},
		"ticks": {
			"line": {
				"stroke": "#777777",
				"strokeWidth": 1
			}
		}
	},
	"grid": {
		"line": {
			"stroke": "#343232",
			"strokeWidth": 1
		}
	}
};

function Stats() {
	/* ---- States ---------------------------------- */
	const [ sales, setSales ] = useState([]);
	const [ salesLoaded, setSalesLoaded ] = useState(false);
	const [ salesError, setSalesError ] = useState();
	const [ stock, setStock ] = useState([]);
	const [ stockLoaded, setStockLoaded ] = useState(false);
	const [ stockError, setStockError ] = useState();
	const todayDate = getNthDate(0);
	const oneWeekDate = getNthDate(6);

	useEffect(() => {
		getSales().catch(console.error);
		getStock().catch(console.error);
	}, []);

	/* ---- Functions ------------------------------- */
	const getSales = async () => {
		StatisticsDB.sales.getWeekly()
			.then(response => {
				setSales(response.error ? null : response.stats);
				setSalesLoaded(true);
				setSalesError(response.error ? response : null);

				if (response.error) console.error(response.error);
			})
			.catch(error => {
				setSales([]);
				setSalesLoaded(true);
				setSalesError(error);

				console.error(error);
			});
	};

	const getStock = async () => {
		StatisticsDB.stock.getWeekly()
			.then(response => {
				setStock(response.error ? null : response.stats);
				setStockLoaded(true);
				setStockError(response.error ? response : null);

				if (response.error) console.error(response.error);
			})
			.catch(error => {
				setStock([]);
				setStockLoaded(true);
				setStockError(error);

				console.error(error);
			});
	};

	/* ---- Page content ---------------------------- */
	return (
		<React.Fragment>
			<div className="Page-header">
				<h3>Statistiques</h3>
			</div>

			<div className="Page-body">
				<div className="chart-section">
					<div className="chart-section-header">
						<h3 className="chart-section-title">Ventes</h3>
					</div>

					<div className="charts-container">
						<div className="chart-box">
							<p className="chart-desc">Bénéfices des ventes du {dateForDisplay(todayDate)} au {dateForDisplay(oneWeekDate)} :</p>
							{salesLoaded ? (
								<React.Fragment>
									{!salesError ? (
										<div className="chart sales-chart">
											<ResponsiveLine
												data={sales}
												margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
												xScale={{ type: "time", format: "%Y-%m-%dT%H:%M:%S.%L%Z", precision: "day", useUTC: false }}
												xFormat="time:%H:%M:%S.%L"
												yScale={{ type: "linear", min: "auto", max: "auto", stacked: true, reverse: false }}
												yFormat=" >-.2f"
												curve="monotoneX"
												axisTop={null}
												axisRight={null}
												axisBottom={{
													orient: "bottom",
													tickValues: "every day",
													tickSize: 5,
													tickPadding: 5,
													tickRotation: 0,
													format: "%d-%m",
													legend: "Jour",
													legendOffset: 36,
													legendPosition: "middle"
												}}
												axisLeft={{
													orient: "left",
													tickSize: 5,
													tickPadding: 5,
													tickRotation: 0,
													legend: "Bénéfice (€)",
													legendOffset: -40,
													legendPosition: "middle"
												}}
												pointSize={10}
												pointColor={{ theme: "background" }}
												pointBorderWidth={2}
												pointBorderColor={{ from: "serieColor" }}
												enablePointLabel={true}
												pointLabelYOffset={-12}
												areaBlendMode="multiply"
												enableSlices="x"
												useMesh={true}
												legends={[]}
												theme={nivoTheme}
											/>
										</div>
									) : <p>Erreur pendant le chargement.</p>}
								</React.Fragment>
							) : <Loader/>}
						</div>
					</div>
				</div>

				<div className="chart-section">
					<div className="chart-section-header">
						<h3 className="chart-section-title">Stock</h3>
					</div>

					<div className="charts-container">
						<div className="chart-box">
							<p className="chart-desc">Quantité des stocks du {dateForDisplay(todayDate)} au {dateForDisplay(oneWeekDate)} :</p>
							{stockLoaded ? (
								<React.Fragment>
									{!stockError ? (
										<div className="chart stock-chart">
											<ResponsiveLine
												data={stock}
												margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
												xScale={{ type: "time", format: "%Y-%m-%dT%H:%M:%S.%L%Z", precision: "day" }}
												xFormat="time:%H:%M:%S.%L"
												yScale={{ type: "linear", min: "auto", max: "auto", stacked: true, reverse: false }}
												yFormat=" >-.2f"
												curve="monotoneX"
												axisTop={null}
												axisRight={null}
												axisBottom={{
													orient: "bottom",
													tickSize: 5,
													tickPadding: 5,
													tickRotation: 0,
													format: "%d-%m",
													legend: "Jour",
													legendOffset: 36,
													legendPosition: "middle"
												}}
												axisLeft={{
													orient: "left",
													tickSize: 5,
													tickPadding: 5,
													tickRotation: 0,
													legend: "Quantité",
													legendOffset: -50,
													legendPosition: "middle"
												}}
												pointSize={10}
												pointColor={{ theme: "background" }}
												pointBorderWidth={2}
												pointBorderColor={{ from: "serieColor" }}
												enablePointLabel={true}
												pointLabelYOffset={-12}
												areaBlendMode="multiply"
												enableSlices="x"
												useMesh={true}
												legends={[
													{
														anchor: "right",
														direction: "column",
														justify: false,
														translateX: 100,
														translateY: 0,
														itemsSpacing: 0,
														itemDirection: "left-to-right",
														itemWidth: 80,
														itemHeight: 20,
														itemOpacity: 0.75,
														symbolSize: 12,
														symbolShape: "circle",
														symbolBorderColor: "rgba(0, 0, 0, .5)",
														effects: [
															{
																on: "hover",
																style: {
																	itemBackground: "rgba(0, 0, 0, .03)",
																	itemOpacity: 1
																}
															}
														]
													}
												]}
												theme={nivoTheme}
											/>
										</div>
									) : <p>Erreur pendant le chargement.</p>}
								</React.Fragment>
							) : <Loader/>}
						</div>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
}

export default withAuth(Stats);