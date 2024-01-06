import {Operator, setTrigger} from "@stockseyes/market-orders";

const apiKey = "c3RvY2tzZXllc2Nsb3VkcnVuLW4yZXJtb3ZpNnEtZWwuYS5ydW4uYXBw";

const sampletTrigger = async () => {
   await setTrigger(apiKey, "https://stockseyescloudrun-n2ermovi6q-el.a.run.app/searchInstruments", Operator.GREATER_THAN_OR_EQUALS_TO,2416, 738561, {
      "searchPatterns": {
         "tradingsymbol": "RELIANCE"
      },
      "paginationDetails": {
         "offset": 0,
         "limit": 5
      }
   });
}

sampletTrigger()
