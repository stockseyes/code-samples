import {Operator, setTrigger} from "@stockseyes/market-orders";

const apiKey = "GET YOUR API KEY at www.stockseyes.com";

const sampletTrigger = async () => {
   await setTrigger(apiKey, "hkjdkjd", Operator.GREATER_THAN_OR_EQUALS_TO,345, "LARSEN", {"extra meta ": "you will receive in callback body"});
}

sampletTrigger()
