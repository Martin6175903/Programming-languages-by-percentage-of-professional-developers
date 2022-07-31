/**
 *  Создаем элемент <svg> и вычерчиваем внутри него круговую диаграмму
 * 
 *  Эта функция ожидает объектный аргумент со следующими свойствами:
 * 
 *  width, height: размер графики SVG в пикселях
 *  cx, cy, r: центра и радиус сектора
 *  lx, ly: левый верхний угол условных обозначений диаграммы
 *  data: объект, имена свойств которого являются метками данных, а значения свойств - значениями, ассоциированными с метками
 * 
 * Функция возвращает элемент <svg>. Вызывающий код должен вставить его в документ, чтобы сделать видимым.
 */

function pieChart (options) {
   let {width, height, cx, cy, r, lx, ly, data} = options;

   // Пространство имён XML для элементов svg. 
   let svg = "http://www.w3.org/2000/svg";

   // Создать элемент <svg> и указать размер пикселя и пользовательские координаты.
   let chart = document.createElementNS(svg, "svg");
   chart.setAttribute("width", width);
   chart.setAttribute("height", height);  
   chart.setAttribute("viewBox", `0 0 ${width} ${height}`);

   // Определить стили текста, которые будут использоваться в диаграмме.
   // Если мы не установим эти значения здесь, тогда их можно установить с помощью CSS.
   chart.setAttribute("font-family", "sans-serif");
   chart.setAttribute("font-size", "18");

   // Получить метки и значения в виде массивов и сложить значения, чтобы узнать, насколько велика круговая диаграмма.
   let labels = Object.keys(data);
   let values = Object.values(data);
   let total = values.reduce((x,y) => x + y);

   // Вычислить углы для всех секторов. Сектор i начинается в angles[i] и заканчивается в angles[i + 1]. Углы измеряются в радианах
   let angles = [0];
   values.forEach((x, i) => angles.push(angles[i] + x/total * 2 * Math.PI));

   // Организовать цикл по секторам круговой диаграммы. 
   values.forEach((value, i) => {
      // Рассчитать две точки, где наш сектор пересекается с окружностью. 
      // Эти формулы выбраны так, чтобы угол 0 соответствовол 12 часам и положительные углы увеличивались по часовой стрелке.
      let x1 = cx + r * Math.sin(angles[i]);
      let y1 = cy - r * Math.cos(angles[i]);
      let x2 = cx + r * Math.sin(angles[i + 1]);
      let y2 = cy - r * Math.cos(angles[i + 1]);

      // Это флаг для углов, превышающих половину окружности. 
      // Он требуется для компоненты вычерчивания arc в  SVG.
      let big = (angles[i + 1] - angles[i] > Math.PI) ? 1 : 0;

      // Эта строка описывает, как вычерчивать сектор круговой диаграммы: 
      let path = `M${cx}, ${cy}` +      // Перейти в центр окружности. 
      `L${x1}, ${y1}` +                 // Вычерчить линию до (x1, y1).
      `A${r}, ${r} 0 ${big} 1` +        // Вычерчить дугу радиуса r... 
      `${x2}, ${y2}` +                  // ...закончив её в (x2, y2).
      "z";                              // Замкнуть путь в (cx, cy).

      // Вычислить цвет CSS для этого сектора. Формула работает только для примерно 15 цветов. 
      // Таким образом, не включайте в диаграмму более 15 секторов. 
      let color = `hsl(${(i * 40) % 360}, ${90 - 3 * i}, ${50 + 2 * i}%)`;

      // Мы описываем сектор с помощью элемента <path>. 
      // Обратим внимание на createElementNS().
      let slice = document.createElementNS(svg, "path");

      //Установить атрубуты элемента <path>. 
      slice.setAttribute("d", path);               // Установить путь для этого сектора.
      slice.setAttribute("fill", color);           //  Установить цвет сектора.
      slice.setAttribute("stroke", "black");       // Сделать контур чёрным.
      slice.setAttribute("stroke-width", "1");     // Ширина 1 пиксель CSS.
      chart.append(slice);                         // Добавить сектор в диаграмму.

      // Вычертить небольшой квадрат, соответствующий ключу. 
      let icon = document.createElementNS(svg, "rect");
      icon.setAttribute("x", lx);                  // Позиция квадрата. 
      icon.setAttribute("y", ly + 30 * i);         
      icon.setAttribute("width", 20);              // Размер квадрата. 
      icon.setAttribute("height", 20);
      icon.setAttribute("fill", color);            // Такой же цвет заполнения квадрата, как у сектора. 

      icon.setAttribute("stroke", "black");        // Такой же контур. 
      icon.setAttribute("stroke-width", "1");
      chart.append(icon);                          // Добавить в диаграмму.

      // Добавить метку справа от квадрата. 
      let label = document.createElementNS(svg, "text");
      label.setAttribute("x", lx + 30);            // Позиция текста. 
      label.setAttribute("y", ly + 30 * i + 16);
      label.append(`${labels[i]} ${value}`);       // Добавить текст к метке.
      chart.append(label);                         // Добавить метку в диаграмму.
   });
   return chart;
}

document.querySelector("#chart").append(pieChart({
   width: 640,
   height: 400,
   cx: 200, 
   cy: 200, 
   r: 180, 
   lx: 400, 
   ly: 10,
   data: {
      "Javascript": 71.5,
      "Java": 45.4,
      "Bash/Shell": 40.4,
      "Python": 37.9,
      "C#": 35.3,
      "PHP": 31.4,
      "C++": 24.6,
      "C": 22.1,
      "TypeScript": 18.3,
      "Ruby": 10.3,
      "Swift": 8.3,
      "Objective-C": 7.3,
      "Go": 7.2
   }
}));