'use client'
import "../css/center.css"
import React, {useEffect, useState} from "react";
import {
    Exchange,
    Fields,
    initialiseStocksEyes, MarketData,
    searchInstruments,
    SearchInstrumentsRequest, StocksEyesEnvironment,
    subscribeRealTimeData
} from "@stockseyes/market-pulse";
import {PaginationDetails, SearchInstrumentsPatternRequest} from "@stockseyes/market-pulse";

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
            // initialize stocks eyes store
            if(!process.env.NEXT_PUBLIC_APIKEY) {
                throw Error("---GET YOUR API KEY---> https://stockseyes.com/contact")
            }
            await initialiseStocksEyes(
                process.env.NEXT_PUBLIC_APIKEY ? process.env.NEXT_PUBLIC_APIKEY :
                    "---GET YOUR API KEY---> https://stockseyes.com/contact",
                StocksEyesEnvironment.PRODUCTION);

            // get Relevant Instruments
            const searchInstrumentsRequest: SearchInstrumentsRequest = {
                tradingsymbol: ["RELIANCE", "HDFCBANK", "SBIN", "NIFTY 50", "NIFTY 500"],
                exchange: [Exchange.NSE]
            }
            const searchInstrumentsPatternRequest: SearchInstrumentsPatternRequest = {
                tradingsymbol: "REL"
            }
            const paginationDetails: PaginationDetails = {
                offset: 0,
                limit : 5
            }
            const searchInstrumentsResponse = await searchInstruments(searchInstrumentsRequest, searchInstrumentsPatternRequest, paginationDetails);
            const instruments = searchInstrumentsResponse.instruments
            console.log(instruments)
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
            const unsubscribe = await subscribeRealTimeData(instrumentTokens, [Fields.TRADING_SYMBOL,Fields.LAST_PRICE,Fields.VOLUME], (data)=>{
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
