import {initialize, searchInstruments, subscribe} from "@stockseyes/market-pulse-node";
import {Exchange} from "@stockseyes/market-domain";
import {SearchInstrumentsResponse} from "@stockseyes/market-domain";

const samplePulseRead = async () => {
    await initialize("APIKEY", (tick) => {
        // here goes your custom processing whatever you need
        console.log(tick);
    });

    const searchInstrumentsResponse: SearchInstrumentsResponse = await searchInstruments("APIKEY", {
        "tradingsymbol": [
            "RELIANCE"
        ],
        "exchange": [
            Exchange.NSE
        ]
    }, {}, {});

    const instrumentTokens = searchInstrumentsResponse.instruments.map(instrument => parseInt(instrument.instrument_token));
    console.log(instrumentTokens);

    subscribe(instrumentTokens)
}

setTimeout(async ()=>{
    await samplePulseRead();
})
