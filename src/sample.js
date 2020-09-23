$(function() {
  // input
  var dataX = [
    '2 2', '1 3', '5', '2 2', '3 1'
  ];
  var dataY = [
    '5', '3', '2 2', '4', '5'
  ];

  test(dataX, dataY);

  return;

  var marginX = 50;
  var marginY = 50;

  var canvas = document.getElementById('canvas');
  if (!canvas || !canvas.getContext) return;
  var context = canvas.getContext('2d');

  var cellWidth = (canvas.width - (marginX * 2)) / dataX.length;
  var cellHeight = (canvas.height - (marginY * 2)) / dataY.length;
  var cellSize = Math.min(cellWidth, cellHeight);

  var mx = marginX;
  var my = marginY;
  var wx = marginX + (cellSize * dataX.length);
  var wy = marginY + (cellSize * dataY.length);
  for (i = 0; i < dataX.length + 1; i++) {
    strokeLine(context, mx, my + (cellSize * i), wx, my + (cellSize * i));
  }
  for (i = 0; i < dataY.length + 1; i++) {
    strokeLine(context, my + (cellSize * i), my, my + (cellSize * i), wy);
  }

  var cells = {};
  for (i = 1; i <= dataX.length; i++) {
    for (j = 1; j <= dataY.length; j++) {
      cells[i + "_" + j] = 0;
    }
  }

  calcLogicPuzzle(cells, dataX, dataY);

  // for (key in getRowKeys(cells, 'vertical', 3)) {
  //   cells[key] = 1;
  // }

  var paintCells = [];
  var nopaintCells = [];
  for (key in cells) {
    if (cells[key] == 1) {
      paintCells.push(key);
    } else if (cells[key] == 2) {
      nopaintCells.push(key);
    }
  }

  paintCells.forEach(function(data, index) {
    paintBlock(context, marginX, marginY, cellSize, data);
  });
  nopaintCells.forEach(function(data, index) {
    paintBlock(context, marginX, marginY, cellSize, data, 2);
  });
});

// ----------------------
function test(dataX, dataY) {
  // 1-10の配列を用意し、0,1,2を埋めていく
  // var data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  var row = [1, 4, 2];

  var cells = {};
  for (i = 1; i <= dataX.length; i++) {
    for (j = 1; j <= dataY.length; j++) {
      cells[i + "_" + j] = 0;
    }
  }

  var data = getHorizontalData(cells, 1, dataX.length);
  var mikakuteiOld = mikakutei(data);
  console.log(data, mikakuteiOld);

  // A. 全てが0なら全て2にする
  // methodA(data, row);
  if (data.indexOf(0) == -1) {
    console.log("A: 完了");
  }

  // B. dataのサイズと塗るサイズが同じなら全て塗る
  // methodB(data, row);
  if (data.indexOf(0) == -1) {
    console.log("B: 完了");
  }

  // C. あまりを引いた数で塗る
  // methodC(data, row);
  if (data.indexOf(0) == -1) {
    console.log("C: 完了");
  }

  // D. 一つしかなければ繋げる
  // methodD(data, row);
  if (data.indexOf(0) == -1) {
    console.log("D: 完了");
  }

  // E.
  // methodE(data, row);
  if (data.indexOf(0) == -1) {
    console.log("E: 完了");
  }

  // F
  // methodF(data, row);
  if (data.indexOf(0) == -1) {
    console.log("F: 完了");
  }

  if (mikakuteiOld === mikakutei(data)) {
    console.log("変更がなかったので次の行へ遷移します。")
  }

  for (var i = 0; i < data.length; i++) {
    setCell(cells, 1, i + 1, data[i]);
  }
  console.log(getHorizontalData(cells, 1, dataX.length));

  $("#test").text(data);
}

function mikakutei(data) {
  var mikaku = 0;
  for (var i = 0; i < data.length; i++) {
    if (data[i] === 0) mikaku++;
  }
  return mikaku;
}

