const calculatePos = (att, cos, pos, x) => {
  const res = [];
  for (let i = 0; i < pos; i++) {
    let sum = 0;
    let cnt = 0;
    for (let j = 0; j < cos; j++) {
      if (att[j].data[i].value !== null) {
        sum += (x[j] * att[j].data[i].value) / 3;
        cnt++;
      }
    }
    res.push({
      title: att[0].data[i].title,
      value: sum / cnt,
    });
  }
  return res;
};

const calculate80and20 = (f, s) => {
  const res = [];
  for (let i = 0; i < f.length; i++) {
    res.push({
      title: f[i].title,
      value: f[i].value * 0.8 + s[i].value * 0.2,
    });
  }
  return res;
};

const combineAll = (uni, pt, indirect, direct, final) => {
  const res = [];
  for (let i = 0; i < uni.length; i++) {
    res.push({
      title: uni[i].title,
      uni: isNaN(uni[i].value) ? 0 : uni[i].value.toFixed(2),
      pt: isNaN(pt[i].value) ? 0 : pt[i].value.toFixed(2),
      direct: isNaN(direct[i].value) ? 0 : direct[i].value.toFixed(2),
      indirect: isNaN(indirect[i].value) ? 0 : indirect[i].value.toFixed(2),
      final: isNaN(final[i].value) ? 0 : final[i].value.toFixed(2),
    });
  }
  return res;
};

const calculate = (att, input) => {
  const cos = att.length;
  const pos = att[0].data.length;
  const uni = calculatePos(att, cos, pos, input.uni);
  const pt = calculatePos(att, cos, pos, input.pt);
  const indirect = calculatePos(att, cos, pos, input.indirect);
  const direct = calculate80and20(uni, pt);
  const final = calculate80and20(direct, indirect);
  return combineAll(uni, pt, indirect, direct, final);
};

module.exports = {
  calculate,
};
