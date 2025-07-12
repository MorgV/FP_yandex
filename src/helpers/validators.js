/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */
import {
  allPass,
  any,
  all,
  equals,
  prop,
  propEq,
  pipe,
  filter,
  length,
  gte,
  converge,
  identity,
  countBy,
  toPairs,
  complement,
} from "ramda";

// Возвращает массив всех цветов фигур, например: [red,green,red,red]
const getFigureColors = (figures) => [
  figures.star,
  figures.square,
  figures.triangle,
  figures.circle,
];

// Считает, сколько фигур каждого цвета: { green: 2, red: 1 }
const countFiguresByColor = countBy(identity);

// Возвращает, сколько фигур заданного цвета: 2
const countColorOccurrences = (color) =>
  pipe(getFigureColors, filter(equals(color)), length);

// Проверяет, что фигура заданного имени имеет нужный цвет: true
const isFigureColor = (figureName, expectedColor) =>
  propEq(figureName, expectedColor);

// Проверяет, что фигура заданного имени НЕ имеет указанный цвет: true
const isNotFigureColor = (figureName, color) =>
  complement(isFigureColor(figureName, color));

// Проверяет, что две фигуры одного цвета: true
const areFiguresSameColor = (figure1, figure2) =>
  converge(equals, [prop(figure1), prop(figure2)]);

// Проверяет, что все фигуры указанного цвета: true
const allFiguresHaveColor = (expectedColor) =>
  pipe(getFigureColors, all(equals(expectedColor)));

const isNotWhite = complement(equals("white"));

/** 1. Красная звезда, зелёный квадрат, остальные — белые */
export const validateFieldN1 = allPass([
  isFigureColor("star", "red"),
  isFigureColor("square", "green"),
  isFigureColor("triangle", "white"),
  isFigureColor("circle", "white"),
]);

/** 2. Как минимум две фигуры зелёные */
export const validateFieldN2 = pipe(
  getFigureColors,
  filter(equals("green")),
  length,
  gte(2)
);

/** 3. Количество красных фигур равно количеству синих */
export const validateFieldN3 = pipe(
  getFigureColors,
  countFiguresByColor,
  ({ red = 0, blue = 0 }) => red === blue
);

/** 4. Синий круг, красная звезда, оранжевый квадрат */
export const validateFieldN4 = allPass([
  isFigureColor("circle", "blue"),
  isFigureColor("star", "red"),
  isFigureColor("square", "orange"),
]);

/** 5. Три фигуры одного цвета (не белого) */
export const validateFieldN5 = pipe(
  getFigureColors,
  countFiguresByColor,
  toPairs,
  filter(([color]) => color !== "white"),
  any(([_, count]) => count >= 3)
);

/** 6. Ровно две зелёные фигуры (одна — треугольник), одна красная */
export const validateFieldN6 = allPass([
  pipe(countColorOccurrences("green"), equals(2)),
  isFigureColor("triangle", "green"),
  pipe(countColorOccurrences("red"), equals(1)),
]);

/** 7. Все фигуры оранжевые */
export const validateFieldN7 = allFiguresHaveColor("orange");

/** 8. Звезда не красная и не белая */
export const validateFieldN8 = allPass([
  isNotFigureColor("star", "red"),
  isNotFigureColor("star", "white"),
]);

/** 9. Все фигуры зелёные */
export const validateFieldN9 = allFiguresHaveColor("green");

/** 10. Треугольник и квадрат одного цвета (не белого) */
export const validateFieldN10 = allPass([
  areFiguresSameColor("triangle", "square"),
  pipe(prop("triangle"), isNotWhite),
]);