function getHorizontalData(cells, num, maxSize) {
  data = [];
  for (var i = 0; i < maxSize; i++) {
    console.log(i);
    data[i] = (cells, num, i + 1);
  }
  return data;
}

function (cells, rowNum, colNum) {
  return cells[rowNum + "_" + colNum];
}

function setCell(cells, rowNum, colNum, value) {
  cells[rowNum + "_" + colNum] = value;
}

function methodA(data, row) {
  if (row.length == 1 && row[0] == 0) {
    for (var i = 0; i < data.length; i++) {
      data[i] = 2;
    }
  }
}

function methodB(data, row) {
  var maxFixSize = getMaxFixSize(row);

  if (maxFixSize === data.length) {
    var index = 0;
    for (var i = 0; i < row.length; i++) {
      if (i > 0) {
        data[index] = 2;
        index += 1;
      }
      for (var j = 0; j < row[i]; j++) {
        data[index] = 1;
        index += 1;
      }
    }
  }
}

function methodC(data, row) {
  var maxFixSize = getMaxFixSize(row);
  var amari = data.length - maxFixSize;

  var index = 0;
  for (var i = 0; i < row.length; i++) {
    if (i > 0) {
      index += 1;
    }

    for (var j = 0; j < amari; j++) {
      index += 1;
    }

    for (var j = 0; j < row[i] - amari; j++) {
      data[index] = 1;
      index += 1;
    }
  }
}

function methodD(data, row) {
  // DEBUG
  row = [5];
  data[2] = 1;
  data[6] = 1;

  if (row.length != 1) return;

  var sIndex = data.indexOf(1);
  var eIndex = data.lastIndexOf(1);
  console.log(sIndex, eIndex);

  if (sIndex == eIndex) return;

  for (var i = 0; i < data.length; i++) {
    if (sIndex <= i && i <= eIndex) {
      data[i] = 1;
    }
  }
}

function methodE(data, row) {
  // row = [1, 3];
  // data[0] = 2;
  // data[1] = 2;
  // data[8] = 2;
  // data[9] = 2;

  var maxFixSize = getMaxFixSize2(data, row);

  var index = getFirstPaintableIndex(data);
  for (var i = 0; i < row.length; i++) {
    if (i > 0) {
      index += 1;
    }
    for (var j = 0; j < maxFixSize; j++) {
      index += 1;
    }
    for (var j = 0; j < row[i] - maxFixSize; j++) {
      data[index] = 1;
      index += 1;
    }
  }
}

function methodF(data, row) {
  data[2] = 2;
  data[3] = 1;
  row = [3];
  // バツを除く左端が塗りの場合、そこから連続して塗る。そのあとバツをつける。
  var a = (data.indexOf(0) != -1) ? data.indexOf(0) : 0; // 未確定
  var b = (data.indexOf(1) != -1) ? data.indexOf(1) : 0; // 塗り
  var c = (data.indexOf(2) != -1) ? data.indexOf(2) : 0; // 塗らない

  console.log(a, b, c, b - c, row[0]);
  // b - c == 1の場合隣接している
  // 上記かつ、row[0] > cの場合bから塗り始める
  if (b - c !== 1 || row[0] <= c) return;

  console.log("塗るよ");
  var index = b;
  for (var i = 0; i < row[0]; i++) {
    data[index] = 1;
    index++;
  }
  console.log(index, data.length);
  if (index < data.length) {
    data[index] = 2;
  }
}

function getMaxFixSize(row) {
  var fillSize = 0;
  for (var i = 0; i < row.length; i++) {
    if (i !== 0) {
      fillSize += 1;
    }
    fillSize += row[i];
  }
  return fillSize;
}

function getMaxFixSize2(data, row) {

  var dataSize = getLastPaintableIndex(data) - getFirstPaintableIndex(data) + 1;

  var fillSize = 0;
  for (var i = 0; i < row.length; i++) {
    if (i !== 0) {
      fillSize += 1;
    }
    fillSize += row[i];
  }

  fillSize = dataSize - fillSize;
  return fillSize;
}

