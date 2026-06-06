// Pure 2D-canvas drawing primitives shared by the terminal artifacts. Each is a
// stateless function taking the context (and where randomness is needed, a
// seeded `rand` from canvas-kit's rng). No DOM or artifact state here.

export function paper(ctx, W, H, rand) {
  ctx.clearRect(0, 0, W, H);
  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, "#f9ead6");
  g.addColorStop(0.5, "#f4d9e3");
  g.addColorStop(1, "#cfd9ec");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  for (let i = 0; i < 1450; i++) {
    ctx.fillStyle = `rgba(55,40,42,${rand() * 0.04})`;
    ctx.fillRect(rand() * W, rand() * H, 1.4, 1.4);
  }
}

export function border(ctx, W, H) {
  ctx.strokeStyle = "rgba(50,35,40,0.54)";
  ctx.lineWidth = 3;
  ctx.strokeRect(34, 34, W - 68, H - 68);
  ctx.strokeStyle = "rgba(53,94,103,0.42)";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(52, 52, W - 104, H - 104);
}

export function perforation(ctx, W, H) {
  ctx.save();
  ctx.fillStyle = "rgba(255,255,255,0.45)";
  for (let x = 72; x < W - 72; x += 26) {
    ctx.beginPath();
    ctx.arc(x, 34, 5, 0, Math.PI * 2);
    ctx.arc(x, H - 34, 5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

export function postcardBack(ctx, W, H) {
  ctx.save();
  ctx.strokeStyle = "rgba(50,35,40,0.18)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(W * 0.68, 72);
  ctx.lineTo(W * 0.68, H - 72);
  ctx.stroke();
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.moveTo(W * 0.73, 190 + i * 56);
    ctx.lineTo(W - 94, 190 + i * 56);
    ctx.stroke();
  }
  ctx.restore();
}

export function field(ctx, label, value, x, y, size) {
  ctx.fillStyle = "rgba(50,35,40,0.52)";
  ctx.font = "600 13px Georgia, serif";
  ctx.fillText(label, x, y - size - 7);
  ctx.fillStyle = "#33242a";
  ctx.font = `700 ${size}px Georgia, serif`;
  ctx.fillText(value, x, y);
}

export function wrap(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > maxWidth && line) {
      ctx.fillText(line, x, y);
      line = word;
      y += lineHeight;
    } else {
      line = next;
    }
  }
  ctx.fillText(line, x, y);
}

export function wrapCentered(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  const lines = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  lines.push(line);
  lines.forEach((item, i) => ctx.fillText(item, x, y + i * lineHeight));
}

export function routeArc(ctx, x, y, w, h, color) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 10]);
  ctx.beginPath();
  ctx.moveTo(x, y + h * 0.72);
  ctx.bezierCurveTo(x + w * 0.2, y - h * 0.34, x + w * 0.74, y + h * 1.24, x + w, y + h * 0.16);
  ctx.stroke();
  ctx.restore();
}

export function cloud(ctx, x, y, s) {
  ctx.save();
  ctx.fillStyle = "rgba(255,255,255,0.38)";
  for (const [dx, dy, r] of [[0, 8, 0.42], [34, -14, 0.52], [78, 0, 0.48], [114, 16, 0.36]]) {
    ctx.beginPath();
    ctx.arc(x + dx, y + dy, s * r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillRect(x - 16, y + 14, 150, 34);
  ctx.restore();
}

export function fish(ctx, x, y, s, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(-0.04);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(0, 0, s, s * 0.48, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-s * 0.82, 0);
  ctx.lineTo(-s * 1.5, -s * 0.45);
  ctx.lineTo(-s * 1.28, 0);
  ctx.lineTo(-s * 1.5, s * 0.45);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

export function skywhale(ctx, x, y, s, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(0, 0, s * 1.65, s * 0.58, -0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-s * 1.2, -s * 0.1);
  ctx.lineTo(-s * 1.9, -s * 0.5);
  ctx.lineTo(-s * 1.62, 0);
  ctx.lineTo(-s * 1.9, s * 0.5);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(s * 0.2, s * 0.35);
  ctx.lineTo(s * 0.62, s * 0.86);
  ctx.lineTo(s * 0.8, s * 0.2);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

export function clock(ctx, x, y, r) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = "rgba(255,247,220,0.72)";
  ctx.strokeStyle = "rgba(50,35,40,0.45)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.strokeStyle = "rgba(50,35,40,0.62)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, -r * 0.56);
  ctx.moveTo(0, 0);
  ctx.lineTo(r * 0.4, r * 0.12);
  ctx.stroke();
  ctx.restore();
}

export function baggageTag(ctx, x, y, text) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(-0.08);
  ctx.fillStyle = "rgba(255,248,224,0.78)";
  ctx.strokeStyle = "rgba(50,35,40,0.42)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-74, -40);
  ctx.lineTo(48, -40);
  ctx.lineTo(78, -10);
  ctx.lineTo(78, 40);
  ctx.lineTo(-74, 40);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "rgba(50,35,40,0.66)";
  ctx.font = "700 16px Georgia, serif";
  ctx.textAlign = "center";
  ctx.fillText(text, 2, -4);
  ctx.font = "700 13px Georgia, serif";
  ctx.fillText("MORE TIME", 2, 20);
  ctx.restore();
}

export function stamp(ctx, x, y, top, bottom) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(-0.12);
  ctx.strokeStyle = "rgba(199,74,92,0.78)";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(0, 0, 76, 0, Math.PI * 2);
  ctx.stroke();
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, 56, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = "rgba(199,74,92,0.86)";
  ctx.font = "700 17px Georgia, serif";
  ctx.textAlign = "center";
  ctx.fillText(top, 0, -10);
  ctx.font = "700 15px Georgia, serif";
  ctx.fillText(bottom, 0, 18);
  ctx.restore();
}

export function barcode(ctx, x, y, w, h, rand) {
  ctx.save();
  ctx.fillStyle = "rgba(50,35,40,0.78)";
  let bx = x;
  while (bx < x + w) {
    const bw = 2 + Math.round(rand() * 6);
    ctx.fillRect(bx, y, bw, h);
    bx += bw + 3 + Math.round(rand() * 4);
  }
  ctx.restore();
}

export function roundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
}

export function chair(ctx, x, y, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = color;
  ctx.fillRect(-48, -28, 96, 42);
  ctx.fillRect(-38, 18, 76, 20);
  ctx.fillRect(-42, 42, 10, 32);
  ctx.fillRect(32, 42, 10, 32);
  ctx.restore();
}

export function suitcase(ctx, x, y, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.strokeStyle = color;
  ctx.fillStyle = "rgba(50,35,40,0.08)";
  ctx.lineWidth = 4;
  ctx.strokeRect(-48, -34, 96, 84);
  ctx.fillRect(-48, -34, 96, 84);
  ctx.beginPath();
  ctx.arc(0, -34, 24, Math.PI, 0);
  ctx.stroke();
  ctx.restore();
}

export function infinity(ctx, x, y, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.strokeStyle = color;
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.ellipse(-28, 0, 30, 22, 0.2, 0, Math.PI * 2);
  ctx.ellipse(28, 0, 30, 22, -0.2, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

export function tinyPlane(ctx, x, y, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(64, 0);
  ctx.lineTo(-58, -20);
  ctx.lineTo(-28, 0);
  ctx.lineTo(-58, 20);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}
