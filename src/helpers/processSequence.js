/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */

import { allPass, pipe, length, gt, lt, test, tap, __ } from "ramda";
import Api from "../tools/api";

const api = new Api();

// Валидации
// TODO: Надо разобраться в регулярках
const isNumeric = test(/^\d+(\.\d+)?$/); // число положительное, дробное или целое
const isValidLength = allPass([
  pipe(length, gt(__, 2)),
  pipe(length, lt(__, 10)),
]);
const isPositive = (value) => parseFloat(value) > 0;

const isValidInput = allPass([isNumeric, isValidLength, isPositive]);

// Вспомогательные функции
const round = Math.round;
const square = (x) => x * x;
const mod3 = (x) => x % 3;

const processSequence = ({ value, writeLog, handleSuccess, handleError }) => {
  // Хелпер для логов
  const log = (fn) => tap((val) => fn(val));

  // Перевод в число
  const toNumber = (str) => parseFloat(str);

  // Перевод в бинарную систему
  const toBinary = (number) =>
    api.get("https://api.tech/numbers/base")({
      from: 10,
      to: 2,
      number,
    });

  // Получить животное по id
  const getAnimal = (id) => api.get(`https://animals.tech/${id}`)({});

  // Обработка получения животного
  const onAnimal = pipe(log(writeLog), (id) =>
    getAnimal(id)
      .then(({ result }) => handleSuccess(result))
      .catch(handleError)
  );

  // Обработка бинарного результата
  const onBinary = pipe(
    ({ result }) => result,
    log(writeLog),
    (binaryStr) => binaryStr.length,
    log(writeLog),
    square,
    log(writeLog),
    mod3,
    log(writeLog),
    onAnimal
  );

  // Основной пайп
  const run = pipe(log(writeLog), (input) => {
    if (!isValidInput(input)) {
      handleError("ValidationError");
      return;
    }

    const number = pipe(toNumber, log(writeLog), round, log(writeLog))(input);

    toBinary(number).then(onBinary).catch(handleError);
  });

  run(value);
};

export default processSequence;
