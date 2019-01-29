const axios = require('axios');

//асинхронная загрузка данных о валютах
const getExchangeRate = async (fromCurrency, toCurrency) => {
    try{
        const response = await axios.get('http://www.apilayer.net/api/live?access_key=fb4ca19aade6fd7c3975d20dbf185cc3');
        const rate = response.data.quotes; //объект с курсами валют
        const baseCurrency = response.data.source; //код базовой валюты
        const usd = 1 / rate[`${baseCurrency}${fromCurrency}`]; //результат деления 1 на курс валюты
        const exchangeRate = usd * rate[`${baseCurrency}${toCurrency}`]; //получаем курс обмена валюты

        return exchangeRate;
    } catch (error){
        throw new Error('Ошибка получения данных');
    }
};

//асинхронная загрузка данных о странах
const getCountries = async (currencyCode) => {
    try{
        //получим страны, это будет массив объектов
        const responce = await axios.get(`https://restcountries.eu/rest/v2/currency/${currencyCode}`);
        return responce.data.map(country => country.name); //массив названий стран
    } catch (error){
        throw new Error(`Невозможно получить страну по коду ${currencyCode}`);
    }
};


//сбор и вывод данных
/*
const convertCurrency = async (fromCurrency, toCurrency, amount) => {
    const exchangeRate = await getExchangeRate(fromCurrency, toCurrency); //обменный курс
    const countries = await getCountries(toCurrency); //список стран
    const convertedAmount = (amount * exchangeRate).toFixed(2);//конверсия

    //вывод полученных данных
    return `${amount} ${fromCurrency}, стоит ${convertedAmount} ${toCurrency}. Вы можете потратить их в следующих странах ${countries}`;
};
*/
//делаем так чтобы они друг друга не блокировали, но дальнейший код выполнялся только после завершения обоих запросов
const convertCurrency = async (fromCurrency, toCurrency, amount) => {
    const [exchangeRate, countries] = await Promise.all([
        getExchangeRate(fromCurrency, toCurrency),
        getCountries(toCurrency),
    ]);
    const convertedAmount = (amount * exchangeRate).toFixed(2);

    return `${amount} ${fromCurrency}, стоит ${convertedAmount} ${toCurrency}. Вы можете потратить их в следующих странах ${countries}`;
};

//выход действа
convertCurrency('EUR', 'RUB', 20)
    .then((message) => {
        console.log(message);
    }).catch((error) => {
        console.log(error.message);
    });

