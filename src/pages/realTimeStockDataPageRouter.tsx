import "../app/css/center.css"
import {useEffect, useState} from "react";
import {Fields, initialiseStocksEyes, initializeStore, subscribeRealTimeData, searchInstruments, SearchInstrumentsRequest} from "@stockseyes/market-pulse";

export default function Page() {

    const [tradableData, setTradableData] = useState([]);
    const [unsubscribe, setUnsubscribe] = useState(() => () => {});
    const [isForeground, setIsForeground] = useState(true);


    // handles when the view of our website goes off-screen to save on read bandwidth
    // preference of client
    // saves on API cost, not reading data when view is not on screen
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                setIsForeground(false);
                console.log("Tab is in background")
            } else {
                setIsForeground(true);
                console.log("Tab is in foreground")
            }
        };
        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, []);



    // unsubscribe from firebase listener when app goes in background, to save on data fetch which is not needed
    useEffect(() => {
        if (!isForeground) {
            unsubscribe();
        }
    }, [isForeground])


    useEffect(() => {

        if (!isForeground) return;

        const subscribeInstrumentDataFromStocksEyes = async () => {
            // initialize stocks eyes store
            initialiseStocksEyes("eyJhcGlLZXkiOiJBSXphU3lCQVMyTXVLVTJ0bWd3RFRHM1p4dy1OZ1lLSjM4ZXNfUVkiLCJhdXRoRG9tYWluIjoic3RvY2tleWVzLWM5NzA1LmZpcmViYXNlYXBwLmNvbSIsInByb2plY3RJZCI6InN0b2NrZXllcy1jOTcwNSIsInN0b3JhZ2VCdWNrZXQiOiJzdG9ja2V5ZXMtYzk3MDUuYXBwc3BvdC5jb20iLCJtZXNzYWdpbmdTZW5kZXJJZCI6IjMyMDU0MDk5ODQwOSIsImFwcElkIjoiMTozMjA1NDA5OTg0MDk6d2ViOjhjMDhiZWZhNzYzMTI3NzE2ODMxZDgiLCJtZWFzdXJlbWVudElkIjoiRy1SWVNHMEtIMDFKIn0=");

            // get Relevant Instruments
            const searchInstrumentsRequest: SearchInstrumentsRequest = {
                tradingsymbol: ["RELIANCE", "HDFCBANK", "SBIN", "NIFTY 50", "NIFTY 500"]
            }
            const instruments = await searchInstruments(searchInstrumentsRequest);

            // either use the fields enum , if in typescript, or use simple strings
            /*
            * Possible fields are
            *   TRADABLE = "tradable",
                MODE = "mode",
                INSTRUMENT_TOKEN = "instrument_token",
                LAST_PRICE = "last_price",
                LAST_QUANTITY = "last_quantity",
                AVERAGE_PRICE = "average_price",
                VOLUME_TRADED = "volume_traded",
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
            const instrumentTokens = instruments.map((instrument=> instrument.instrument_token))
            const unsubscribe = subscribeRealTimeData(instrumentTokens, [Fields.TRADING_SYMBOL,"last_price","volume_traded"], (data)=>{
                console.log(data);
                setTradableData(data);
            })

            // unsubscribe when user closed your tab
            // optional, just to close connection gracefully
            window.addEventListener('beforeunload', unsubscribe);
            setUnsubscribe(() => unsubscribe)
        }

        subscribeInstrumentDataFromStocksEyes();

        // unsubscribe the real time data fetch when component unmounts
        return () => {
            unsubscribe();
            window.removeEventListener('beforeunload', unsubscribe);
        }
    }, [isForeground]) // run whenever user comes foreground

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
                            <td style={styles.td}>{item.volume_traded}</td>
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
