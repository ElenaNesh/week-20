const searchingResult=document.querySelector('.searching-result');
const searchBtn=document.querySelector('#search-btn');
const whom=document.querySelector('#whom');
const inputField=document.querySelector('#number');
const searchingErrors=document.querySelector('.searching-errors')

searchBtn.addEventListener('click', getInfo);

async function getInfo() {
    searchingErrors.textContent='';
    searchingResult.textContent='Ожидание...';
    const selectedValue=whom.value;
    const selectedNumber=inputField.value;
    try {
        // сначала я проверяю чтоб не было других знаков кроме цифр 
        // (один только плюс в начале никак не хочет исключаться, но с ним все работает корректно)
        if (!/^[0-9]+$/.test(selectedNumber)) {throw new Error('Пожалуйста, вводите только цифры')}
        // делаем запрос на сервер чтобы узнать сколько всего элементов и выдать ошибку если пользователь ввел число больше
        const amountOfElements=await fetch(`https://swapi.py4e.com/api/${selectedValue}`);
        if (!amountOfElements.ok) {
            throw new Error(`Извините, не можем получить от сервера общее количество элементов: ${amountOfElements.status}`)
        };
        const amountOfElementsJson=await amountOfElements.json();
        const lastNumber=amountOfElementsJson.count;
        if (Number(selectedNumber)===0||selectedNumber>lastNumber) {
            throw new Error(`Выберите число от 1 до ${lastNumber}`)
        }
        // делаем основной запрос чтобы узнать название конкретного элемента
        const response = await fetch(`https://swapi.py4e.com/api/${selectedValue}/${selectedNumber}/`);
        if (!response.ok) {
            throw new Error(`${response.status}`)
        }
        const responseJSON=await response.json();
        if (selectedValue==='films') {
        searchingResult.textContent=JSON.stringify(responseJSON.title)}
        else {searchingResult.textContent=JSON.stringify(responseJSON.name)}
    }
    catch(err) {
        searchingResult.textContent='';
        searchingErrors.textContent=`Ошибочка вышла: ${err.message}`;
        if (err.message.includes('500')) {searchingErrors.textContent=`Ошибочка вышла: Что-то не так с сервером, попробуйте позже.`}
        
    }
    }

    



