'use client'
import "../css/center.css"
import {useEffect, useState} from "react";
import {Fields, initializeStocksEyes, initializeStore, subscribeRealTimeData} from "@singhaltushar903/market-pulse";

export default function Page() {

    const [tradableData, setTradableData] = useState([]);

    useEffect(() => {
        // initialize stocks eyes store
        initializeStocksEyes({
            apiKey: "AIzaSyBAS2MuKU2tmgwDTG3Zxw-NgYKJ38es_QY",
            authDomain: "stockeyes-c9705.firebaseapp.com",
            projectId: "stockeyes-c9705",
            storageBucket: "stockeyes-c9705.appspot.com",
            messagingSenderId: "320540998409",
            appId: "1:320540998409:web:8c08befa763127716831d8",
            measurementId: "G-RYSG0KH01J"
        });
        // either use the fields enum , if in typescript, or use simple strings
        /*
        * Possible fields are
        *   TRADABLE = "tradable",
            MODE = "mode",
            INSTRUMENT_TOKEN = "instrument_token",
            LAST_PRICE = "last_price",
            LAST_QUANTITY = "last_quantity",
            AVERAGE_PRICE = "average_price",
            VOLUME = "volume",
            BUY_QUANTITY = "buy_quantity",
            SELL_QUANTITY = "sell_quantity",
            OHLC = "ohlc",
            CHANGE = "change",
            LAST_TRADE_TIME = "last_trade_time",
            TIMESTAMP = "timestamp",
            OI = "oi",
            OI_DAY_HIGH = "oi_day_high",
            OI_DAY_LOW = "oi_day_low",
            DEPTH = "depth",
            TRADING_SYMBOL = "trading_symbol"
        * */
        const unsubscribe = subscribeRealTimeData([738561], [Fields.TRADING_SYMBOL,"last_price","volume"], (data)=>{
            console.log(data);
            setTradableData(data);
        })

        // unsubscribe the real time data fetch when component unmounts
        return () => {
            // TODO: add window load and unload listeners

            unsubscribe();
        }
    }, [])

    return (
        <div className="centered-div">
            <div>
                <h2>Live Tradable Data</h2>
                <table style={styles.table}>
                    <thead>
                    <tr>
                        <th style={styles.th}>Trading Symbol</th>
                        <th style={styles.th}>Last Price</th>
                        <th style={styles.th}>Volume</th>
                    </tr>
                    </thead>
                    <tbody>
                    {tradableData.map((item, index) => (
                        <tr key={index}>
                            <td style={styles.td}>{item.trading_symbol}</td>
                            <td style={styles.td}>{item.last_price}</td>
                            <td style={styles.td}>{item.volume}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

const styles = {
    table: {
        borderCollapse: 'collapse',
        width: '100%',
        border: '1px solid #ddd',
        borderRadius: '5px',
        overflow: 'hidden',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    },
    th: {
        background: '#f2f2f2',
        padding: '10px',
        textAlign: 'left',
        borderBottom: '1px solid #ddd',
    },
    td: {
        padding: '10px',
        textAlign: 'left',
        borderBottom: '1px solid #ddd',
    },
};
