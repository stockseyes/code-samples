import "../app/css/center.css"
import React, {useEffect, useState} from "react";
import {
    Exchange,
    Fields,
    initialiseStocksEyes, MarketData, PaginationDetails,
    searchInstruments, SearchInstrumentsPatternRequest,
    SearchInstrumentsRequest, StocksEyesEnvironment,
    subscribeRealTimeData
} from "@stockseyes/market-pulse";

const Page: React.FC =() => {

    const [tradableData, setTradableData] = useState<MarketData[]>([]);
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

            await initialiseStocksEyes(
                "eyJhcGlLZXkiOiJBSXphU3lCQVMyTXVLVTJ0bWd3RFRHM1p4dy1OZ1lLSjM4ZXNfUVkiLCJhdXRoRG9tYWluIjoic3RvY2tleWVzLWM5NzA1LmZpcmViYXNlYXBwLmNvbSIsInByb2plY3RJZCI6InN0b2NrZXllcy1jOTcwNSIsInN0b3JhZ2VCdWNrZXQiOiJzdG9ja2V5ZXMtYzk3MDUuYXBwc3BvdC5jb20iLCJtZXNzYWdpbmdTZW5kZXJJZCI6IjMyMDU0MDk5ODQwOSIsImFwcElkIjoiMTozMjA1NDA5OTg0MDk6d2ViOjhjMDhiZWZhNzYzMTI3NzE2ODMxZDgiLCJtZWFzdXJlbWVudElkIjoiRy1SWVNHMEtIMDFKIiwicmVjYXB0Y2hhQ2xpZW50S2V5IjoiNkxmOGFkd25BQUFBQUtrQkRGMmk5Q19nZVFnQTZkOVlNU29fTHBBeSJ9",
                StocksEyesEnvironment.PRODUCTION);

            // get Relevant Instruments
            const searchInstrumentsRequest: SearchInstrumentsRequest = {
                tradingsymbol: ["RELIANCE", "NIFTY BANK"],
                exchange: [Exchange.NSE]
            }
            const searchInstrumentsPatternRequest: SearchInstrumentsPatternRequest = {
                // tradingsymbol: "GOLD23DECFUT",
                // expiryRange: {
                //     "low": new Date("2023-12-05"),
                //     "high": new Date("2023-12-07")
                // }
            }
            const paginationDetails: PaginationDetails = {
                offset: 0,
                limit : 5
            }
            const searchInstrumentsResponse = await searchInstruments(searchInstrumentsRequest, searchInstrumentsPatternRequest, paginationDetails);
            console.log(searchInstrumentsResponse)
            const instruments = searchInstrumentsResponse.instruments
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
            const unsubscribe = await subscribeRealTimeData(instrumentTokens, [Fields.TRADING_SYMBOL,Fields.LAST_PRICE,Fields.VOLUME,Fields.DEPTH, Fields.PREVIOUS_DEPTH, Fields.PREVIOUS_PRICE], (data)=>{
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
                            <td style={styles.td}>{item[Fields.TRADING_SYMBOL]}</td>
                            <td style={styles.td}>{item[Fields.LAST_PRICE]}</td>
                            <td style={styles.td}>{item[Fields.VOLUME]}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

const styles: Record<string, React.CSSProperties> = {
    table: {
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

export default Page;
