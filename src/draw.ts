import * as nodeCanvas from "canvas";
import chalk from "chalk";
import * as changeCase from "change-case";

const palette = [
  "#262A49",
  "#09545A",
  "#0E7352",
  "#1FC285",
  "#ABD869",
  "#FABE51",
  "#ED6B3C",
  "#EA1049",
  "#A02D5E",
  "#700A61",
  "#062F7B",
];

type Data = Array<{ name: string; value: number; ratio: number }>;

export function drawTerminal({ data }: { data: Data }): void {
  data.map((stat, index) => {
    let bar = new Array(Math.floor(stat.ratio * 50)).fill("█").join("") + " ";
    if (bar.length === 1) {
      bar = "▏";
    }
    console.log(
      `${stat.name.replace("use", "").padEnd(16)} ${chalk.hex(palette[index])(
        bar
      )}${stat.value}`
    );
  });
}

export function drawPng({ data }: { data: Data }) {
  const canvas = nodeCanvas.createCanvas(800, 500);

  const ctx = canvas.getContext("2d");

  function bar(
    {
      availableWidth,
      availableHeight,
      ctx,
      index,
    }: {
      availableWidth: number;
      availableHeight: number;
      ctx: nodeCanvas.CanvasRenderingContext2D;
      index: number;
    },
    { value, ratio, name }: typeof data[number]
  ) {
    ctx.save();
    ctx.fillStyle = palette[index];
    const height = Math.max(availableHeight * ratio, 1);
    ctx.fillRect(0, 0, availableWidth, -height);

    const round = Math.min(3, height);
    if (round >= 2) {
      ctx.beginPath();
      ctx.arc(round, -height, round, 0, Math.PI * 2);
      ctx.arc(availableWidth - round, -height, round, 0, Math.PI * 2);
      ctx.fillRect(round, -height + 2, availableWidth - round * 2, -round - 2);
      ctx.fill();
    }

    ctx.textAlign = "center";
    const fontSize = 18;
    ctx.font = `bold ${fontSize}px sans-serif`;
    ctx.fillText(
      Math.round(value).toString(),
      availableWidth / 2,
      -height - 10,
      availableWidth
    );

    ctx.font = `bold 12px sans-serif`;
    ctx.textBaseline = "top";
    ctx.textAlign = "center";
    ctx.fillText(
      changeCase.capitalCase(name.replace("use", "")).replace(" ", "\n"),
      availableWidth / 2,
      8,
      availableWidth
    );
    ctx.restore();
  }

  ctx.fillStyle = "azure";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  data.forEach((d, i, all) => {
    ctx.save();
    const oneBarWidth = canvas.width / all.length;
    const oneBarHeight = canvas.height * 0.6;
    ctx.translate(i * oneBarWidth + 8, canvas.height * 0.8);
    bar(
      {
        availableHeight: oneBarHeight - 16,
        availableWidth: oneBarWidth - 16,
        ctx,
        index: i,
      },
      d
    );
    ctx.restore();
  });

  ctx.textBaseline = "bottom";
  ctx.textAlign = "left";
  ctx.fillStyle = palette[0];

  ctx.textBaseline = "bottom";
  ctx.font = "24px monospace";
  ctx.fillText("react-hook-stats", 8, canvas.height - 8, canvas.width - 16);

  const offsetHeight = ctx.measureText("react-hook-stats")
    .actualBoundingBoxAscent;

  ctx.font = "600 10px sans-serif";
  ctx.globalAlpha = 0.5;
  ctx.fillText("Made with", 8, canvas.height - 8 - offsetHeight);
  ctx.globalAlpha = 1;

  return canvas.toBuffer();
}