function getFirstPaintableIndex(data) {
  var a = (data.indexOf(0) != -1) ? data.indexOf(0) : 0;
  var b = (data.indexOf(1) != -1) ? data.indexOf(1) : 0;
  return Math.max(a, b);
}

function getLastPaintableIndex(data) {
  var a = (data.lastIndexOf(0) != -1) ? data.lastIndexOf(0) : data.length;
  var b = (data.lastIndexOf(1) != -1) ? data.lastIndexOf(1) : data.length;
  return Math.min(a, b);
}

// -----------------------------------------------------------

function strokeLine(context, x1, y1, x2, y2) {
  context.beginPath();
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.stroke();
}

function paintBlock(context, marginX, marginY, cellSize, pointXY, type = 1) {
  var splittedPoint = pointXY.split('_');
  var pointX = splittedPoint[0];
  var pointY = splittedPoint[1];
  var x1 = marginX + (cellSize * (pointX - 1));
  var y1 = marginY + (cellSize * (pointY - 1));
  var w = cellSize;
  var h = cellSize;
  if (type === 1) {
    context.fillRect(x1, y1, w, h);
  } else if (type === 2) {
    context.beginPath();
    context.moveTo(x1, y1 + h);
    context.lineTo(x1 + w, y1);
    context.moveTo(x1, y1);
    context.lineTo(x1 + w, y1 + h);
    context.stroke();
  }
}

function getRowKeys(cells, direction, rownum) {
  var regex;
  if (direction === 'horizontal') {
    regex = new RegExp('^\\d+_' + rownum + '$');
  } else {
    regex = new RegExp('^' + rownum + '_\\d+$');
  }

  var row = [];
  for (key in cells) {
    if (key.match(regex) != null) {
      row[key] = cells[key];
    }
  }

  return row;
}

function calcLogicPuzzle(cells, dataX, dataY) {
  // getRowKeys（）でX軸0- Y軸0- の順で回す
  while (true) {
    var oldCells = $.extend(true, {}, cells);
    for (indexX = 1; indexX <= dataY.length; indexX++) {
      var k = getRowKeys(cells, 'horizontal', indexX)
      // console.log(k);
    }
    for (indexY = 1; indexY <= dataY.length; indexY++) {
      var k = getRowKeys(cells, 'vertical', indexY)
    }

    // DEBUG: 残りの未確定セル数で判定する
    if (checkEquals(cells, oldCells)) {
      break;
    }
    break; // DEBUG
  }
}

function cloneHash(hash) {
  return $.extend(true, {}, hash);
}

function checkEquals(hash1, hash2) {
  var hash1Json = JSON.stringify(cloneHash(hash1));
  var hash2Json = JSON.stringify(cloneHash(hash2));
  return hash1Json === hash2Json;
}

function calcLogicPuzzleOld(cells, dataX, dataY) {
  var size = dataX.length;
  // FIXME: dataXを回すのではなく、getRowKeys()で取得したデータを回す。

  dataX.forEach(function(data, index) {
    var splittedNums = data.split(' ');
    var splittedTotalNum = 0;
    splittedNums.forEach(function(data) {
      splittedTotalNum += parseInt(data);
    });
    var spaceNum = splittedNums.length - 1;
    var remnantCells = size - splittedTotalNum - spaceNum;

    if (remnantCells == 0) {
      var n = 0;
      for (i = 0; i < splittedNums.length; i++) {
        if (i > 0) {
          n++;
          var k = n + '_' + (index + 1);
          cells[k] = 2;
        }
        for (j = 0; j < splittedNums[i]; j++) {
          n++;
          var k = n + '_' + (index + 1);
          cells[k] = 1;
        }
      }
      return;
    }
  });
}